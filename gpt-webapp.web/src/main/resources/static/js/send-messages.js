let isSendingMessage = false;
function sendMessage(chatId) {
    const userMessageInput = document.getElementById(`chat-input-${chatId}`);
    const messageText = userMessageInput.value.trim();
    
    if (isSendingMessage || messageText === '') return;

    // Bloquear el envío de nuevos mensajes
    isSendingMessage = true;
    
    const params = new URLSearchParams();
    params.append("message",messageText);
    params.append("chatId",chatId);
    
    if (messageText !== '') {
        userMessageInput.value = '';
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
	        isSendingMessage = false;
		}).catch(error => {console.error('Error fetching the test', error)
			isSendingMessage = false;
		});
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

function setupMessageListeners(chatId) {
    const messageInput = document.getElementById(`chat-input-${chatId}`);
    const sendButton = messageInput.nextElementSibling; // Suponiendo que el botón es el siguiente hermano

    // Evento para enviar el mensaje al hacer clic en el botón
    sendButton.addEventListener('click', function() {
        sendMessage(chatId);
    });

    // Evento para enviar el mensaje al presionar "Enter"
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage(chatId);
        }
    });
}