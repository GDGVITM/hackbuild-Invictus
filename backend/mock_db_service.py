# backend/mock_db_service.py
import json
from typing import List, Dict, Any
from models import StandardAd

DATABASE_FILE = "mock_database.json"

def _load_database() -> Dict[str, Any]:
    """Loads the mock database from the JSON file."""
    try:
        with open(DATABASE_FILE, 'r', encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def get_competitors_by_term(search_term: str) -> List[str]:
    """Finds competitor brands for a given search term."""
    db = _load_database()
    search_term = search_term.lower()
    
    # Simple keyword matching for categories
    for category in db.keys():
        if category in search_term:
            return [brand['brand_name'] for brand in db[category]]
    
    return []

def get_ads_by_brand(brand_name: str) -> List[StandardAd]:
    """Gets all ads for a specific brand name."""
    db = _load_database()
    
    all_brands = []
    for category in db.values():
        all_brands.extend(category)
        
    standardized_ads = []
    for brand_data in all_brands:
        if brand_data['brand_name'].lower() == brand_name.lower():
            for ad in brand_data['ads']:
                standard_ad = StandardAd(
                    platform='Meta', # Mock platform
                    competitor_name=brand_data['brand_name'],
                    headline=ad['headline'],
                    body_text=ad['body_text'],
                    image_url=ad['image_url'],
                    cta_text=ad['cta_text']
                )
                standardized_ads.append(standard_ad)
            return standardized_ads # Return as soon as we find the brand
            
    return []