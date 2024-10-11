import lldb
import os

# Define the path to the log file
LOG_FILE_PATH = "./nr_log.txt"

def next_registers(debugger, command, result, internal_dict):

    # If log file exists, delete it
    if os.path.exists(LOG_FILE_PATH):
        os.remove(LOG_FILE_PATH)
    
    with open(LOG_FILE_PATH, 'a') as log_file:
        # Get the current process
        process = debugger.GetSelectedTarget().GetProcess()

        thread = process.GetSelectedThread()

        while process.GetState() != lldb.eStateExited:

            # Get the current frame and backtrace
            frame = thread.GetFrameAtIndex(0)
            if not frame.IsValid():
                break
            
            # Loop through the entire call stack to check if 'main' is still in any frame
            main_found = False
            for i in range(thread.GetNumFrames()):
                frame = thread.GetFrameAtIndex(i)
                if frame.IsValid() and 'main' in frame.GetFunctionName():
                    main_found = True
                    break  # If we found 'main', we can stop searching

            # If 'main' is no longer in the call stack, it means we have exited 'main'
            if not main_found:
                log_file.write("Exited 'main', stopping.\n")
                break

            # Execute the next instruction
            debugger.HandleCommand("s")
            # Print the state of all registers
            # debugger.HandleCommand("register read") # --format binary
            # Print the state of all registers and redirect to log file
            command_result = lldb.SBCommandReturnObject()
            debugger.GetCommandInterpreter().HandleCommand("register read --format binary", command_result)
            if command_result.Succeeded():
                log_file.write(command_result.GetOutput())  # Write the register info to the log file
            else:
                log_file.write("Failed to read registers.\n")

            # Update the process state
            process = debugger.GetSelectedTarget().GetProcess()
            thread = process.GetSelectedThread()
    

def __lldb_init_module(debugger, internal_dict):
    # Register the command in LLDB
    debugger.HandleCommand("command script add -f next_registers.next_registers next_registers")
    print("Command 'next_registers' installed. Usage: next_registers")
