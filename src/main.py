from flask import Flask, jsonify, send_file, request
import os

app = Flask(__name__)

ASSETS_FOLDER = "assets"

@app.route('/getClientData/<int:id>', methods=['GET'])
def getClientData(id):
    file_path = os.path.join('../assets/', f"{id}.json")
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(file_path, mimetype='application/json')

@app.route('query/<int:id>', methods=['GET'])
def query(id):
    data = request.get_TODO_model()
    if not data:
        return jsonify({"error": "No JSON data provided"}), 400
    return jsonify({"received": data}), 200

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    mock_items = {1: "Item One", 2: "Item Two", 3: "Item Three"}
    item = mock_items.get(item_id, "Item not found")
    return jsonify({"item_id": item_id, "name": item}), 200

if __name__ == '__main__':
    os.makedirs(ASSETS_FOLDER, exist_ok=True)  # Ensure the folder exists
    app.run(debug=True)
