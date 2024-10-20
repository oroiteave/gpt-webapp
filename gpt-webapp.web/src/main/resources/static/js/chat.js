function openChat(chatId) {
    const chatContainersWrapper = document.getElementById('chatContainersWrapper');

    // Verificar si ya existe un chat-container para este chat
    if (document.getElementById(`chat-container-${chatId}`)) {
        alert(`El chat con ID ${chatId} ya está abierto.`);
        return;
    }

    // Crear un nuevo contenedor para el chat
    const newChatContainer = document.createElement('div');
    newChatContainer.classList.add('chat-container');
    newChatContainer.id = `chat-container-${chatId}`; // Asignar un ID único basado en el chatId
    newChatContainer.style.position = 'absolute';

    // Crear el header del chat
    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat-header');
    chatHeader.textContent = `Chat con ID: ${chatId}`;
    newChatContainer.appendChild(chatHeader);

    // Crear el área de mensajes
    const chatMessages = document.createElement('div');
    chatMessages.classList.add('chat-messages');
    chatMessages.id = `chat-messages-${chatId}`;
    chatMessages.textContent = 'Cargando mensajes...'; // Puedes hacer una petición aquí para obtener los mensajes reales
    newChatContainer.appendChild(chatMessages);

    // Crear el input para enviar mensajes
    const chatInputWrapper = document.createElement('div');
    chatInputWrapper.classList.add('chat-input');
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'Escribe un mensaje...';
    chatInput.id = `chat-input-${chatId}`;
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Enviar';
    
    // Evento para enviar el mensaje
    sendButton.addEventListener('click', function() {
        sendMessage(chatId);
    });

    chatInputWrapper.appendChild(chatInput);
    chatInputWrapper.appendChild(sendButton);
    newChatContainer.appendChild(chatInputWrapper);

    // Añadir el nuevo contenedor de chat al chat-containers-wrapper
    chatContainersWrapper.appendChild(newChatContainer);
    
    addDragFeatureToAllChats();
    
    // (Opcional) Aquí puedes hacer una petición para obtener los mensajes del chat y cargarlos
    loadMessages(chatId);
}