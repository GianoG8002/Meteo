async function coords() {
    const city = document.getElementById('city').value;
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&format=json&addressdetails=1&limit=1`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data && data.length > 0) {
            latitudine = parseFloat(data[0].lat);
            longitudine = parseFloat(data[0].lon);
            fetchWeatherData(latitudine, longitudine)
        }
    } catch (error) {
        alert('An error occurred. Please try again.');
    }
}

function getWeatherDescription(code) {
    const weatherMap = {
        0: 'Sereno',
        1: 'Prevalentemente sereno',
        2: 'Parzialmente nuvoloso',
        3: 'Nuvoloso',
        45: 'Nebbia',
        48: 'Nebbia con formazione di brina',
        51: 'Pioviggine: Intensità leggera',
        53: 'Pioviggine: Intensità moderata',
        55: 'Pioviggine: Intensità densa',
        56: 'Pioviggine gelata: Intensità leggera',
        57: 'Pioviggine gelata: Intensità densa',
        61: 'Pioggia: Intensità leggera',
        63: 'Pioggia: Intensità moderata',
        65: 'Pioggia: Intensità forte',
        66: 'Pioggia gelata: Intensità leggera',
        67: 'Pioggia gelata: Intensità forte',
        71: 'Neve: Intensità leggera',
        73: 'Neve: Intensità moderata',
        75: 'Neve: Intensità forte',
        77: 'Grani di neve',
        80: 'Rovesci di pioggia: Intensità leggera',
        81: 'Rovesci di pioggia: Intensità moderata',
        82: 'Rovesci di pioggia: Intensità violenta',
        85: 'Rovesci di neve: Intensità leggera',
        86: 'Rovesci di neve: Intensità forte',
        95: 'Temporale: Leggero o moderato',
        96: 'Temporale con grandine leggera',
        99: 'Temporale con grandine forte'
    };
    return weatherMap[code] || 'Errore';
}

async function fetchWeatherData(lat, long) {
    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=14`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.daily) {
            displayWeatherData(data.daily);
        } else {
            alert('Errore di connessione con Open-Meteo.');
        }
    } catch (error) {
        console.error('Errore di connessione con Open-Meteo:', error);
    }
}

function displayWeatherData(dailyData) {
    document.getElementById('forecast').style = 'gap: 1rem;';

    const { temperature_2m_max, temperature_2m_min, precipitation_sum, weather_code, time } = dailyData;

    const forecastContainer = document.getElementById('forecast');
    const days = 10;

    forecastContainer.innerHTML = ``;
    
    for (let i = 0; i < days; i++) {
        const date = new Date(time[i]);
        const dayName = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

        const maxTemp = temperature_2m_max[i];
        const minTemp = temperature_2m_min[i];
        const precip = precipitation_sum[i];
        const weather = getWeatherDescription(weather_code[i]);

        forecastContainer.innerHTML += `
            <div class="row" style="background: #eef1f3; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h3 style="margin-top: 0; text-align: center; color: darkred;">${dayName}</h3>
                <p>Max Temp: <span style="font-weight: bold;">${maxTemp}°C</span></p>
                <p>Min Temp: <span style="font-weight: bold;">${minTemp}°C</span></p>
                <p>Precipitazioni: <span style="font-weight: bold;">${precip} mm</span></p>
                <p>Meteo: <span style="font-weight: bold;"><br>${weather}</span></p>
            </div>
            <div class='row' style='height=2rem'>
                <p></p>
            </div>
        `;
    }
}