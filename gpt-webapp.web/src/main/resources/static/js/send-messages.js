function sendMessage(chatId) {
    const userMessageInput = document.getElementById(`chat-input-${chatId}`);
    const messageText = userMessageInput.value.trim();
    const params = new URLSearchParams();
    params.append("message",messageText);
    
    if (messageText !== '') {
        // Agregar el mensaje del usuario al chat
        addMessageToChat(messageText, 'user',chatId);

        fetch('/messages/test', {
		method: 'POST',
		headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		body: params.toString()
		})
		.then(response => response.text())
		.then(data => {
			addMessageToChat(data, 'bot',chatId);
		}).catch(error => console.error('Error fetching the test', error));

        userMessageInput.value = ''; // Limpiar el campo de texto
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

document.getElementById('userMessage').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
});
