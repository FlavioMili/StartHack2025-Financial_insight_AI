from .llm.gemini_handler import GeminiHandler
from .llm.wordllama import WordLlamaHanlder
from .rag.memoripy_handler import MemoripyHandler
from dotenv import load_dotenv 
import os
load_dotenv()
GEMINI_API = os.getenv("GEMINI_API_KEY")

DATA_DIR = "../data"
PROMPT = """You are an intelligent assistant specializing in wealth management conversations. Your task is to analyze a conversation between a Wealth Manager and a client, and when the client asks for something, you should predict what additional information or context would be useful for the wealth manager to consult.

You are provided with the following:
- **Recent parts of the conversation:** This includes the latest dialogue exchanges that capture the client's current concerns, preferences, and requests.
- **Historical interactions:** Previous conversations with the client that might provide context on their financial goals, risk tolerance, investment history, and personal preferences.
- **Supplementary queries:** Specific questions or queries that have been directed at you which may help in solving the client’s current problem.

**Instructions:**
Return a query to give to an LLM that returns all the information required. Only write the query, don't provide any other output

"""
user_id = 0
llm = GeminiHandler(GEMINI_API, "gemini-2.0-flash")
user_info = open("../assets/client_0.json", "r").read()
embedding = WordLlamaHanlder()
memory = MemoripyHandler(os.path.join(DATA_DIR, "llm_memory.json"), embedding, llm, 1)
user_memory = MemoripyHandler(os.path.join(DATA_DIR, str(user_id) + ".json"), embedding, llm, 1)
user_memory.load()
memory.load()
history = [{"role": "user", "content": "I want to switch to a conservative approach on my portfolio."}]
def ask_llm(history: list):
    similar_prompts = memory.retrieve_interactions(history[-1]["content"], require_metadata=True)
    similar_memories = memory.retrieve_interactions(history[-1]["content"])
    llm.enable_search(False)
    prompt = [PROMPT, "\nPrevious interactions with LLMs" + similar_prompts, "\nExtra context with the user:" + similar_memories + "\nUser Information: " + user_info]
    r = llm.get_response(history, prompt, [])
    print(prompt)
    print("----")
    print(r)
    print("---")
    r2 = llm.get_response(history, [r, "\nUser Information: " + user_info], [])
    print(r2)

ask_llm(history)

