# backend/semantic_analysis.py

symbol_table = {}

def reset_symbol_table():
    global symbol_table
    symbol_table = {}

def semantic_check(ast):
    reset_symbol_table()

    if ast["type"] != "Program":
        return {"error": "Invalid AST structure"}

    results = {
        "symbol_table": [],
        "errors": []
    }

    for child in ast.get("children", []):
        result = analyze_statement(child)
        results["symbol_table"].extend(result.get("symbol_table", []))
        results["errors"].extend(result.get("errors", []))

    return results


def analyze_statement(node):
    result = {"symbol_table": [], "errors": []}

    if node["type"] == "Declaration":
        type_node = node["children"][0]
        identifier_node = node["children"][1]
        expr_node = node["children"][3]

        var_type = type_node["value"]
        var_name = identifier_node["value"]

        # Check for redeclaration
        if var_name in symbol_table:
            result["errors"].append(f"Variable '{var_name}' already declared.")
        else:
            inferred_type = evaluate_expression(expr_node)
            if inferred_type != var_type:
                result["errors"].append(
                    f"Type mismatch: declared '{var_type}', but assigned expression evaluates to '{inferred_type}'."
                )

            # Add to symbol table
            symbol_table[var_name] = {
                "name": var_name,
                "type": var_type,
                "value": None  # optional: infer constant values
            }

            result["symbol_table"].append({
                "name": var_name,
                "type": var_type
            })

    return result


def evaluate_expression(node):
    if node["type"] == "Number":
        return "int"
    elif node["type"] == "Identifier":
        var_name = node["value"]
        if var_name not in symbol_table:
            return "undeclared"
        return symbol_table[var_name]["type"]
    elif node["type"] == "BinaryOperation":
        left_type = evaluate_expression(node["children"][0])
        right_type = evaluate_expression(node["children"][2])
        if left_type != right_type:
            return "type_error"
        return left_type
    else:
        return "unknown"
