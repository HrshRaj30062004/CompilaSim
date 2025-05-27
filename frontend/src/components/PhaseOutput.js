import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 🔽 Collapsible container
const Collapsible = ({ label, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          color: "#333"
        }}
      >
        {open ? "▼" : "▶"} {label}
      </div>
      {open && <div style={{ marginLeft: "1rem" }}>{children}</div>}
    </div>
  );
};

// 🌲 AST node renderer (used only for syntax tree)
const renderASTNode = (node, label = "Node") => {
  if (typeof node !== 'object' || node === null) return <code>{String(node)}</code>;

  return (
    <Collapsible label={`${label} (${node.type || 'Unknown'})`}>
      {Object.entries(node).map(([key, value], idx) => {
        if (key === 'children' && Array.isArray(value)) {
          return (
            <div key={idx}>
              <strong>{key}:</strong>
              <div style={{ marginLeft: "1rem" }}>
                {value.map((child, i) => (
                  <div key={i}>{renderASTNode(child, `Child ${i + 1}`)}</div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={idx}>
            <strong>{key}:</strong>{" "}
            {typeof value === 'object' ? renderASTNode(value, key) : <code>{String(value)}</code>}
          </div>
        );
      })}
    </Collapsible>
  );
};

// 🧠 Main renderer
const renderData = (data) => {
  // ✅ 1. Table format (Lexical, Semantic)
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && !Array.isArray(data[0])) {
    const keys = Object.keys(data[0]);
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {keys.map((key, idx) => (
              <th key={idx} style={{ border: '1px solid #ccc', padding: '6px', background: '#eee' }}>
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {keys.map((key, i) => (
                <td key={i} style={{ border: '1px solid #ddd', padding: '6px' }}>
                  {typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // ✅ 2. IR, Optimized, Final Code (List of strings)
  if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
    return (
      <SyntaxHighlighter language="text" style={atomDark}>
        {data.join('\n')}
      </SyntaxHighlighter>
    );
  }

  // ✅ 3. Syntax Tree (AST)
  if (data && typeof data === 'object' && data.type === "Program" && Array.isArray(data.children)) {
    return renderASTNode(data, "AST");
  }

  // ✅ 4. Fallback for other objects/arrays
  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: "1rem" }}>
        {data.map((item, idx) => (
          <Collapsible key={idx} label={`Item ${idx + 1}`}>
            {renderData(item)}
          </Collapsible>
        ))}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div style={{ marginLeft: "1rem" }}>
        {Object.entries(data).map(([key, value], idx) => (
          <div key={idx}>
            <strong>{key}:</strong>{" "}
            {typeof value === 'object' ? renderData(value) : <code>{String(value)}</code>}
          </div>
        ))}
      </div>
    );
  }

  return <code>{String(data)}</code>;
};

// 🔷 Output Container
const PhaseOutput = ({ title, data }) => {
  console.log(`[DEBUG] ${title} data:`, data);
  return (
    <div style={{
      margin: "1.5rem 0",
      padding: "1.2rem",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "10px"
    }}>
      <h3 style={{ color: "#222", marginBottom: "1rem" }}>{title}</h3>
      {renderData(data)}
    </div>
  );
};

export default PhaseOutput;
