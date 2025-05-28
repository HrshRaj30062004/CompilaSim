# backend/semantic_analysis.py

def semantic_check(ast):
    symbol_table = []
    errors = []

    def add_symbol(name, var_type):
        for entry in symbol_table:
            if entry["name"] == name:
                errors.append(f"Variable '{name}' already declared.")
                return
        symbol_table.append({"name": name, "type": var_type})

    def lookup_symbol(name):
        for entry in symbol_table:
            if entry["name"] == name:
                return entry["type"]
        errors.append(f"Undeclared variable '{name}'.")
        return "unknown"

    def evaluate_expression(expr):
        if not isinstance(expr, dict):
            return "unknown"
        expr_type = expr.get("type")
        if expr_type == "Number":
            return "int"
        elif expr_type == "Identifier":
            return lookup_symbol(expr.get("value"))
        elif expr_type == "String":
            return "string"
        elif expr_type == "BinaryOperation":
            left = evaluate_expression(expr["children"][0])
            right = evaluate_expression(expr["children"][2])
            return left if left == right else "type_error"
        else:
            return "unknown"

    def check_node(node):
        if not isinstance(node, dict):
            errors.append("Invalid node format")
            return

        node_type = node.get("type")

        if node_type == "Program":
            for child in node.get("children", []):
                check_node(child)

        elif node_type == "Function":
            for child in node.get("children", []):
                check_node(child)

        elif node_type == "Block":
            for stmt in node.get("children", []):
                check_node(stmt)

        elif node_type == "DeclarationList":
            for decl in node.get("children", []):
                check_node(decl)

        elif node_type == "Declaration":
            var_name = node.get("value")
            expr_node = node["children"][0] if node.get("children") else None
            if expr_node:
                expr_type = evaluate_expression(expr_node)
                if expr_type != "int":
                    errors.append(f"Invalid assignment type to '{var_name}'. Got '{expr_type}'")
            add_symbol(var_name, "int")

        elif node_type == "Assignment":
            var_name = node.get("value")
            expr_node = node["children"][0]
            expr_type = evaluate_expression(expr_node)
            declared_type = lookup_symbol(var_name)
            if declared_type != expr_type:
                errors.append(f"Type mismatch in assignment to '{var_name}': expected '{declared_type}', got '{expr_type}'")

        elif node_type == "Return":
            expr_node = node["children"][0]
            ret_type = evaluate_expression(expr_node)
            if ret_type != "int":
                errors.append(f"Return type mismatch: expected 'int', got '{ret_type}'")

        elif node_type == "If":
            cond_expr = node["children"][0]
            cond_type = evaluate_expression(cond_expr)
            if cond_type != "int":
                errors.append("Condition in if must be of type 'int'")
            check_node(node["children"][1])  # if block

        elif node_type == "IfElse":
            cond_expr = node["children"][0]
            if_type = evaluate_expression(cond_expr)
            if if_type != "int":
                errors.append("Condition in if-else must be of type 'int'")
            check_node(node["children"][1])  # if block
            check_node(node["children"][2])  # else block

        elif node_type == "While":
            cond_expr = node["children"][0]
            cond_type = evaluate_expression(cond_expr)
            if cond_type != "int":
                errors.append("Condition in while must be of type 'int'")
            check_node(node["children"][1])  # while block

        elif node_type == "Printf":
            if not node.get("children"):
                errors.append("printf requires at least one argument")
                return
                
            first_arg = node["children"][0]
            if first_arg.get("type") != "String":
                errors.append("First argument to printf must be a format string")
            
            for arg in node.get("children", [])[1:]:
                if arg.get("type") == "Identifier":
                    lookup_symbol(arg.get("value"))
                elif arg.get("type") == "BinaryOperation":
                    evaluate_expression(arg)

        elif node_type == "Scanf":
            if not node.get("children"):
                errors.append("scanf requires at least one argument")
                return
                
            first_arg = node["children"][0]
            if first_arg.get("type") != "String":
                errors.append("First argument to scanf must be a format string")
            
            for arg in node.get("children", [])[1:]:
                if arg.get("type") != "Identifier":
                    errors.append("scanf arguments must be variable names")
                else:
                    lookup_symbol(arg.get("value"))

    # Entry point
    check_node(ast.get("ast"))

    return {
        "symbol_table": symbol_table,
        "errors": errors
    }