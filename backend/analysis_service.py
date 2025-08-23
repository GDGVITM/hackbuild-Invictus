# backend/analysis_service.py

from transformers import pipeline
import os
from dotenv import load_dotenv
import json
from groq import Groq

# --- Part 1: Existing Text Classifier (No changes here) ---
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def analyze_ad_text(text: str):
    candidate_labels = ["Urgent", "Inspirational", "Formal", "Playful", "Informative"]
    result = classifier(text, candidate_labels)
    top_label = result['labels'][0]
    print(f"Analyzed text, top result is '{top_label}'")
    return {"detected_tone": top_label}

# --- Part 2: Updated Campaign Generator with Storyboard ---

load_dotenv()

try:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    print(f"Error configuring Groq, please check your API key: {e}")
    client = None

def generate_campaign_idea(product_description: str, tone: str, style: str, competitor_ads: list):
    if not client:
        return {"error": "Groq client not initialized. Please check your API key."}

    competitor_insight_summary = ""
    if competitor_ads:
        example_ad = competitor_ads[0]
        competitor_insight_summary = f"""
        For context, here is an example of a competitor's ad:
        - Headline: "{example_ad['headline']}"
        - Body: "{example_ad['body_text']}"
        """

    # We are instructing the AI to respond with a new "video_storyboard" key
    system_prompt = """
    You are an expert performance marketer and creative director.
    You must respond with a valid JSON object with the following keys: "headlines", "body_copy", "visual_prompt", "reasoning", and "video_storyboard".
    - "headlines": An array of 3 catchy, unique headlines.
    - "body_copy": A single paragraph of compelling ad copy.
    - "visual_prompt": A descriptive prompt for a text-to-image AI.
    - "reasoning": An array of short strings explaining why this strategy is effective.
    - "video_storyboard": An array of 3 objects, each representing a 1-second scene in a video ad. Each object must have two keys: "visual" (a description of the scene) and "overlay_text" (the text that appears on screen).
    """
    
    user_prompt = f"""
    **Product Information:** {product_description}
    **Creative Direction:** Tone should be {tone}, and visual style should be {style}.
    {competitor_insight_summary}
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        response_content = chat_completion.choices[0].message.content
        return json.loads(response_content)
    except Exception as e:
        print(f"Error during API call to Groq: {e}")
        return {"error": "An error occurred while generating the campaign with Groq."}