import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import AddRating from './addRating';

import { 
  Card, 
  CardContent, 
  Grid
} from '@mui/material';

import '../App.css';

const QuestionPage = () => {
  const [question, setQuestion] = useState(undefined);
  const [chatgptAnswer, setChatgptAnswer] = useState(undefined);
  const [googleAnswer, setGoogleAnswer] = useState([]);
  const [keywordExtracted, setKeywordExtracted] = useState(undefined);
  const [keywordAnswer, setKeywordAnswer] = useState([]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [secondRatingSubmitted, setSecondRatingSubmitted] = useState(false);
  const [isNextButtonClicked, setIsNextButtonClicked] = useState(false); // New state variable
  const [isFirstRatingSubmitted, setIsFirstRatingSubmitted] = useState(false);
  const [isSecondRatingSubmitted, setIsSecondRatingSubmitted] = useState(false);
  const [googleSimilarityScore, setGoogleSimilarityScore] = useState(null);
  const [keywordSimilarityScore, setKeywordSimilarityScore] = useState(null);
  const navigate = useNavigate();

  let { num } = useParams(); 
  console.log(num);
  num = Number(num);
  if (isNaN(num)) {
    console.log('num is not a valid number');
  }
  const totalNumber = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(num);
        const response = await axios.get(`http://localhost:4000/answers/number/${num}`);
        console.log(response);
        if (response.data.message === 'No more questions') {
          navigate('/LastPage');
        }else if (!response.data) {
          console.log('No data received from server');
          navigate('/LastPage');
        } else{
        setQuestion(response.data.question);
        setChatgptAnswer(response.data.chatgptAnswer);
        const googleResults = [];
        const keywordResults = [];
    
        for(let i = 1; i <=10; i++) {
          if(response.data[`googleResultTitle${i}`] !== undefined) {
            googleResults.push({
              title: response.data[`googleResultTitle${i}`],
              link: response.data[`googleResultLink${i}`],
              htmlSnippet: response.data[`googleResultHtmlSnippet${i}`]
            });
          }
    
          if(response.data[`keywordsResultTitle${i}`] !== undefined) {
            keywordResults.push({
              title: response.data[`keywordsResultTitle${i}`],
              link: response.data[`keywordsResultLink${i}`],
              htmlSnippet: response.data[`keywordsResultHtmlSnippet${i}`]
            });
          }
        }
    
        setGoogleAnswer(googleResults);
        setKeywordAnswer(keywordResults);
        setKeywordExtracted(response.data.keywordsExtracted);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [num]);

  useEffect(() => {
    if (ratingSubmitted) {
      // create a function to fetch similarity score
      const fetchSimilarityScore = async () => {
        try {
          const googleResponse = await axios.post('http://127.0.0.1:8000/similarity', {
            "text1": chatgptAnswer,
            "text2": googleAnswer.map(item => item.title + ' ' + item.htmlSnippet).join(' ')
          });
          setGoogleSimilarityScore(googleResponse.data.similarity_score);

          const keywordResponse = await axios.post('http://127.0.0.1:8000/similarity', {
            "text1": chatgptAnswer,
            "text2": keywordAnswer.map(item => item.title + ' ' + item.htmlSnippet).join(' ')
          });
          setKeywordSimilarityScore(keywordResponse.data.similarity_score);
        } catch (error) {
          console.log(error);
        }
      }

      fetchSimilarityScore();
    }
  }, [ratingSubmitted, chatgptAnswer, googleAnswer, keywordAnswer]);

  const handleRatingSubmitted = () => {
    setRatingSubmitted(true);
    setIsFirstRatingSubmitted(true); // Set isSubmitted to true when the first rating is submitted
    setGoogleSimilarityScore("Calculating similarity score...");
    setKeywordSimilarityScore("Calculating similarity score...");
  }

  const handleSecondRatingSubmitted = () => {
    setSecondRatingSubmitted(true);
    setIsSecondRatingSubmitted(true);// Set isSubmitted to true when the second rating is submitted
  };

  const handleNext = async () => {  // make the function async
    if (secondRatingSubmitted) { // Only proceed if second rating has been submitted
      setIsNextButtonClicked(true); // Indicate that the "Next" button has been clicked
      const nextNumber = num < totalNumber ? num + 1 : null;
      
      if (nextNumber) {
        // Reset states for the new question
        setRatingSubmitted(false);
        setSecondRatingSubmitted(false);
        setIsFirstRatingSubmitted(false);
        setIsSecondRatingSubmitted(false);
        
        const response = await axios.get(`http://localhost:4000/answers/number/${nextNumber}`);
        if(response.data.message === 'No more questions') {
          // Redirect to 'No more questions' page
          navigate('/LastPage');
        } else {
          // Wait for state update to complete
          setTimeout(() => {
            navigate(`/answers/number/${nextNumber}`);
          }, 0);
        }
      } else {
        // Redirect to 'No more questions' page
        navigate('/LastPage');
      }
    }
  };
  

  function textToHtml(text) {
    if (text) {
        let new_text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        new_text = new_text.replace(/((http|https):\/\/[\w?=&./-;#~%-]+(?![\w\s?&./;#~%"=-]*>))/g, '<a href="$1" target="_blank">$1</a>');
        return new_text;
    }    
    return text; 
  }

  return (
    <div className="bigContainer">
      <Grid container spacing={2}>
      <div style={{margin: 'auto', width:'1100px'}}>
        <Grid item xs={12}>
          <Card>
            <CardContent  style={{margin: 'auto', width:'760px'}}>
              <h2>Question:</h2>
              <p>{question}</p>
            </CardContent>
          </Card>
        </Grid>
        </div>
        
        <div style={{margin: 'auto', width:'1100px', marginTop:'28px'}}>
        <Grid>
          <Card>
            <CardContent style={{margin: 'auto', width:'760px'}} >
              <h2>ChatGPT Answer:</h2>
              <div dangerouslySetInnerHTML={{ __html: textToHtml(chatgptAnswer) }} />
            </CardContent>
          </Card>
        </Grid>
        </div>

        
      <div style={{margin: 'auto', width:'1100px', marginTop:'30px'}}>
         <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
          <AddRating onRatingSubmitted={handleRatingSubmitted} questionNumber={num} isSubmitted={isFirstRatingSubmitted}/>
        </Grid>
      </div>

        {ratingSubmitted && (
        <>
        <div style={{margin: 'auto', width:'1100px', marginTop:'28px'}}>
        <Grid container spacing={3}>
        <Grid item xs={6}>        
          <Card>
            <CardContent>
              <h2 className="resultsCardTitle">Google results from sentence</h2>       
              <p style={{fontSize: '18px',paddingTop:'12px'}}>This is the google search results based on the full text of the above question</p>
              {googleSimilarityScore === "Calculating similarity score..." ? 
              <p style={{fontSize: '18px',paddingTop:'12px', color:'red'}}>Calculating similarity score...</p> :  
              <p style={{fontSize: '18px',paddingTop:'12px', color:'red'}}>Similarity compare with chatgptAnswer: {Math.round(googleSimilarityScore * 100)}%</p>}

              <div style={{height: '44px'}}></div>
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {googleAnswer.map((item, index) => (
                  <div key={index}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{fontSize:'14px'}} >{item.title}</a>
                    <p style={{fontSize:'13px'}} dangerouslySetInnerHTML={{ __html: item.htmlSnippet }}/>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <h2 className="resultsCardTitle">Google results from keywords</h2>
              <div style={{marginBottom: '-32px'}}>
                <div style={{backgroundColor:'#F4F4F4', borderRadius:'6px', paddingLeft:'12px', paddingRight:'12px', paddingTop:'12px', paddingBottom:'12px', marginLeft:'12px', marginRight:'12px'}}>
                  <p style={{fontSize: '13px'}}> Keywords Extracted:</p> <p style={{marginTop:'-14px', marginBottom:'-4px',fontSize: '13px', fontWeight: '800'}}> {keywordExtracted}
                  </p>
                </div>
                <p style={{fontSize: '18px', marginTop: '4px'}}>This is the google search results based on the keywords extracted from the above question</p>
                {keywordSimilarityScore === "Calculating similarity score..." ? 
                 <p style={{fontSize: '18px',paddingTop:'12px', color:'red'}}>Calculating similarity score...</p> : 
                 <p  style={{fontSize: '18px',paddingTop:'12px', color:'red'}}>Similarity compare with chatgptAnswer: {Math.round(keywordSimilarityScore * 100)}%</p>}
              </div>
              <br/>
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {keywordAnswer.map((item, index) => (
                  <div key={index}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{fontSize:'14px'}} >{item.title}</a>
                    <p style={{fontSize:'12px'}} dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </Grid>
        </Grid>
        </div>

        <div style={{margin: 'auto', width:'1100px', marginTop:'28px'}}>
        <Grid item xs={12}>
        <p>After checking the 2 Google results, evaluate the ChatGPT answer again</p>
         <AddRating onRatingSubmitted={handleSecondRatingSubmitted} questionNumber={num} isSubmitted={isSecondRatingSubmitted}/>
         <br/>
         <button onClick={handleNext}  disabled={!secondRatingSubmitted}>
          Next 
        </button>
        </Grid>
        </div>
        </>
      )}
     </Grid>
    </div>
  );
};

export default QuestionPage;





