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

    // Evitar que el clic en el ícono de lápiz abra el chat
    editIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Evitar que se dispare el evento del li
        enableTitleEditing(newChatItem); // Activar la edición del título
    });

    newChatItem.appendChild(editIcon);

    newChatItem.addEventListener('click', function() {
        openChat(chatId); // Abrir el chat cuando se hace clic en el título
    });

    chatList.insertBefore(newChatItem, chatList.firstChild);
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
    // Obtener el ID del chat
    const chatId = chatItem.dataset.chatId;
    
    // Obtener el título actual del chat
    const currentTitle = chatItem.firstChild.textContent.trim();
    
    // Crear un input para editar el título
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.classList.add('edit-title-input');

    // Reemplazar el título por el input
    chatItem.innerHTML = '';
    chatItem.appendChild(input);

    // Al presionar "Enter", guardar el nuevo título
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

    // Cuando el input pierda el foco, también guardar el título
    input.addEventListener('blur', function() {
        const newTitle = input.value.trim();
        
        if (newTitle) {
            updateChatTitle(chatItem, newTitle);
        } else {
            alert('El título no puede estar vacío');
        }
    });

    // Enfocar el input para que el usuario pueda comenzar a editar inmediatamente
    input.focus();
}

// Función para actualizar el título del chat en la UI y backend
function updateChatTitle(chatItem, newTitle) {
    // Restaurar el título en el <li> y volver a mostrar el icono de lápiz
    chatItem.innerHTML = `${newTitle} <i class="fas fa-pencil-alt edit-icon" title="Editar chat"></i>`;

    // Añadir nuevamente el eventListener al icono de lápiz
    chatItem.querySelector('.edit-icon').addEventListener('click', function() {
        enableTitleEditing(chatItem);
    });

    // Aquí puedes hacer una petición al backend para actualizar el título en la base de datos
    const params = new URLSearchParams();
    params.append("title",newTitle);
    params.append("chatId",chatItem.dataset.chatId);
    fetch('/chat/title',{
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	})
    console.log(`Chat con ID ${chatItem.dataset.chatId} actualizado a: ${newTitle}`);
}

// Añadir eventListeners a todos los iconos de edición existentes
document.querySelectorAll('.edit-icon').forEach(function(editIcon) {
    const chatItem = editIcon.closest('li'); // El <li> correspondiente al chat
    editIcon.addEventListener('click', function() {
        enableTitleEditing(chatItem); // Activar la edición
    });
});

function openChat(chatId) {
    alert(`Abriendo chat con ID: ${chatId}`);
    //todo
}