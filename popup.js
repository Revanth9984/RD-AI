
document.addEventListener("DOMContentLoaded", () =>{
    //accessing the elements
    const questionInput= document.getElementById("textspace");
    const askbtn= document.getElementById("btn");
    const answerBox= document.getElementById("answer");

  //listen for ask button clicks
  askbtn.addEventListener("click",() =>{
    const question= questionInput.value.trim();
    if(!question){
        answerBox.textContent= "Please enter a question";
        return;
    }
    answerBox.textContent="Reading the WebPage";

     //accessing page text
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>{
        chrome.tabs.sendMessage(tabs[0].id, {action: "getPageText"}, async (response) =>{
            if(chrome.runtime.lasterror || !response){
                answerBox.textContent= "Failed to read data from page";
                return;
            }
            const pageText = response.pageText;
            answerBox.textContent="Searching the web";

            console.log(question,pageText);
            //using server to fetch answer
            try{
              const serverResponse= await fetch("https://ai-chat-box-backend.vercel.app/ask",{
                method:"POST",
                headers:{
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  question: question,
                  pageText: pageText
                })
              })
              const result= await serverResponse.json();
              if(result.answer){
                answerBox.textContent= result.answer;
              }
              else answerBox.textContent= result.error;
            }catch(err){
              console.log(err);
              answerBox.textContent= "Unable to fetch answer from server";
            }
    // try{
    //     const gptResponse= await fetch("https://api.openai.com/v1/chat/completions",{
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${OPENAI_API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         model: "gpt-3.5-turbo",
    //         messages: [
    //             {role:"system", content:"You are a helpful assistant answering questions based on webpage content."},
    //             {role:"user", content: `Page Content: ${pageText.substring(0,3000)}\n\n Question:${question}`}
    //         ],
    //         max_tokens: 512,
    //         temperature: 0.7
    //     })
    //     });
    //     //getting response from AI
    //       const result= await gptResponse.json();
    //       const AIanswer= result.choices?.[0]?.message?.content?.trim() || "No response from AI";
    //       answerBox.textContent= AIanswer;
    // }catch(error) {
    //     console.error(error);
    //     answerBox.textContent= "Error connecting to OPENAI API";
    // }

      });
    });
  });  
});  