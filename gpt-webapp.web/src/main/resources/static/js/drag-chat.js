document.addEventListener('DOMContentLoaded', function() {
    // Añadir arrastre a todos los chat-containers
    addDragFeatureToAllChats();
});

// Función que añade funcionalidad de arrastre a los nuevos chats
function addDragFeatureToAllChats() {
    const chatContainers = document.querySelectorAll('.chat-container');
    
    chatContainers.forEach(chatContainer => {
        const chatHeader = chatContainer.querySelector('.chat-header');
        
        let isDragging = false;
        let initialX = 0, initialY = 0;
        let offsetX = 0, offsetY = 0;

        chatHeader.addEventListener('mousedown', function(e) {
            isDragging = true;

            // Guardar la posición inicial del mouse
            initialX = e.clientX;
            initialY = e.clientY;

            // Obtener la posición inicial del contenedor
            offsetX = chatContainer.offsetLeft;
            offsetY = chatContainer.offsetTop;

            chatContainer.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const currentX = e.clientX;
                const currentY = e.clientY;

                // Calcular la nueva posición del contenedor
                const newLeft = offsetX + (currentX - initialX);
                const newTop = offsetY + (currentY - initialY);

                // Actualizar la posición del contenedor
                chatContainer.style.left = `${newLeft}px`;
                chatContainer.style.top = `${newTop}px`;
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            chatContainer.style.cursor = 'default';
        });
    });
}