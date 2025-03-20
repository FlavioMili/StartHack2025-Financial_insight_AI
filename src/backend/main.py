from flask import Flask, jsonify, send_file, request
from .pipeline import ResponsePipeline
import os
from .speech.order_speakers import classify_speaker
import threading 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

ASSETS_FOLDER = "../assets"

VOCAL_CHAT_MEM = {0: [{"role": "user", "content": "Why my tesla shares dropped?"}]}

TEXT_CHAT_MEM = {}
TEMPORARY_CHAT_MEM = {}
PIPELINES = {}
CONTEXT_SIZE = 20

@app.route('/getClientData/<int:id>', methods=['GET'])
def getClientData(id):
    file_path = os.path.join(ASSETS_FOLDER, f"client_{id}.json")   
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(file_path, mimetype='application/json')

@app.route('/query/<int:id>', methods=['GET'])
def query(id):
    model = ResponsePipeline(id)
    response = model.get_answer(VOCAL_CHAT_MEM[id][-CONTEXT_SIZE:])
    pipeline = PIPELINES.get(id, None)
    if pipeline is None:
        model = ResponsePipeline(id)
    else:
        model = pipeline
    response = model.get_answer(VOCAL_CHAT_MEM[id][-CONTEXT_SIZE:])
    if not response:
        return jsonify({"error": "No JSON data provided"}), 400
    return jsonify({"received": response}), 200

@app.route('/get_user/<int:id>', methods=['GET'])
def get_user(id):
    user_info = open(f"../assets/client_{str(id)}.json", "r").read()
    return user_info, 200

@app.route('/chat/<int:id>', methods=['POST'])
def chat(id):
    prompt = request.form.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        history = TEXT_CHAT_MEM.get(id, [])
        history.append({"role": "user", "content": prompt})
        pipeline = PIPELINES.get(id, None)
        if pipeline is None:
            model = ResponsePipeline(id)
        else:
            model = pipeline
        response = model.get_chat_answer(history)
        threading.Thread(target=model.add_memory_interaction, args=(VOCAL_CHAT_MEM.get(id, []), prompt)).start()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"prompt": prompt, "response": response}), 200

@app.route('/add_interaction/<int:id>', methods=['POST'])
def add_interaction(id):
    sentence = request.form.get("sentence")
    if not sentence:
        return jsonify({"error": "Message is required"}), 400
    try:
        text = TEMPORARY_CHAT_MEM.get(id, "")
        text += sentence
        if PIPELINES.get(id, None) is None:
            model = ResponsePipeline(id)
        else:
            model = PIPELINES.get(id)
        response = classify_speaker(model.llm, text, VOCAL_CHAT_MEM[id])
        if len(response) > len(VOCAL_CHAT_MEM[id]):
            VOCAL_CHAT_MEM[id] = response
        else:
            VOCAL_CHAT_MEM[id] += response 
        query(id) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({}), 200

if __name__ == '__main__':
    os.makedirs(ASSETS_FOLDER, exist_ok=True)  
    app.run(debug=True)
