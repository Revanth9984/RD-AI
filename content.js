// Extracts all text from the page
function extracttext(){
    return document.body.innerText;
}

// Listen for messages from the popup or background
chrome.runtime.onMessage.addListener((request,sender,sendResponse) =>{
    if(request.action==="getPageText"){
        const text=extracttext();
        sendResponse({pageText: text});
    }
})