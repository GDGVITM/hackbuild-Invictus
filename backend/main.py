# backend/main.py

from fastapi import FastAPI
from typing import List, Set
from models import StandardAd
import os
from dotenv import load_dotenv
import json
from prediction_service import predict_ad_performance, AdVariation

# --- IMPORTS FOR AI ---
from pydantic import BaseModel
from analysis_service import analyze_ad_text, generate_campaign_idea
from mock_db_service import get_competitors_by_term, get_ads_by_brand
from groq import Groq

load_dotenv()
app = FastAPI()

# --- INITIALIZE THE GROQ CLIENT ---
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    groq_client = None

# --- Add CORS middleware ---
from fastapi.middleware.cors import CORSMiddleware
origins = ["http://localhost:3000", "http://localhost"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Define Request Body Models ---
class AdText(BaseModel):
    text: str
class CampaignRequest(BaseModel):
    product_description: str
    tone: str
    style: str
class ProductDescription(BaseModel):
    description: str
class ChatRequest(BaseModel):
    message: str
class ABTestRequest(BaseModel):
    ads: List[AdVariation]

# --- API Endpoints ---
@app.post("/api/discover-competitors")
def discover_competitors(product: ProductDescription):
    print(f"Discovering competitors for: '{product.description}'")
    competitors = get_competitors_by_term(product.description)
    return {"search_term": product.description, "competitors": competitors}

@app.get("/api/competitor-ads/{competitor_name}", response_model=List[StandardAd])
def get_competitor_ads(competitor_name: str):
    print(f"Fetching mock ads for competitor: {competitor_name}")
    ads = get_ads_by_brand(competitor_name)
    return ads

@app.post("/api/analyze-text")
def analyze_text_endpoint(ad_text: AdText):
    return analyze_ad_text(ad_text.text)

@app.post("/api/generate-campaign")
def generate_campaign_endpoint(request: CampaignRequest):
    mock_context = get_ads_by_brand("Nike")
    response = generate_campaign_idea(
        product_description=request.product_description,
        tone=request.tone,
        style=request.style,
        competitor_ads=[ad.dict() for ad in mock_context]
    )
    return response

@app.post("/api/chat")
def chat_with_assistant(request: ChatRequest):
    if not groq_client:
        return {"error": "Groq client not initialized."}
    system_prompt = """
    You are a friendly and knowledgeable marketing assistant chatbot. Your name is 'Ad-visor'.
    Your purpose is to answer questions about digital marketing, advertising strategies, and campaign ideas.
    Keep your answers concise, helpful, and easy to understand. Respond in markdown format.
    """
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message},
            ],
            model="llama3-8b-8192",
            temperature=0.5,
        )
        response_content = chat_completion.choices[0].message.content
        return {"reply": response_content}
    except Exception as e:
        print(f"Error during Groq chat API call: {e}")
        return {"error": "Sorry, I couldn't process that request."}

@app.post("/api/simulate-ab-test")
def simulate_ab_test_endpoint(request: ABTestRequest):
    """
    Receives a list of ad variations and returns a predicted score for each.
    """
    predictions = []
    for ad in request.ads:
        prediction = predict_ad_performance(ad)
        predictions.append(prediction)
    
    return {"predictions": predictions}