import numpy as np
import pandas as pd

def myFunc(x):
    return 2*x

a = 3
b = myFunc(3)

if (b > 4):
    print('Hello world!')
else:
    print('Goodbye world!')

for i in range(10):
    if (i == 5):
        print(i)
    else:
        print(2*i)