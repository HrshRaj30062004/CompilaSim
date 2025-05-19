import React from 'react';

const CodeEditor = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      rows={10}
      cols={60}
      placeholder="Enter C-like code here..."
      style={{ fontFamily: 'monospace', fontSize: '14px' }}
    />
  );
};

export default CodeEditor;
