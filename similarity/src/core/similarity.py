from transformers import BertModel, BertTokenizer
# from sklearn.metrics.pairwise import cosine_similarity
# import torch

class TextEmbedder:
  def __init__(self):
    # Load pre-trained model and tokenizer
    #self.model = BertModel.from_pretrained('bert-base-uncased')
    #self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    # Load ClinicalBERT model and tokenizer
    self.model = BertModel.from_pretrained('emilyalsentzer/Bio_ClinicalBERT')
    self.tokenizer = BertTokenizer.from_pretrained('emilyalsentzer/Bio_ClinicalBERT')
    
  def get_embedding(self, text):
    # Tokenize input text
    inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

    # Get vector representation of input text
    outputs = self.model(**inputs)
    #vector = outputs[0].mean(dim=1).detach().numpy()  # Mean pooling
    #return vector
    cls_embedding = outputs[0][:, 0, :].detach().numpy()  # CLS token
    return cls_embedding
