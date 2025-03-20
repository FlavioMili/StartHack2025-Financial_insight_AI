from ..llm.llmhandler import LLMHandler
import json 
from ..utility.strings import extract_json 

ORDER_PROMPT = """
You are a helpful assistant tasked with identifying the speaker and content of each utterance in a conversation.

Given the following transcription of a conversation between a Client and a Wealth Manager, please analyze each unlabeled phrase and determine if it was spoken by the "Client" or the "Wealth Manager".

Your goal is to structure the output as a list of dictionaries, where each dictionary represents a single turn in the conversation. Each dictionary should have two keys: "role" (with a value of either "client" or "manager") and "content" (containing the text of the utterance).

**Transcription:**

[Insert your transcription here]

**Example Output Format:**

```json
[
  {"role": "client", "content": "Hello, why are my stocks going down?"},
  {"role": "manager", "content": "Hello, let me check your portfolio."}
]
```

**Please process the following transcription and provide the output in the specified JSON format.**
```

**Explanation of the prompt:**

* **Clear Role Definition:** It explicitly states the roles involved ("Client" and "Wealth Manager") and what the LLM needs to do.
* **Task Description:** It clearly outlines the task: identify the speaker and content of each utterance.
* **Desired Output Format:** It provides a clear example of the expected JSON structure, making it easy for the LLM to understand the desired output.
* **Instructions for Processing:** It instructs the LLM to "analyze each unlabeled phrase" and determine the speaker.
* **Transcription Placeholder:** It includes a clear instruction to "Insert your transcription here" where you will paste the conversation text.
* **Example Output:** The example output provides a concrete illustration of the expected data structure.
* **Final Request:** It ends with a direct instruction to process the transcription and provide the output in the specified JSON format.

**How to use this prompt:**

1. **Copy the prompt.**
2. **Replace "[Insert your transcription here]"** with the actual text of your conversation.
3. **Provide this complete prompt (with your transcription) to the LLM.**

The LLM should then analyze the conversation and return the output in the desired list of dictionaries format. Remember that the accuracy of the LLM's output will depend on the clarity and context within the provided transcription. You might need to adjust the prompt or review the output if the conversation is ambiguous.
"""
def convert_history(history: list[dict]):
    for message in history:
        message["role"] = "user" if message["role"] == "client" else "assistant"
    return history

def convert_history_openai(history: list[dict]):
    for message in history:
        message["role"] = "user" if message["role"] == "client" else "assistant"
    return history

def classify_speaker(llm: LLMHandler, transcription_text: str, context: list = []):  
    r = llm.get_response([{"role": "assistant", "content": json.dumps(convert_history(context))}, {"role": "user", "content": transcription_text}], [ORDER_PROMPT], [])
    return json.loads(extract_json(r))
