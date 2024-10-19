const chatContainer = document.getElementById('chatContainer');
const chatHeader = document.getElementById('chatHeader');

let isDragging = false;
let offsetX = 0, offsetY = 0;

chatHeader.addEventListener('mousedown', function(e) {
    isDragging = true;

    // Obtener el rectángulo del contenedor
    const rect = chatContainer.getBoundingClientRect();

    // Calcular el offset entre el cursor y la esquina superior izquierda del contenedor
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Cambiar el cursor a modo "arrastrar"
    chatContainer.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        // Calcular la nueva posición del contenedor
        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        // Mover el contenedor a la nueva posición
        chatContainer.style.left = `${newLeft}px`;
        chatContainer.style.top = `${newTop}px`;
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    chatContainer.style.cursor = 'default';  // Restablecer el cursor
});