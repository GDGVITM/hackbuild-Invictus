# backend/models.py

from pydantic import BaseModel
from typing import Optional

class StandardAd(BaseModel):
    platform: str
    competitor_name: str
    headline: str
    body_text: str
    image_url: str
    cta_text: Optional[str] = None # Some ads might not have a clear CTA