import { useState } from 'react';
import './App.css';
import axios from 'axios';
import './Middlebar';
import googlelogo from './assets/googlelogo.png'
import facebooklogo from './assets/facebooklogo.png'
import app,{googleprovider,facebookprovider} from './firebase1.js'
import Middlebar from './Middlebar';
function App() {
  const [isuserloggenin, setisuserloggenin]=useState(false);
  const[useremail,setuseremail]=useState('')
  const[username,setusername]=useState('')
  const[userphoto,setuserphoto]=useState('')
  const googleloginfunc=()=>{
   
    app.auth().signInWithPopup(googleprovider).then(function(result) {
      setusername(result.user.displayName)
      setuseremail(result.user.email)
      setuserphoto(result.user.photoURL)
      setisuserloggenin(true)
      axios.get(axios.get("http://localhost:8001/createuser/"+result.user.email).then(res=>
      console.log(res.data)
    ))

    }).catch(function(error) {
     console.log(error)
    });
  }
  const facebookloginfunc=()=>{
    app.auth().signInWithPopup(facebookprovider).then(function(result) {
      console.log("Facebook Auth Successful")
      setisuserloggenin(true)
      setusername(result.user.displayName)
      setuseremail(result.user.email)
      setuserphoto(result.user.photoURL)
    console.log(result.user.email)
    
    }).catch(function(error) {
     console.log("Error")
      console.log(error)
      if(error.code==="auth/account-exists-with-different-credential"){
        alert("User with same email ID exists")
      }
      
    });
  }
  const usersignout=()=>{
    app.auth().signOut().then(function() {
      setisuserloggenin(false)
    }).catch(function(error) {
      alert("Some error occured")

    });
  }
  return (
    
    <div className="App">
      {isuserloggenin?
      <div>
      <div className="header">
        <p className="header_username">{username}</p>
        <img className="header_image" src={userphoto}/>
        <button className="header_button" onClick={usersignout}>Logout</button>
      </div>
      <Middlebar useremail={useremail}/>
      </div>
      :

      <div className="notlogged_in">
        <h1>Welcome</h1>
        <h2 style={{paddingTop:"10px"}}>Login to Go Ahead</h2>
      
         <button onClick={googleloginfunc} className="googlelogin_button">
              <img src={googlelogo} style={{width:"40px"}}/>
              <p style={{paddingLeft:"15px",fontSize:"25px"}}>Login</p>
            </button>
            <button onClick={facebookloginfunc} className="facebooklogin_button">
            <img src={facebooklogo} style={{width:"40px"}}/>
            <p  style={{paddingLeft:"15px",fontSize:"25px"}}>Login</p>
            </button>
          
        </div>
}
     
    </div>
  );
}

export default App;
