import { useRouter } from 'next/navigation'
import React from 'react';

const RelatedClaims = ({ data }) => {
  const { suggested_queries } = data;
  const router = useRouter()
  const handleClaimClick = (claim) => {
    router.push(`/fact-check?claim=${encodeURIComponent(claim)}`)
  };

  return (
    <div className="markdown-body dark bg-gray-800">
      <h2 className="mb-4">Ask Next</h2>
      <p className="text-gray-300 text-sm font-italic">Here are some other questions you might be interested in. Click any of the following, and our intelligent agents will perform a full investigation</p>
      <div className="space-y-2">
        {suggested_queries.map((query, index) => (
            <div>
          <a
            key={index}
            onClick={() => handleClaimClick(query)}
            className="text-gray-300 cursor-pointer hover:text-blue-400 transition-colors duration-200"
          >
            {query}
          </a></div>
        ))}
      </div>
    </div>
  );
};

export default RelatedClaims;