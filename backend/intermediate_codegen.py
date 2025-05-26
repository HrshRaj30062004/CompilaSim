temp_counter = 0
label_counter = 0
ir = []

def new_temp():
    global temp_counter
    temp_counter += 1
    return f"t{temp_counter}"

def new_label():
    global label_counter
    label_counter += 1
    return f"L{label_counter}"

def reset_codegen():
    global temp_counter, label_counter, ir
    temp_counter = 0
    label_counter = 0
    ir = []

def generate_code(ast):
    reset_codegen()

    if not ast:
        return {"ir": []}

    # Unwrap if necessary
    if "ast" in ast and ast["ast"].get("type") == "Program":
        ast = ast["ast"]

    if ast.get("type") != "Program":
        return {"ir": []}

    for child in ast.get("children", []):
        handle_node(child)

    return {"ir": ir}


def handle_node(node):
    node_type = node.get("type")

    if node_type == "Function":
        ir.append(f"# Function {node.get('value')}")
        for stmt in node["children"]:
            handle_node(stmt)

    elif node_type == "Block":
        for stmt in node.get("children", []):
            handle_node(stmt)

    elif node_type == "DeclarationList":
        for decl in node.get("children", []):
            handle_node(decl)

    elif node_type == "Declaration":
        var_name = node.get("value")
        if node.get("children"):
            expr_node = node["children"][0]
            result = generate_expr(expr_node)
            ir.append(f"{var_name} = {result}")

    elif node_type == "Assignment":
        var_name = node.get("value")
        expr_node = node["children"][0]
        result = generate_expr(expr_node)
        ir.append(f"{var_name} = {result}")

    elif node_type == "Return":
        result = generate_expr(node["children"][0])
        ir.append(f"return {result}")

    elif node_type == "If":
        cond = generate_expr(node["children"][0])
        label_false = new_label()
        ir.append(f"ifFalse {cond} goto {label_false}")
        handle_node(node["children"][1])  # if block
        ir.append(f"{label_false}:")

    elif node_type == "IfElse":
        cond = generate_expr(node["children"][0])
        label_false = new_label()
        label_end = new_label()
        ir.append(f"ifFalse {cond} goto {label_false}")
        handle_node(node["children"][1])  # if block
        ir.append(f"goto {label_end}")
        ir.append(f"{label_false}:")
        handle_node(node["children"][2])  # else block
        ir.append(f"{label_end}:")

    elif node_type == "While":
        label_start = new_label()
        label_end = new_label()
        ir.append(f"{label_start}:")
        cond = generate_expr(node["children"][0])
        ir.append(f"ifFalse {cond} goto {label_end}")
        handle_node(node["children"][1])  # while block
        ir.append(f"goto {label_start}")
        ir.append(f"{label_end}:")


def generate_expr(node):
    node_type = node.get("type")
    
    if node_type == "Number":
        return str(node["value"])
    elif node_type == "Identifier":
        return node["value"]
    elif node_type == "BinaryOperation":
        left = generate_expr(node["children"][0])
        op = node["children"][1]["value"]
        right = generate_expr(node["children"][2])
        temp = new_temp()
        ir.append(f"{temp} = {left} {op} {right}")
        return temp
    return "?"
