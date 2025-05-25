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
        match = re.match(r"(\w+)\s*=\s*(\w+)\s*([\+\-\*/])\s*(\w+)", line)
        if match:
            dest, left, op, right = match.groups()
            if is_constant(left) and is_constant(right):
                result = str(eval(f"{left}{op}{right}"))
                optimized_ir.append(f"{dest} = {result}")
            else:
                optimized_ir.append(line)
        else:
            optimized_ir.append(line)

    return {"optimized_ir": optimized_ir}
