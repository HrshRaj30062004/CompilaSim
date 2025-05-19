import ply.yacc as yacc
from lexical_analysis import tokens  # Reuse lexer
import json

# ------------------------
# AST Node Generator
# ------------------------

def make_node(type, children=None, value=None):
    return {
        "type": type,
        "children": children if children else [],
        "value": value
    }

# ------------------------
# Grammar Rules
# ------------------------

def p_program(p):
    """program : statement"""
    p[0] = make_node("Program", [p[1]])

def p_statement_declaration(p):
    """statement : INT IDENTIFIER EQUALS expression SEMICOLON"""
    p[0] = make_node("Declaration", [
        make_node("Type", value=p[1]),
        make_node("Identifier", value=p[2]),
        make_node("AssignmentOperator", value=p[3]),
        p[4],
        make_node("EndStatement", value=p[5])
    ])

def p_expression_binop(p):
    """expression : expression PLUS term
                  | expression MINUS term"""
    p[0] = make_node("BinaryOperation", [
        p[1],
        make_node("Operator", value=p[2]),
        p[3]
    ])

def p_expression_term(p):
    "expression : term"
    p[0] = p[1]

def p_term_binop(p):
    """term : term MULTIPLY factor
            | term DIVIDE factor"""
    p[0] = make_node("BinaryOperation", [
        p[1],
        make_node("Operator", value=p[2]),
        p[3]
    ])

def p_term_factor(p):
    "term : factor"
    p[0] = p[1]

def p_factor_num(p):
    "factor : NUMBER"
    p[0] = make_node("Number", value=p[1])

def p_factor_id(p):
    "factor : IDENTIFIER"
    p[0] = make_node("Identifier", value=p[1])

def p_factor_expr(p):
    "factor : LPAREN expression RPAREN"
    p[0] = p[2]

# ------------------------
# Error Rule
# ------------------------

def p_error(p):
    if p:
        raise SyntaxError(f"Syntax error at '{p.value}', position {p.lexpos}")
    else:
        raise SyntaxError("Syntax error at EOF")

# ------------------------
# Parser Entry Point
# ------------------------

parser = yacc.yacc()

def run_parser(code):
    try:
        result = parser.parse(code)
        return result
    except SyntaxError as e:
        return {"error": str(e)}
