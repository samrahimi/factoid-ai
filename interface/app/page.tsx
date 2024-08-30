"use client"

import Image from "next/image";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import remarkRehype from 'remark-rehype'
export default function Home() {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('truth');
  const [prompt, setPrompt] = useState(`Write a long-form human interest piece about the Japanese fishermen who are notorious for the drive hunting of dolphins at the cove... We want to understand who these people are, how they ended up hunting dolphins for a living, why they continue in the face of fierce opposition, and what they think the future holds. Be as open minded and unbiased as possible, and look at the matter from a diverse array of perspectives`);
  const [bytes, setBytes] = useState(0);
  const [output, setOutput] = useState(' ');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [status, setStatus] = useState('')
  
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:1207/api/models');
      setModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  
  async function getStreamingFactcheckResponse(url, prompt, model, { signal }) {
    try {

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          //'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"prompt": prompt, "model":model}),
        signal
      });
            
      //   url,  signal);
      for await (const chunk of response.body) {
        if (signal.aborted) throw signal.reason;
        setBytes(bytes+chunk.length);
        setOutput((output) => output + new TextDecoder().decode(chunk));
      }
      setIsLoading(false)

    } catch (e) {
      if (e instanceof TypeError) {
        console.log(e);
        console.log("TypeError: Browser may not support async iteration");
      } else {
        console.log(`Error in async iterator: ${e}.`);
      }
    }
  }
  
  const handleControlMessage = (ssePayload) => {
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOutput('')
    setResultUrl('');
    const aborter = new AbortController();
    setBytes(0);

    
    //button.addEventListener("click", () => aborter.abort());
    getStreamingFactcheckResponse(`http://localhost:1207/api/run-pipeline`, 
      prompt, 
      selectedModel, 
      { signal: aborter.signal });
    
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">AI Research Assistant</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-2">
            Select Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2">
            Enter Prompt. 
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write a long-form human interest piece about the Japanese fishermen who are notorious for the drive hunting of dolphins at the cove... We want to understand who these people are, how they ended up hunting dolphins for a living, why they continue in the face of fierce opposition, and what they think the future holds. Be as open minded and unbiased as possible, and look at the matter from a diverse array of perspectives"
            className="w-full h-40 bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {output && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <div className="bg-gray-800 p-4 rounded-md overflow-x-auto">
            <div className="markdown-body dark">
            <ReactMarkdown remarkPlugins={[remarkGfm]}  >
                {output}  
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {
        // TODO 
      }

      {false && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <ul className="space-y-2">
            <li>
              <a
                href={`${resultUrl}/final_report.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Download Final Report
              </a>
            </li>
            {[...Array(10)].map((_, index) => (
              <li key={index}>
                <a
                  href={`${resultUrl}/task_${index + 1}.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Download Task {index + 1} Report
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}