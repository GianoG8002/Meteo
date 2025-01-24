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
        0: '01d',
        1: '02d',
        2: '02d',
        3: '03d',
        45: '50d',
        48: '50d',
        51: '10d',
        53: '10d',
        55: '10d',
        56: '10d',
        57: '10d',
        61: '09d',
        63: '09d',
        65: '09d',
        66: '09d',
        67: '09d',
        71: '13d',
        73: '13d',
        75: '13d',
        77: '13d',
        80: '09d',
        81: '09d',
        82: '09d',
        85: '13d',
        86: '13d',
        95: '11d',
        96: '11d',
        99: '11d'
    };
    icon = weatherMap[code]
    
    return `https://openweathermap.org/img/wn/${icon}@2x.png` || 'Errore';
}

async function fetchWeatherData(lat, long) {
    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=16`;
    
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
    const days = 16;

    forecastContainer.innerHTML = ``;
    
    for (let i = 0; i < days; i++) {
        const date = new Date(time[i]);
        const dayName = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

        const maxTemp = temperature_2m_max[i];
        const minTemp = temperature_2m_min[i];
        const precip = precipitation_sum[i];
        const weather = getWeatherDescription(weather_code[i]);

        forecastContainer.innerHTML += `
            <div class="row justify-content-center" style="background: #eef1f3; padding: 15px; border-radius: 1rem; align-items: center;">
                <div class="col" style="background-color: #fff; border-radius: 3rem;">
                    <h3 style="margin-top: 1rem; text-align: center; color: darkred;">${dayName}</h3>
                    <img src="${weather}" style="filter: brightness(.85);">
                </div>
                <div class="col">
                    <p>Max Temp: <span style="font-weight: bold;">${maxTemp}°C</span></p>
                    <p>Min Temp: <span style="font-weight: bold;">${minTemp}°C</span></p>
                    <p>Precipitazioni: <span style="font-weight: bold;">${precip} mm</span></p>
                </div>
            </div>
            <div class='row' style='height=2rem'>
                <p></p>
            </div>
        `;
    }
}