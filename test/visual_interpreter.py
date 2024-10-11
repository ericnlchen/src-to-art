import re
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

def binary_to_grayscale_values(binary_str):
    # Strip the '0b' prefix from the binary string
    binary_str = binary_str[2:]
    
    # Ensure the binary string is 64 bits long by padding with leading zeros if needed
    binary_str = binary_str.zfill(64)
    
    # Split the 64-bit string into eight 8-bit chunks
    grayscale_values = [int(binary_str[i:i+8], 2) for i in range(0, 64, 8)]
    
    return grayscale_values

def parse_registers(file_path):
    all_timesteps = []
    current_timestep = []
    binary_pattern = re.compile(r'0b[01]{64}')  # Pattern to match 64-bit binary values
    timestep_header_pattern = re.compile(r'General Purpose Registers:')  # Identify new timestep
    
    with open(file_path, 'r') as file:
        for line in file:
            if timestep_header_pattern.search(line):
                if current_timestep:
                    # If we have accumulated registers, store the previous timestep's registers
                    all_timesteps.append(current_timestep)
                    current_timestep = []  # Reset for the next timestep
            match = binary_pattern.search(line)
            if match:
                # Extract the 64-bit binary value and append to the current timestep
                current_timestep.append(match.group(0))
        
        # Append the last timestep after file read is complete
        if current_timestep:
            all_timesteps.append(current_timestep)
    
    return all_timesteps

if __name__ == '__main__':
    # Example usage
    file_path = 'nr_log.txt'
    timesteps = parse_registers(file_path)

    # # Print the result
    # for idx, timestep in enumerate(timesteps):
    #     print(f"Timestep {idx + 1}:")
    #     for reg_idx, reg in enumerate(timestep):
    #         print(f"  Register {reg_idx}: {reg}")
    #     print()
    frames = []
    for idx, timestep in enumerate(timesteps):
        frame = []
        for reg_idx, reg in enumerate(timestep):
            grays = binary_to_grayscale_values(reg)
            frame.append(grays)
        # plt.imshow(frame, cmap='gray')
        # plt.show()
        frames.append(frame)
    
    print("Got {} frames".format(len(frames)))

    fig, ax = plt.subplots(figsize=(4, 4))
    ax.set_axis_off()
    fig.patch.set_visible(False)
    image = ax.imshow(frames[0], cmap='gray')
    def update(frame):
        image.set_array(frame)
        return [image]
    anim = FuncAnimation(fig, update, frames, interval=10, repeat=False)

    plt.show()

    anim.save('animation.gif', writer='imagemagick')

