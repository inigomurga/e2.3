const apiKey = 'f90c95373eae09403ee16df62d24d5cd'; // Asegúrate de que esta clave sea válida

document.getElementById('getWeather').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Por favor, ingresa una ciudad.');
    }
});

function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log('URL generada:', url); // Verifica la URL generada

    fetch(url)
        .then(response => {
            console.log('Estado de la respuesta:', response.status); // Verifica el estado de la respuesta
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Clave de API inválida o no autorizada.');
                } else if (response.status === 404) {
                    throw new Error('Ciudad no encontrada.');
                } else {
                    throw new Error('Error al obtener los datos del clima.');
                }
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verifica los datos recibidos
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error:', error.message); // Muestra el error en la consola
            document.getElementById('weather').innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const city = data.name;

    weatherDiv.innerHTML = `
        <h2>Pronóstico para ${city}</h2>
        <p>Temperatura: ${temperature} °C</p>
        <p>Descripción: ${description}</p>
    `;
}