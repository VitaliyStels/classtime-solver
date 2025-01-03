document.addEventListener('DOMContentLoaded', () => {
  //const getTextButton = document.getElementById('getTextButton');
  const getDetails = document.getElementById('quizDetails');
  const fetchButton = document.getElementById('solveQuizButton');
  const setResponse = document.getElementById('response');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getDivText
      }, (results) => {
        if (results && results[0] && results[0].result) {
          getDetails.textContent = results[0].result;
        } else {
          getDetails.textContent = 'No div with the specified class found.';
        }
      });
    });



  function getDivText() {
    const title = document.querySelector('h2[data-testid="student-session-question-title"]');
    const quizAnswers = document.querySelectorAll('span[data-text="true"]');
    const answers = [];

    quizAnswers.forEach((element) => {
      answers.push(element.textContent);
    });
    if (title) {
      return `Question: ${title.textContent}\nOptions: ${answers.join(', ')}`;
    } else {
      return 'No div with the specified class found.';
    }
  }


  fetchButton.addEventListener('click', async () => {
    console.log("fetching");

    const apiKey = 'API_KEY';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const data = {
      contents: [{
        parts: [{ text: getDetails.textContent }]
      }]
    };
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      // Debug info
      console.log(data);
      console.log('...')
      console.log(data.candidates[0].content.parts[0].text);
      setResponse.textContent = data.candidates[0].content.parts[0].text;
    })
    .catch(error => {
      console.error('Error:', error);
    });  
  })
});

