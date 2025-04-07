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
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
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
    const mapDiv = document.getElementById('map');
    const city = data.city.name;
    const { lat, lon } = data.city.coord;

    let forecastHTML = `<h2>Pronóstico para ${city}</h2>`;
    for (let i = 0; i < data.list.length; i += 8) { // Cada 8 registros equivale a 24 horas
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;

        forecastHTML += `
            <div>
                <h3>${date}</h3>
                <p>Temperatura: ${temperature} °C</p>
                <p>Descripción: ${description}</p>
            </div>
        `;
    }

    weatherDiv.innerHTML = forecastHTML;

    // Generar el mapa interactivo
    mapDiv.innerHTML = `
        <h2>Mapa Interactivo</h2>
        <iframe
            src="https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=${lat}&lon=${lon}&zoom=8"
            width="100%"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy">
        </iframe>
    `;
}