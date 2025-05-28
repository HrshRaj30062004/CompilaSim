int main() {
    // Variable declarations with and without initialization
    int a = 10;
    int b;
    int c = 5, d = 7;
    
    // Arithmetic operations
    b = a + c * d - 3;
    
    // Control structures
    if (a > b) {
        printf("a is greater than b: %d > %d", a, b);
    } else {
        printf("b is greater than or equal to a: %d >= %d", b, a);
    }
    
    // Nested control structures
    while (c < 20) {
        if (c / 2 == 0) {
            printf("%d is even", c);
        } else {
            printf("%d is odd", c);
        }
        c = c + 1;
        
        // Nested while
        int temp = 0;
        while (temp < 2) {
            printf("Nested loop iteration: %d", temp);
            temp = temp + 1;
        }
    }
    
    // Function calls (printf/scanf)
    printf("Enter a number: ");
    scanf("%d", &d);
    printf("You entered: %d", d);
    
    // Complex expressions
    int result = (a * b) + (c / d) - (a / 3);
    
    // Return statement
    return 0;
}