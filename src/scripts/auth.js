document.getElementById('registerButton').addEventListener('click', () => {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (email && password) {
        registerUser(email, password);
    } else {
        document.getElementById('registerMessage').textContent = 'Por favor, completa todos los campos.';
    }
});

function registerUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        document.getElementById('registerMessage').textContent = 'El correo ya está registrado.';
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('registerMessage').style.color = 'green';
    document.getElementById('registerMessage').textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
}

document.getElementById('loginButton').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email && password) {
        authenticateUser(email, password);
    } else {
        document.getElementById('loginMessage').textContent = 'Por favor, completa todos los campos.';
    }
});

function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        document.getElementById('loginMessage').style.color = 'green';
        document.getElementById('loginMessage').textContent = 'Inicio de sesión exitoso.';
        document.getElementById('login').style.display = 'none';
        document.getElementById('register').style.display = 'none';
        document.getElementById('search').style.display = 'block'; // Mostrar el contenedor de búsqueda
    } else {
        document.getElementById('loginMessage').style.color = 'red';
        document.getElementById('loginMessage').textContent = 'Credenciales incorrectas.';
    }
}
