import React from 'react';

const RelatedClaims = ({ data }) => {
  const { suggested_queries } = data;

  const handleClaimClick = (claim) => {
    window.location.href=`/fact-check?claim=${encodeURIComponent(claim)}`
  };

  return (
    <div className="markdown-body dark bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4">Related Claims</h2>
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