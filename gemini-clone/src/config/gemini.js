const runChat = async (prompt) => {
  const res = await fetch("http://localhost:3000/ask" , {
    method:"POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({prompt})
  })

  const data = await res.json();
  const response = data.response;
  console.log(response)
  return response;
}

export default runChat;