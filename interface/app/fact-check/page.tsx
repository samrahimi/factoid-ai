"use client"
import React, { useEffect, useState } from 'react';         
import { UploadCloud, Link, FileText } from 'lucide-react';
import FactCheckProgressScreen from '../../components/FactCheckProgressScreen';
import { ReportPayload, updateReport } from '@/lib/reports';
import { supabase } from '../../lib/supabaseClient';
import { Navigation } from '@/components/Navigation';
const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [currentReport, setCurrentReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('fact_check_fun');
  const [prompt, setPrompt] = useState('')
  const [aborter, setAborter] = useState(new AbortController())
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [clientId, setClientId] = useState('')
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState("Ready")
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for the current user when the component mounts
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    // Set up an auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Clean up the listener when the component unmounts
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);


  async function getStreamingFactcheckResponse(url, prompt, model, { signal }) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "prompt": prompt, "model": model, "clientId": clientId }),
        signal
      });
 
      for await (const chunk of response.body) {
        if (signal.aborted) throw signal.reason;
        //setBytes(bytes + chunk.length);
        setOutput((output) => output + new TextDecoder().decode(chunk));
      }
      setIsLoading(false);
 
    } catch (e) {
      if (e instanceof TypeError) {
        console.log(e);
        console.log("TypeError: Browser may not support async iteration");
      } else {
        console.log(`Error in async iterator: ${e}.`);
      }
    }
  }
  useEffect(() => {
    if (!connected) {
        const newSocket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_PIPELINE_API_SERVER}/api/ws`);

        newSocket.onopen = () => {
            setConnected(true)
            console.log('Connected to the server');
        };
        
        newSocket.onmessage = async(event) => {
            const message = JSON.parse(event.data);
            console.log(message)
            if (message.type === 'connection') {
            console.log('Received client ID:', message.clientId);
            setClientId(message.clientId)
            // Store the clientId for future use
            } else if (message.type === 'event' && message.data.messageType === 'update_results') {
                console.log('Received update_context event:', message.data);
                try {
                  await updateReport(message.data.messagePayload as ReportPayload);
                    // if (message.data.messagePayload.publication_info) {
                    //     const payload = {...message.data.messagePayload, ...message.data.messagePayload.publication_info }
                    //     await updateReport(payload as ReportPayload);
                    //   } else 
                    //     await updateReport(message.data.messagePayload as ReportPayload);
                } catch (error) {
                    console.error('Failed to upsert report:', error);
                    // You might want to add some user feedback here
                }
            } else {
                console.log('Received message:', message);
                if (message.data.messageType == "begin_step" && message.data.messagePayload.name != "claim_loader") {
                    setStep(message.data.messagePayload.description)
                    setProgress(message.data.messagePayload.progress)
                }
            }
        };
        setSocket(newSocket)
    }
  }, [])
  
  const handleSubmit = async (promptText) => {
    setIsLoading(true);
    setPrompt(promptText)
    setOutput('');
    //setAborter(new AbortController());
    //setBytes(0);
 
    getStreamingFactcheckResponse(`http://${process.env.NEXT_PUBLIC_PIPELINE_API_SERVER}/api/run-pipeline`,
        promptText,
      selectedModel,
      { signal: aborter.signal });

      setCurrentScreen('progress');

  };
 

  const handleCancel = () => {
    aborter.abort()
    console.log("fact check request prematurely cancelled")
    setCurrentScreen('home');
  };

  const handleFactCheckComplete = (report) => {
    setReports([report, ...reports]);
    setCurrentReport(report);
    setCurrentScreen('completion');
  };

  const handleNewFactCheck = () => {
    setCurrentScreen('home');
  };

  const handleViewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setCurrentReport(report);
    setCurrentScreen('view');
  };

  const handleBack = () => {
    setCurrentScreen('history');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <FactCheckForm onSubmit={handleSubmit} />;
      case 'progress':
        return <FactCheckProgressScreen step={step} progress={progress} status={isLoading} outputStream={output} onCancel={handleCancel} onComplete={handleFactCheckComplete} />;
      default:
        return <FactCheckForm onSubmit={handleSubmit} />;
    }
  };

  return (
      <main>{renderScreen()}</main>
  );
};

const FactCheckForm = ({onSubmit}) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const prepopulatedText = window.location.href.split('?claim=')[1] ? decodeURIComponent(window.location.href.split('?claim=')[1]) : ''
    setText(prepopulatedText)
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submit - in HomeScreen")
    const combinedPrompt = url.length > 0 ? `@${url}\n\n${text}` : text
    onSubmit(combinedPrompt+" [System Message: It is currently "+new Date().toLocaleString()+"]");
  };

  return (
      <div className="container mx-auto w-full max-w-4xl px-4 py-6">
        <h2 className="text-xl mt-16 font-semibold mb-4 text-gray-100">Create Your Factoid</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='hidden'>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
              Upload Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-300 mb-2">
              Type a question, paste a sketchy claim making the rounds on social media, 
              or ask about some "fact" that you're not sure about.
            </label>
            <textarea
              id="text-input"
              name="text-input"
              rows={4}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-600 rounded-md bg-gray-700 text-gray-100"
              placeholder="Text goes here... Please don't include any personal information, as the results of the fact check will be public."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
              Enter URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-300 sm:text-sm">
                <Link className="h-5 w-5" />
              </span>
              <input
                type="text"
                name="url-input"
                id="url-input"
                className="focus:ring-teal-500 focus:border-teal-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-600 bg-gray-700 text-gray-100"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Submit for Fact Checking
            </button>
          </div>
        </form>
        <div className='text-muted-foreground mt-16 text-sm'>
        <h2 className="text-l mt-16 font-semibold mb-4 text-teal-500">What Is DeFact? About Us</h2>
        <p className="mb-6">Working from a secret location 44 hours south of Silicon Valley, 
          our engineering team quietly built the world's largest LLM, a mixture of experts with between 2 and 5 trillion parameters 
          depending on the nature of your inquiry and the quantity of source material that needs to be ingested. 
        </p>
        
        <p className="mb-6">
          Then we trained it to do research, journalism, fact checking, and basically all the cool search stuff that
          the big AI companies keep promising but can't deliver because it might upset their big enterprise customers 
          in the media and publishing industry. We are a non-profit, and we are here to help you find the truth... but 
          we can't do it without your help. So put in your question or a "fact" that's been making the rounds of social media, 
          hit the button, and let's get started!
        </p>

        <p className="mb-6">Disclaimer: this "About Us" page may or may not be completely factual, and the main 
          reason its here is so that the AI nerds have something they can factcheck. Yes, it works GREAT 
          with scientific and technical materials, as well as academic topics in the arts. Unlike this page, 
          everything else you'll see on this website is generated by our AI, with nearly 100% accuracy. 
          We actually have a policy that no humans are allowed to edit the output of our models, 
          and even the metadata and tags are generated entirely by AI. 
        </p>
        <p className="mb-6">You see, AI doesn't lie, and it doesn't "hallucinate"- the quality of content generated 
          is entirely dependent on the quality and relevance of the source materials used to provide 
          context.

        </p>
        <p className="mb-6">Any questions? Contact <a href="mailto:sam@defact.org">sam@defact.org</a></p>
        </div>
      </div>
  );
};

export default App;