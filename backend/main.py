# backend/main.py
from fastapi import FastAPI
from typing import List, Set
from models import StandardAd
import os

from pydantic import BaseModel
from analysis_service import analyze_ad_text, generate_campaign_idea
from mock_db_service import get_competitors_by_term, get_ads_by_brand # Import new service

app = FastAPI()

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

# --- API Endpoints ---
@app.post("/api/analyze-text")
def analyze_text_endpoint(ad_text: AdText):
    return analyze_ad_text(ad_text.text)

@app.post("/api/generate-campaign")
def generate_campaign_endpoint(request: CampaignRequest):
    mock_context = get_ads_by_brand("Nike") # Use Nike as an example context
    response = generate_campaign_idea(
        product_description=request.product_description,
        tone=request.tone,
        style=request.style,
        competitor_ads=[ad.dict() for ad in mock_context]
    )
    return response

# --- UPDATED: Endpoint for Competitor Discovery using Mock DB ---
@app.post("/api/discover-competitors")
def discover_competitors(product: ProductDescription):
    print(f"Discovering competitors for: '{product.description}'")
    competitors = get_competitors_by_term(product.description)
    return {"search_term": product.description, "competitors": competitors}

# --- UPDATED: Endpoint to Fetch Ads from Mock DB ---
@app.get("/api/competitor-ads/{competitor_name}", response_model=List[StandardAd])
def get_competitor_ads(competitor_name: str):
    print(f"Fetching mock ads for competitor: {competitor_name}")
    ads = get_ads_by_brand(competitor_name)
    return ads

# --- This endpoint is no longer needed with the new mock system ---
@app.get("/api/check-for-new-ads", response_model=List[StandardAd])
def check_for_new_ads():
    return []