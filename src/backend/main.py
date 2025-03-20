from flask import Flask, jsonify, send_file, request
import os

app = Flask(__name__)

ASSETS_FOLDER = "assets"

@app.route('/getClientData/<int:id>', methods=['GET'])
def getClientData(id):
    file_path = os.path.join('../../assets/', f"client_{id}.json")
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(file_path, mimetype='application/json')

@app.route('/query/<int:id>', methods=['GET'])
def query(id):
    data = request.get_TODO_model()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    return jsonify({"received": data}), 200

@app.route('/chat', methods=['GET'])
def chat():
    prompt = request.args.get("prompt")  
    
    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400
    try:
        response = "Ok"
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"prompt": prompt, "response": response}), 200

if __name__ == '__main__':
    os.makedirs(ASSETS_FOLDER, exist_ok=True)  
    app.run(debug=True)
