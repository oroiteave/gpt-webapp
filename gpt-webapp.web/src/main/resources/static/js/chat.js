function openChat(chatId,chatTitle) {
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
    newChatContainer.style.position = 'absolute'; // Necesario para que se pueda arrastrar

    // Crear el header del chat
    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat-header');
    
    
    const modelSelector = document.createElement('select');
    modelSelector.classList.add('model-selector');
    modelSelector.title = 'Selecciona el modelo';

    // Opciones del selector de modelos
    const models = ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini','gpt-4-turbo'];
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelector.appendChild(option);
    });

    // Evento para manejar el cambio de modelo
    modelSelector.addEventListener('change', function() {
		const params = new URLSearchParams();
		params.append("model",modelSelector.value);
		params.append("chatId",chatId);
        fetch('/chat/model', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
	        body: params.toString()
		})
		.catch(error => {
			console.error("Error al cambiar el modelo: ",error);
		});
        
    });

    // Añadir el selector de modelos al header (a la izquierda)
    chatHeader.appendChild(modelSelector);
    
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('chat-title');
    headerTitle.textContent = `${chatTitle}`;
    chatHeader.appendChild(headerTitle);
    
    // Crear el ícono de cerrar (X)
    const closeButton = document.createElement('i');
    closeButton.classList.add('fas', 'fa-times', 'close-chat');
    closeButton.title = 'Cerrar chat';
    
    // Evento para cerrar el chat
    closeButton.addEventListener('click', function() {
        closeChat(chatId);
    });
    
    // Añadir el botón de cerrar al header
    chatHeader.appendChild(closeButton);
    
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

    // Evento para enviar el mensaje al hacer clic en el botón
    sendButton.addEventListener('click', function() {
        sendMessage(chatId);
    });

    // Evento para enviar el mensaje al presionar "Enter"
    chatInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage(chatId);
        }
    });

    chatInputWrapper.appendChild(chatInput);
    chatInputWrapper.appendChild(sendButton);
    newChatContainer.appendChild(chatInputWrapper);

    // Añadir el nuevo contenedor de chat al chat-containers-wrapper
    chatContainersWrapper.appendChild(newChatContainer);
    
    centerChat(newChatContainer);

    // Aplicar la funcionalidad de arrastre a este nuevo contenedor
    addDragFeatureToAllChats();
    
    fetch(`/chat/${chatId}/model`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener el modelo del chat con ID ${chatId}`);
            }
            return response.text(); // El modelo se devuelve como texto plano
        })
        .then(model => {
            if (models.includes(model)) {
                modelSelector.value = model; // Seleccionar el modelo correcto en el selector
                console.log(`Modelo cargado desde el backend para el chat ${chatId}: ${model}`);
            } else {
                console.warn(`El modelo "${model}" no está en la lista de opciones.`);
            }
        })
        .catch(error => {
            console.error('Error al cargar el modelo: ', error);
        });

    // (Opcional) Aquí puedes hacer una petición para obtener los mensajes del chat y cargarlos
    loadMessages(chatId);
}

function centerChat(chatContainer) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const chatWidth = chatContainer.offsetWidth;
    const chatHeight = chatContainer.offsetHeight;

    // Calcular la posición para centrar el chat
    const left = (windowWidth - chatWidth) / 2;
    const top = (windowHeight - chatHeight) / 2;

    // Aplicar la posición centrada al chat
    chatContainer.style.left = `${left}px`;
    chatContainer.style.top = `${top}px`;
}
// Función para cerrar el chat
function closeChat(chatId) {
    const chatContainer = document.getElementById(`chat-container-${chatId}`);
    if (chatContainer) {
        chatContainer.remove(); // Elimina el contenedor del chat de la interfaz
        console.log(`Chat con ID ${chatId} cerrado.`);
    }
}


function loadMessages(chatId) {
    const chatMessages = document.getElementById(`chat-messages-${chatId}`);
    
	fetch(`/messages/${chatId}/getMessages`)
	.then(response => response.json())
	.then(messages => {
	    chatMessages.textContent = '';
		messages.forEach(message => {
	    const newMessage = document.createElement('div');
		newMessage.textContent = message.content;
		newMessage.classList.add('message',message.role);
	    chatMessages.appendChild(newMessage);
	});	
	}).catch(error => console.error('Error al cargar los mensajes: ', error));
}