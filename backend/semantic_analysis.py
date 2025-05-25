def semantic_check(ast):
    symbol_table = []
    errors = []

    def check_node(node):
        if not isinstance(node, dict):
            errors.append("Invalid node structure")
            return

        node_type = node.get("type")
        if not node_type:
            errors.append("Missing 'type' in node")
            return

        if node_type == "Program":
            for child in node.get("children", []):
                check_node(child)

        elif node_type == "Declaration":
            try:
                var_type = node["children"][0]["value"]
                var_name = node["children"][1]["value"]
                expr = node["children"][3]

                expr_type = evaluate_expression(expr)
                if expr_type != var_type:
                    errors.append(f"Type mismatch: declared '{var_type}', but assigned expression evaluates to '{expr_type}'.")
                symbol_table.append({"name": var_name, "type": var_type})
            except Exception as e:
                errors.append(f"Error processing declaration: {str(e)}")

    def evaluate_expression(expr):
        expr_type = expr.get("type")
        if expr_type == "Number":
            return "int"
        elif expr_type == "Identifier":
            # lookup in symbol table?
            return "int"  # Assume int for now
        elif expr_type == "BinaryOperation":
            left = evaluate_expression(expr["children"][0])
            right = evaluate_expression(expr["children"][2])
            if left == right:
                return left
            else:
                return "type_error"
        return "unknown"

    check_node(ast.get("ast"))  # Accepts the wrapped dict

    return {
        "symbol_table": symbol_table,
        "errors": errors
    }
