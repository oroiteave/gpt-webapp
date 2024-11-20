async function fetchAndRenderChats() {
    try {
        const response = await fetch('/multi-gpt/chat/list');
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
    newChatItem.dataset.chatId = chatId;
    
    // Crear el span para el título
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('chat-item-title');
    titleSpan.textContent = chatTitle;
    newChatItem.appendChild(titleSpan);
    
    // Añadir el ícono de lápiz con su listener
    const editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-pencil-alt', 'edit-icon');
    editIcon.title = 'Editar chat';
    
    editIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar que se dispare el evento del li
        enableTitleEditing(newChatItem); // Activar la edición del título
    });
    
    // Crear el ícono de basura (eliminación)
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
    deleteIcon.title = 'Borrar chat';

    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        const confirmDelete = confirm(`¿Estás seguro de que deseas eliminar el chat "${chatTitle}"?`);
        if (confirmDelete) {
            deleteChat(newChatItem);
        }
    });

    newChatItem.appendChild(editIcon);
    newChatItem.appendChild(deleteIcon);

    newChatItem.addEventListener('click', function() {
		fetch(`/multi-gpt/chat/${chatId}/title`)
		.then(response => response.text())
		.then(title => {
	        openChat(chatId, title);
		}).catch(error =>{console.error('El id del chat no existe: ',error)});
    });

    chatList.insertBefore(newChatItem, chatList.firstChild);
}


function deleteChat(chatItem) {
    const chatId = chatItem.dataset.chatId;
    chatItem.remove();

	fetch(`/multi-gpt/chat/delete?id=${chatId}`,{
		method: 'DELETE'
	}).catch(error => console.error('Error al eliminar el chat',error));
    console.log(`Chat con ID ${chatId} eliminado`);
}

document.getElementById('addChatBtn').addEventListener('click', function() {
	fetch('/multi-gpt/chat/create', {
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
    const titleSpan = chatItem.querySelector('span');
    const currentTitle = titleSpan.textContent.trim();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.classList.add('edit-title-input');
    input.maxLength = 20;

    // Reemplazar el titleSpan con el input
    chatItem.replaceChild(input, titleSpan);

    let updated = false; // Bandera para evitar múltiples actualizaciones

    function updateTitleIfNeeded() {
        if (updated) return; // Si ya se actualizó, no hacer nada
        updated = true;
        const newTitle = input.value.trim();
        if (newTitle) {
            updateChatTitle(chatItem, newTitle);
        } else {
            alert('El título no puede estar vacío');
            // Opcional: Revertir al título original si está vacío
            const originalTitleSpan = document.createElement('span');
            originalTitleSpan.textContent = currentTitle;
            chatItem.replaceChild(originalTitleSpan, input);
        }
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            updateTitleIfNeeded();
        }
    });

    input.addEventListener('blur', function() {
        updateTitleIfNeeded();
    });

    input.focus();
}

function updateChatTitle(chatItem, newTitle) {
    const input = chatItem.querySelector('input');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = newTitle;
    titleSpan.classList.add('chat-item-title');

    if (input && chatItem.contains(input)) {
        // Reemplazar el input con el titleSpan
        chatItem.replaceChild(titleSpan, input);
    } else {
        // Si por alguna razón el input no existe, actualizamos el span existente
        const existingTitleSpan = chatItem.querySelector('span');
        if (existingTitleSpan) {
            existingTitleSpan.textContent = newTitle;
        } else {
            chatItem.insertBefore(titleSpan, chatItem.firstChild);
        }
    }

    // Actualizar el título en el backend
    const params = new URLSearchParams();
    params.append("title", newTitle);
    params.append("chatId", chatItem.dataset.chatId);
    
    fetch('/multi-gpt/chat/title', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    }).then(() => {
        const headerTitle = document.getElementById(`chat-title-${chatItem.dataset.chatId}`);
        if (headerTitle) {
            headerTitle.textContent = newTitle;
        } else {
            console.warn(`No se encontró el elemento con ID chat-title-${chatItem.dataset.chatId}`);
        }
        console.log(`Chat con ID ${chatItem.dataset.chatId} actualizado a: ${newTitle}`);
    }).catch(error => console.error('Error actualizando el título:', error));
}

document.querySelectorAll('.edit-icon').forEach(function(editIcon) {
    const chatItem = editIcon.closest('li');
    editIcon.addEventListener('click', function() {
        enableTitleEditing(chatItem);
    });
});