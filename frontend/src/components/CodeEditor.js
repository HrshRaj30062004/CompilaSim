import React, { useState, useRef } from 'react';
import './CodeEditor.css';

const CodeEditor = ({ code, setCode }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <span>Source Code</span>
        <div className="editor-actions">
          <button 
            className="upload-btn"
            onClick={triggerFileInput}
          >
            <span className="upload-icon">📁</span>
            Upload C File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".c,.h"
            style={{ display: 'none' }}
          />
          <span className="language-badge">C</span>
        </div>
      </div>
      {fileName && (
        <div className="file-info">
          <span className="file-name">{fileName}</span>
          <button 
            className="clear-file"
            onClick={() => {
              setFileName('');
              setCode('');
            }}
          >
            ×
          </button>
        </div>
      )}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your C code here or upload a file..."
        className="code-input"
        spellCheck="false"
      />
    </div>
  );
};

export default CodeEditor;