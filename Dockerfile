# Start with the official Deno image
FROM denoland/deno:1.40.2

# Switch to root user to have permissions to install packages
USER root

# Update package lists and install ffmpeg (which includes ffprobe)
# The -y flag automatically answers yes to any prompts
RUN apt-get update && apt-get install -y ffmpeg

# Clean up the apt cache to reduce the final image size
RUN rm -rf /var/lib/apt/lists/*

# Switch back to the non-root 'deno' user for better security
USER deno

# Set the working directory inside the container
WORKDIR /app

# Copy all your project files into the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 8000

# Define the command to run your application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-run", "functions/masterWorker.js"]