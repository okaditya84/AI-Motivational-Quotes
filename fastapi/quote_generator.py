from fastapi import FastAPI
import random
from typing import Optional

app = FastAPI()

# List of motivational quotes (in a real app, integrate with your LLM/groq API)
motivational_quotes = [
    "Believe in yourself and all that you are.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you, you have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it."
]

@app.get("/generate_quote")
def generate_quote():
    quote = random.choice(motivational_quotes)
    return {"quote": quote}

@app.get("/generate_custom_quote")
def generate_custom_quote(keywords: Optional[str] = None):
    quote = random.choice(motivational_quotes)
    if keywords:
        quote = f"{quote} - Embrace your journey towards {keywords}"
    return {"quote": quote}

# To run this service, use:
# uvicorn quote_generator:app --reload --port 8000 