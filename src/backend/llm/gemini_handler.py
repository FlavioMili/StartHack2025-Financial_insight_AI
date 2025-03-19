from .llmhandler import LLMHanlder
from google import genai
from google.genai.types import HarmCategory, HarmBlockThreshold, GenerateContentConfig


class GeminiHandler(LLMHanlder):

    def __init__(self, api, model) -> None:
        self.client = genai.Client(api_key=api)
        self.model = model

    def get_response(self, history: list[dict], prompts: list[str], tools) -> str:
        return self.get_response_stream(history, prompts, tools, on_update=lambda x: None)

    def get_response_stream(self, history: list[dict], prompts: list[str], tools, on_update, extra_args: list = []) -> str:
        safety = { 
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        }
        instructions = "\n".join(prompts)
        generate_content_config = GenerateContentConfig( system_instruction=instructions, safety_settings=safety)
        converted_history = self.convert_history(history)
        response = self.client.models.generate_content_stream(
                contents=converted_history,
                config=generate_content_config,
                model=self.model,
            )
        full_message = ""
        for chunk in response:
            if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
                continue
            elif chunk.text is not None:
                full_message += chunk.text
                args = (full_message.strip(), ) + tuple(extra_args)
                on_update(*args)
        return full_message.strip()

    def convert_history(self, history: list):
        from google.genai import types
        result = []
        for message in history:
                result.append(
                    types.Content(
                        role="user" if message["role"] == "user" else "model",
                        parts=[types.Part.from_text(text=message["content"])],
                    )
                )
        return result
