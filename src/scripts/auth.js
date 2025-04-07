document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password) {
        authenticateUser(username, password);
    } else {
        document.getElementById('loginMessage').textContent = 'Por favor, completa todos los campos.';
    }
});

function authenticateUser(username, password) {
    const users = [
        { username: "admin", password: "1234" } // Datos de usuarios locales
    ];

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        document.getElementById('loginMessage').style.color = 'green';
        document.getElementById('loginMessage').textContent = 'Inicio de sesión exitoso.';
        document.getElementById('login').style.display = 'none';
        document.getElementById('weather').style.display = 'block';
    } else {
        document.getElementById('loginMessage').style.color = 'red';
        document.getElementById('loginMessage').textContent = 'Credenciales incorrectas.';
    }
}
