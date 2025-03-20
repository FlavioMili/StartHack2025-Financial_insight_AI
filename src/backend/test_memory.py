from .llm.gemini_handler import GeminiHandler
from .llm.wordllama import WordLlamaHanlder
from .rag.memoripy_handler import MemoripyHandler
from dotenv import load_dotenv
from time import sleep
import os
load_dotenv()
api = os.getenv("GEMINI_API_KEY")

embedding = WordLlamaHanlder()
llm = GeminiHandler(api, "gemini-2.0-flash")
memory = MemoripyHandler("../data/memory.json", embedding, llm, 1)
chats = open("../data/questions.md", "r").read()
messages = chats.split("\n\n")
memory.load()
#for i in range(len(messages)-1):
#    memory.add_interaction(messages[i], messages[i+1])
#    sleep(1)

res = memory.retrieve_interactions("How is my portfolio?")
print(res)
exit()
r = llm.get_response([{"role": "user", "content": "hello"}], ["hello"], [])

print(r)

