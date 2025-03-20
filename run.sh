#!/bin/bash

# Navigate to the root directory where the script is located
cd "$(dirname "$0")" || exit 1

# Start the Flask server
echo "Starting Flask server..."
cd src || { echo "Directory src not found!"; exit 1; }
python -m backend.main &

# Start the Node.js server
echo "Starting Node.js server..."
cd ../
node server.js &

# Start the speech transcription service
echo "Starting Speech Transcription Service..."
cd src || { echo "Directory src not found!"; exit 1; }
python -m backend.speech.transcribe &

# Wait for all processes to complete
wait
