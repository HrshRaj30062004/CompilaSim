import re

def is_constant(value):
    try:
        float(value)
        return True
    except:
        return False

def optimize_ast(ast):
    ir = ast.get("ir", [])
    optimized_ir = []

    for line in ir:
        stripped = line.strip()

        if (stripped.endswith(':') or 
            stripped.startswith('goto') or 
            stripped.startswith('if') or 
            stripped.startswith('return') or
            stripped.startswith('printf') or
            stripped.startswith('scanf') or 
            '=' not in stripped):
            optimized_ir.append(stripped)
            continue

        match = re.match(r"(\w+)\s*=\s*(\w+)\s*([\+\-\*/])\s*(\w+)", stripped)
        if match:
            dest, left, op, right = match.groups()
            if is_constant(left) and is_constant(right):
                result = str(eval(f"{left}{op}{right}"))
                optimized_ir.append(f"{dest} = {result}")
            else:
                optimized_ir.append(stripped)
        else:
            optimized_ir.append(stripped)

    return {"optimized_ir": optimized_ir}