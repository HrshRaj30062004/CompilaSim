# CompilaSim# CompilaSim — Compiler Visualizer Project

A six-phase compiler with interactive 3D visualization, supporting a subset of the C language. Built with **Python (backend)** and **JavaScript/Three.js (frontend)**.

---

## 🚀 Features

- **Complete Compilation Pipeline**:
  - ✅ Lexical Analysis  
  - ✅ Syntax Analysis (AST Generation)  
  - ✅ Semantic Analysis  
  - ✅ Intermediate Code Generation  
  - ✅ Optimization  
  - ✅ Code Generation  
- **Interactive 3D AST Visualization**
- **Supported C Subset**:
  - Variable declarations (`int x = 5;`)
  - Arithmetic/logical expressions
  - Control structures (`if`, `else`, `while`, `for`)
  - I/O operations (`printf`, `scanf`)
  - Functions (`main` function only`)

---

## 🛠 Installation

### 🔹 Backend (Python)

```bash
# Clone repository
git clone https://github.com/HrshRaj30062004/CompilaSim.git
cd CompilaSim/backend

# Create virtual environment (recommended)
python -m venv venv
# Activate it
# For Linux/Mac:
source venv/bin/activate
# For Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 🔹 Frontend (Node.js + React)

```bash
cd ../frontend
npm install
```

---

## ▶️ Usage

### Start Backend Server

```bash
cd backend
python app.py
```

### Start Frontend Server

```bash
cd ../frontend
npm start
```

Now open your browser and visit:  
🔗 **http://localhost:3000**

---

## 📁 Project Structure

```
CompilaSim/
│
├── backend/
│   ├── app.py                   # Flask server
│   ├── lexical_analysis.py      # Lexer
│   ├── syntax_analysis.py       # Parser (AST Generator)
│   ├── semantic_analysis.py     # Type Checker
│   ├── intermediate_codegen.py  # 3-address code generator
│   ├── optimizer.py             # Intermediate Representation Optimizer
│   ├── code_generator.py        # Final code generation (assembly-level)
│   └── requirements.txt         # Python package list
│
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── App.js               # Main app
│   │   └── AST3DVisualizer.js   # 3D AST rendering via Three.js
│   └── package.json             # Frontend dependencies
│
└── README.md                    # You're here!
```

---

## 💻 Example Input (C Code)

```c
int main() {
    int x = 5;
    int y = 6;
    if (x > y) {
        printf("%d", x);
    } else {
        printf("%d", y);
    }
    return 0;
}
```

---

## 📡 API Endpoints

| Endpoint            | Method | Description                     |
|---------------------|--------|---------------------------------|
| `/api/lexical`      | POST   | Tokenize input code             |
| `/api/syntax`       | POST   | Generate AST                    |
| `/api/semantic`     | POST   | Perform semantic analysis       |
| `/api/intermediate` | POST   | Generate intermediate code      |
| `/api/optimize`     | POST   | Optimize intermediate code      |
| `/api/codegen`      | POST   | Generate final assembly code    |

---

## ⚠️ Limitations

- Supports a **single function only** (`main`)
- Limited type system (`int`, `string`)
- Basic control flow (`if`, `else`, `while`, `for`)
- Simplified I/O (`printf`, `scanf`)
- No support for arrays, structs, or pointers

---

## 🧩 Troubleshooting

### Lexical Errors
- Ensure symbols are supported (check `lexical_analysis.py`)
- Remove unsupported operators/special characters

### Syntax Errors
- Ensure balanced braces and parentheses
- End all statements with semicolons

### Visualization Issues
- Refresh if 3D AST doesn't load
- Check browser console for WebGL issues

---

## 👨‍💻 Contributors

- Swastik Sharma  
- Harsh Raj  
- Aaryan Kaushal