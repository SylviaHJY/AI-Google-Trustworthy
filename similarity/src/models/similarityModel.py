from pydantic import BaseModel

class similarityModel(BaseModel):
    text1: str
    text2: str