# backend/code_generator.py

def generate_final_code(ir_instructions):
    final_code = []
    errors = []

    if not isinstance(ir_instructions, list):
        return {"error": "IR instructions should be a list"}

    for instr in ir_instructions:
        if not isinstance(instr, str):
            errors.append(f"Invalid instruction (not a string): {instr}")
            continue

        if '=' not in instr:
            errors.append(f"Invalid instruction (no '='): {instr}")
            continue

        left_expr = instr.split('=', 1)
        if len(left_expr) != 2:
            errors.append(f"Malformed instruction: {instr}")
            continue

        left, expr = [x.strip() for x in left_expr]

        # Binary operation detection
        if any(op in expr for op in ['+', '-', '*', '/']):
            parts = expr.split()
            if len(parts) != 3:
                errors.append(f"Malformed binary operation in instruction: {instr}")
                continue

            operand1, operator, operand2 = parts

            asm_op = op_to_asm(operator)
            if asm_op == 'UNKNOWN':
                errors.append(f"Unknown operator '{operator}' in instruction: {instr}")
                continue

            final_code.append(f"LOAD {operand1}")
            final_code.append(f"{asm_op} {operand2}")
            final_code.append(f"STORE {left}")

        else:
            # Simple assignment
            final_code.append(f"LOAD {expr}")
            final_code.append(f"STORE {left}")

    return {
        "final_code": final_code,
        "errors": errors
    }

def op_to_asm(op):
    return {
        '+': 'ADD',
        '-': 'SUB',
        '*': 'MUL',
        '/': 'DIV'
    }.get(op, 'UNKNOWN')
