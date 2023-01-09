// import './sass/styles.scss';

// import  TimeDate  from './js/TimeDate';
import playList from './js/Playlist.js';

// Часы

const time = document.querySelector('.time');
const showTime = (lang = 'en-US') => {
  const date = new Date();

  const dtf = new Intl.DateTimeFormat(lang, { hour12: false,
                                              timeZone: 'Europe/Minsk',
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              second: 'numeric' });

  // time.textContent = date.toLocaleTimeString();
  time.textContent = dtf.format(date);
  setTimeout(() => {
    showTime();
    showDate();
    showGreeting();
  }, 1000);
} 
window.onload = showTime();


// Календарь
const calendar = document.querySelector('.date');
const showDate = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date();
  const options = {
    week: 'long',
    month: 'long',
    day: 'numeric',
  };
  // const getWeekDay = () => {
  //   return days[date.getDay()];
  // }
  const getCurrentDateDependOnLang = (lang = 'en-US') => {
  // return date.toLocaleDateString(lang, options);
    const dtf = Intl.DateTimeFormat(lang, { weekday: 'long',
                                            month: 'long',
                                            day: 'numeric' });
    return dtf.format(date);
  }
  //calendar.textContent = `${getWeekDay()}, ${getCurrentDateDependOnLang()}`;
  calendar.textContent = getCurrentDateDependOnLang();
}

// --------------------------------------------------------------- //
// Приветствие

const greeting = document.querySelector('.greeting');
const getTimeOfDay = () => {
  const date = new Date();
  const hour = date.getHours();
  if (hour < 6) return 'night';
  else if (hour < 12) return 'morning';
  else if (hour < 18) return 'afternoon';
  return 'evening';
}
const showGreeting = (lang = 'en-US') => {
  greeting.textContent = `Good ${getTimeOfDay()}`;
}


// Сохранение имени пользователя
const userName = document.querySelector('.name');

const setLocalStorage = () => {
  localStorage.setItem('name', userName.value);
}
// userName.addEventListener('blur', setLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
  localStorage.getItem('name') && (userName.value = localStorage.getItem('name'));
}
window.onload = getLocalStorage();
// ------------------------------------------------- //

// Смена фонового изображения

const getRandomNum = (min = 1, max = 20) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

let randomNum = getRandomNum();

const generateLinkToImg = () => {
  //console.log("in", randomNum);
  randomNum < 10 ? (randomNum = randomNum.toString().padStart(2, '0')) : randomNum;
  // randomNum < 10 ? (randomNum = `0${randomNum}`) : randomNum;
  //console.log("out", randomNum);
  return `https://raw.githubusercontent.com/Intrstng/stage1-tasks/assets/images/${getTimeOfDay()}/${randomNum}.webp`;
}

// Установка background image с плавным эффектом перехода
const setBackgroundImg = () => {
  const img = new Image();
  img.src = generateLinkToImg();
  img.onload = () => {
    document.querySelector('body').style.backgroundImage = `url('${generateLinkToImg()}')`;
  }
}

window.onload = setBackgroundImg();

// Слайдер

const slidePrevBtn = document.querySelector('.slide-prev');
const slideNextBtn = document.querySelector('.slide-next');

const selectBackgroundImg = (slide) => {
  if (slide === 'next') {
   // console.log("next1", randomNum);
      randomNum = parseInt(randomNum) + 1;
      randomNum > 20 ? randomNum = 1 : randomNum;
   //   console.log("next2", randomNum);
      setBackgroundImg();
    } else if (slide === 'prev') {
    //  console.log("prev1", randomNum);
      randomNum = parseInt(randomNum) - 1;
      randomNum < 1 ? randomNum = 20 : randomNum;
    //    console.log("prev2", randomNum);
        setBackgroundImg();
      }
}

const changeBackgroundImg = (e) => {
  (e.target.closest('.slide-prev')) && selectBackgroundImg('prev');
  (e.target.closest('.slide-next')) && selectBackgroundImg('next');
}

slidePrevBtn.addEventListener('click', changeBackgroundImg);
slideNextBtn.addEventListener('click', changeBackgroundImg);

// ------------------------------------------------- //
// Виджет погоды

// Город
const city = document.querySelector('.city');

const setCityLocalStorage = () => {
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setCityLocalStorage);

const getCityLocalStorage = () => {
  localStorage.getItem('city') && (city.value = localStorage.getItem('city'));
}
window.onload = getCityLocalStorage();

// API

const weatherIcon = document.querySelector('.weather-icon');
const weatherError = document.querySelector('.weather-error');
const weatherDescription = document.querySelector('.description-container');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const lang = 'lang=ru';
const units = 'units=metric';
const measure = 'м/с'

// Мой API
// https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=ru&appid=0a4ec74fecebfa7150be3ee22aad22ca&units=metric

const getWeather = () => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&${lang}&appid=0a4ec74fecebfa7150be3ee22aad22ca&${units}`;
  fetch(url)
    .then(  
      function(response) {  
        if (response.status !== 200) {
          weatherError.textContent = `Ошибка, введены некорректные значения. Status Code: ${response.status}`; 
          console.log(`Looks like there was a problem. Status Code: ${response.status}`);  
          return;  
        }
        response.json().then(function(data) {
          weatherIcon.className = 'weather-icon owf';
          weatherIcon.classList.add(`owf-${data.weather[0].id}`)
          weatherDescription.firstElementChild.textContent = `${Math.round(data.main.temp)} ${String.fromCodePoint(8451)}`; // Farenheit 8457
          weatherDescription.lastElementChild.textContent = data.weather[0].description;
          wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} ${measure}`;
          humidity.textContent = `Humidity: ${Math.round(data.main.humidity)} ${String.fromCodePoint(37)}`;
          //console.log(data.weather[0].id);  
        });  
      }  
    )  
    .catch(function(err) {
      console.log('Fetch Error :-S', err);  
    })
}
window.onload = getWeather();
city.addEventListener('change', getWeather);

// ------------------------------------------------- //
// Виджет Цитата
const quoteBtn = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

const quotesUrls = {
  by: './assets/json/belarusian_quotes.json',
  ru: './assets/json/quotes.json',
  chuk: './assets/json/chuck-jokes-ru.json',
  online: 'https://type.fit/api/quotes',
}

const showQuote = (quoteData) => {
  let randomQuote = getRandomNum(0, quoteData.length);
  quote.textContent = quoteData[randomQuote].text;
  author.textContent = quoteData[randomQuote].author;
}

const getQuotes = async (url) => {
  const quotes = url;
  const res = await fetch(quotes);
  const data = await res.json();
  showQuote(data);
}

// Функция getQuotesBackup выдает запасной (локальный) JSON с цитатами если основной JSON не приходит по API
// const getQuotesBackup = async (url) => {
//   const quotes = url;
//   const res = await fetch(quotes);
//   const data = await res.json();
//   showQuote(data);
// }
// const getQuotes = (url) => {
// fetch(url)
// .then(  
//   function(response) {  
//     if (response.status !== 200) {
//       getQuotesBackup(quotesUrls.ru); // Выдает локальный JSON если нет ответа по API
//       return;  
//     }
//     response.json().then(function(data) {
//       showQuote(data); 
//     });  
//   }  
// )  
// .catch(function(err) {
//   console.log('Fetch Error :-S', err);  
// })
// }

              getQuotes(quotesUrls.online);
              quoteBtn.addEventListener('click', () => getQuotes(quotesUrls.online));

// ----------------------------------------------- //
// Аудиоплеер

// const audio = document.querySelector('audio');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playBtn = document.querySelector('.play');
const playlist = document.querySelector('.play-list');
const playlistItems = document.querySelectorAll('.play-item');
let isPlay = false;
let playNum = 0;

const audio = new Audio();
const pauseAudio = () => {
  audio.pause();
}

const addIconPause = () => {
  playBtn.classList.add('pause');
}

const addIconPlay = () => {
  playBtn.classList.remove('pause');
}

const playPrevAudio = () => {
  playlist.children[playNum].classList.remove('item-active');
  if (playNum === 0) {
    playNum = (playList.length - 1);
  } else {
    playNum--;
  }
  isPlay = false;
  playAudio();
}

const playNextAudio = () => {
  playlist.children[playNum].classList.remove('item-active');
  if (playNum < (playList.length - 1)) {
    playNum++;
  } else playNum = 0;
  isPlay = false;
  playAudio();
}

audio.onended = function() {
  playNextAudio();
}

const playAudio = () => {
  audio.src = playList[playNum].src;
  playlist.children[playNum].classList.add('item-active');
  console.log(audio.src);
  audio.currentTime = 0;
  if (!isPlay) {
    audio.play();
    isPlay = true;
    addIconPause();
  } else {
      pauseAudio();
      isPlay = false;
      addIconPlay();
  }
}

playBtn.addEventListener('click', playAudio);
playPrevBtn.addEventListener('click', playPrevAudio);
playNextBtn.addEventListener('click', playNextAudio);

// Генерация плейлиста в DOM

playList.forEach((elem) => {
  let playItem = document.createElement('li');
  playItem.classList.add('play-item');
  playItem.innerHTML = elem.title;
  playlist.append(playItem);
});

// Play по нажатию на трек

const playSelectedTrack = (event) => {
  if (event.target.closest('.play-item')) {
    playlist.children[playNum].classList.remove('item-active');
    playNum = playList.map((elem) => elem.title).indexOf(event.target.textContent);
    isPlay = false;
    playAudio();
  }
}

playlist.addEventListener('click', playSelectedTrack);

