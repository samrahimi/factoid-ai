import React from 'react';

const WorksCited = ({ data }) => {
  const { works_cited } = data;

  return (
    <div className="markdown-body dark bg-gray-800  rounded-lg shadow-lg">
      <h2 className="mb-4">Works Cited</h2>
      <div className="space-y-2">
        {works_cited.map((work, index) => (
            <div>
            {work.author && <span>{work.author}. </span>}
            {work.title && <span className="italic">{work.title}. </span>}
            {work.publication && <span>{work.publication}, </span>}
            {work.year && <span>{work.year}. </span>}
            {work.url && (
              <a  key={index}
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {work.url}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksCited;
