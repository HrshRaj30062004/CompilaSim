# backend/optimizer.py

from intermediate_codegen import reset_codegen

temp_counter = 0
optimized_instructions = []

def new_temp():
    global temp_counter
    temp_counter += 1
    return f"t{temp_counter}"

def reset_optimizer():
    global temp_counter, optimized_instructions
    temp_counter = 0
    optimized_instructions = []

def optimize_ast(ast):
    reset_optimizer()

    if ast["type"] != "Program":
        return {"error": "Invalid AST structure"}

    for stmt in ast.get("children", []):
        optimize_statement(stmt)

    return {
        "optimized_ir": optimized_instructions
    }

def optimize_statement(node):
    if node["type"] == "Declaration":
        var_name = node["children"][1]["value"]
        expr_node = node["children"][3]

        result = fold_constants(expr_node)
        optimized_instructions.append(f"{var_name} = {result}")

def fold_constants(node):
    if node["type"] == "Number":
        return str(node["value"])

    elif node["type"] == "Identifier":
        return node["value"]

    elif node["type"] == "BinaryOperation":
        left = fold_constants(node["children"][0])
        op = node["children"][1]["value"]
        right = fold_constants(node["children"][2])

        # Check if both sides are constant numbers
        if left.isdigit() and right.isdigit():
            folded = eval(f"{left} {op} {right}")
            return str(folded)

        temp = new_temp()
        optimized_instructions.append(f"{temp} = {left} {op} {right}")
        return temp

    return "?"
