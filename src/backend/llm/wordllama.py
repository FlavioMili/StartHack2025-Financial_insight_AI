from .embeddinghandler import EmbeddingHandler
from wordllama import WordLlama
import numpy as np

class WordLlamaHanlder(EmbeddingHandler):
    def __init__(self, size) -> None:
        self.size = size
        self.wl = WordLlama.load(dim=size)

    def get_embedding(self, text: list[str]) -> np.ndarray:
        return self.wl.embed(text)

    def get_embedding_dimensions(self) -> int:
        return self.size


