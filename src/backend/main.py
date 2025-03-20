from flask import Flask, jsonify, send_file, request
from .pipeline import ResponsePipeline
import os

app = Flask(__name__)
ASSETS_FOLDER = "assets"

VOCAL_CHAT_MEM = {0: [{"role": "user", "content": "Why my tesla shares dropped?"}]}

TEXT_CHAT_MEM = {}

@app.route('/getClientData/<int:id>', methods=['GET'])
def getClientData(id):
    file_path = os.path.join('../../assets/', f"client_{id}.json")
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(file_path, mimetype='application/json')

@app.route("/add_transcript/<int:id>", methods=["POST"])
def add_transcript(id):
    pass

@app.route('/query/<int:id>', methods=['GET'])
def query(id):
    model = ResponsePipeline(id)
    response = model.get_answer([{"role": "user", "content": VOCAL_CHAT_MEM[id][-1]["content"]}])
    if not response:
        return jsonify({"error": "No JSON data provided"}), 400
    return jsonify({"received": response}), 200

@app.route('/chat/<int:id>', methods=['POST'])
def chat(id):
    prompt = request.form.get("prompt")
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        history = TEXT_CHAT_MEM.get(id, []).append({"role": "user", "content": prompt})
        model = ResponsePipeline(id)
        response = model.get_answer(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"prompt": prompt, "response": response}), 200

if __name__ == '__main__':
    os.makedirs(ASSETS_FOLDER, exist_ok=True)  
    app.run(debug=True)
