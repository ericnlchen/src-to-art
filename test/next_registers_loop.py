import lldb

def next_registers_loop(debugger, command, result, internal_dict):
    # Parse the loop count from the command, or run indefinitely if not specified
    loop_count = int(command.strip()) if command else -1
    counter = 0
    
    while loop_count != 0:
        # Execute the next instruction
        error = lldb.SBError()
        process = debugger.GetSelectedTarget().GetProcess()
        
        # Step to the next instruction and check for process state
        process.Continue()
        
        if process.GetState() in [lldb.eStateStopped, lldb.eStateExited]:
            print("Process has stopped or exited.")
            break
        
        # Print the state of all registers
        debugger.HandleCommand("register read")
        
        # Decrease the loop counter if specified
        if loop_count > 0:
            loop_count -= 1
            counter += 1
            print(f"Step {counter}")

def __lldb_init_module(debugger, internal_dict):
    # Register the command in LLDB with optional loop count argument
    debugger.HandleCommand("command script add -f next_registers_loop.next_registers_loop next_registers_loop")
    print("Command 'next_registers_loop' installed. Usage: next_registers_loop [count]")

