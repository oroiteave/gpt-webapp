function sendMessage(chatId) {
    const userMessageInput = document.getElementById(`chat-input-${chatId}`);
    const messageText = userMessageInput.value.trim();
    const params = new URLSearchParams();
    params.append("message",messageText);
    params.append("chatId",chatId);
    
    if (messageText !== '') {
        // Agregar el mensaje del usuario al chat
        addMessageToChat(messageText, 'user',chatId);

        fetch('/messages/sendPrompt', {
		method: 'POST',
		headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		body: params.toString()
		})
		.then(response => response.text())
		.then(data => {
			addMessageToChat(data, 'assistant',chatId);
		}).catch(error => console.error('Error fetching the test', error));

        userMessageInput.value = '';
    }
}

function addMessageToChat(message, sender,chatId) {
    const chatMessages = document.getElementById(`chat-messages-${chatId}`);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);

    // Scroll automático hacia abajo para ver el último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}