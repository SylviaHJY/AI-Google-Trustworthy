from fastapi import APIRouter, HTTPException
from src.models.similarityModel import similarityModel
from src.core.similarity import TextEmbedder
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter()
embedder = TextEmbedder()

@router.post("/similarity")
def calculate_similarity(similarity: similarityModel):
    text1 = similarity.text1
    text2 = similarity.text2
    if text1 == "" or text2 == "":
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    vector1 = embedder.get_embedding(text1)
    vector2 = embedder.get_embedding(text2)
    similarity_score = cosine_similarity(vector1, vector2)[0][0]
    return {"similarity_score": similarity_score.item()}  # convert numpy float to Python float

