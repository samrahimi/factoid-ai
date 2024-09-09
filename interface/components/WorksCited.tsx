import React from 'react';
import { getDangerousHtmlFromMarkdown } from '@/lib/utils';

const WorksCited = ({readingList}: { readingList: string }) => {
  //const { works_cited } = data;

  return (readingList &&
    <div className="markdown-body dark bg-gray-800  rounded-lg shadow-lg">
              <h2 className="mb-4">Literature Review</h2>
              <p>Our research is based on the following sources:</p>
              <div dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(readingList.replace("\n", "\n\n")) }}
               className="markdown-body dark" />
    </div>
  );
};

export default WorksCited;
