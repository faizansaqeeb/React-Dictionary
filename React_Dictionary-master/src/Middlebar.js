import React,{useEffect, useState} from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './Middlebar.css'
import SearchIcon from '@material-ui/icons/Search';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
function Middlebar(props) {
    const [wordtosearch, setwordtosearch]=useState('')
    const[wordfound,setwordfound]=useState(true)
    const[searchclicked, setsearchclicked]=useState(false)
    const[formresponsedata,setformresponsedata]=useState([])
    const[wordvocabhistory,setwordvocabhistory]=useState([])
    useEffect(() => {
      async function fetchData() {
          const req = await axios.get("http://localhost:8001/getwordhistory/"+props.useremail)
          setwordvocabhistory(req.data)
      }
      fetchData();
    }, []);
    //onst[wordvocabhistory,setwordvocabhistory]=useState([])
    /*axios.get("http://localhost:8001/getwordhistory/"+props.useremail).then(res=>
      setwordvocabhistory(res.data)
    )*/
    const handlesubmit=(event)=>{
      setsearchclicked(true)
      event.preventDefault()
      console.log("Enterd handlesubmit")
      axios.get("http://localhost:8001/getwordmeaning/"+wordtosearch+"/"+props.useremail).then(res=>{
      console.log(res.data)
      setformresponsedata(res.data)
      {if(res.data !="Word not found"){
        var iswordinwordvocab=false
        wordvocabhistory.map(wordvocab=>{
          if(wordvocab.word==wordtosearch){
            iswordinwordvocab=true
          }
        })
        if(iswordinwordvocab==false){
          const newwordvocabhistory=wordvocabhistory.concat({_id:uuidv4(),word:wordtosearch});
          setwordvocabhistory(newwordvocabhistory)
        }
      }
    }
    }
      )
 
    }
    const handlechange=(event)=>{
      setwordtosearch(event.target.value)
    }
    const displaymeaning=()=>{
      if(searchclicked==true){
        if(wordfound==false){
          return(
            <h1>Word not found</h1>
          )
        }
      }
    }
  
    return (
       
      <div className="middlebar">
        <div className="search_bar">
          <p style={{textAlign:"center"}}><h2>Enter word to search</h2></p>
          <div className="form_division">
            <form  onSubmit={handlesubmit}>
              <input className="form_input" type="text"  onChange={handlechange}/>
            </form>
           <button className="form_button" onClick={handlesubmit}><SearchIcon/></button>
          </div>
          
        
        {searchclicked?
        //console.log(formresponsedata)
        <Displaymeaning respdata={formresponsedata}/>
        :
        <h1></h1>
        }
      </div>












      <div className="words_search">
        <h1 style={{textAlign:"center"}}>Your Words</h1>
        {wordvocabhistory.map((vocabword) =>{
          const capitalword= vocabword.word.charAt(0).toUpperCase() + vocabword.word.slice(1)
          return(
            <div className="words_search_wordbox">
          <h2>{capitalword}</h2>
          </div>
          )
        })}
      </div>
        </div>
    )
}

function Displaymeaning(props){
  {
    if(props.respdata.length==0){
      return(
        <h1></h1>
      )
    }
  }

 { if (props.respdata=="Word not found"){
    return(
      <h1>Word not found</h1>
    )
      
      
  }
  else{
    {if(props.respdata.length!=0){
      const audio=new Audio(props.respdata.audiolink)
    return(
      <div className="word_responsediv">
    <h1 style={{paddingLeft:"10px"}}>{props.respdata.word}</h1>
    <h1 style={{paddingLeft:"10px"}}>{props.respdata.wordtext}</h1>
    <button className="word_responsediv_play" onClick={()=>{audio.play()}}><VolumeUpIcon/></button>
    {props.respdata.meanings.map(meaning =>{
      return(
      <div className="word_responsediv_meaning">
      <h2>{meaning.partOfSpeech}</h2>
      {meaning.definitions.map(definition=>{
        return(
          <div className="word_responsediv_definition">
        <h3>Definition</h3>
        <h3 style={{paddingLeft:"10px"}}>{definition.definition}</h3>
        <h3>Example</h3>
        <h3 style={{paddingLeft:"10px"}}>{definition.example}</h3>
        </div>
        )
      })}
      {console.log(meaning.definitions)}
      </div>)
    })

    }
    </div>
    )
  }
}

  }
}

}


    


export default Middlebar
