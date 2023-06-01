import Request from './Request.js';
import Weahter from './Weather.js'

//Dom Elements
const html = document.querySelector('html');
const nav = document.querySelector('nav');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const result = document.getElementById('result');
const search = document.getElementById('search');
const loading = document.getElementById('loading');
const card = document.getElementById('card');
const segustionBox = document.getElementById('segustionBox');
const exit = document.getElementById('exit');



//Variables
const theme = localStorage.getItem("Theme");
const requestUser = new Request({
    baseURL: 'https://646521939c09d77a62e4a2ef.mockapi.io/Todos/user',
    headers: { 'Content-Type': 'application/json' }
})
let timeout = null;

checkIfUserIsLoged();

exit.addEventListener('click', () => {
    getOut();
});

async function getOut() {
    loading.classList.replace('hidden', 'flex');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const response = await requestUser.get();
    const user = response.find(item => item.id === userInfo.id);
    userInfo.isLogin = false;
    localStorage.setItem('user', JSON.stringify(userInfo));
    user.isLogin = false;
    await requestUser.edit(`/${user.id}`, user);
    setTimeout(() => window.location.replace("./login.html"), 100);
    loading.classList.replace('flex', 'hidden');
}


async function checkIfUserIsLoged() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const response = await requestUser.get();
    const user = response.find(item => item.email === userInfo.email);

    if (!user || !userInfo.isLogin || !user.isLogin === userInfo.isLogin)
        window.location.replace("./login.html")

}

const getWaetherData = async (input) => {
    loading.classList.replace('hidden', 'flex');
    segustionBox.innerHTML = "";
    const request = new Request({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=cd6c0f6d53226300d084d2e5d1639543&units=metric`,
    });

    const response = await request.get();

    if (response.cod === '404') {
        result.classList.replace('hidden', 'block');
        card.classList.replace('flex', 'hidden');
    } else {
        generateCard(response);
        setSugestions(search.value);
        result.classList.replace('block', 'hidden');
        card.classList.replace('hidden', 'flex');
    }

    loading.classList.replace('flex', 'hidden');

}

function generateCard(response) {

    let obj = {
        temp: response.main.temp,
        weather: response.weather[0].main,
        location: response.name + " , " + response.sys.country,
        feelsLike: response.main.feels_like,
        humidity: response.main.humidity
    }
    const weather = new Weahter(obj);
    obj = weather.getWeatherObject();

    const cardImage = card.querySelector('#cardImage');
    const cardTemp = card.querySelector('#cardTemp');
    const cardCity = card.querySelector('#cardCity');
    const cardWeather = card.querySelector('#cardWeather');
    const cardFeelsLike = card.querySelector('#cardFeelsLike');
    const cardHumidity = card.querySelector('#cardHumidity');


    cardImage.src = `./assets/svgs/animated/${obj.img}`;
    cardTemp.textContent = obj.temp;
    cardCity.textContent = obj.location;
    cardWeather.textContent = obj.weather;
    cardFeelsLike.textContent = obj.feelsLike;
    cardHumidity.textContent = obj.humidity;
}

const searchResult = searchDebounce(getWaetherData, 1500)


search.addEventListener('input', () => {
    searchResult(search.value);
});

search.addEventListener('click', () => {
    generateSegustion()
});


search.addEventListener('focusout', () => {
    const id = setTimeout(() => {
        segustionBox.innerHTML = "";
        clearTimeout(id);
    }, 200);

})

function searchDebounce(fn, delay) {
    return (input) => {
        clearTimeout(timeout);
        if (input === '') return;
        timeout = setTimeout(() => {
            fn(input);
        }, delay);
    }
}

function setSugestions(input) {
    let segestions = localStorage.getItem('sugestions');
    if (segestions) {
        if (segestions.includes(input)) return;
        segestions = segestions.split(',');
        segestions.push(input);
        segestions = segestions.slice(-6);
        localStorage.setItem('sugestions', segestions.join(','));
    } else {
        localStorage.setItem('sugestions', input);
    }
}

function generateSegustion() {
    let segestions = localStorage.getItem('sugestions');
    segustionBox.classList.remove('hidden');

    if (!segestions.length) return;

    const list = segestions.split(',').reverse().map(item => {
        console.log(segestions.length);
        const div = document.createElement('div');
        div.classList = 'segustion-item';
        div.textContent = item;
        div.addEventListener('click', () => {
            search.value = item;
            segustionBox.innerHTML = "";
            searchResult(search.value);
        });
        return div;
    });
    segustionBox.innerHTML = "";
    const div = document.createElement('div');
    div.classList = 'segustion-item';
    div.textContent = "Delete Search History";
    div.addEventListener('click', ()=>localStorage.setItem('sugestions', ''));
    list.push(div);
    segustionBox.append(...list);
}

if (theme) {
    html.dataset.theme = theme;
    setTheme((theme === "Winter" ? true : false));
} else {
    localStorage.setItem("Theme", "Winter");
}

themeToggle.addEventListener('click', () => {
    setTheme(themeToggle.checked);
});

function setTheme(check) {
    if (check) {
        html.dataset.theme = `winter`;
        nav.classList.replace('bg-base-300', 'bg-info');
        themeIcon.classList = "bi bi-brightness-low-fill px-2 text-3xl";
        themeToggle.checked = check;
        localStorage.setItem("Theme", "Winter");
    } else {
        html.dataset.theme = `business`;
        nav.classList.replace('bg-info', 'bg-base-300');
        themeIcon.classList = "bi bi-moon-fill px-2 text-xl";
        themeToggle.checked = check;
        localStorage.setItem("Theme", "business");
    }
}

