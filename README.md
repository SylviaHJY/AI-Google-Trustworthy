# AI-Google-Trustworthy

### Introduction
AI Trust Evaluator is a comprehensive system designed to facilitate users in evaluating AI-generated responses against real-world data. Utilizing a blend of modern technologies and robust algorithms, the system integrates with LangChain, AzureOpenAI, OpenAI's GPT-3.5-turbo model, and Google Search API. It provides users with three types of search results: AI-generated responses, full query Google Search results, and Google Search results based on extracted keywords from the original query.

Leveraging Hugging Face's Transformers library, BERT model, and BertTokenizer, the system achieves high-precision language understanding. It further utilizes advanced NLP techniques with Retext for keyword extraction and text analysis. FastAPI web framework's Pydantic is employed for robust and efficient data validation, and cosine similarity metrics are implemented for nuanced comparison of AI and Google Search responses.

### MainPage
![MainPage](/public/images/mainPage.png)

### Login
![LoginPage](/public/images/LoginPage.png)

### First Rating
![firstRating](/public/images/firstRating.png)

### Second Rating
![secondRating](/public/images/secondRating.png)

### Technologies Used

Frontend:
* React.js
* HTML, CSS
* Backend:
* Node.js
* Express
* Python3
* FastAPI
* Pydantic

AI and NLP:
* Hugging Face's Transformers
* BERT model
* BertTokenizer
* Retext

Integration:
* AzureOpenAI
* OpenAI's GPT-3.5-turbo model
* Google Search API

Database:
MongoDB

Others:
* Axios
* express-session 

### Usage
To run the AI Trust Evaluator, you'll need to start three different services: the Node.js backend, the Python similarity calculation service, and the React frontend. Follow these steps:

1. Start Node.js Backend
  >You need download
  [Node.js](https://nodejs.org/en/download/)
  [Mongodb](https://www.mongodb.com/try/download/community)

 > Navigate to the Node.js backend directory and run:

  > Copy code
  > npm start
  > This will start the Node.js backend service on port 4000.

2. Start Python Similarity Calculation Service
 > First, install the required Python dependencies by running:

  > Copy code
  > pip install -r requirements.txt
  > Then, navigate to the Python similarity calculation service directory and run:

  > Copy code
  uvicorn src.main:app
  > This will start the Python service for calculating similarity scores on port 8000.

3. Start React Frontend
> Navigate to the React frontend directory and run:

> Copy code
> npm start
> This will start the React frontend on port 3000.

Now, you can open your browser and navigate to http://localhost:3000 to access the AI Trust Evaluator.
