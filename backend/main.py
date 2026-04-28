from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import os
from google import genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="VolunteerIQ Matching API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Volunteer(BaseModel):
    id: str
    skills: List[str]
    bio: Optional[str] = ""

class Opportunity(BaseModel):
    id: str
    title: str
    description: str
    required_skills: List[str]

class MatchRequest(BaseModel):
    volunteer: Volunteer
    opportunities: List[Opportunity]

class MatchResponse(BaseModel):
    opportunity_id: str
    match_score: float

@app.post("/api/match", response_model=List[MatchResponse])
async def compute_matches(req: MatchRequest):
    """
    Computes cosine similarity between a volunteer profile and a list of opportunities
    using Google's Gemini text-embedding models.
    """
    try:
        # Client automatically uses GEMINI_API_KEY from environment variables
        client = genai.Client()
        
        # 1. Format volunteer text
        vol_text = f"Skills: {', '.join(req.volunteer.skills)}. Bio: {req.volunteer.bio}"
        
        # 2. Get volunteer embedding
        vol_emb_response = client.models.embed_content(
            model='text-embedding-004',
            contents=vol_text
        )
        vol_emb = np.array(vol_emb_response.embeddings[0].values)
        
        # 3. Format and get opportunity embeddings
        opp_texts = []
        for opp in req.opportunities:
            text = f"Title: {opp.title}. Description: {opp.description}. Required Skills: {', '.join(opp.required_skills)}"
            opp_texts.append(text)
            
        opp_emb_response = client.models.embed_content(
            model='text-embedding-004',
            contents=opp_texts
        )
        
        matches = []
        # 4. Compute cosine similarity for each opportunity
        for i, opp in enumerate(req.opportunities):
            opp_emb = np.array(opp_emb_response.embeddings[i].values)
            
            dot_product = np.dot(vol_emb, opp_emb)
            norm_a = np.linalg.norm(vol_emb)
            norm_b = np.linalg.norm(opp_emb)
            
            if norm_a == 0 or norm_b == 0:
                score = 0.0
            else:
                score = dot_product / (norm_a * norm_b)
                
            matches.append(MatchResponse(
                opportunity_id=opp.id,
                # Convert from numpy float to native float
                match_score=float(score)
            ))
            
        # 5. Sort by match score descending
        matches.sort(key=lambda x: x.match_score, reverse=True)
        return matches

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
