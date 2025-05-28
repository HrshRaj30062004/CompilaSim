import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import PhaseOutput from './components/PhaseOutput';
import PhaseControls from './components/PhaseControls';
import { 
  runLexical, runSyntax, runSemantic,
  runIntermediate, runOptimize, runCodegen
} from './services/api';
import './App.css';

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
  const [theme, setTheme] = useState('light');
  const [fileName, setFileName] = useState('');

  const resetAll = () => {
    setCode('');
    setFileName('');
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
    // Use code from editor or uploaded file
    const codeToProcess = code.trim();
    
    if (!codeToProcess) {
      alert("Please enter code or upload a file first!");
      return;
    }

    try {
      switch (currentPhase) {
        case 0: {
          const lex = await runLexical(codeToProcess);
          setTokens(lex.data);
          break;
        }
        case 1: {
          const syn = await runSyntax(codeToProcess);
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
          const final = await runCodegen({ ir: optimized });
          console.log('Codegen output:', JSON.stringify(final.data, null, 2));
          setFinalCode(final.data.final_code);
          setMessage('✅ Compilation Complete!');
          break;
        }
        default:
          break;
      }

      if (currentPhase < 6) {
        setCurrentPhase(currentPhase + 1);
        setSelectedTab(currentPhase + 1);
      }
    } catch (err) {
      console.error("Compilation error:", err);
      alert(`Error: ${err?.response?.data?.error || err.message || "Unknown error"}`);
    }
  };

  const phases = [
    { title: "Lexical Tokens", data: tokens },
    { title: "Parse Tree (AST)", data: ast },
    { title: "Semantic Analysis", data: semantics },
    { title: "Intermediate Code (IR)", data: ir },
    { title: "Optimized Code", data: optimized },
    { title: "Final Code Generation", data: finalCode }
  ];

  const handleFileUpload = (file, fileName) => {
    setFileName(fileName);
    setCode(file);
  };

  return (
    <div className="compiler-container" data-theme={theme}>
      <header className="header">
        <h1 className="logo">CompilaSim</h1>
        <button 
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main className="main-content">
        <div>
          <CodeEditor 
            code={code} 
            setCode={setCode}
            fileName={fileName}
            onFileUpload={handleFileUpload}
          />
          <PhaseControls 
            onRunNext={runNextPhase} 
            currentPhase={currentPhase} 
            onReset={resetAll} 
          />
        </div>

        <div className="phase-output-container">
          <div className="phase-tabs">
            {phases.map((phase, idx) => (
              <button
                key={idx}
                className={`phase-tab ${selectedTab === idx ? 'active' : ''}`}
                onClick={() => setSelectedTab(idx)}
                disabled={!phase.data}
              >
                {phase.title.split(' ')[0]}
              </button>
            ))}
          </div>

          {phases[selectedTab]?.data && (
            <PhaseOutput 
              title={phases[selectedTab].title} 
              data={phases[selectedTab].data} 
            />
          )}
          {message && <p className="completion-message">{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default App;