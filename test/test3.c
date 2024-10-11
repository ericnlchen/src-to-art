#include <stdio.h>

#define ROWS 3
#define COLS 3

// Function to print a matrix
void printMatrix(int matrix[ROWS][COLS], int rows, int cols) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%d\t", matrix[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

// Function to multiply two matrices
void multiplyMatrices(int matrix1[ROWS][COLS], int matrix2[ROWS][COLS], int result[ROWS][COLS]) {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            result[i][j] = 0;
            for (int k = 0; k < COLS; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
}

// Function to transpose a matrix
void transposeMatrix(int matrix[ROWS][COLS], int transpose[ROWS][COLS]) {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            transpose[j][i] = matrix[i][j];
        }
    }
}

int main() {
    // Hardcoded input matrices
    int matrix1[ROWS][COLS] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    
    int matrix2[ROWS][COLS] = {
        {9, 8, 7},
        {6, 5, 4},
        {3, 2, 1}
    };
    
    int result[ROWS][COLS];   // To store the result of matrix multiplication
    int transpose[ROWS][COLS]; // To store the transpose of matrix1

    // Print original matrices
    printf("Matrix 1:\n");
    printMatrix(matrix1, ROWS, COLS);

    printf("Matrix 2:\n");
    printMatrix(matrix2, ROWS, COLS);

    // Perform matrix multiplication
    multiplyMatrices(matrix1, matrix2, result);
    printf("Result of Matrix Multiplication:\n");
    printMatrix(result, ROWS, COLS);

    // Perform transpose of matrix1
    transposeMatrix(matrix1, transpose);
    printf("Transpose of Matrix 1:\n");
    printMatrix(transpose, ROWS, COLS);

    return 0;
}
