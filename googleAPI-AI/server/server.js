import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import { retext } from 'retext'; // Natural language processor
import retextPos from 'retext-pos'; // Part of speech
import retextKeywords from 'retext-keywords'; // Keywords
import { toString } from 'nlcst-to-string';

dotenv.config();

const app = express();
app.use(express.json());
// 使用 cors 中间件解决跨域问题
app.use(cors());

const configuration = new Configuration({
    organization: "org-L3EC4bsSh5eIcDPsWVB5Xiph", // 你的Organization ID
    apiKey: process.env.CHATGPT_API_KEY,
});

const openai = new OpenAIApi(configuration);


app.get('/api/chatgpt', async (req, res) => {
  const { q } = req.query;
  try {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: q }
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7
    });

    res.json(response.data.choices[0].message.content.trim().toString('utf8'));
  } catch (error) {
    console.error('Error:', error);
    console.error('Error:', error.response ? error.response.data : error);
    res.status(500).json({ error: 'An error occurred while using ChatGPT', message: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  console.log("Search query:", q);  
  if (!q || q.trim() === '') {
    res.status(400).json({ error: 'Missing search query' });
    return;
  }
  try {
     // Google search using full query string
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: '534f4261cc70c4495',  
          q
        }
      }
    );
    res.json(response.data.items);
    //console.log("Search results:", response.data.items);
    // Process the response data
    let processedData = {};
    response.data.items.forEach((item, index) => {
      Object.assign(processedData, {
        [`googleResultTitle${index+1}`]: item.title,
        [`googleResultSnippet${index+1}`]: item.snippet,
        [`googleResultLink${index+1}`]: item.link,
        [`googleResultHtmlSnippet${index+1}`]: item.htmlSnippet
      });
    });

    console.log("----------------------------------------------");
    console.log("Search results:", JSON.stringify(processedData, null, 2));
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    res.status(500).json({ error: 'An error occurred while searching keywords' });
  }
});

app.get('/api/keywordSearch', async (req, res) => {
  const { q } = req.query; 
  if (!q || q.trim() === '') {
    res.status(400).json({ error: 'Missing search query' });
    return;
  }
  try {
    // Extract keywords from query
    let keywordStrings = [];
    await retext().use(retextPos).use(retextKeywords).process(q).then((file) => {
      file.data.keywords.forEach((keyword) => {
        keywordStrings.push(toString(keyword.matches[0].node));
      });
    });

    // Combine all keywords into a single string separated by spaces
    const keywordQuery = keywordStrings.join(' ');
    console.log('Keyword query:', keywordQuery);

    // Google search using the combined keyword query
    const keywordResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: '534f4261cc70c4495', 
        q: keywordQuery
      }
    });

    res.json({
      keywordQuery,
      results: keywordResponse.data.items
    });
    console.log("---------------------------------------------------------------------------");
    //console.log("Keyword search results:", keywordResponse.data.items);
    // Process the response data
    let processedData = {};
    keywordResponse.data.items.forEach((item, index) => {
      Object.assign(processedData,{
        [`keywordsResultTitle${index+1}`]: item.title,
        [`keywordsResultSnippet${index+1}`]: item.snippet,
        [`keywordsResultLink${index+1}`]: item.link,
        [`keywordsResultHtmlSnippet${index+1}`]: item.htmlSnippet
      });
    });

    console.log("----------------------------------------------");
    console.log("Keywords Search results:", JSON.stringify(processedData, null, 2));

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    res.status(500).json({ error: 'An error occurred while searching keywords' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
