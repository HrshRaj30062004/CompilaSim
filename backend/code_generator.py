# backend/code_generator.py

def generate_final_code(ir_instructions):
    final_code = []

    for instr in ir_instructions:
        if '=' in instr:
            left, expr = [x.strip() for x in instr.split('=')]

            # Binary operation?
            if any(op in expr for op in ['+', '-', '*', '/']):
                parts = expr.split()
                operand1 = parts[0]
                operator = parts[1]
                operand2 = parts[2]

                final_code.append(f"LOAD {operand1}")
                final_code.append(f"{op_to_asm(operator)} {operand2}")
                final_code.append(f"STORE {left}")

            else:
                # Simple assignment
                final_code.append(f"LOAD {expr}")
                final_code.append(f"STORE {left}")

    return {
        "final_code": final_code
    }

def op_to_asm(op):
    return {
        '+': 'ADD',
        '-': 'SUB',
        '*': 'MUL',
        '/': 'DIV'
    }.get(op, 'UNKNOWN')
