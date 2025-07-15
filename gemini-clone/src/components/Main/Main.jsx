import React, { useContext , useEffect} from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'


const Main = () => {

  const {onSent , recentPrompt , showResult , loading , resultData , setInput , input} = useContext(Context)

  useEffect(() => {
    // This effect runs whenever resultData, showResult, or loading changes
    if (showResult && !loading && resultData) {
      // Find all pre code blocks within the rendered result data
      // Using querySelectorAll on the entire document might be less efficient for large apps
      // For more targeted highlighting, you'd use a ref on the parent element of the new content.
      // For a chatbot, if `resultData` is just the *latest* message, it's often fine.
      document.querySelectorAll('pre code').forEach(block => {
        // Only highlight if Prism hasn't already processed it (it adds a 'token' class)
        if (!block.classList.contains('token')) {
          Prism.highlightElement(block);
        }
      });
    }
  }, [resultData, showResult, loading]); // Dependencies for useEffect

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">

        {!showResult
        ?<>
          <div className="greet">
          <p><span>Hello, Utkarsh</span></p>
          <p>How can I help you today?</p>
        </div>
        <div className="cards">
          <div className="card">
            <p>Suggest beautiful places to visit on an upcoming road trip</p>
            <img src={assets.compass_icon} alt=''/>
          </div>
          <div className="card">
            <p>Briefly summerize this concept: urban planning</p>
            <img src={assets.bulb_icon} alt=''/>
          </div>
          <div className="card">
            <p>Brainstorm team bonding activities for our work retreat</p>
            <img src={assets.message_icon} alt=''/>
          </div>
          <div className="card">
            <p>Improve the readability of the following code</p>
            <img src={assets.code_icon} alt=''/>
          </div>
        </div>
        </>
        :<div className='result'>
          <div className="result-title">
            <img src={assets.user_icon} alt="" />
            <p>{recentPrompt}</p>
          </div>
          <div className="result-data">
            <img src={assets.gemini_icon} alt="" />
            {loading
            ?<div className='loader'>
              <hr />
              <hr />
              <hr />
            </div>
           :<p dangerouslySetInnerHTML={{__html:resultData}}></p>
            }
          </div>
        </div>
        }

        <div className="main-bottom">
          <div className="search-box">
            <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here'/>
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              <img onClick={()=>onSent()} src={assets.send_icon} alt="" />
            </div>
          </div>
          <p className="bottom-info">My name is utkarsh bhosale im an engineering student studying at dypcoe</p>
        </div>
      </div>
    </div>
  )
}

export default Main