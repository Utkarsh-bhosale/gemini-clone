import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input , setInput] = useState("");
  const [recentPrompt , setRecentPrompt] = useState("");
  const [prevPrompts , setPrevPrompts] = useState([]);
  const [showResult , setShowResult] = useState(false);
  const [loading , setLoading] = useState(false);
  const [resultData , setResultData] = useState("");

  const delayPara = (index , nextWord) =>{

  }

  const onSent = async (prompt) => {
  setResultData("");
  setLoading(true);
  setShowResult(true);
  setRecentPrompt(input);

  const response = await runChat(input);

  let formattedResponse = response;

  // 1. Bold formatting (**)
  formattedResponse = formattedResponse.split('**').map((text, index) => {
    return index % 2 === 1 ? `<b>${text}</b>` : text;
  }).join('');

  // 2. Line breaks (paragraphs/newlines)
  formattedResponse = formattedResponse.replace(/\n/g, "<br />");

  // 3. Headings (##, ###) - Order matters: handle longer ones first
  formattedResponse = formattedResponse.replace(/###\s*(.*?)<br \/>/g, "<h3>$1</h3>"); // Handle ###
  formattedResponse = formattedResponse.replace(/##\s*(.*?)<br \/>/g, "<h2>$1</h2>");   // Handle ##

  // 4. List items (*)
  formattedResponse = formattedResponse.replace(/\* (.*?)(<br \/>|$)/g, "<li>$1</li>"); // Replace * with <li>
  // Wrap list items in <ul> if they exist
  if (formattedResponse.includes("<li>")) {
    // This is a simple approach; for more complex scenarios, you might need to build the list iteratively
    formattedResponse = "<ul>" + formattedResponse + "</ul>";
    // Clean up any stray <br /> tags that might appear inside <ul> due to previous replacements
    formattedResponse = formattedResponse.replace(/<ul><br \/>/g, "<ul>").replace(/<br \/><\/ul>/g, "</ul>");
  }


  // 5. Inline code (`text`)
  formattedResponse = formattedResponse.replace(/`(.*?)`/g, "<code>$1</code>");

  // 6. Code blocks (```text```)
  formattedResponse = formattedResponse.replace(/```(.*?)```/gs, "<pre><code>$1</code></pre>");

  setResultData(formattedResponse);
  setLoading(false);
  setInput("");
};


  //onSent("what is react js?")

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )
}

export default ContextProvider;