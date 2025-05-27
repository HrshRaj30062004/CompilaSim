import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import PhaseOutput from './components/PhaseOutput';
import PhaseControls from './components/PhaseControls';
import ASTTree from './components/ASTTree'; // ✅ Import the tree view component
import {
  runLexical, runSyntax, runSemantic,
  runIntermediate, runOptimize, runCodegen
} from './services/api';

const App = () => {
  const [code, setCode] = useState('');
  const [tokens, setTokens] = useState(null);
  const [ast, setAst] = useState(null);
  const [semantics, setSemantics] = useState(null);
  const [ir, setIR] = useState(null);
  const [optimized, setOptimized] = useState(null);
  const [finalCode, setFinalCode] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [message, setMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const resetAll = () => {
    setCode('');
    setTokens(null);
    setAst(null);
    setSemantics(null);
    setIR(null);
    setOptimized(null);
    setFinalCode(null);
    setCurrentPhase(0);
    setMessage('');
    setSelectedTab(0);
  };

  const runNextPhase = async () => {
    try {
      switch (currentPhase) {
        case 0: {
          const lex = await runLexical(code);
          setTokens(lex.data);
          break;
        }
        case 1: {
          const syn = await runSyntax(code);
          setAst(syn.data);
          break;
        }
        case 2: {
          if (!ast || Object.keys(ast).length === 0) {
            alert("❗ AST not available. Please run syntax analysis first.");
            return;
          }
          const sem = await runSemantic({ ast });
          setSemantics(sem.data);
          break;
        }
        case 3: {
          const irRes = await runIntermediate({ ast });
          setIR(irRes.data.ir);
          break;
        }
        case 4: {
          const opt = await runOptimize({ ast: { ir } });
          setOptimized(opt.data.optimized_ir);
          break;
        }
        case 5: {
          if (!optimized || !Array.isArray(optimized)) {
            alert("⚠️ Optimized IR not available.");
            return;
          }

          try {
            const final = await runCodegen({ ir: optimized });

            if (final && final.data && Array.isArray(final.data.final_code)) {
              setFinalCode(final.data.final_code);
              setMessage('✅ Compilation Complete!');
            } else {
              console.error("❌ Codegen failed or malformed:", final);
              alert("❌ Codegen failed: No valid response received.");
            }
          } catch (err) {
            console.error("❌ Exception in codegen phase:", err);
            alert("❌ Error during codegen: " + (err.message || "unknown"));
          }

          break;
        }
        default:
          break;
      }

      if (currentPhase < 6) {
        setCurrentPhase(currentPhase + 1);
        setSelectedTab(currentPhase + 1); // auto switch to new tab
      }

    } catch (err) {
      console.error(err);
      alert("Error: " + (err?.response?.data?.error || err.message || "Unknown"));
    }
  };

  const phases = [
    { title: "🔤 Lexical Tokens", data: tokens },
    { title: "🌲 Parse Tree (AST)", data: ast },
    { title: "📚 Semantic Analysis", data: semantics },
    { title: "🔧 Intermediate Code (IR)", data: ir },
    { title: "🚀 Optimized Code", data: optimized },
    { title: "⚙️ Final Code Generation", data: finalCode }
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 CompilaSim – Phase-by-Phase Compiler Simulator</h1>
      <CodeEditor code={code} setCode={setCode} />
      <PhaseControls onRunNext={runNextPhase} currentPhase={currentPhase} onReset={resetAll} />

      {/* ✅ Tabs Header */}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '1rem 0' }}>
        {phases.map((phase, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedTab(idx)}
            disabled={!phase.data}
            style={{
              padding: '0.5rem 1rem',
              border: selectedTab === idx ? '2px solid #444' : '1px solid #ccc',
              backgroundColor: selectedTab === idx ? '#e0e0e0' : '#f9f9f9',
              cursor: phase.data ? 'pointer' : 'not-allowed',
              fontWeight: selectedTab === idx ? 'bold' : 'normal'
            }}
          >
            {phase.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* ✅ Phase Output or AST Tree */}
      {phases[selectedTab] && phases[selectedTab].data && (
        selectedTab === 1 ? (
          <>
            <ASTTree ast={phases[selectedTab].data} />
            <PhaseOutput title={phases[selectedTab].title} data={phases[selectedTab].data} />
          </>
        ) : (
          <PhaseOutput title={phases[selectedTab].title} data={phases[selectedTab].data} />
        )
      )}

      {message && <h2 style={{ color: "green" }}>{message}</h2>}
    </div>
  );
};

export default App;
