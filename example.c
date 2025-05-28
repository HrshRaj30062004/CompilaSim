int main() {
    // Supported declarations
    int a = 10;
    int b = 5;
    int c, d;
    
    // Simple arithmetic
    c = a + b;
    d = a * b - c;
    
    // If-else statement
    if (a > b) {
        printf("a is greater");
    } else {
        printf("b is greater or equal");
    }
    
    // While loop
    int counter = 0;
    while (counter < 3) {
        printf("Counter: %d", counter);  // Basic printf
        counter = counter + 1;
    }
    
    // Return statement
    return 0;
}