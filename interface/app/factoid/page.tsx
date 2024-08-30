"use client"

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import remarkRehype from 'remark-rehype'

export default function Home() {
 const [selectedModel, setSelectedModel] = useState('fact_check_simple');
 const [prompt, setPrompt] = useState(`Write a long-form human interest piece about the Japanese fishermen who are notorious for the drive hunting of dolphins at the cove... We want to understand who these people are, how they ended up hunting dolphins for a living, why they continue in the face of fierce opposition, and what they think the future holds. Be as open minded and unbiased as possible, and look at the matter from a diverse array of perspectives`);
 const [bytes, setBytes] = useState(0);
 const [output, setOutput] = useState(' ');
 const [isLoading, setIsLoading] = useState(false);

 const outputRef = useRef(null);

 useEffect(() => {
   if (outputRef.current) {
     outputRef.current.scrollTop = outputRef.current.scrollHeight;
   }
 }, [output]);

 async function getStreamingFactcheckResponse(url, prompt, model, { signal }) {
   try {
     const response = await fetch(url, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ "prompt": prompt, "model": model }),
       signal
     });

     for await (const chunk of response.body) {
       if (signal.aborted) throw signal.reason;
       setBytes(bytes + chunk.length);
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

 const handleSubmit = async (e) => {
   e.preventDefault();
   setIsLoading(true);
   setOutput('');
   const aborter = new AbortController();
   setBytes(0);

   getStreamingFactcheckResponse(`http://localhost:1207/api/run-pipeline`,
     prompt,
     selectedModel,
     { signal: aborter.signal });

 };

 return (
   <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 p-8">
     <nav className="bg-gray-800 p-4 mb-4">
       <h1 className="text-2xl font-bold">TruthScan</h1>
     </nav>

     <div className="mb-4">
       <label htmlFor="model" className="block text-sm font-medium mb-2">
         Select Model
       </label>
       <select
         id="model"
         value={selectedModel}
         onChange={(e) => setSelectedModel(e.target.value)}
         className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
       >
         <option value="fact_check_simple">Standard</option>
         <option value="truth">Pro</option>
       </select>
     </div>

     <div className="flex-grow overflow-y-auto" ref={outputRef}>
       {output && (
         <div className="mt-8">
           <div className="bg-gray-800 p-4 rounded-md overflow-x-auto">
             <div className="markdown-body dark">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {output}
               </ReactMarkdown>
             </div>
           </div>
         </div>
       )}
     </div>

     <form onSubmit={handleSubmit} className="space-y-6 mt-4">
       <div>
         <label htmlFor="prompt" className="block text-sm font-medium mb-2">
           Enter Text to Fact Check
         </label>
         <textarea
           id="prompt"
           value={prompt}
           onChange={(e) => setPrompt(e.target.value)}
           placeholder="Enter text here..."
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
   </div>
 );
}
