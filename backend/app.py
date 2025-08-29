from flask import Flask, request, jsonify
from flask_cors import CORS

from lexical_analysis import run_lexer
from syntax_analysis import run_parser
from semantic_analysis import semantic_check
from intermediate_codegen import generate_code
from optimizer import optimize_ast
from code_generator import generate_final_code

app = Flask(__name__)

CORS(app, origins=[
    "https://compila-sim.vercel.app",
    "https://compila-in8tqocra-harshs-projects-9c3b7aa6.vercel.app",  # new deployment URL
    "http://localhost:3000"
], supports_credentials=True)

@app.route('/api/lexical', methods=['POST'])
def lexical_analysis():
    data = request.get_json()
    code = data.get("code", "")
    tokens = run_lexer(code)
    return jsonify(tokens)

@app.route('/api/syntax', methods=['POST'])
def syntax_analysis():
    data = request.get_json()
    code = data.get("code", "")
    tree = run_parser(code)
    return jsonify(tree)

@app.route('/api/semantic', methods=['POST'])
def semantic_analysis():
    try:
        data = request.get_json()
        ast = data.get("ast", {})

        # Debug: Log input to make sure it's not null
        print("Received AST for semantic analysis:", ast)

        result = semantic_check(ast)
        return jsonify(result)
    except Exception as e:
        print("❌ Error in /api/semantic:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/api/intermediate', methods=['POST'])
def intermediate_code():
    data = request.get_json()
    ast = data.get("ast", {})
    ir = generate_code(ast)
    return jsonify(ir)

@app.route('/api/optimize', methods=['POST'])
def optimize_code():
    data = request.get_json()
    print("🛠 Raw /api/optimize POST body:", data)

    ast_wrapper = data.get("ast", {})
    ast = ast_wrapper.get("ast", {})  # ✅ Unwrap second layer
    print("📦 Extracted AST:", ast)

    optimized = optimize_ast(ast)
    print("✅ Optimized IR:", optimized)

    return jsonify(optimized)

@app.route('/api/codegen', methods=['POST'])
def codegen():
    data = request.get_json()
    ir = data.get("ir", [])
    
    # 🔒 Safety check if someone passed a nested dict again
    if isinstance(ir, dict) and "ir" in ir:
        ir = ir["ir"]

    result = generate_final_code(ir)
    print("✅ Final generated code:", result)
    return jsonify(result)



if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    # For production, set debug=False. For local dev, you can override with an env var if needed.
    debug_mode = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)