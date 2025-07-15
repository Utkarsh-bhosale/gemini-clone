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

  //Typing Effect
  const delayPara = (index , nextWord) =>{
    setTimeout(function () {
      setResultData(prev=>prev+nextWord)
    },75*index)
  }

  const onSent = async (prompt) => {
  setResultData("");
  setLoading(true);
  setShowResult(true);
  let response;
  if(prompt !== undefined){
    response = await runChat(prompt);
    setRecentPrompt(prompt);
  }else{
    setPrevPrompts(prev=>[...prev,input])
    setRecentPrompt(input);
    response = await runChat(input);
  }
  let formattedResponse = response;

  // STEP 1: Process code blocks FIRST AND ISOLATE THEM 
  // Replace code blocks with a temporary placeholder or a unique marker
  // before processing other Markdown.
  // The 'lang' and 'code' are captured for later use.
  const codeBlocks = []; // To store processed code blocks
  formattedResponse = formattedResponse.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const languageClass = lang ? `language-${lang.toLowerCase()}` : 'language-plaintext';
    const htmlCode = `<pre><code class="${languageClass}">${code.trim()}</code></pre>`;
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
    codeBlocks.push(htmlCode); // Store the HTML code block
    return placeholder;        // Replace original with a placeholder
  });


  // STEP 2: Apply other Markdown formatting to the *rest* of the text
  // Now, the '#' inside code blocks are gone, replaced by placeholders.

  // 1. Bold formatting (**)
  formattedResponse = formattedResponse.split('**').map((text, index) => {
    return index % 2 === 1 ? `<b>${text}</b>` : text;
  }).join('');

  // 2. Line breaks (paragraphs/newlines)
  formattedResponse = formattedResponse.replace(/\n/g, "<br />");

  // 3. Headings (##, ###) - Order matters: handle longer ones first
  formattedResponse = formattedResponse.replace(/###\s*(.*?)<br \/>/g, "<h3>$1</h3>");
  formattedResponse = formattedResponse.replace(/##\s*(.*?)<br \/>/g, "<h2>$1</h2>");

  // 4. List items (*)
  formattedResponse = formattedResponse.replace(/\* (.*?)(<br \/>|$)/g, "<li>$1</li>");
  if (formattedResponse.includes("<li>")) {
    formattedResponse = "<ul>" + formattedResponse + "</ul>";
    formattedResponse = formattedResponse.replace(/<ul><br \/>/g, "<ul>").replace(/<br \/><\/ul>/g, "</ul>");
  }

  // 5. Inline code (`text`) - this was wrongly placed after code blocks in your original list.
  //    It should be before code blocks if they are processed after other markdown,
  //    but with the placeholder strategy, order here is less critical relative to code blocks.
  formattedResponse = formattedResponse.replace(/`(.*?)`/g, "<code>$1</code>");


  // STEP 3: Insert the processed code blocks back 
  codeBlocks.forEach((htmlCode, index) => {
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${index}__`;
    formattedResponse = formattedResponse.replace(placeholder, htmlCode);
  });

  // setResultData(formattedResponse); // Use finalResponse if you renamed it, otherwise formattedResponse
  let newFormattedResponse = formattedResponse.split(" ");
  for(let i = 0 ; i < newFormattedResponse.length ; i++){
    const nextWord = newFormattedResponse[i];
    delayPara(i , nextWord+" ");
  }
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