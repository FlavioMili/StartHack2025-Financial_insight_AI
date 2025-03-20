from .raghandler import RAGHandler
from ..llm.llmhandler import LLMHandler
from ..llm.embeddinghandler import EmbeddingHandler
from memoripy import JSONStorage
from memoripy import MemoryManager
from memoripy.model import EmbeddingModel
from memoripy.model import ChatModel
import os
import numpy as np
from ..utility.strings import extract_json
from ..utility.strings import process_conversation
import json 

class MemoripyHandler(RAGHandler):
    key = "memoripy"

    def __init__(self, memory_path, embedding: EmbeddingHandler, llm: LLMHandler, memory_size):
        self.memory_manager = None
        self.memory_path = memory_path
        self.llm = self._create_chat_adapter(llm)
        self.embedding = self._create_embedding_adapter(embedding)
        self.memory_size = memory_size

    def reset_memory(self):
        storage = os.path.join(self.memory_path)
        if os.path.exists(storage):
            os.remove(storage)
 
    def load(self):
        storage = os.path.join(self.memory_path)
        storage_option = JSONStorage(storage)
        self.memory_manager = MemoryManager(self.llm, self.embedding, storage_option)

    def _create_embedding_adapter(self, embedding: EmbeddingHandler):
        
        class EmbeddingAdapter(EmbeddingModel):
            def __init__(self, embedding: EmbeddingHandler):
                self.embedding = embedding

            def get_embedding(self, text: str) -> np.ndarray:
                emb = self.embedding.get_embedding([text])
                return emb[0]
       
            def initialize_embedding_dimension(self) -> int:
                return self.embedding.get_embedding_dimensions()

        return EmbeddingAdapter(embedding)

    def _create_chat_adapter(self, llm:LLMHandler):
        class ChatModelAdapter(ChatModel):
            def __init__(self, llm: LLMHandler):
                self.llm = llm
                self.prompt = """
                Extract key concepts from the following chat conversation. Focus on highly relevant and specific concepts that capture the essence of the discussion. Your response must be a JSON array where each element is a string representing one key concept. Do not include any additional text, commentary, or formatting; output only the JSON array.
                
                Chat Conversation:                 
                """
            def invoke(self, messages: list) -> str:
                prompts, history = messages
                response = self.llm.generate_text(messages[:-1]["content"]["text"],history,prompts)
                return response

            def extract_concepts(self, text: str) -> list[str]:
                response = self.llm.get_response([{"role": "user", "content": text}], [],[self.prompt])
                j = extract_json(response)
                if type(j) is not list:
                    return []
                else:
                    return j
        return ChatModelAdapter(llm)

    def add_interaction(self, prompt, response, metadata={}):
        if self.memory_manager is not None:
            combined_text = " ".join([prompt, response])
            concepts = self.memory_manager.extract_concepts(combined_text)
            print(combined_text)
            new_embedding = self.embedding.get_embedding(combined_text)
            if len(metadata) > 0:
                response += "\n\n```json" + json.dumps(metadata) + "```"
            self.memory_manager.add_interaction(prompt, response, new_embedding, concepts)

    def retrieve_interactions(self, message):
        if self.memory_manager is not None:
            relevant_interactions = self.memory_manager.retrieve_relevant_interactions(message, exclude_last_n=self.memory_size, return_minimum=3)
            r = []
            for i in relevant_interactions:
               r.append(i["prompt"] + "\n" + i["output"])
            return process_conversation("\n".join(r))
        return ""
            

