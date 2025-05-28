# backend/lexical_analysis.py

import ply.lex as lex

reserved = {
    'int': 'INT',
    'if': 'IF',
    'else': 'ELSE',
    'while': 'WHILE',
    'for': 'FOR',
    'return': 'RETURN',
    'printf': 'PRINTF',
    'scanf': 'SCANF'
}

tokens = [
    'NUMBER', 'FLOAT', 'CHAR', 'STRING', 'IDENTIFIER',
    'PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE', 'EQUALS',
    'LPAREN', 'RPAREN', 'LBRACE', 'RBRACE',
    'SEMICOLON', 'COMMA',
    'LT', 'GT', 'LE', 'GE', 'EQ', 'NE'
] + list(reserved.values())

t_PLUS = r'\+'
t_MINUS = r'-'
t_MULTIPLY = r'\*'
t_DIVIDE = r'/'
t_EQUALS = r'='
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_LBRACE = r'\{'
t_RBRACE = r'\}'
t_SEMICOLON = r';'
t_COMMA = r','
t_LT = r'<'
t_GT = r'>'
t_LE = r'<='
t_GE = r'>='
t_EQ = r'=='
t_NE = r'!='

def t_STRING(t):
    r'\"([^\\\n]|(\\.))*?\"'
    t.value = str(t.value)
    return t

def t_CHAR(t):
    r'\'([^\\\n]|(\\.))\''
    return t

def t_FLOAT(t):
    r'\d+\.\d+'
    t.value = float(t.value)
    return t

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

def t_IDENTIFIER(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    if t.value in reserved:
        t.type = reserved[t.value]
    else:
        t.type = 'IDENTIFIER'
    return t

def t_comment_single(t):
    r'//.*'
    pass

def t_comment_multi(t):
    r'/\*[\s\S]*?\*/'
    pass

t_ignore = ' \t'

def t_newline(t):
    r'\n+'
    count = 0
    for c in t.value:
        if c == '\n':
            count += 1
    t.lexer.lineno += count

def t_error(t):
    print(f"Illegal character '{t.value[0]}' at position {t.lexpos}")
    t.lexer.skip(1)

lexer = lex.lex()

def run_lexer(code):
    lexer.input(code)
    result = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        token_dict = {}
        token_dict["type"] = tok.type
        token_dict["value"] = tok.value
        token_dict["position"] = tok.lexpos
        result.append(token_dict)
    return result
