# backend/connectors/meta_connector.py
import httpx
import os
from dotenv import load_dotenv
from typing import List
from models import StandardAd

load_dotenv()

META_API_URL = "https://graph.facebook.com/v19.0/ads_archive"
ACCESS_TOKEN = os.getenv("META_ACCESS_TOKEN")

def get_ads(search_term: str) -> List[StandardAd]:
    if not ACCESS_TOKEN:
        print("Error: META_ACCESS_TOKEN not found in .env file.")
        return []

    params = {
        'search_terms': search_term,
        'ad_active_status': 'ACTIVE',
        'ad_type': 'ALL',
        'limit': 25,
        'fields': 'id,page_name,ad_creative_bodies,ad_creative_link_headlines,snapshot_url,call_to_action_type',
        # --- THE FIX: Add the required country parameter ---
        'ad_reached_countries': "['IN']", # Search for ads shown in India
        'access_token': ACCESS_TOKEN,
    }

    try:
        with httpx.Client() as client:
            print(f"Requesting from Meta API with params: {params.get('search_terms')}")
            response = client.get(META_API_URL, params=params)
            response.raise_for_status()
            raw_ads = response.json().get('data', [])
            print(f"Meta API returned {len(raw_ads)} ads.")
            
    except httpx.HTTPStatusError as e:
        print("--- META API HTTP ERROR ---")
        print(f"Request to {e.request.url} failed with status code {e.response.status_code}")
        print("Response body:", e.response.text)
        print("--- END META API ERROR ---")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

    standardized_ads = []
    for ad in raw_ads:
        headline_list = ad.get('ad_creative_link_headlines', [])
        body_list = ad.get('ad_creative_bodies', [])

        standard_ad = StandardAd(
            platform='Meta',
            competitor_name=ad.get('page_name', 'N/A'),
            headline=headline_list[0].get('text', '') if headline_list else '',
            body_text=body_list[0].get('text', '') if body_list else '',
            image_url=ad.get('snapshot_url', ''), 
            cta_text=ad.get('call_to_action_type', '').replace('_', ' ').title()
        )
        standardized_ads.append(standard_ad)

    return standardized_ads