import React from 'react';

const RelatedClaims = ({ data }) => {
  const { related_claims } = data;

  const handleClaimClick = (claim) => {
    window.location.href=`/beta?claim=${encodeURIComponent(claim)}`
  };

  return (
    <div className="markdown-body dark bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4">Related Claims</h2>
      <div className="space-y-2">
        {related_claims.map((claim, index) => (
            <div>
          <a
            key={index}
            onClick={() => handleClaimClick(claim)}
            className="text-gray-300 cursor-pointer hover:text-blue-400 transition-colors duration-200"
          >
            {claim}
          </a></div>
        ))}
      </div>
    </div>
  );
};

export default RelatedClaims;