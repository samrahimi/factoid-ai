import React, { useState } from 'react';
import WorksCited from './WorksCited';
import RelatedClaims from './RelatedClaims';
import ReactMarkdown from 'react-markdown';
import { getDangerousHtmlFromMarkdown } from '@/lib/utils';
const Tab = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 font-medium ${
      active
        ? 'text-blue-500 border-b-2 border-blue-500'
        : 'text-gray-400 hover:text-gray-300'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const ReportDetails = ({ data }) => {
  const [activeTab, setActiveTab] = useState('evaluation');

  const tabs = [
    { id: 'evaluation', label: 'Result' },
    { id: 'article', label: 'Article' },
    { id: 'worksCited', label: 'Sources' },
    { id: 'relatedClaims', label: 'Related' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'evaluation':
        return (
            <div className="markdown-body dark" dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(data.evaluation) }} />
        );
      case 'article':
        return (
          <div dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(data.article.replace("\n", "\n\n")) }} className="markdown-body dark" />
        );
      case 'worksCited':
        return <WorksCited data={data.bibliography} />;
      case 'relatedClaims':
        return <RelatedClaims data={data.related_questions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-700">
        <nav className="flex">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
      <div className="p-4">{renderTabContent()}</div>
    </div>
  );
};

export default ReportDetails;