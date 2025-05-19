# backend/intermediate_codegen.py

temp_counter = 0
instructions = []

def new_temp():
    global temp_counter
    temp_counter += 1
    return f"t{temp_counter}"

def reset_codegen():
    global temp_counter, instructions
    temp_counter = 0
    instructions = []

def generate_code(ast):
    reset_codegen()

    if ast["type"] != "Program":
        return {"error": "Invalid AST"}

    for stmt in ast.get("children", []):
        process_statement(stmt)

    return {
        "ir": instructions
    }

def process_statement(node):
    if node["type"] == "Declaration":
        var_name = node["children"][1]["value"]     # e.g., 'a'
        expr_node = node["children"][3]             # The expression part
        result_temp = evaluate_expression(expr_node)
        instructions.append(f"{var_name} = {result_temp}")

def evaluate_expression(node):
    if node["type"] == "Number":
        return str(node["value"])

    elif node["type"] == "Identifier":
        return node["value"]

    elif node["type"] == "BinaryOperation":
        left = evaluate_expression(node["children"][0])
        op = node["children"][1]["value"]
        right = evaluate_expression(node["children"][2])

        temp = new_temp()
        instructions.append(f"{temp} = {left} {op} {right}")
        return temp

    return "?"
