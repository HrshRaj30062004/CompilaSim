import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import PhaseOutput from './components/PhaseOutput';
import PhaseControls from './components/PhaseControls';
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
          const final = await runCodegen({ ir: optimized });
          console.log("💡 /api/codegen result:", final.data);
          setFinalCode(final.data.final_code);  // Might be undefined if backend is misbehaving
          setMessage('✅ Compilation Complete!');
          break;
        }
        default:
          break;
      }

      if (currentPhase < 6) {
        setCurrentPhase(currentPhase + 1);
      }

    } catch (err) {
      console.error(err);
      alert("Error: " + (err?.response?.data?.error || err.message || "Unknown"));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🧠 CompilaSim – Phase-by-Phase Compiler Simulator</h1>
      <CodeEditor code={code} setCode={setCode} />

      <PhaseControls onRunNext={runNextPhase} currentPhase={currentPhase} />

      {tokens && <PhaseOutput title="🔤 Lexical Tokens" data={tokens} />}
      {ast && <PhaseOutput title="🌲 Parse Tree (AST)" data={ast} />}
      {semantics && <PhaseOutput title="📚 Semantic Analysis" data={semantics} />}
      {ir && <PhaseOutput title="🔧 Intermediate Code (IR)" data={ir} />}
      {optimized && <PhaseOutput title="🚀 Optimized Code" data={optimized} />}
      {finalCode && <PhaseOutput title="⚙️ Final Code Generation" data={finalCode} />}

      {message && <h2 style={{ color: "green" }}>{message}</h2>}
    </div>
  );
};

export default App;
