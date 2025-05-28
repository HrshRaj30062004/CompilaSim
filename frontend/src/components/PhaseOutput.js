import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tree from 'react-d3-tree';
import AST3DVisualizer from './AST3DVisualizer';
import './PhaseOutput.css';

// Beautiful Toggle Button Component
const ViewToggle = ({ viewMode, setViewMode, isRaw, setIsRaw, isAST }) => (
  <div className="view-toggle-container">
    {isAST && (
      <>
        <button
          onClick={() => setViewMode('2d')}
          className={`view-toggle-btn ${viewMode === '2d' ? 'active' : ''}`}
        >
          <span className="toggle-icon">🌲</span>
          <span>Tree View</span>
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`view-toggle-btn ${viewMode === '3d' ? 'active' : ''}`}
        >
          <span className="toggle-icon">✨</span>
          <span>3D View</span>
        </button>
      </>
    )}
    <button
      onClick={() => setIsRaw(!isRaw)}
      className={`view-toggle-btn ${isRaw ? 'active' : ''}`}
    >
      <span className="toggle-icon">{isRaw ? '🖌️' : '📋'}</span>
      <span>{isRaw ? 'Pretty' : 'Raw'}</span>
    </button>
  </div>
);

// Lexical Analysis Table (Integrated)
const LexicalAnalysisView = ({ data }) => {
  if (!data || !Array.isArray(data)) return <div className="empty-state">No tokens found</div>;

  return (
    <div className="data-table-container lexical-table">
      <div className="table-header">
        <h4>Lexical Tokens</h4>
        <div className="table-actions">
          <button className="table-action-btn">
            <span>🔍</span> Search
          </button>
          <button className="table-action-btn">
            <span>↓</span> Export
          </button>
        </div>
      </div>
      <div className="table-scroll-container">
        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Type</th>
              <th>Line</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            {data.map((token, index) => (
              <tr key={index}>
                <td className="token-value">{token.value}</td>
                <td className="token-type">{token.type}</td>
                <td className="token-position">{token.line}</td>
                <td className="token-position">{token.column}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Semantic Analysis Symbol Table (Integrated)
const SemanticAnalysisView = ({ data }) => {
  if (!data) return <div className="empty-state">No symbol data available</div>;

  return (
    <div className="data-table-container symbol-table">
      <div className="table-header">
        <h4>Symbol Table</h4>
        <div className="table-actions">
          <button className="table-action-btn">
            <span>🔍</span> Search
          </button>
        </div>
      </div>
      <div className="table-scroll-container">
        {Object.entries(data).map(([scope, entries]) => (
          <div key={scope} className="symbol-scope">
            <h5 className="scope-header">
              <span className="scope-icon">📁</span>
              {scope}
            </h5>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Scope</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr key={i}>
                    <td className="symbol-name">{entry.name}</td>
                    <td className="symbol-type">{entry.type}</td>
                    <td className="symbol-value">{entry.value || '-'}</td>
                    <td className="symbol-scope">{entry.scope || 'global'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

// AST 2D Tree Component
const AST2DTree = ({ ast }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const transformAST = (node) => {
    if (!node || typeof node !== 'object') return {};
    return {
      name: node.type,
      attributes: node.value ? { value: node.value } : {},
      children: Array.isArray(node.children) 
        ? node.children.map(transformAST) 
        : [],
    };
  };

  const data = transformAST(ast);

  const renderCustomNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle 
        r={15} 
        fill={nodeDatum.children ? "#4895ef" : "#4361ee"}
        stroke="#3a0ca3"
        strokeWidth={2}
        onClick={toggleNode}
      />
      <text 
        x={25} 
        dy=".35em" 
        fill="#2b2d42" 
        fontSize={12} 
        fontWeight="bold"
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.value && (
        <text 
          x={25} 
          dy="1.5em" 
          fill="#4a4e69" 
          fontSize={10}
        >
          {nodeDatum.attributes.value}
        </text>
      )}
    </g>
  );

  return (
    <div ref={containerRef} className="ast-2d-container">
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: dimensions.width / 2, y: 50 }}
        pathFunc="step"
        separation={{ siblings: 1, nonSiblings: 1 }}
        renderCustomNodeElement={renderCustomNode}
        styles={{
          links: {
            stroke: "#7209b7",
            strokeWidth: 2,
          }
        }}
      />
    </div>
  );
};

// Main PhaseOutput Component
const PhaseOutput = ({ title, data }) => {
  const [viewMode, setViewMode] = useState('2d');
  const [isRaw, setIsRaw] = useState(false);

  const renderContent = () => {
    if (!data) return <div className="empty-state">No data available</div>;

    if (isRaw) {
      return (
        <SyntaxHighlighter 
          language="json" 
          style={atomDark}
          customStyle={{ margin: 0, borderRadius: 0 }}
        >
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      );
    }

    switch (true) {
      case title.includes('Lexical'):
        return <LexicalAnalysisView data={data} />;
      
      case title.includes('Semantic'):
        return <SemanticAnalysisView data={data} />;
      
      case title.includes('AST'):
        return (
          <>
            <ViewToggle 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
              isRaw={isRaw} 
              setIsRaw={setIsRaw}
              isAST={true}
            />
            {viewMode === '2d' ? <AST2DTree ast={data} /> : <AST3DVisualizer ast={data} />}
          </>
        );
      
      default:
        return (
          <SyntaxHighlighter 
            language="javascript" 
            style={atomDark}
            customStyle={{ margin: 0, borderRadius: 0 }}
          >
            {Array.isArray(data) ? data.join('\n') : JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        );
    }
  };

  return (
    <div className="phase-output-container">
      <div className="phase-header">
        <h3>{title}</h3>
        {!title.includes('Lexical') && !title.includes('Semantic') && (
          <ViewToggle 
            viewMode={viewMode} 
            setViewMode={setViewMode} 
            isRaw={isRaw} 
            setIsRaw={setIsRaw}
            isAST={title.includes('AST')}
          />
        )}
      </div>
      <div className="phase-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default PhaseOutput;