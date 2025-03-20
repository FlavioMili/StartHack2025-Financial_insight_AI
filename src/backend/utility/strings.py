import json
import re
from markdown import Markdown
from io import StringIO

def process_conversation(text):
    """
    Processes a conversation text to remove duplicate prompts and answers,
    and orders/concatenates the interaction into pairs of prompt: answer:.

    Args:
        text: The input conversation text.

    Returns:
        A string containing the processed conversation in prompt: answer: format.
    """
    lines = text.strip().split('\n')
    conversation = []
    seen_prompts = set()
    current_speaker = None
    current_utterance = ""

    for line in lines:
        line = line.strip()
        if not line:
            continue

        match = re.match(r"^(.*?)(?:\s*\((.*?)\))?:", line)
        if match:
            speaker = match.group(1).strip()
            role = match.group(2)
            utterance = line[match.end():].strip()

            if speaker:
                if current_speaker and current_utterance:
                    if current_utterance not in seen_prompts:
                        conversation.append(f"{current_speaker}: {current_utterance}")
                        seen_prompts.add(current_utterance)
                current_speaker = speaker
                current_utterance = utterance
            elif utterance:
                current_utterance += " " + utterance
        elif current_speaker:
            current_utterance += " " + line

    if current_speaker and current_utterance:
        if current_utterance not in seen_prompts:
            conversation.append(f"{current_speaker}: {current_utterance}")

    processed_conversation = []
    i = 0
    while i < len(conversation):
        prompt = conversation[i]
        answer = ""
        if i + 1 < len(conversation) and conversation[i].split(':')[0].strip() != conversation[i+1].split(':')[0].strip():
            answer = conversation[i+1]
            processed_conversation.append(f"{prompt}\n{answer}")
            i += 2
        else:
            processed_conversation.append(prompt)
            i += 1

    result = ""
    for item in processed_conversation:
        result += f"{item}\n"

    return result.strip()

def extract_json(input_string: str) -> str:
    """Extract JSON string from input string

    Args:
        input_string (): The input string 

    Returns:
        str: The JSON string 
    """
    # Regular expression to find JSON objects or arrays
    json_pattern = re.compile(r'\{.*?\}|\[.*?\]', re.DOTALL)
    
    # Find all JSON-like substrings
    matches = json_pattern.findall(input_string) 
    # Parse each match and return the first valid JSON
    for match in matches:
        try:
            json_data = json.loads(match)
            return match
        except json.JSONDecodeError:
            continue
    print("Wrong JSON", input_string)
    return "{}"