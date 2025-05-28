# backend/syntax_analysis.py

import ply.yacc as yacc
from lexical_analysis import tokens

def make_node(type, children=None, value=None):
    if children is None:
        children = []
    return {
        "type": type,
        "children": children,
        "value": value
    }

# Grammar rules:
def p_program(p):
    "program : function"
    p[0] = make_node("Program", [p[1]])

def p_function(p):
    "function : INT IDENTIFIER LPAREN RPAREN block"
    p[0] = make_node("Function", [p[5]], p[2])

def p_block(p):
    "block : LBRACE statements RBRACE"
    p[0] = make_node("Block", p[2])

def p_statements(p):
    """statements : statements statement
                  | statement"""
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        combined = []
        for stmt in p[1]:
            combined.append(stmt)
        combined.append(p[2])
        p[0] = combined

def p_statement_declaration(p):
    "statement : INT decl_list SEMICOLON"
    p[0] = make_node("DeclarationList", p[2])

def p_decl_list(p):
    """decl_list : decl_list COMMA decl
                 | decl"""
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        combined = []
        for d in p[1]:
            combined.append(d)
        combined.append(p[3])
        p[0] = combined

def p_decl(p):
    """decl : IDENTIFIER
            | IDENTIFIER EQUALS expression"""
    if len(p) == 2:
        p[0] = make_node("Declaration", value=p[1])
    else:
        p[0] = make_node("Declaration", [p[3]], p[1])

def p_statement_assignment(p):
    "statement : IDENTIFIER EQUALS expression SEMICOLON"
    p[0] = make_node("Assignment", [p[3]], p[1])

def p_statement_return(p):
    "statement : RETURN expression SEMICOLON"
    p[0] = make_node("Return", [p[2]])

def p_statement_if(p):
    "statement : IF LPAREN expression RPAREN block"
    p[0] = make_node("If", [p[3], p[5]])

def p_statement_if_else(p):
    "statement : IF LPAREN expression RPAREN block ELSE block"
    p[0] = make_node("IfElse", [p[3], p[5], p[7]])

def p_statement_while(p):
    "statement : WHILE LPAREN expression RPAREN block"
    p[0] = make_node("While", [p[3], p[5]])

def p_statement_printf(p):
    """statement : PRINTF LPAREN string_and_args RPAREN SEMICOLON
                 | SCANF LPAREN string_and_args RPAREN SEMICOLON"""
    if p[1] == "printf":
        p[0] = make_node("Printf", p[3])
    else:
        p[0] = make_node("Scanf", p[3])

def p_string_and_args(p):
    """string_and_args : STRING
                       | STRING COMMA arg_list"""
    lst = [make_node("String", value=p[1])]
    if len(p) == 4:
        for a in p[3]:
            lst.append(a)
    p[0] = lst

def p_arg_list(p):
    """arg_list : arg_list COMMA expression
                | expression"""
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        result = []
        for a in p[1]:
            result.append(a)
        result.append(p[3])
        p[0] = result

def p_expression_relational(p):
    """expression : expression LT term
                  | expression GT term
                  | expression LE term
                  | expression GE term
                  | expression EQ term
                  | expression NE term"""
    p[0] = make_node("BinaryOperation", [p[1], make_node("Operator", value=p[2]), p[3]])

def p_expression_binop(p):
    """expression : expression PLUS term
                  | expression MINUS term"""
    p[0] = make_node("BinaryOperation", [p[1], make_node("Operator", value=p[2]), p[3]])

def p_expression_term(p):
    "expression : term"
    p[0] = p[1]

def p_term_binop(p):
    """term : term MULTIPLY factor
            | term DIVIDE factor"""
    p[0] = make_node("BinaryOperation", [p[1], make_node("Operator", value=p[2]), p[3]])

def p_term_factor(p):
    "term : factor"
    p[0] = p[1]

def p_factor_number(p):
    "factor : NUMBER"
    p[0] = make_node("Number", value=p[1])

def p_factor_identifier(p):
    "factor : IDENTIFIER"
    p[0] = make_node("Identifier", value=p[1])

def p_factor_grouped(p):
    "factor : LPAREN expression RPAREN"
    p[0] = p[2]

def p_factor_string(p):
    "factor : STRING"
    p[0] = make_node("String", value=p[1])

def p_error(p):
    if p:
        raise SyntaxError(f"Syntax error at '{p.value}', position {p.lexpos}")
    else:
        raise SyntaxError("Syntax error at EOF")

parser = yacc.yacc()

def run_parser(code):
    try:
        return parser.parse(code)
    except SyntaxError as e:
        return {"error": str(e)}
