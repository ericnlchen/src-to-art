#include <stdio.h>
#include <stdlib.h>

// Recursive function to manipulate the stack by repeated function calls
void recursiveFunction(int count, int limit) {
    int stackVar = count;  // Local variable to consume stack space
    printf("Stack level: %d, stackVar address: %p\n", count, (void*)&stackVar);

    if (count < limit) {
        recursiveFunction(count + 1, limit);  // Recursive call to create deep stack
    } else {
        printf("Reached recursion limit, starting to unwind the stack.\n");
    }
}

// Function to manipulate the heap by allocating and deallocating memory
void manipulateHeap(int allocations) {
    int **heapArray = malloc(allocations * sizeof(int*));  // Array of pointers on the heap

    // Allocate memory for each pointer in the array
    for (int i = 0; i < allocations; i++) {
        heapArray[i] = malloc(1024 * sizeof(int));  // Allocate 1KB for each array element
        printf("Allocated 1024 integers at address: %p\n", (void*)heapArray[i]);
    }

    // Free the allocated memory
    for (int i = 0; i < allocations; i++) {
        free(heapArray[i]);
        printf("Freed memory at address: %p\n", (void*)heapArray[i]);
    }

    free(heapArray);  // Free the array itself
    printf("Freed the array of pointers.\n");
}

int main() {
    int recursionLimit = 10;  // Control the depth of recursion (stack manipulation)
    int heapAllocations = 5;  // Control the number of allocations (heap manipulation)

    printf("Starting stack manipulation with recursion.\n");
    recursiveFunction(0, recursionLimit);

    printf("\nStarting heap manipulation.\n");
    manipulateHeap(heapAllocations);

    printf("\nProgram finished.\n");
    return 0;
}
