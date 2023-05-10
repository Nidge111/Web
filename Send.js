const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesContainer = document.getElementById('messages');
const usernameDisplayTopRight = document.getElementById('username-display-top-right');

let username = '';

// Event listener for login button
loginButton.addEventListener('click', () => {
  const enteredUsername = usernameInput.value.trim();

  if (enteredUsername !== '') {
    username = enteredUsername;
    showChatInterface();
    displayUsername();
  }
});

// Event listener for send button
sendButton.addEventListener('click', sendMessage);

// Event listener for Enter key press in message input
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function showChatInterface() {
  document.getElementById('login-container').style.display = 'none';
  chatContainer.style.display = 'block';
}

function displayUsername() {
  usernameDisplayTopRight.textContent = username;
}

function sendMessage() {
  const message = messageInput.value.trim();

  if (message !== '') {
    const data = {
      username: username,
      message: message
    };

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          messageInput.value = '';
          retrieveMessages();
        } else {
          console.error('Failed to send message:', result.error);
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }
}


function retrieveMessages() {
  fetch('/api/messages')
    .then(response => response.json())
    .then(messages => {
      // Clear the chat container
      messagesContainer.innerHTML = '';

      // Render each message in the chat container
      messages.forEach(message => {
        renderMessage(message.username, message.message);
      });

      // Remove messages after 20 seconds
      setTimeout(() => {
        const currentTime = new Date().getTime(); // Get current timestamp in milliseconds

        // Filter and remove messages older than 20 seconds
        const filteredMessages = messages.filter(message => {
          const messageTime = new Date(message.timestamp).getTime();
          const elapsedTime = currentTime - messageTime;
          const isOldMessage = elapsedTime > 20000; // 20 seconds (in milliseconds)
          return !isOldMessage;
        });

        // Clear the chat container
        messagesContainer.innerHTML = '';

        // Render the filtered messages in the chat container
        filteredMessages.forEach(message => {
          renderMessage(message.username, message.message);
        });
      }, 5000); // 5 seconds (for testing purposes, adjust as needed)
    })
    .catch(error => {
      console.error('Error retrieving messages:', error);
    });
}


function renderMessage(username, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const usernameElement = document.createElement('span');
  usernameElement.classList.add('username');
  usernameElement.textContent = username + ": "; // Add colon after the username

  const messageTextElement = document.createElement('span');
  messageTextElement.classList.add('message-text');
  messageTextElement.textContent = message;

  messageElement.appendChild(usernameElement);
  messageElement.appendChild(messageTextElement);

  messagesContainer.appendChild(messageElement);

  // Remove message after 20 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 20000);
}

