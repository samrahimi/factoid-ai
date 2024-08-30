import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const FactCheckProgressScreen = ({ onCancel, outputStream, onComplete, step, progress}) => {
 //const [progress, setProgress] = useState(0);
 //const [streamingResults, setStreamingResults] = useState('');
 const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(null);
 return (
   <div className="flex flex-col h-screen">
     {/* Fixed Header */}
     <div className="fixed top-16 left-0 right-0 bg-gray-900 px-4 py-0 sm:px-6 lg:px-8 z-10">
       <h2 className="text-xl font-semibold mb-4 text-purple-300">Fact Check in Progress</h2>
       <div className="mb-0">
         <div className="relative pt-1">
           <div className="flex mb-2 items-center justify-between">
             <div>
               <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-400 bg-blue-900">
                 {step}
               </span>
             </div>
             <div className="text-right">
               <span className="text-xs font-semibold inline-block text-blue-400">
                 {progress}%
               </span>
             </div>
           </div>
           <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-900">
             <div
               style={{ width: `${progress}%` }}
               className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
             ></div>
           </div>
         </div>
       </div>
       {estimatedTimeRemaining !== null && (
         <p className="mb-4 text-sm text-gray-400">
           Estimated time remaining: {estimatedTimeRemaining} seconds
         </p>
       )}
     </div>

     {/* Scrollable Content */}
     <div className="flex-grow overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 mt-40 mb-10"> {/* Added mt-16 to push content below fixed header */}
       <div className="bg-gray-800 shadow overflow-hidden rounded-lg">
         <div className="px-4 py-4">
           <div className="max-w-xl text-sm text-gray-300 markdown-body dark">
             <ReactMarkdown>{outputStream}</ReactMarkdown>
           </div>
         </div>
       </div>
     </div>

     {/* Fixed Footer */}
     <div className="fixed bottom-0 left-0 right-0 bg-gray-900 px-4 py-4 sm:px-6 lg:px-8 z-10">
       <button
         onClick={onCancel}
         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
       >
         Cancel
       </button>
     </div>
   </div>
 );
};

export default FactCheckProgressScreen;
