import React, { useState } from 'react';
import axios from 'axios';

const AddRating = ({ onRatingSubmitted,questionNumber, isSubmitted}) => {
  const [AccuracyRating, setAccuracyRating] = useState('');
  const [CompletenessRating, setCompletenessRating] = useState('');
  const [error, setError] = useState(null);

  const handleChangeAccuracy = (e) => {
    setAccuracyRating(Number(e.target.value));
  }

  const handleChangeCompleteness = (e) => {
    setCompletenessRating(Number(e.target.value));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

   // Check if inputs are numbers or null
    if (AccuracyRating === null || isNaN(AccuracyRating) || CompletenessRating === null || isNaN(CompletenessRating)) {
      setError("Please give a valid rating number");
      return;
    }

    // Get participantId and userId from localStorage
    let user;
    try {
      user = JSON.parse(localStorage.getItem('user'));
      //console.log(user);
    } catch (error) {
      console.error("Failed to parse user from local storage:", error);
      setError(error.message);
      return;
    }
    //console.log("User from local storage:", user);
  
    const participantId = user?.participantId;
    const userId = user?._id;
  
    const requestBody = {
      participantId,
      userId,
      accuracyRating: AccuracyRating,
      completenessRating: CompletenessRating,
      questionNumber: questionNumber
    };
    //console.log("Request body:", requestBody);
    
    try {
      const response = await axios.post('http://localhost:4000/ratings/addRating', requestBody, {
        withCredentials: true  // 让浏览器在请求中附带 cookie
      });
      console.log(response);
      if(response.data.error) {
        setError(response.data.error);
      } else {
        setError(null);
        if(response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }        
        if (onRatingSubmitted) {
          onRatingSubmitted();  // Ensure this is being called
        }
      }
    } catch (error) {
      console.error("Failed to submit rating:", error);
      console.error("Server response:", error.response);  // Log the server's response
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  } 

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{margin: 'auto', width:'1100px', marginTop:'28px'}}>
        <p style={{fontSize:'12px'}}>
        Accuracy Rating：<br />
        (1 – completely incorrect, 2 – more incorrect than correct, 3 – Approximately equal correct and incorrect, 4 – more correct than incorrect, 5 – nearly all correct, 6 – correct)
        </p>
        </div>
        <div>
         <p style={{fontSize:'12px'}}>
         Completeness Rating：<br />
          1 – incomplete, addresses some aspects of the question, but significant parts are missing or incomplete<br />
          2 – adequate, addresses all aspects of the question and provides the minimum amount of information required to be considered complete<br />
          3 – comprehensive, addresses all aspects of the question and provides additional information or context beyond what was expected
         </p>
        </div>
        <label>
          Accuracy Rating:
          <input type="number" min="1" max="6" value={AccuracyRating} onChange={handleChangeAccuracy} />
        </label>
        <label style={{margin:'6px'}}>
          Completeness Rating:
          <input type="number" min="1" max="3" value={CompletenessRating} onChange={handleChangeCompleteness} style={{margin:'px'}}/>
        </label>
        <button type="submit" style={{margin:'4px'}} disabled={isSubmitted}>Confirm</button> {/* Disable the button when the rating is submitted */}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default AddRating;

