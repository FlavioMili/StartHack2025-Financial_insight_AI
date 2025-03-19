class LLMHanlder():
    def get_response(self, history, prompts, tools) -> str:
        pass

    def get_response_stream(self, history: list[dict], prompts: list[str], tools, on_update, extra_args: list = []) -> str:
        pass 


