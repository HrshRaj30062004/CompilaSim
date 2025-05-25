temp_counter = 0
ir = []

def new_temp():
    global temp_counter
    temp_counter += 1
    return f"t{temp_counter}"

def reset_codegen():
    global temp_counter, ir
    temp_counter = 0
    ir = []

def generate_code(ast):
    reset_codegen()

    if not ast:
        return {"ir": []}

    # Fix: Unwrap 'ast' key if it's present
    if "ast" in ast and ast["ast"].get("type") == "Program":
        ast = ast["ast"]

    if ast.get("type") != "Program":
        return {"ir": []}

    for stmt in ast.get("children", []):
        handle_statement(stmt)

    return {"ir": ir}


def handle_statement(node):
    if node["type"] == "Declaration":
        var_name = node["children"][1]["value"]
        expr_node = node["children"][3]
        result = generate_expr(expr_node)
        ir.append(f"{var_name} = {result}")

def generate_expr(node):
    if node["type"] == "Number":
        return str(node["value"])
    elif node["type"] == "Identifier":
        return node["value"]
    elif node["type"] == "BinaryOperation":
        left = generate_expr(node["children"][0])
        op = node["children"][1]["value"]
        right = generate_expr(node["children"][2])
        temp = new_temp()
        ir.append(f"{temp} = {left} {op} {right}")
        return temp
    return "?"
