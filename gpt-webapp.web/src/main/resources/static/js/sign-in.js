document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === '' || password === '') {
        alert('Por favor, completa todos los campos.');
    } else {
        // Aquí puedes manejar la lógica de envío de datos al backend para iniciar sesión
        console.log('Correo electrónico:', email);
        console.log('Contraseña:', password);
    }
});