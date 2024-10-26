let isSendingMessage = {};

function sendMessage(chatId) {
    const userMessageInput = document.getElementById(`chat-input-${chatId}`);
    const messageText = userMessageInput.value.trim();
    
    if (messageText === '') return;

    if (isSendingMessage[chatId]) return;

    // Bloquear el envío de nuevos mensajes para este chat
    isSendingMessage[chatId] = true;
    
    const params = new URLSearchParams();
    params.append("message", messageText);
    params.append("chatId", chatId);
    
    userMessageInput.value = '';
    // Agregar el mensaje del usuario al chat
    addMessageToChat(messageText, 'user', chatId);

    fetch('/messages/sendPrompt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    })
    .then(response => response.text())
    .then(data => {
        addMessageToChat(data, 'assistant', chatId);
        // Desbloquear el envío de mensajes para este chat
        isSendingMessage[chatId] = false;
    })
    .catch(error => {
        console.error('Error fetching the test', error);
        // Desbloquear el envío de mensajes para este chat en caso de error
        isSendingMessage[chatId] = false;
    });
}


function addMessageToChat(message, sender, chatId) {
    const chatMessages = document.getElementById(`chat-messages-${chatId}`);
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    // Procesar el mensaje para detectar bloques de código
    const messageParts = parseMessageWithCodeBlocks(message);

    // Crear elementos para cada parte del mensaje
    messageParts.forEach(part => {
        if (part.type === 'text') {
            const textElement = document.createElement('span');
            textElement.textContent = part.content;
            messageElement.appendChild(textElement);
        } else if (part.type === 'code') {
            // Crear un contenedor para el bloque de código
            const codeContainer = document.createElement('div');
            codeContainer.classList.add('code-block');

            // Crear un encabezado para el bloque de código
            const codeHeader = document.createElement('div');
            codeHeader.classList.add('code-header');
            codeHeader.textContent = part.language ? part.language : 'Code';
            codeContainer.appendChild(codeHeader);

            const codeElement = document.createElement('pre');
            const codeContent = document.createElement('code');
            codeContent.textContent = part.content;

            // Asignar clase de lenguaje si está presente
            if (part.language) {
                codeContent.classList.add(`language-${part.language}`);
            }

            codeElement.appendChild(codeContent);
            codeContainer.appendChild(codeElement);
            messageElement.appendChild(codeContainer);

            // Aplicar resaltado de sintaxis
            hljs.highlightElement(codeContent);
        }
    });

    chatMessages.appendChild(messageElement);

    // Scroll automático hacia abajo para ver el último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para analizar el mensaje y separar texto y bloques de código
function parseMessageWithCodeBlocks(message) {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(message)) !== null) {
        // Texto antes del bloque de código
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: message.substring(lastIndex, match.index)
            });
        }

        // Bloque de código con lenguaje opcional
        parts.push({
            type: 'code',
            content: match[2],
            language: match[1] || ''
        });

        lastIndex = codeBlockRegex.lastIndex;
    }

    // Texto después del último bloque de código
    if (lastIndex < message.length) {
        parts.push({
            type: 'text',
            content: message.substring(lastIndex)
        });
    }

    return parts;
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