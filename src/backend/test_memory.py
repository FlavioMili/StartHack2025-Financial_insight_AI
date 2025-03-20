from .llm.gemini_handler import GeminiHandler
from .llm.wordllama import WordLlamaHanlder
from .rag.memoripy_handler import MemoripyHandler
from dotenv import load_dotenv
import os
load_dotenv()
api = os.getenv("GEMINI_API_KEY")

llm = GeminiHandler(api, "gemini-2.0-flash")
r = llm.get_response([{"role": "user", "content": "hello"}], ["hello"], [])
print(r)

