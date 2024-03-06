var userInput = document.getElementById('user-input').value;
var responseContainer = document.getElementById('response-container');
let voice_text = ""

const button = document.querySelector('button');
const voiceIcon = document.getElementById('voice-icon');


// Check if the browser supports speech recognition
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

  // Enable the microphone icon
  voiceIcon.classList.add('active');

  // Create a new SpeechRecognition instance
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  // Set the properties for speech recognition
  recognition.lang = 'en-US'; // Specify the language
  recognition.continuous = false; // Stop listening when speech ends

  // Add an event listener to the voice icon
  voiceIcon.addEventListener('click', () => {
    // Start speech recognition when the icon is clicked
    recognition.start();
  });

  // Add an event listener for the recognition result
  recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript; // Get the recognized transcript
  let value  = "";


    value = transcript;
    
     voice_text = value;

    console.log(voice_text,"voice")
    // Set the input value to the recognized transcript
    button.click(); // Trigger the click event on the "Add" button
  });
  // Add an event listener for errors
  recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
  });
} else {
  // Disable the microphone icon if speech recognition is not supported
  voiceIcon.classList.add('disabled');
}


async function sendMessage() {
    try {
        var userInput = document.getElementById('user-input').value;

        if(voice_text.length > 0 ){

          userInput = voice_text
        }


        var responseContainer = document.getElementById('response-container');

        // Display user message
        var userMessage = document.createElement('div');
        userMessage.className = 'message user-message';
        var userMessageContent = document.createElement('div');
        userMessageContent.className = 'message-content';
        userMessageContent.textContent = userInput;
        userMessage.appendChild(userMessageContent);
        responseContainer.appendChild(userMessage);

        // Make a request to your local server
        let response = await fetch('https://frightened-yoke-bass.cyclic.app/api/chatgpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apiKey:  "MM0z6E72hycTCeUFUp68HTkAn4D3",
                messages: [{ role: 'user', content: userInput }],
            }),
        });

        let { data } = await response.json();
        console.log('API Response:', data);

        // Display bot response with typing animation
        var botResponse = document.createElement('div');
        botResponse.className = 'message bot-message';
        var botResponseContent = document.createElement('div');
        botResponseContent.className = 'message-content typing-animation';

        // Start typing animation
        async function typeAnimation() {
            for (let i = 0; i < data.output.content.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 20)); // Adjust the timeout for speed
                botResponseContent.textContent += data.output.content[i];
            }
        }

        // Trigger typing animation
        typeAnimation();

        botResponse.appendChild(botResponseContent);
        responseContainer.appendChild(botResponse);

        // Remove older messages if the count exceeds 10
        var messages = responseContainer.getElementsByClassName('message');
        if (messages.length > 10) {
            responseContainer.removeChild(messages[0]);
        }

        // Clear user input
        document.getElementById('user-input').value = '';

        // Scroll to the bottom of the response container
        responseContainer.scrollTop = responseContainer.scrollHeight;
    } catch (error) {
        console.error('Error:', error);
    }
}

