import React from 'react';
import { getDangerousHtmlFromMarkdown } from '@/lib/utils';

const WorksCited = ({readingList}: { readingList: string }) => {
  //const { works_cited } = data;

  return (readingList &&
    <div className="markdown-body dark bg-gray-800  rounded-lg shadow-lg">
              <h2 className="mb-4">Works Cited</h2>
              <p className='text-gray-300 text-sm'>Here we present a brief synopsis of each source that was consulted during the creation of this report. While we do our best to make clear what is fact and what is opinion, it is possible for things to slip through the cracks; we therefore encourage you to review the original source materials and to think critically about what you are reading.</p>
              <div dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(readingList.replace("\n", "\n\n")) }}
               className="markdown-body dark" />
    </div>
  );
};

export default WorksCited;
