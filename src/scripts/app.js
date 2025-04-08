const apiKey = 'f90c95373eae09403ee16df62d24d5cd';

document.getElementById('weather').style.display = 'none';

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

    fetch(url)
        .then(response => {
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
            displayWeather(data);
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p style="color: red;">${error.message}</p>`;
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const mapDiv = document.getElementById('map');
    const downloadButton = document.getElementById('downloadCsv');
    const recipientEmailInput = document.getElementById('recipientEmail');
    const sendEmailButton = document.getElementById('sendEmail');
    const city = data.city.name;
    const { lat, lon } = data.city.coord;

    weatherDiv.style.display = 'block';
    mapDiv.style.display = 'block';

    let forecastHTML = `<h2>Pronóstico para ${city}</h2><div class="forecast-container">`;
    const forecastData = [];

    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        const temperature = forecast.main.temp;
        const description = forecast.weather[0].description;

        forecastHTML += `
            <div class="forecast-item">
                <h3>${date}</h3>
                <p>Temperatura: ${temperature} °C</p>
                <p>Descripción: ${description}</p>
            </div>
        `;

        forecastData.push({ Fecha: date, Temperatura: `${temperature} °C`, Descripción: description });
    }
    forecastHTML += `</div>`;

    weatherDiv.innerHTML = forecastHTML;

    downloadButton.style.display = 'inline-block';
    recipientEmailInput.style.display = 'inline-block';
    sendEmailButton.style.display = 'inline-block';

    downloadButton.onclick = () => downloadCsv(forecastData, city);
    sendEmailButton.onclick = () => sendForecastByEmail(forecastData, city);

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

function downloadCsv(data, city) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.forEach(row => {
        const values = headers.map(header => `"${row[header]}"`);
        csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pronostico-${city}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function sendForecastByEmail(data, city) {
    const recipientEmail = document.getElementById('recipientEmail').value.trim();
    const emailMessage = document.getElementById('emailMessage');

    if (!recipientEmail) {
        emailMessage.textContent = 'Por favor, ingresa un correo válido.';
        return;
    }

    const csvContent = generateCsvContent(data);

    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            recipientEmail: recipientEmail,
            subject: `Pronóstico del tiempo para ${city}`,
            text: `Adjunto encontrarás el pronóstico del tiempo para ${city}.`,
            attachment: csvContent
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al enviar el correo.');
            }
            emailMessage.style.color = 'green';
            emailMessage.textContent = `El pronóstico ha sido enviado a ${recipientEmail}.`;
        })
        .catch(error => {
            emailMessage.style.color = 'red';
            emailMessage.textContent = 'Error al enviar el correo.';
        });
}

function generateCsvContent(data) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.forEach(row => {
        const values = headers.map(header => `"${row[header]}"`);
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}