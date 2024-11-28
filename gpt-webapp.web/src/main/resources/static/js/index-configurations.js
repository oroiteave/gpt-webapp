const saveTokenBtn = document.getElementById('saveTokenBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userTokenInput = document.getElementById('userToken');

document.addEventListener('DOMContentLoaded', function () {
	fetch('/multi-gpt/user/token').then(response => {
    if (response.ok) {
        return response.text();  // Obtener el texto directamente sin analizar como JSON
    } else {
        throw new Error('Error inesperado');
    }
	}).then(data => {
	    if (data) {
	        userTokenInput.value = data;  // Usar el texto directamente
	    }
	}).catch(error => console.error('Error recibiendo el token del usuario:', error));
});

saveTokenBtn.addEventListener('click', function () {
    const userToken = userTokenInput.value;
    const params = new URLSearchParams();
    params.append("userToken",userToken);
    fetch('/multi-gpt/user/token', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
			},
        body: params.toString()
	})
    .catch(error => console.error('Error en el envío del token:', error));
    if (userToken) {
        alert('Token enviado');
    } else {
        alert('Por favor, ingresa un token.');
    }
});

logoutBtn.addEventListener('click', function () {
    location.reload();
});