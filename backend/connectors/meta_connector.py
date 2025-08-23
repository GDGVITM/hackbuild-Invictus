# backend/connectors/meta_connector.py
import os
from dotenv import load_dotenv
from typing import List
from models import StandardAd
from apify_client import ApifyClient

load_dotenv()

# --- Configuration for the Apify API ---
APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")

def get_ads(search_term: str) -> List[StandardAd]:
    """
    Fetches live ad data by running the Apify Facebook Ad Library Scraper.
    """
    if not APIFY_API_TOKEN:
        print("Error: APIFY_API_TOKEN not found in .env file.")
        return []

    try:
        client = ApifyClient(APIFY_API_TOKEN)
        
        # Prepare the input for the Apify Actor
        # The actor ID for the official Facebook Ad Library Scraper is MOhVRckEu3b2i5k2g
        run_input = {
            "searchTerms": [search_term],
            "country": "IN", # Search for ads shown in India
            "maxResults": 10, # Limit the number of results to keep it fast
        }

        print(f"Starting Apify scraper for search term: '{search_term}'...")
        # Run the Actor and wait for it to finish
        run = client.actor("MOhVRckEu3b2i5k2g").call(run_input=run_input)
        print("Apify scraper finished. Fetching results...")

        # Fetch the results from the Actor's dataset
        dataset_items = client.dataset(run["defaultDatasetId"]).list_items().items
        print(f"Apify returned {len(dataset_items)} ads.")

    except Exception as e:
        print(f"An error occurred with the Apify API call: {e}")
        return []

    standardized_ads = []
    for ad in dataset_items:
        # This is the "translation" step for the SCRAPED data
        # Apify's data structure is different, so we map its fields to our model
        card_data = ad.get('cardData', {})
        
        standard_ad = StandardAd(
            platform='Meta (Live)',
            competitor_name=ad.get('pageName', 'N/A'),
            headline=card_data.get('title', ''),
            body_text=card_data.get('caption', ''),
            image_url=ad.get('adSnapshotUrl', ''), 
            cta_text=card_data.get('callToAction', '').replace('_', ' ').title()
        )
        standardized_ads.append(standard_ad)

    return standardized_ads