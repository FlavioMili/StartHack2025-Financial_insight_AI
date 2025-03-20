import requests 

def recognize_file(file_path, url="http://127.0.0.1:8080/inference"):
    with open(file_path, "rb") as file:
        files = {"file": file}
        data = {
            "temperature": "0.0",
            "temperature_inc": "0.2",
            "response_format": "json"
        }
        
        response = requests.post(url, files=files, data=data)
        
    return response.json()["text"]
