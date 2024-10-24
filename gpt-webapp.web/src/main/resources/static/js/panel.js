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
            for (const [id, title] of Object.entries(chatMap)) {
               addChatToTop(id,title);
            }
        }
    } catch (error) {
        console.error('Error al renderizar los chats:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndRenderChats);

function addChatToTop(chatId, chatTitle) {
    const chatList = document.getElementById('chatTitles');
    
    const newChatItem = document.createElement('li');
    newChatItem.textContent = chatTitle;
    newChatItem.dataset.chatId = chatId;
    
    // Añadir el ícono de lápiz con su listener
    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon');
    editIcon.title = 'Editar chat';
    
    // Crear el ícono de basura (eliminación)
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.title = 'Borrar chat';

    // Evitar que el clic en el ícono de lápiz abra el chat
    editIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar que se dispare el evento del li
        enableTitleEditing(newChatItem); // Activar la edición del título
    });
    
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar que se abra el chat cuando se hace clic en el ícono
        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el chat "${chatTitle}"?`);
        if (confirmDelete) {
            deleteChat(newChatItem);
        }
    });

    newChatItem.appendChild(editIcon);
	newChatItem.appendChild(deleteIcon);

    newChatItem.addEventListener('click', function() {
        openChat(chatId,chatTitle); // Abrir el chat cuando se hace clic en el título
    });

    chatList.insertBefore(newChatItem, chatList.firstChild);
}

function deleteChat(chatItem) {
    const chatId = chatItem.dataset.chatId;
    chatItem.remove();

	fetch(`/chat/delete?id=${chatId}`,{
		method: 'DELETE'
	}).catch(error => console.error('Error al eliminar el chat',error));
    console.log(`Chat con ID ${chatId} eliminado`);
}

document.getElementById('addChatBtn').addEventListener('click', function() {
	fetch('/chat/create', {
		method: 'POST'
	})
	.then(response => response.json())
	.then(chat => {
		const title = chat.title;
		const chatId = chat.id;
    	addChatToTop(chatId, title);
	}).catch(error => console.error('Error obteniendo el nuevo chat', error))
});

function enableTitleEditing(chatItem) {
    const currentTitle = chatItem.firstChild.textContent.trim();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.classList.add('edit-title-input');

    chatItem.innerHTML = '';
    chatItem.appendChild(input);

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const newTitle = input.value.trim();
            
            if (newTitle) {
                updateChatTitle(chatItem, newTitle);
            } else {
                alert('El título no puede estar vacío');
            }
        }
    });

    input.addEventListener('blur', function() {
        const newTitle = input.value.trim();
        
        if (newTitle) {
            updateChatTitle(chatItem, newTitle);
        } else {
            alert('El título no puede estar vacío');
        }
    });

    input.focus();
}

function updateChatTitle(chatItem, newTitle) {
    chatItem.textContent = '';
    

    // Crear un nodo de texto para el nuevo título
    const titleTextNode = document.createTextNode(newTitle);
    chatItem.appendChild(titleTextNode);

    // Crear el ícono de edición (lápiz)
    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon');
    editIcon.title = 'Editar chat';

    // Crear el ícono de eliminación (basura)
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.title = 'Borrar chat';

    // Añadir el listener para editar el título
    editIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        enableTitleEditing(chatItem);
    });

    // Añadir el listener para borrar el chat
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el chat "${newTitle}"?`);
        if (confirmDelete) {
            deleteChat(chatItem);
        }
    });

    // Añadir los íconos al chatItem
    chatItem.appendChild(editIcon);
    chatItem.appendChild(deleteIcon);

    // Actualizar el título en el backend
    const params = new URLSearchParams();
    params.append("title", newTitle);
    params.append("chatId", chatItem.dataset.chatId);
    
    fetch('/chat/title', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    }).then(() => {
        const headerTitle = document.getElementById(`chat-title-${chatItem.dataset.chatId}`);
        headerTitle.textContent = newTitle;
        console.log(`Chat con ID ${chatItem.dataset.chatId} actualizado a: ${newTitle}`);
    }).catch(error => console.error('Error actualizando el título:', error));
}


document.querySelectorAll('.edit-icon').forEach(function(editIcon) {
    const chatItem = editIcon.closest('li');
    editIcon.addEventListener('click', function() {
        enableTitleEditing(chatItem);
    });
});