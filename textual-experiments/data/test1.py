from intbase import *
from collections import deque

class Interpreter(InterpreterBase):
    ARITHMETIC_EXPRESSION_OPS = {'+', '-', '*', '/', '%', '<', '>', '<=', '>=', '!=', '=='}
    STRING_EXPRESSION_OPS = {'+', '==', '!=', '<', '>', '<=', '>='}
    BOOL_EXPRESSION_OPS = {'!=', '==', '&', '|'}
    EXPRESSION_OPS = ARITHMETIC_EXPRESSION_OPS.union(STRING_EXPRESSION_OPS, BOOL_EXPRESSION_OPS)

    def __init__(self, console_output=True, input=None, trace_output=False):
        super().__init__(console_output, input)   # call InterpreterBase constructor
        self.trace_output = trace_output
        self.variable_table = dict()          # Variable table
        self.ip = 0                           # Instruction pointer
        self.terminated = False               # Whether we are finished interpreting
        self.endfunc_return_locations = deque()
        self.while_locations = deque()

    def run(self, program):
        # Reset I/O
        super().reset()
        # Clear variable table
        self.variable_table.clear()
        # Clear return locations
        self.endfunc_return_locations.clear()
        self.while_locations.clear()
        # Split into tokenized lines
        tokenized_program = self.tokenize(program)
        if (self.trace_output):
            print('Tokenized Program:')
            for line in tokenized_program:
                print(line)
        # Set instruction pointer to first line number of main function
        self.ip = self.find_line_number(['func','main'], tokenized_program)
        if self.ip == -1:
            super().error(ErrorType.NAME_ERROR, 'No main function was located.')
        self.ip += 1 # to get to the body of the function
        # Interpret the tokenized lines one-by-one
        self.terminated = False
        while not self.terminated:
            self.interpret_line(self.ip, tokenized_program) # interprets line and sets self.ip accordingly, sets self.terminated if done
        return

    def tokenize(self, program):
        tokenized_program = []
        for line in program:
            # Get indent amount
            indent_amount = len(line) - len(line.lstrip(' '))
            line = line.lstrip(' ')
            # Separate out strings, odd indices will be strings
            segments = line.split('"')
            for i in range(len(segments)):
                # For strings...
                if i % 2 != 0:
                    segments[i] = self.add_quotes(segments[i])
                # For non-strings...
                if i % 2 == 0:
                    # Find comments
                    if '#' in segments[i]:
                        segments[i] = segments[i].partition('#')[0]
                        segments = segments[0:i+1]
                        segments[i] = segments[i].split()
                        break
                    # Split into tokens by spaces
                    segments[i] = segments[i].split()
            # Insert indent amount as an integer
            segments.insert(0, indent_amount)
            segments = self.flatten(segments)
            tokenized_program.append(segments)
        return tokenized_program

    def interpret_line(self, ip, tokenized_program):
        # Interpret current line
        if (self.trace_output):
            print('')
            print(f'Interpreting line {self.ip}: {tokenized_program[self.ip]}')
            print(f'with variables: {self.variable_table}')
        current_line = tokenized_program[ip]
        # If current_line is empty, just advance ip and continue
        if len(current_line) == 1 or (len(current_line) == 2 and current_line[1] == ''):
            self.ip += 1
            return
        indent_amount = current_line[0]
        first_token = current_line[1]
        if first_token == self.FUNCCALL_DEF:
            self.process_funccall(current_line, tokenized_program)
        elif first_token == self.ASSIGN_DEF:
            self.process_assign(current_line)
        elif first_token == self.ENDFUNC_DEF:
            self.process_endfunc()
        elif first_token == self.WHILE_DEF:
            self.process_while(current_line, tokenized_program)
        elif first_token == self.ENDWHILE_DEF:
            self.process_endwhile()
        elif first_token == self.RETURN_DEF:
            self.process_return(current_line)
        elif first_token == self.IF_DEF:
            self.process_if(current_line, tokenized_program)
        elif first_token == self.ELSE_DEF:
            self.process_else(current_line, tokenized_program)
        elif first_token == self.ENDIF_DEF:
            self.process_endif(current_line, tokenized_program)
        else:
            super().error(ErrorType.SYNTAX_ERROR, f'Unknown token {first_token}.', self.ip)
        return

    def process_funccall(self, line, tokenized_program):
        function_name = line[2]
        # Built-in input function
        if function_name == self.INPUT_DEF:
            list_of_args = line[3:]
            self.do_input_function(list_of_args)
            self.ip += 1
        # Built-in strtoint function
        elif function_name == self.STRTOINT_DEF:
            arg = line[3]
            self.do_strtoint_function(arg)
            self.ip += 1
        # Built-in print function
        elif function_name == self.PRINT_DEF:
            list_of_args = line[3:]
            self.do_print_function(list_of_args)
            self.ip += 1
        # User-defined function
        else:
            # Find out where the function starts
            function_line_num = self.find_line_number(['func',function_name], tokenized_program)
            if function_line_num == -1:
                super().error(ErrorType.NAME_ERROR, f'Unknown function {function_name}.', self.ip)
            # Remember where to return to
            self.endfunc_return_locations.append(self.ip)
            # Set ip to first line of the function
            self.ip = function_line_num + 1

    def do_input_function(self, list_of_args):
        strings_to_concatenate = []
        for arg in list_of_args:
            if self.is_variable(arg):
                value = self.find_variable(arg)
                strings_to_concatenate.append(self.remove_quotes(value))
            else:
                value = self.remove_quotes(arg)
                strings_to_concatenate.append(value)
        prompt = ''.join(strings_to_concatenate)
        super().output(prompt)
        user_input = super().get_input()
        self.variable_table['result'] = self.add_quotes(user_input)
        return

    def do_strtoint_function(self, arg):
        if self.is_variable(arg):
            arg = self.find_variable(arg)
        result = self.remove_quotes(arg)
        if result != '0':
            result = result.lstrip('0')
        if result[0] == '-' and result[1:] != ['0']:
            result = '-' + result[1:].lstrip('0')
        self.variable_table['result'] = result
        return

    def do_print_function(self, list_of_args):
        strings_to_concatenate = []
        for arg in list_of_args:
            if self.is_variable(arg):
                value = self.find_variable(arg)
                strings_to_concatenate.append(self.remove_quotes(value))
            else:
                value = self.remove_quotes(arg)
                strings_to_concatenate.append(value)
        message = ''.join(strings_to_concatenate)
        super().output(message)
        return

    def process_assign(self, line):
        variable_name = line[2]
        expression = line[3:]
        value = self.compute_expression(expression)
        self.variable_table[variable_name] = value
        self.ip += 1
        return

    def compute_expression(self, expression):
        expression_stack = deque()
        for i in range(len(expression)-1, -1, -1):
            symbol = expression[i]
            if symbol not in self.EXPRESSION_OPS:
                expression_stack.append(symbol)
            else:
                first = expression_stack.pop()
                second = expression_stack.pop()
                result = self.apply_operator(symbol, [first, second])
                expression_stack.append(result)
        result = expression_stack.pop()
        if self.is_variable(result):
            result = self.find_variable(result)
        if result[0] == '-' and result[1:] != ['0']:
            result = '-' + result[1:].lstrip('0')
        if result != '0':
            result = result.lstrip('0')
        return result
        
    def apply_operator(self, operator, operands):
        if self.trace_output:
            print(f'Applying operator {operator} to {operands}')
        # Check if operands are variables, get values if so
        if self.is_variable(operands[0]):
            operands[0] = self.find_variable(operands[0])
        if self.is_variable(operands[1]):
            operands[1] = self.find_variable(operands[1])
        # Deduce operand types and ensure that they match
        if self.deduce_type(operands[0]) != self.deduce_type(operands[1]):
            super().error(ErrorType.TYPE_ERROR, f'Type mismatch between operands {operands[0]} and {operands[1]}.', self.ip)
        # Operations for strings
        if self.deduce_type(operands[0]) == self.STRING_DEF:
            operands[0] = self.remove_quotes(operands[0])
            operands[1] = self.remove_quotes(operands[1])
            if operator not in self.STRING_EXPRESSION_OPS:
                super().error(ErrorType.TYPE_ERROR, f'Incompatible operator {operator} for operands {self.add_quotes(operands[0])} and {self.add_quotes(operands[1])} of type string.', self.ip)
            elif operator == '+':
                result = self.add_quotes(operands[0] + operands[1])
            elif operator == '==':
                result = str(operands[0] == operands[1])
            elif operator == '!=':
                result = str(operands[0] != operands[1])
            elif operator == '<':
                result = str(operands[0] < operands[1])
            elif operator == '>':
                result = str(operands[0] > operands[1])
            elif operator == '<=':
                result = str(operands[0] <= operands[1])
            elif operator == '>=':
                result = str(operands[0] >= operands[1])
        # Operations for booleans
        elif self.deduce_type(operands[0]) == self.BOOL_DEF:
            bool_operand_0 = operands[0] == 'True'
            bool_operand_1 = operands[1] == 'True'
            if operator not in self.BOOL_EXPRESSION_OPS:
                super().error(ErrorType.TYPE_ERROR, f'Incompatible operator {operator} for operands {operands[0]} and {operands[1]} of type bool.', self.ip)
            elif operator == '==':
                result = str(bool_operand_0 == bool_operand_1)
            elif operator == '!=':
                result = str(bool_operand_0 != bool_operand_1)
            elif operator == '&':
                result = str(bool_operand_0 and bool_operand_1)
            elif operator == '|':
                result = str(bool_operand_0 or bool_operand_1)
        # Operations for integers
        elif self.deduce_type(operands[0]) == self.INT_DEF:
            int_operand_0 = int(operands[0])
            int_operand_1 = int(operands[1])
            if operator not in self.ARITHMETIC_EXPRESSION_OPS:
                super().error(ErrorType.TYPE_ERROR, f'Incompatible operator {operator} for operands {operands[0]} and {operands[1]} of type int.', self.ip)
            elif operator == '+':
                result = str(int_operand_0 + int_operand_1)
            elif operator == '-':
                result = str(int_operand_0 - int_operand_1)
            elif operator == '*':
                result = str(int_operand_0 * int_operand_1)
            elif operator == '/':
                result = str(int_operand_0 // int_operand_1)
            elif operator == '%':
                result = str(int_operand_0 % int_operand_1)
            elif operator == '<':
                result = str(int_operand_0 < int_operand_1)
            elif operator == '>':
                result = str(int_operand_0 > int_operand_1)
            elif operator == '<=':
                result = str(int_operand_0 <= int_operand_1)
            elif operator == '>=':
                result = str(int_operand_0 >= int_operand_1)
            elif operator == '!=':
                result = str(int_operand_0 != int_operand_1)
            elif operator == '==':
                result = str(int_operand_0 == int_operand_1)
            if self.trace_output:
                print(f'to yield {result}')
        return result
    
    def process_endfunc(self):
        if self.endfunc_return_locations:
            self.ip = self.endfunc_return_locations.pop() + 1
        else:
            # We must be hitting enfunc in main, so terminate
            self.terminated = True
        return

    def process_while(self, line, tokenized_program):
        expression = line[2:]
        result = self.compute_expression(expression)
        if self.deduce_type(result) != self.BOOL_DEF:
            super().error(ErrorType.TYPE_ERROR, f'While statement condition must be a boolean.', self.ip)
        if result == 'True':
            self.while_locations.append(self.ip)
            self.ip += 1
        else:
            indent_amount = line[0]
            endwhile_location = self.find_endwhile(indent_amount, tokenized_program)
            self.ip = endwhile_location + 1

    def find_endwhile(self, indent_amount, tokenized_program):
        for i in range(self.ip + 1, len(tokenized_program)):
            if tokenized_program[i][0] == indent_amount and tokenized_program[i][1] == self.ENDWHILE_DEF:
                return i
        super().error(ErrorType.SYNTAX_ERROR, 'No matching endwhile found for while statement', self.ip)

    def process_endwhile(self):
        while_location = self.while_locations.pop()
        self.ip = while_location
        return

    def process_return(self, line):
        # If it's a return statement with an expression, compute and store result
        if len(line) > 2:
            return_value = self.compute_expression(line[2:])
            self.variable_table['result'] = return_value
        # Return to the calling function
        if self.endfunc_return_locations:
            self.ip = self.endfunc_return_locations.pop() + 1
        # If no calling function, we are returning from main so terminate
        else:
            self.terminated = True
        return

    def process_if(self, line, tokenized_program):
        expression = line[2:]
        result = self.compute_expression(expression)
        if self.deduce_type(result) != self.BOOL_DEF:
            super().error(ErrorType.TYPE_ERROR, f'If statement condition must be a boolean.', self.ip)
        if result == 'True':
            self.ip += 1
        else:
            indent_amount = line[0]
            else_or_endif_location = self.find_else_or_endif(indent_amount, tokenized_program)
            self.ip = else_or_endif_location + 1

    def find_else_or_endif(self, indent_amount, tokenized_program):
        for i in range(self.ip + 1, len(tokenized_program)):
            if tokenized_program[i][0] == indent_amount and (tokenized_program[i][1] == self.ELSE_DEF or tokenized_program[i][1] == self.ENDIF_DEF):
                return i
        super().error(ErrorType.SYNTAX_ERROR, 'No matching else or endif found for if statement', self.ip)

    def process_else(self, line, tokenized_program):
        # If we organically run into an else block, that means we should NOT execute its code.
        # Instead we should actually jump ahead to the line after the endif
        indent_amount = line[0]
        endif_location = self.find_else_or_endif(indent_amount, tokenized_program)
        self.ip = endif_location + 1
        return

    def process_endif(self, line, tokenized_program):
        self.ip += 1
        return

    def deduce_type(self, value):
        if '"' in value:
            return self.STRING_DEF
        elif value == 'True' or value == 'False':
            return self.BOOL_DEF
        elif value.isdigit() or (value[0] == '-' and value[1:].isdigit()):
            return self.INT_DEF
        else:
            super().error(ErrorType.TYPE_ERROR, f'Invalid value {value}')

    def is_variable(self, val_or_var):
        if '"' in val_or_var:
            return False
        if val_or_var == 'True' or val_or_var == 'False':
            return False
        if val_or_var.isdigit() or (val_or_var[0] == '-' and val_or_var[1:].isdigit()):
            return False
        if val_or_var in self.EXPRESSION_OPS:
            return False
        return True

    def find_variable(self, variable_name):
        if variable_name not in self.variable_table:
            super().error(ErrorType.NAME_ERROR, f'Unknown variable {variable_name}.', self.ip)
        value = self.variable_table[variable_name]
        return value
        
    def find_line_number(self, tokens_to_find, tokenized_program):
        '''Returns the first line containing tokens_to_find as the first consecutive
           non-line number tokens or -1 if not found'''
        line_number = -1
        for i in range(len(tokenized_program)):
            if tokenized_program[i][1:len(tokens_to_find)+1] == tokens_to_find:
                line_number = i
        return line_number

    def flatten(self, l):
        result = []
        for elem in l:
            if type(elem) == list:
                result += elem
            else:
                result.append(elem)
        return result

    def remove_quotes(self, string):
        return string.lstrip('"').rstrip('"')

    def add_quotes(self, string):
        return '"' + string + '"'