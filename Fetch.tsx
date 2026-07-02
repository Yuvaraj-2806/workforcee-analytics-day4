import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiCopy, FiCheck, FiDownloadCloud, FiTerminal } from 'react-icons/fi';
import { Employee } from '../types';
import './Fetch.css';

export function Fetch() {
  const [copied, setCopied] = useState<boolean>(false);

  const { data = null, isLoading, error } = useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await axios.get<Employee[]>('/employees.json');
      return response.data;
    },
  });

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to colorize JSON string for pretty syntax highlighted output
  const getHighlightedJson = (jsonObj: any) => {
    const rawJson = JSON.stringify(jsonObj, null, 2);
    // Escape HTML characters
    const escaped = rawJson
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Regular expression to identify keys, strings, numbers, booleans, and nulls
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="json-${cls}">${match}</span>`;
      }
    );
  };

  return (
    <div className="fetch-container">
      {/* HEADER / TAB BAR */}
      <div className="fetch-header">
        <div className="fetch-header-left">
          <div className="window-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="file-name">
            <FiTerminal /> employees.json
          </div>
        </div>
        <div className="fetch-actions">
          <button 
            onClick={handleCopy} 
            className={`action-btn ${copied ? 'success' : ''}`}
            disabled={isLoading || !!error}
          >
            {copied ? (
              <>
                <FiCheck /> Copied!
              </>
            ) : (
              <>
                <FiCopy /> Copy JSON
              </>
            )}
          </button>
          <button 
            onClick={handleDownload} 
            className="action-btn"
            disabled={isLoading || !!error}
          >
            <FiDownloadCloud /> Download
          </button>
        </div>
      </div>

      {/* BODY / CODE VIEW */}
      <div className="json-view-wrapper">
        {isLoading && (
          <div className="status-overlay">
            <div className="spinner"></div>
            <div>Fetching workforce database with Axios...</div>
          </div>
        )}

        {error && (
          <div className="status-overlay">
            <div className="error-icon">⚠️</div>
            <div className="error-title">Axios Request Failed</div>
            <div className="error-desc">{error.message}</div>
          </div>
        )}

        {!isLoading && !error && data && (
          <pre 
            className="json-view"
            dangerouslySetInnerHTML={{ __html: getHighlightedJson(data) }}
          />
        )}
      </div>
    </div>
  );
}
