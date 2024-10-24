function openChat(chatId, chatTitle) {
    const chatContainersWrapper = document.getElementById('chatContainersWrapper');

    if (document.getElementById(`chat-container-${chatId}`)) {
        alert(`${chatTitle} ya está abierto.`);
        return;
    }

    const models = ['gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'];

    const newChatContainer = createChatContainer(chatId);
    

    const { chatHeader, modelSelector } = createChatHeader(chatId, chatTitle, models);
    newChatContainer.appendChild(chatHeader);

    const chatMessages = createChatMessagesArea(chatId);
    newChatContainer.appendChild(chatMessages);

    const chatInputWrapper = createChatInputArea(chatId);
    newChatContainer.appendChild(chatInputWrapper);

    chatContainersWrapper.appendChild(newChatContainer);
    addResizeHandles(newChatContainer);
    addResizeFeatureToChat(newChatContainer);

    centerChat(newChatContainer);

    addDragFeatureToAllChats();

    loadChatModel(chatId, modelSelector, models);

    setupMessageListeners(chatId);

    loadMessages(chatId);
}

function createChatContainer(chatId) {
    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    chatContainer.id = `chat-container-${chatId}`; // Asignar un ID único basado en el chatId
    chatContainer.style.position = 'absolute'; // Necesario para que se pueda arrastrar
    return chatContainer;
}

function addResizeFeatureToChat(chatContainer) {
    const resizers = chatContainer.querySelectorAll('.resizer');
    let originalWidth = 0;
    let originalHeight = 0;
    let originalX = 0;
    let originalY = 0;
    let originalMouseX = 0;
    let originalMouseY = 0;

    resizers.forEach(function(resizer) {
        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar conflictos con el arrastre

            originalWidth = parseFloat(getComputedStyle(chatContainer, null).getPropertyValue('width').replace('px', ''));
            originalHeight = parseFloat(getComputedStyle(chatContainer, null).getPropertyValue('height').replace('px', ''));
            originalX = chatContainer.getBoundingClientRect().left;
            originalY = chatContainer.getBoundingClientRect().top;
            originalMouseX = e.clientX;
            originalMouseY = e.clientY;

            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(e) {
                if (resizer.classList.contains('bottom-right')) {
                    const width = originalWidth + (e.clientX - originalMouseX);
                    const height = originalHeight + (e.clientY - originalMouseY);
                    chatContainer.style.width = width + 'px';
                    chatContainer.style.height = height + 'px';
                }
                else if (resizer.classList.contains('bottom-left')) {
                    const width = originalWidth - (e.clientX - originalMouseX);
                    const height = originalHeight + (e.clientY - originalMouseY);
                    chatContainer.style.width = width + 'px';
                    chatContainer.style.height = height + 'px';
                    chatContainer.style.left = originalX + (e.clientX - originalMouseX) + 'px';
                }
                else if (resizer.classList.contains('top-right')) {
                    const width = originalWidth + (e.clientX - originalMouseX);
                    const height = originalHeight - (e.clientY - originalMouseY);
                    chatContainer.style.width = width + 'px';
                    chatContainer.style.height = height + 'px';
                    chatContainer.style.top = originalY + (e.clientY - originalMouseY) + 'px';
                }
                else if (resizer.classList.contains('top-left')) {
                    const width = originalWidth - (e.clientX - originalMouseX);
                    const height = originalHeight - (e.clientY - originalMouseY);
                    chatContainer.style.width = width + 'px';
                    chatContainer.style.height = height + 'px';
                    chatContainer.style.left = originalX + (e.clientX - originalMouseX) + 'px';
                    chatContainer.style.top = originalY + (e.clientY - originalMouseY) + 'px';
                }
                else if (resizer.classList.contains('top')) {
                    const height = originalHeight - (e.clientY - originalMouseY);
                    chatContainer.style.height = height + 'px';
                    chatContainer.style.top = originalY + (e.clientY - originalMouseY) + 'px';
                }
                else if (resizer.classList.contains('bottom')) {
                    const height = originalHeight + (e.clientY - originalMouseY);
                    chatContainer.style.height = height + 'px';
                }
                else if (resizer.classList.contains('right')) {
                    const width = originalWidth + (e.clientX - originalMouseX);
                    chatContainer.style.width = width + 'px';
                }
                else if (resizer.classList.contains('left')) {
                    const width = originalWidth - (e.clientX - originalMouseX);
                    chatContainer.style.width = width + 'px';
                    chatContainer.style.left = originalX + (e.clientX - originalMouseX) + 'px';
                }

                // Opcional: establecer dimensiones mínimas
                if (parseInt(chatContainer.style.width) < 300) {
                    chatContainer.style.width = '300px';
                }
                if (parseInt(chatContainer.style.height) < 200) {
                    chatContainer.style.height = '200px';
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }
        });
    });
}


function addResizeHandles(chatContainer) {
    const resizers = document.createElement('div');
    resizers.classList.add('resizers');

    // Crear los ocho resizers para las esquinas y lados
    const resizerPositions = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];

    resizerPositions.forEach(position => {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer', position);
        resizers.appendChild(resizer);
    });

    chatContainer.appendChild(resizers);
}

function createChatHeader(chatId, chatTitle, models) {
    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat-header');

    // Crear el selector de modelo y añadirlo al encabezado
    const modelSelector = createModelSelector(chatId, models);
    chatHeader.appendChild(modelSelector);

    // Crear el título del chat y añadirlo al encabezado
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('chat-title');
    headerTitle.id = `chat-title-${chatId}`;
    headerTitle.textContent = chatTitle;
    chatHeader.appendChild(headerTitle);

    // Crear el botón de cerrar y añadirlo al encabezado
    const closeButton = createCloseButton(chatId);
    chatHeader.appendChild(closeButton);

    // Retornar el encabezado y el selector de modelo para uso posterior
    return { chatHeader, modelSelector };
}

function createModelSelector(chatId, models) {
    const modelSelector = document.createElement('select');
    modelSelector.classList.add('model-selector');
    modelSelector.title = 'Selecciona el modelo';

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelector.appendChild(option);
    });

    modelSelector.addEventListener('change', function () {
        const params = new URLSearchParams();
        params.append("model", modelSelector.value);
        params.append("chatId", chatId);
        fetch('/chat/model', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        })
        .catch(error => {
            console.error("Error al cambiar el modelo: ", error);
        });
    });

    return modelSelector;
}

function createCloseButton(chatId) {
    const closeButton = document.createElement('i');
    closeButton.classList.add('fas', 'fa-times', 'close-chat');
    closeButton.title = 'Cerrar chat';

    closeButton.addEventListener('click', function () {
        closeChat(chatId);
    });

    return closeButton;
}

function createChatMessagesArea(chatId) {
    const chatMessages = document.createElement('div');
    chatMessages.classList.add('chat-messages');
    chatMessages.id = `chat-messages-${chatId}`;
    chatMessages.textContent = 'Cargando mensajes...'; // Aquí puedes cargar los mensajes reales
    return chatMessages;
}

function createChatInputArea(chatId) {
    const chatInputWrapper = document.createElement('div');
    chatInputWrapper.classList.add('chat-input');

    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.placeholder = 'Escribe un mensaje...';
    chatInput.id = `chat-input-${chatId}`;

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Enviar';

    chatInputWrapper.appendChild(chatInput);
    chatInputWrapper.appendChild(sendButton);

    return chatInputWrapper;
}

function loadChatModel(chatId, modelSelector, models) {
    fetch(`/chat/${chatId}/model`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener el modelo del chat con ID ${chatId}`);
            }
            return response.text();
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
}

function centerChat(chatContainer) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const chatWidth = chatContainer.offsetWidth;
    const chatHeight = chatContainer.offsetHeight;

    const left = (windowWidth - chatWidth) / 2;
    const top = (windowHeight - chatHeight) / 2;

    chatContainer.style.left = `${left}px`;
    chatContainer.style.top = `${top}px`;
}

function closeChat(chatId) {
    const chatContainer = document.getElementById(`chat-container-${chatId}`);
    if (chatContainer) {
        chatContainer.remove();
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
		    addMessageToChat(message.content, message.role, chatId);
		});	
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}).catch(error => console.error('Error al cargar los mensajes: ', error));
}