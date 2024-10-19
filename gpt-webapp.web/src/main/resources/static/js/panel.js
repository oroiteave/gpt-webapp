async function fetchAndRenderChats() {
    try {
        const response = await fetch('/chat/list');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de chats');
        }
        const chatMap = await response.json();
        const chatList = document.getElementById('chatTitles');
        chatList.innerHTML = '';
        
        // Verificar si hay chats o no
        if (Object.keys(chatMap).length === 0) {
            const noChatsMessage = document.createElement('div');
            noChatsMessage.textContent = 'Aún no hay chats';
            noChatsMessage.style.color = '#ccc';
            chatList.appendChild(noChatsMessage);
        } else {
            for (const [id, title] of Object.entries(chatMap).reverse()) {
                const chatItem = document.createElement('li');
                chatItem.textContent = title; 
                chatItem.dataset.chatId = id;

                chatItem.addEventListener('click', function() {
                    openChat(id); // Llamar a la función para abrir el chat
                });

                chatList.appendChild(chatItem);
            }
        }
    } catch (error) {
        console.error('Error al renderizar los chats:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderChats);

function addChatToTop(chatId, chatTitle) {
    const chatList = document.getElementById('chatTitles');
    
    // Crear un nuevo elemento <li> para el nuevo chat
    const newChatItem = document.createElement('li');
    newChatItem.textContent = chatTitle; // Título del nuevo chat
    newChatItem.dataset.chatId = chatId; // Asignar el ID al nuevo chat
    
    // Añadir el eventListener para que se pueda abrir el chat
    newChatItem.addEventListener('click', function() {
        openChat(chatId); // Función que abre el chat (implementación personalizada)
    });

    // Insertar el nuevo chat en la parte superior de la lista
    chatList.insertBefore(newChatItem, chatList.firstChild);
}

// Función para manejar el clic en el botón "Agregar Chat"
document.getElementById('addChatBtn').addEventListener('click', function() {
	fetch('/chat/create', {
		method: 'POST',
	})
	.then(response => response.json())
	.then(chat => {
		const title = chat.title;
		const chatId = chat.id;
    	addChatToTop(chatId, title);
	}).catch(error => console.error('Error obteniendo el nuevo chat', error))
});

function openChat(chatId) {
    alert(`Abriendo chat con ID: ${chatId}`);
    //todo
}