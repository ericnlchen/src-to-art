#include <stdio.h>
#include <stdint.h>
#include <math.h>

// Function to perform a variety of integer operations
void integer_operations() {
    int a = 42;
    int b = 15;
    int c = 0;

    // Basic arithmetic operations
    c = a + b;
    printf("Addition (42 + 15): %d\n", c);

    c = a - b;
    printf("Subtraction (42 - 15): %d\n", c);

    c = a * b;
    printf("Multiplication (42 * 15): %d\n", c);

    c = a / b;
    printf("Division (42 / 15): %d\n", c);

    // Modulo operation
    c = a % b;
    printf("Modulo (42 %% 15): %d\n", c);

    // Bitwise operations
    c = a & b;
    printf("Bitwise AND (42 & 15): %d\n", c);

    c = a | b;
    printf("Bitwise OR (42 | 15): %d\n", c);

    c = a ^ b;
    printf("Bitwise XOR (42 ^ 15): %d\n", c);

    c = a << 2;  // Left shift
    printf("Left shift (42 << 2): %d\n", c);

    c = a >> 2;  // Right shift
    printf("Right shift (42 >> 2): %d\n", c);
}

// Function to perform floating-point operations
void floating_point_operations() {
    float x = 3.14;
    float y = 2.71;
    float z = 0.0;

    // Basic arithmetic operations
    z = x + y;
    printf("Float addition (3.14 + 2.71): %f\n", z);

    z = x - y;
    printf("Float subtraction (3.14 - 2.71): %f\n", z);

    z = x * y;
    printf("Float multiplication (3.14 * 2.71): %f\n", z);

    z = x / y;
    printf("Float division (3.14 / 2.71): %f\n", z);

    // Trigonometric operations
    z = sin(x);
    printf("Sine of 3.14: %f\n", z);

    z = cos(x);
    printf("Cosine of 3.14: %f\n", z);

    z = tan(x);
    printf("Tangent of 3.14: %f\n", z);
}

// Function to perform 64-bit integer operations
void large_integer_operations() {
    int64_t a = 987654321987654;
    int64_t b = 123456789123456;
    int64_t c = 0;

    // Basic arithmetic operations
    c = a + b;
    printf("64-bit Addition: %lld\n", c);

    c = a - b;
    printf("64-bit Subtraction: %lld\n", c);

    c = a * b;
    printf("64-bit Multiplication: %lld\n", c);

    c = a / b;
    printf("64-bit Division: %lld\n", c);
}

// Function to perform logical operations
void logical_operations() {
    int a = 1;
    int b = 0;
    int result;

    // Logical AND
    result = a && b;
    printf("Logical AND (1 && 0): %d\n", result);

    // Logical OR
    result = a || b;
    printf("Logical OR (1 || 0): %d\n", result);

    // Logical NOT
    result = !a;
    printf("Logical NOT (!1): %d\n", result);
}

// Function to simulate some iterative computations
void iterative_computation() {
    int sum = 0;

    // Simulate some loop-based computation (e.g., sum of first 1000 integers)
    for (int i = 1; i <= 1000; i++) {
        sum += i;
    }
    printf("Sum of first 1000 integers: %d\n", sum);
}

// Main function
int main() {
    printf("Running integer operations...\n");
    integer_operations();

    printf("\nRunning floating-point operations...\n");
    floating_point_operations();

    printf("\nRunning large integer operations...\n");
    large_integer_operations();

    printf("\nRunning logical operations...\n");
    logical_operations();

    printf("\nRunning iterative computation...\n");
    iterative_computation();

    return 0;
}
