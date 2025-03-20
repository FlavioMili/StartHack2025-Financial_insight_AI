from .llm.gemini_handler import GeminiHandler
from .llm.wordllama import WordLlamaHanlder
from .rag.memoripy_handler import MemoripyHandler
from dotenv import load_dotenv
from time import sleep
import os
import json
load_dotenv()
api = os.getenv("GEMINI_API_KEY")

embedding = WordLlamaHanlder()
llm = GeminiHandler(api, "gemini-2.0-flash")
memory = MemoripyHandler("../data/llm_memory.json", embedding, llm, 1)
memory.load()
chats = open("../data/tools.json", "r").read()
chats = json.loads(chats)
i = 0
for chat in chats:
    for message in chat:
        if i > 31:
            memory.add_interaction(message["client"], message["manager"], {"llm_query": message["llm_query"]})
            sleep(1)
        i += 1
res = memory.retrieve_interactions("I want to create a conservative portfolio")
print(res)

