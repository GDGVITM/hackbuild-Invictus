# backend/prediction_service.py
from pydantic import BaseModel

class AdVariation(BaseModel):
    headline: str
    body_text: str
    cta_text: str

def predict_ad_performance(ad: AdVariation) -> dict:
    """
    Predicts an ad's performance score based on a simple heuristic model.
    The score is out of 100.
    """
    score = 50  # Start with a baseline score
    reasons = []

    # Rule 1: Headline analysis
    if '?' in ad.headline:
        score += 10
        reasons.append("+10: Headline asks an engaging question.")
    if len(ad.headline) > 50:
        score -= 5
        reasons.append("-5: Headline may be too long.")
    
    # Rule 2: Body text analysis
    urgent_keywords = ["sale", "limited", "now", "hurry", "today"]
    if any(keyword in ad.body_text.lower() for keyword in urgent_keywords):
        score += 15
        reasons.append("+15: Body text creates a sense of urgency.")
    
    # Rule 3: Call-to-Action (CTA) analysis
    strong_ctas = ["shop", "buy", "get", "order"]
    if any(cta in ad.cta_text.lower() for cta in strong_ctas):
        score += 20
        reasons.append("+20: Strong, direct call-to-action.")
    
    # Clamp the score between 0 and 100
    final_score = max(0, min(100, score))
    
    return {"score": final_score, "reasons": reasons}