import numpy as np

class EmbeddingHandler():
    def get_embedding(self, text: list[str]) -> np.ndarray:
        return np.array([[0]])

    def get_embedding_dimensions(self) -> int:
        return 1
