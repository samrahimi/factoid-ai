'use client'

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import * as reportService from '@/lib/reports';
import ReactMarkdown from 'react-markdown';
import ReportDetails from '@/components/ReportDetails';
import { Report } from '@/lib/reports';

export default function ReportDetailPage({ params }) {
  const [report, setReport] = useState<any>(null);
  useEffect(() => {
    const fetchReport = async () => {

      const fetchedReport = await reportService.getReport(params.project_id, true)
      setReport(fetchedReport);
      return () => setReport(null);
  };

    fetchReport();
}, []);
  return (
    report && (
    <>
      <div className="text-l font-semibold mb-2 text-gray-100 max-h-18 overflow-clip">{report?.parsed.publication_info?.catchy_title || report?.claim}</div>
      <p className="text-gray-300 mb-2 text-sm">Created: {new Date(report?.created_at).toLocaleString()}</p>

      <ReportDetails data={report?.parsed} tabs="false" />

    </>
    )
  )
}