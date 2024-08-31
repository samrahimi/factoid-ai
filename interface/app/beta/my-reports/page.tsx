'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import * as reportService from '../../../lib/reports';
import ReactMarkdown from 'react-markdown';
import ReportDetails from './ReportDetails';

interface Report {
  id: string;
  created_at: string;
  user_request: string;
  claim?: string;
  evaluation?: string;
  category?: string;
  parsed?: {
    evaluation: string;
    article: string;
    bibliography: any;
    works_cited: any;
    related_questions: any;
  };
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const fetchedReports = await reportService.getReports(user.id);
          setReports(fetchedReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  if (isLoading) {
    return <div className="text-center text-gray-100 mt-8">Loading reports...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-purple-300">My Reports</h1>
      {reports.length === 0 ? (
        <p className="text-gray-300">You haven't created any reports yet.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li style={{height:"190px", overflow: "hidden"}}  
              key={report.id}
              onClick={() => handleReportClick(report)}
              className="bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-100">{report.claim}</h2>
              <p className="text-gray-300 mb-2">Created: {new Date(report.created_at).toLocaleString()}</p>
              <ReactMarkdown>{report.evaluation}</ReactMarkdown>
            </li>
          ))}
        </ul>
      )}

      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-medium text-gray-100">{selectedReport.claim}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ReportDetails data={selectedReport.parsed} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}