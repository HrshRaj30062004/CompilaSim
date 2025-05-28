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

        instr = instr.strip()

        if instr.endswith(":"):
            final_code.append(instr)
            continue

        if instr.startswith("goto "):
            label = instr.split()[1]
            final_code.append(f"JMP {label}")
            continue

        if instr.startswith("ifFalse"):
            parts = instr.split()
            if len(parts) == 4 and parts[2] == "goto":
                cond_var = parts[1]
                label = parts[3]
                final_code.append(f"JZ {cond_var}, {label}")
                continue
            else:
                errors.append(f"Malformed ifFalse: {instr}")
                continue

        if instr.startswith("if"):
            parts = instr.split()
            if len(parts) == 4 and parts[2] == "goto":
                cond_var = parts[1]
                label = parts[3]
                final_code.append(f"JNZ {cond_var}, {label}")
                continue
            else:
                errors.append(f"Malformed if: {instr}")
                continue

        if instr.startswith("return"):
            parts = instr.split()
            if len(parts) == 2:
                final_code.append(f"RET {parts[1]}")
            else:
                errors.append(f"Malformed return: {instr}")
            continue

        if instr.startswith("printf"):
            parts = instr.split(maxsplit=1)
            if len(parts) == 2:
                final_code.append(f"PRINT {parts[1]}")
            else:
                errors.append(f"Malformed printf: {instr}")
            continue

        if instr.startswith("scanf"):
            parts = instr.split(maxsplit=1)
            if len(parts) == 2:
                final_code.append(f"SCAN {parts[1]}")
            else:
                errors.append(f"Malformed scanf: {instr}")
            continue

        if '=' in instr:
            left_expr = instr.split('=', 1)
            if len(left_expr) != 2:
                errors.append(f"Malformed assignment: {instr}")
                continue

            left, expr = [x.strip() for x in left_expr]

            if any(op in expr for op in ['+', '-', '*', '/']):
                parts = expr.split()
                if len(parts) != 3:
                    errors.append(f"Malformed binary op: {instr}")
                    continue

                operand1, operator, operand2 = parts
                asm_op = op_to_asm(operator)

                if asm_op == 'UNKNOWN':
                    errors.append(f"Unknown operator '{operator}' in: {instr}")
                    continue

                final_code.append(f"LOAD {operand1}")
                final_code.append(f"{asm_op} {operand2}")
                final_code.append(f"STORE {left}")
            else:
                final_code.append(f"LOAD {expr}")
                final_code.append(f"STORE {left}")
        else:
            errors.append(f"Invalid instruction: {instr}")

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