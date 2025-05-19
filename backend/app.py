from flask import Flask, request, jsonify
from flask_cors import CORS

from lexical_analysis import run_lexer
from syntax_analysis import run_parser
from semantic_analysis import semantic_check
from intermediate_codegen import generate_code
from optimizer import optimize_ast
from code_generator import generate_final_code

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True) # ← Enables CORS for all frontend requests

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
    data = request.get_json()
    ast = data.get("ast", {})
    result = semantic_check(ast)
    return jsonify(result)

@app.route('/api/intermediate', methods=['POST'])
def intermediate_code():
    data = request.get_json()
    ast = data.get("ast", {})
    ir = generate_code(ast)
    return jsonify(ir)

@app.route('/api/optimize', methods=['POST'])
def optimize_code():
    data = request.get_json()
    ast = data.get("ast", {})
    optimized = optimize_ast(ast)
    return jsonify(optimized)

@app.route('/api/codegen', methods=['POST'])
def codegen():
    data = request.get_json()
    ir = data.get("ir", [])
    result = generate_final_code(ir)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True)
