# backend/lexical_analysis.py

import ply.lex as lex

# Define token names
tokens = (
    'NUMBER',
    'IDENTIFIER',
    'PLUS',
    'MINUS',
    'MULTIPLY',
    'DIVIDE',
    'EQUALS',
    'LPAREN',
    'RPAREN',
    'SEMICOLON',
    'INT',
)

# Reserved words
reserved = {
    'int': 'INT'
}

# Token regex rules
t_PLUS      = r'\+'
t_MINUS     = r'-'
t_MULTIPLY  = r'\*'
t_DIVIDE    = r'/'
t_EQUALS    = r'='
t_LPAREN    = r'\('
t_RPAREN    = r'\)'
t_SEMICOLON = r';'

def t_IDENTIFIER(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value, 'IDENTIFIER')  # Check for reserved words
    return t

def t_NUMBER(t):
    r'\d+'
    t.value = int(t.value)
    return t

# Ignore spaces and tabs
t_ignore = ' \t'

# Track line numbers
def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

# Error handling
def t_error(t):
    return {
        "type": "ERROR",
        "value": t.value[0],
        "position": t.lexpos
    }

lexer = lex.lex()

def run_lexer(code):
    lexer.input(code)
    result = []
    while True:
        tok = lexer.token()
        if not tok:
            break
        result.append({
            "type": tok.type,
            "value": tok.value,
            "position": tok.lexpos
        })
    return result
