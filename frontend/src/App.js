import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import PhaseOutput from './components/PhaseOutput';
import PhaseControls from './components/PhaseControls';

import {
  runLexical, runSyntax, runSemantic,
  runIntermediate, runOptimize, runCodegen
} from './services/api';

const phaseColors = {
  lexical: '#ff6f61',
  syntax: '#6b5b95',
  semantic: '#88b04b',
  intermediate: '#f7cac9',
  optimize: '#92a8d1',
  codegen: '#955251'
};

const App = () => {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState(null);
  const [ast, setAst] = useState(null);
  const [semantics, setSemantics] = useState(null);
  const [ir, setIR] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [finalCode, setFinalCode] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAll = async () => {
    try {
      setLoading(true);
      const lex = await runLexical(code);
      setTokens(lex.data);

      const syn = await runSyntax(code);
      setAst(syn.data);

      const sem = await runSemantic(syn.data);
      setSemantics(sem.data);

      const irResp = await runIntermediate(syn.data);
      setIR(irResp.data.ir);

      const opt = await runOptimize(syn.data);
      setOptimized(opt.data.optimized_ir);

      const final = await runCodegen(opt.data.optimized_ir);
      setFinalCode(final.data.final_code);
    } catch (err) {
      console.error("Compiler Error:", err);
      alert("Error: " + (err?.response?.data?.error || err.message || "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: 900,
    margin: "2rem auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#222"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontWeight: "700",
    fontSize: "2rem",
    color: "#333"
  };

  const phaseStyle = {
    backgroundColor: "#fafafa",
    padding: "1rem",
    borderRadius: 8,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: "1.5rem",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: "1.4"
  };

  const titleStyle = (color) => ({
    borderLeft: `6px solid ${color}`,
    paddingLeft: "0.5rem",
    marginBottom: "0.75rem",
    color,
    fontWeight: "600",
    fontSize: "1.2rem"
  });

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>🧠 CompilaSim – Mini Compiler Simulator</h1>
      <CodeEditor code={code} setCode={setCode} />
      <PhaseControls onRunAll={runAll} loading={loading} />
      
      {tokens && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.lexical)}>🔤 Lexical Tokens</h2>
          <PhaseOutput data={tokens} />
        </div>
      )}
      {ast && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.syntax)}>🌲 Parse Tree (AST)</h2>
          <PhaseOutput data={ast} />
        </div>
      )}
      {semantics && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.semantic)}>📚 Semantic Analysis</h2>
          <PhaseOutput data={semantics} />
        </div>
      )}
      {ir && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.intermediate)}>🔧 Intermediate Code (IR)</h2>
          <PhaseOutput data={ir} />
        </div>
      )}
      {optimized && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.optimize)}>🚀 Optimized Code</h2>
          <PhaseOutput data={optimized} />
        </div>
      )}
      {finalCode && (
        <div style={phaseStyle}>
          <h2 style={titleStyle(phaseColors.codegen)}>⚙️ Final Code Generation</h2>
          <PhaseOutput data={finalCode} />
        </div>
      )}
    </div>
  );
};

export default App;
