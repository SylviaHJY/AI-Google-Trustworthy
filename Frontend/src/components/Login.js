import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import useNavigate
import '../App.css';

import { 
  Card, 
  CardContent, 
  Grid
} from '@mui/material';

const Login = () => {
  const [participantId, setParticipantId] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // instantiate useNavigate

  // 在组件加载时检查登录状态
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/login', {
          withCredentials: true
        });
        if (response.data.message === 'Already logged in') {
          navigate('/answers/number/1');
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkLoginStatus();
  }, []); // 依赖数组为空，表示此effect仅在组件加载时运行

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', {
        participantId
      }, {
        withCredentials: true  // 让浏览器在请求中附带 cookie
      });
      console.log(response);
      if(response.data.error) {
        setError(response.data.error);
      } else {
        setError(null);
        if (response.data.message === 'Already logged in') {
          // Here is where you handle the case where the user is already logged in
          //setError('You are already logged in.');
          navigate('/answers/number/1');
        } else {
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          navigate('/answers/number/1');
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  }    

  return (
    <div className='App-login' style={{margin: 'auto', textAlign:'center', marginTop:'28px'}}>
    <Grid container spacing={2}>
    <Grid item xs={12}>
    <Card  
      style={{
        margin: 'auto',
        width:'500px',
        height:'600px',
        backgroundImage: "url('https://bernardmarr.com/img/What%20Is%20The%20Importance%20Of%20Artificial%20Intelligence%20(AI).png')",
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}
     >

      <CardContent style={{backgroundColor: 'rgba(255, 255, 255, 0.7)'}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label style={{textAlign:'center', marginTop:'34px'}}>
          Participant ID:
          <input type="text" 
          style={{marginLeft:'6px'}}
          value={participantId} 
          onChange={(e) => setParticipantId(e.target.value)} />
        </label>
        </div>
        <button type="submit" style={{marginTop: '6px'}}>Login</button>
      </form>
      </CardContent>
    </Card>
      </Grid>
    </Grid>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;

