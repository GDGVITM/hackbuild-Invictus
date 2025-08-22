# backend/connectors/google_connector.py

import json
from typing import List
from models import StandardAd

def get_ads() -> List[StandardAd]:
    # FIX: Added encoding="utf-8" here as well
    with open('mock_data/google_ads.json', 'r', encoding="utf-8") as f:
        raw_ads = json.load(f)
    
    standardized_ads = []
    for ad in raw_ads:
        # Translating Google's unique fields to our standard format
        standard_ad = StandardAd(
            platform=ad.get('source'),
            competitor_name=ad.get('brand'),
            headline=ad.get('headline_1'),
            body_text=ad.get('description'),
            image_url=ad.get('creativeUrl'),
            cta_text=ad.get('cta')
        )
        standardized_ads.append(standard_ad)
        
    return standardized_ads