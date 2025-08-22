# backend/main.py

from fastapi import FastAPI
from typing import List, Set
from models import StandardAd
from connectors import meta_connector, google_connector
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from dotenv import load_dotenv

# Import the new modules needed for the AI endpoints
from pydantic import BaseModel
from analysis_service import analyze_ad_text, generate_campaign_idea
from groq import Groq

load_dotenv()
app = FastAPI()

# --- Initialize Groq Client for Keyword Extraction ---
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    groq_client = None


# Add CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost",
]
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


# --- API Endpoints ---
@app.post("/api/analyze-text")
def analyze_text_endpoint(ad_text: AdText):
    result = analyze_ad_text(ad_text.text)
    return result

@app.post("/api/generate-campaign")
def generate_campaign_endpoint(request: CampaignRequest):
    mock_competitor_context = [{
        "headline": "Step Into Comfort.",
        "body_text": "Discover the revolutionary cushion technology in our new runner series."
    }]
    response = generate_campaign_idea(
        product_description=request.product_description,
        tone=request.tone,
        style=request.style,
        competitor_ads=mock_competitor_context
    )
    return response

# --- NEW: Endpoint for Competitor Discovery ---
@app.post("/api/discover-competitors")
def discover_competitors(product: ProductDescription):
    if not groq_client:
        return {"error": "Groq client not initialized."}
    
    # Use Groq to extract a simple search term from the user's description
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Extract the single most relevant 2-3 word search query from the following product description. Respond with ONLY the search query and nothing else."},
            {"role": "user", "content": product.description},
        ],
        model="llama3-8b-8192",
    )
    search_term = chat_completion.choices[0].message.content.strip().replace('"', '')

    print(f"Extracted search term: '{search_term}'")
    
    # Use the live connector to find ads based on the extracted search term
    live_ads = meta_connector.get_ads(search_term=search_term)
    
    # Create a unique list of competitor names
    competitors: Set[str] = set(ad.competitor_name for ad in live_ads if ad.competitor_name != 'N/A')
    
    return {"search_term": search_term, "competitors": list(competitors)}

# --- UPDATED: Endpoint to Fetch Ads (Now uses Live Data for Meta) ---
@app.get("/api/competitor-ads/{competitor_name}", response_model=List[StandardAd])
def get_competitor_ads(competitor_name: str):
    print(f"Fetching LIVE ads for competitor: {competitor_name}")

    # The meta_connector now requires a search term and fetches live data
    meta_ads = meta_connector.get_ads(search_term=competitor_name)
    
    # The google_connector still uses mock data
    google_ads = google_connector.get_ads()

    all_ads = meta_ads + google_ads
    return all_ads

# --- DEPRECATED (for now): The alert check logic needs to be re-thought for live data ---
@app.get("/api/check-for-new-ads", response_model=List[StandardAd])
def check_for_new_ads():
    # This feature was based on mock data. In a live system, you'd compare
    # current ads against a database of previously seen ads.
    # For now, we will return an empty list.
    print("Alert check endpoint called (currently disabled for live data).")
    return []