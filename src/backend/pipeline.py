from .llm.gemini_handler import GeminiHandler
from .llm.wordllama import WordLlamaHanlder
from .rag.memoripy_handler import MemoripyHandler
from dotenv import load_dotenv 
import os
from .tools import tool 
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
PROMPT_CHAT = """You are an helpful assistant"""

class ResponsePipeline():
    def __init__(self, user_id: int, context_size: int=15) -> None:
        self.user_id = user_id
        self.context_size = context_size

        self.llm = GeminiHandler(GEMINI_API, "gemini-2.0-flash")
        self.user_info = open(f"../assets/client_{str(user_id)}.json", "r").read()
        self.embedding = WordLlamaHanlder()
        self.memory = MemoripyHandler(os.path.join(DATA_DIR, "llm_memory.json"), self.embedding, self.llm, 1)
        self.user_memory = MemoripyHandler(os.path.join(DATA_DIR, str(user_id) + ".json"), self.embedding, self.llm, 1)
        self.user_memory.load()
        self.memory.load()
    
    def get_answer(self, history: list) -> str:
        """Get pipeline answer

        Args:
            history: openai-format of the history 

        Returns:
            The LLM answer
        """
        similar_prompts = self.memory.retrieve_interactions(history[-1]["content"], require_metadata=True)
        similar_memories = self.user_memory.retrieve_interactions(history[-1]["content"])
        self.llm.enable_search(False)
        prompt = [PROMPT, "\nPrevious interactions with LLMs" + similar_prompts, "\nExtra context with the user:" + similar_memories + "\nUser Information: " + self.user_info]
        r = self.llm.get_response(history, prompt, [])
        self.llm.enable_search(True)
        r2 = self.llm.get_response(history, [r, "\n\nUser Information:\n" + self.user_info], [])
        return r2

    def get_chat_answer(self, history: list) -> str:
        self.llm.enable_search(True)
        r = self.llm.get_response(history, [PROMPT_CHAT, self.user_info], [tool.tool_list])
        self.llm.enable_search(False)
        return r

