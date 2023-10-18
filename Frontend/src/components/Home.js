import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div>
      <div style={{margin: 'auto', width:'800px', marginTop:'28px',textAlign:'center',fontSize:'20px',fontWeight:'600', color:'#272727'}}>
       <p>This website is designed to evaluate the Accuracy & Completeness of the ChatGPT outputs through a curated, scoring-based survey</p>
      </div>
      <div style={{margin: 'auto', width:'1000px', marginTop:'24px'}}>
          <img src='https://cdn.analyticsvidhya.com/wp-content/uploads/2023/04/googleVSMicrosoft.jpeg' alt='Header Image'/>
      </div>
      <main>
          <div style={{margin: 'auto', width:'1000px', marginTop:'28px'}}>
          <p>Citation: Johnson, S.B., King, A.J., Warner, E.L., Aneja, S., Kann, B.H. and Bylund, C.L., 2023. Using ChatGPT to evaluate cancer myths and misconceptions: artificial intelligence and cancer information. JNCI cancer spectrum, 7(2), p.pkad015.</p>
          </div>
          <div style={{margin: 'auto', width:'1000px', marginTop:'28px'}}>
          <p>Thirty-three physicians across 17 specialties generated 284 medical questions that they subjectively classified as easy, medium, or hard with either binary (yes/no) or descriptive answers.
            The physicians then graded ChatGPT-generated answers to these questions for accuracy (6-point Likert scale; range 1 – completely incorrect to 6 – completely correct) and completeness (3-point Likert scale; range 1 – incomplete to 3 - complete plus additional context). </p>
          </div>
          <div style={{margin: 'auto', 
           width:'200px',
           marginTop:'28px',
           justifyContent: 'center', 
           alignItems: 'center', }}>
          <Link to='/Login'>
            <button type="button">
                Get Started
            </button>
          </Link>
          </div>
      </main>
    </div>
  );
}

export default Home;

