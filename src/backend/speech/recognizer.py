import pyaudio
import wave
import requests
import time
from .whisper_api import recognize_file

def send_transcript(transcript: str, chat_id:int, server="http://127.0.0.1:5000"):
    url = f"{server}/add_interaction/" + str(chat_id)
    data = {"sentence": transcript}
    response = requests.post(url, data=data)
    return response
def record_and_transcribe():
    # Audio recording parameters
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 44100
    SEGMENT_DURATION = 2  # seconds per audio segment
    TEMP_FILENAME = "temp_audio.wav"

    # Set up PyAudio
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("Recording... Press Ctrl+C to stop.")

    try:
        while True:
            frames = []
            segment_start = time.time()
            # Record for SEGMENT_DURATION seconds
            while time.time() - segment_start < SEGMENT_DURATION:
                data = stream.read(CHUNK)
                frames.append(data)

            # Save the current segment to a temporary file
            wf = wave.open(TEMP_FILENAME, 'wb')
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(p.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))
            wf.close()

            # Get the transcript using the provided function
            transcript = recognize_file(TEMP_FILENAME)
            # Print the transcript in real time (for the segment)
            print(transcript)

            # Check if the segment ends with sentence punctuation
            if transcript.strip() and transcript.strip()[-1] in ".!?":
                send_transcript(transcript, 0)

    except KeyboardInterrupt:
        print("\nRecording stopped.")

    finally:
        stream.stop_stream()
        stream.close()
        p.terminate()

if __name__ == "__main__":
    record_and_transcribe()
