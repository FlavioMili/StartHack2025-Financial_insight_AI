## TODO:

-- Update this README with a schematic idea of what to do


## Installation and use 

The application is divided in 3 main components:
1. The WebUI, that functions as frontend for the application 
2. The Backend, that hosts an API for the application to interface to 
3. The speech transcribes, that transcribes the call in live

### Backend Installation 

To install the backend, you can use the requirements.txt file.
```bash
pip install -r requirements.txt
```

After that, you can launch it using 
```bash 
python main.py
```

### Speech Transcriber

The speech recorder is supposed to run separately from the server or the backend. In this implementation, we offer the transcribing feature from the microphone.

1. Install whisper.cpp 

```bash
cd src/backend/speech 
./install_whisper.sh 
```

2. Install python dependencies

```bash
pip install -r requirements.txt
```

3. Launch the transcriber

```bash
python transcribe.py 
```


