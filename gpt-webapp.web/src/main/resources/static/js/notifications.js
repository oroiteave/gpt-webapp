function showErrorNotification(errorMessage) {
    // Verifica si ya existe una notificación activa
    if (document.getElementById('custom-notification')) return;

    // Crear el contenedor de la notificación
    const notification = document.createElement('div');
    notification.id = 'custom-notification';
    notification.style.position = 'fixed';
    notification.style.top = '0';
    notification.style.left = '0';
    notification.style.width = '100vw';
    notification.style.height = '100vh';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'center';
    notification.style.alignItems = 'center';
    notification.style.zIndex = '1000';

    // Crear el contenido de la notificación
    const notificationContent = document.createElement('div');
    notificationContent.style.backgroundColor = 'white';
    notificationContent.style.borderRadius = '10px';
    notificationContent.style.padding = '20px';
    notificationContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notificationContent.style.textAlign = 'center';
    notificationContent.style.maxWidth = '400px';
    notificationContent.style.fontFamily = 'Arial, sans-serif';

    // Agregar el mensaje de error
    const errorMessageElement = document.createElement('p');
    errorMessageElement.textContent = errorMessage;
    errorMessageElement.style.color = '#FF0000';
    errorMessageElement.style.marginBottom = '20px';

    // Agregar un botón para cerrar la notificación
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#007BFF';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = () => {
        document.body.removeChild(notification);
    };

    // Ensamblar la notificación
    notificationContent.appendChild(errorMessageElement);
    notificationContent.appendChild(closeButton);
    notification.appendChild(notificationContent);
    document.body.appendChild(notification);
}