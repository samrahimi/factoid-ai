import React, { useState } from 'react';
import WorksCited from './WorksCited';
import RelatedClaims from './RelatedClaims';
import ReactMarkdown from 'react-markdown';
import { getDangerousHtmlFromMarkdown } from '@/lib/utils';
const Tab = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 font-medium ${
      active
        ? 'bg-teal-900 text-primary-foreground border-b-2 border-teal-500'
        : 'text-gray-400 hover:text-gray-300'
    }`}
    onClick={(e) => {
      
      e.preventDefault()
      onClick()
    }}
  >
    {label}
  </button>
);

const ReportDetails = ({ data, tabView }) => {
  const [activeTab, setActiveTab] = useState('evaluation');

  const tabs = [
    { id: 'evaluation', label: 'Summary' },
    { id: 'article', label: 'In Depth' },
    { id: 'worksCited', label: 'Read Next' },
    //{ id: 'relatedClaims', label: 'Related' },
  ];
  const renderAsStandalone = () => {
    return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="markdown-body dark" dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(data.evaluation) }} />
                  <div dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(data.article.replace("\n", "\n\n")) }} className="markdown-body dark" />
                  <WorksCited readingList={data.bibliography} />
                  <RelatedClaims data={data.related_questions} />
                  <p className="font-italic text-gray-300">
                    This Factoid was requested by a human user and written by a team of inteliigent agents, who are constantly learning and evolving. 
                  </p>

                  <p className="font-semibold">Sign up for free to create your own Factoids! <a href="/auth">CLICK HERE TO GET STARTED</a></p>

                  <h3 className="text-l font-semibold text-gray-300 mt-8">How is this different from ChatGPT or Perplexity?</h3>
                  <div dangerouslySetInnerHTML={{ __html: getDangerousHtmlFromMarkdown(
                    `How is this different from ChatGPT? Well, to start off, 100% of the content on this platform is backed up by external sources which are not affiliated with DeFact in any way; we guarantee that all sources have full editorial independence.

                    How is this different from Perplexity? First of all, their research agents only search a small subset of the web, with zero transparency as to 
                    what publications are on their allow-list, or how those publications are chosen. It is also unclear if they actually consult the full text of sources 
                    or if they rely on the snippets provided by the search engine. 
                    
                    DeFact research agents approach their tasks in the same way 
                    a skilled human researcher would go about it - they start off by running multiple searches against whatever search engines and academic databases are most suitable 
                    given your query. Then, they determine which sources are most likely to be relevant, and retrieve the complete text of those sources. 
                    
                    After that, the source documents are handed to specialized writing and fact checking agents, along with the user's request, and these agents 
                    are the ones who answer your questions, evaluate claims of fact, and write comprehensive, well-written articles. While the agents are not perfect,
                    they are constantly learning and evolving, and it is extremely rare that they hallucinate or provide incorrect information not backed by the source material. 
                    
                    The final step of the process involves a skilled digital librarian who reviews the article and fact check together with the original source material, 
                    and prepares a reading list that summarizes each source consulted in a way that's relevant to the user's original request. This is also when the complete 
                    Factoid is categorized and tagged, so that it can be easily found by other users who are interested in similar topics. Usually this librarian is an AI, although 
                    on occasion a human librarian may be involved in the cataloging and curation process, if the Factoid is of particularly high quality or addresses 
                    time-sensitive news and current events.

                    That said, human involvement if any is always restricted to refining the metadata (title, tags, category, etc.) and humans NEVER edit or alter the actual content in any way, nor do humans have anything to do with the citations.
                    
                    We believe that this process is the most transparent and reliable way to provide you with the information you need to make informed decisions about the information you consume, and ensures that our personal biases do not get reflected in the content on this platform.

                    Please note: the cover images for each Factoid are NOT real photos; they are illustrations that are generated by a specialized AI model 
                    based on the content. These images are meant to be eye-catching and to give you a sense of what the Factoid is about, 
                    but they are not meant to be taken literally! In the future, we will be training our research agents to retrieve real images from the web and 
                    we will consider whether to continue with generating synthetic images or not at that time.
                    
                    If you have any questions or concerns about the information presented here, please don't hesitate to reach out to us at 
                    <a href="mailto:sam@defact.org">sam@defact.org</a>. Want to see how we did it? Check out the code on github at https://github.com/samrahimi/factoid-ai.`) }} className="markdown-body dark" />
                    

                  <p className="font-italic text-gray-300">
                    We are a small team of developers and researchers who are passionate about the truth. We believe that the internet is a powerful tool for spreading knowledge, but it can also be a dangerous place if not used responsibly. 
                    Our goal is to provide you with the tools you need to make informed decisions about the information you consume. 
                    We hope that you found this Factoid helpful, and that it inspires you to think critically about the world around you.</p>

    </div>
    )
  }
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
        // return <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.article}</ReactMarkdown>;
      case 'worksCited':
        return <>
          <WorksCited readingList={data.bibliography} />
          <RelatedClaims data={data.related_questions} /> 
        </>;
      //deprecated... we've combined worksCited and relatedClaims into one tab
      case 'relatedClaims':
        return <RelatedClaims data={data.related_questions} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg  overflow-hidden">
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