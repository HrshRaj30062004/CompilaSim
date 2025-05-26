# backend/lexical_analysis.py

import ply.lex as lex

# Reserved keywords
reserved = {
    'int': 'INT',
    'if': 'IF',
    'else': 'ELSE',
    'while': 'WHILE',
    'for': 'FOR',
    'return': 'RETURN'
}

# List of token names (including reserved keywords)
tokens = [
    'NUMBER',
    'IDENTIFIER',
    'PLUS',
    'MINUS',
    'MULTIPLY',
    'DIVIDE',
    'EQUALS',
    'LPAREN',
    'RPAREN',
    'LBRACE',
    'RBRACE',
    'SEMICOLON',
    'COMMA',
    'LT', 'GT', 'LE', 'GE', 'EQ', 'NE'

] + list(reserved.values())  # Add reserved words as tokens

# Token regex rules
t_PLUS      = r'\+'
t_MINUS     = r'-'
t_MULTIPLY  = r'\*'
t_DIVIDE    = r'/'
t_EQUALS    = r'='
t_LPAREN    = r'\('
t_RPAREN    = r'\)'
t_LBRACE    = r'\{'
t_RBRACE    = r'\}'
t_SEMICOLON = r';'
t_COMMA     = r','
t_LT    = r'<'
t_GT    = r'>'
t_LE    = r'<='
t_GE    = r'>='
t_EQ    = r'=='
t_NE    = r'!='

# Identifier or keyword
def t_IDENTIFIER(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value, 'IDENTIFIER')
    return t

# Integer literal
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
    print(f"Illegal character '{t.value[0]}' at position {t.lexpos}")
    t.lexer.skip(1)

# Build the lexer
lexer = lex.lex()

# Run the lexer and return structured result
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
