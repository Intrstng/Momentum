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
  quote.textContent = `"${quoteData[randomQuote].text}"`;
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
const trackBlock = document.querySelector('.track-name');
const trackLength = document.querySelector('.length');
const volumeBtn = document.querySelector('.volume-button');
const trackTimeLine = document.querySelector('.timeline');
const progressBar = document.querySelector('.progress');
let isPlay = false;
let playNum = 0;

const audio = new Audio('./assets/sounds/Two of Us - Saidbysed.mp3');
audio.volume = 0.35;

const pauseAudio = () => {
  audio.pause();
}

const addIconPause = () => {
  playBtn.classList.add('pause');
}

const addIconPlay = () => {
  playBtn.classList.remove('pause');
}

const markSelectedTrack = (action) => {
  (action === 'remove') ? playlist.children[playNum].classList.remove('item-active') :
  playlist.children[playNum].classList.add('item-active');
}

const showTrackInfo = () => {
  trackBlock.textContent = playList[playNum].title;
  audio.addEventListener("loadeddata", () => {
    let trackDurationInSec = Math.trunc(audio.duration);
    trackLength.textContent = trackLengthTime(trackDurationInSec);
    }, false);
  }

const trackLengthTime = (seconds) => {
  let min = Math.floor((seconds / 60));
  let hour = Math.floor((seconds / 3600));
  let sec = (seconds - (hour * 60) - (min * 60));
  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (hour !== 0) {
    min = (min - (hour * 60));
    if (min < 10) {
      min = `0${min}`;
    }
    return `${hour}:${min}:${sec}`;
  } else {
    return `${min}:${sec}`;
  }
}

const playPrevAudio = () => {
  markSelectedTrack('remove');
  if (playNum === 0) {
    playNum = (playList.length - 1);
  } else {
    playNum--;
  }
  isPlay = false;
  audio.src = playList[playNum].src;
  playAudio();
}

const playNextAudio = () => {
  markSelectedTrack('remove');
  if (playNum < (playList.length - 1)) {
    playNum++;
  } else playNum = 0;
  isPlay = false;
  audio.src = playList[playNum].src;
  playAudio();
}

audio.onended = function() {
  playNextAudio();
}

const changeMuteIcon = () => {
  const volumeIcon = document.querySelector('.volume');
  volumeIcon.classList.toggle('icono-volume');
  volumeIcon.classList.toggle('icono-volumeMedium');
}

const muteSound = () => {
  changeMuteIcon();
  audio.muted == false ? audio.muted = true : audio.muted = false;
}
volumeBtn.addEventListener('click', muteSound);

// Обновление CurrentTime (см. setInterval)

const setCurrentTrackTime = () => {
  progressBar.style.width = `${audio.currentTime / audio.duration * 100}%`;
  let currentTrackTime = Math.trunc(audio.currentTime);
  document.querySelector('.current').textContent = trackLengthTime(currentTrackTime);
}

// Установка уровня звука и изменение полосы volume bar при клике по ней
const volumeSlider = document.querySelector('.volume-slider');
const volumeLevelBar = document.querySelector('.volume-percentage');
volumeLevelBar.style.width = `${audio.volume * 100}%`; // Значение полосы volume bar по умолчанию

const setVolumeLevel = (event) => {
  const volumeSliderWidth = getComputedStyle(volumeSlider).width;
  const selectedVolumeByLevelBar = event.offsetX / parseInt(volumeSliderWidth);
  const volumeLevelBar = document.querySelector('.volume-percentage');
  volumeLevelBar.style.width = `${selectedVolumeByLevelBar * 100}%`;
  audio.volume = selectedVolumeByLevelBar;
}
volumeSlider.addEventListener('click', setVolumeLevel, false);

// Установка progress bar трека при нажатии на него

const setTrackProgress = (event) => {
  const trackTimeLineWidth = getComputedStyle(trackTimeLine).width;

  const selectedTrackTimeLinePos = event.offsetX / parseInt(trackTimeLineWidth);
  progressBar.style.width = `${selectedTrackTimeLinePos * 100}%`;
  audio.currentTime = audio.duration * selectedTrackTimeLinePos;
}
trackTimeLine.addEventListener('click', setTrackProgress);

// Play / pause одной кнопкой
audio.src = playList[playNum].src;

function playAudio() {
  markSelectedTrack('add');
  
  console.log(audio.src);
  if (!isPlay) {
    audio.play();
    isPlay = true;
    addIconPause();
    showTrackInfo();
    setCurrentTrackTime();
    setInterval(setCurrentTrackTime, 500);
    return;
  } else {
      pauseAudio();
      isPlay = false;
      addIconPlay();
      setCurrentTrackTime();
  }
}

playBtn.addEventListener('click', playAudio);
playPrevBtn.addEventListener('click', playPrevAudio);
playNextBtn.addEventListener('click', playNextAudio);

// Генерация плейлиста в DOM

const genPlaylist = () => {
  playList.forEach((elem, index) => {
    let playItem = document.createElement('li');
    playItem.classList.add('play-item');
    playItem.innerHTML = `<span class="track-title">${index + 1}. &nbsp;${elem.title}</span><span class="track-duration">${elem.duration}</span>`;
    playlist.append(playItem);
  });
}
genPlaylist();

// Play по нажатию на трек

const playSelectedTrack = (ev, element = ev.target) => {
  let trackNameArray = element.textContent.split(' ');
    trackNameArray.shift();
    const trackName = trackNameArray.join(' ').trim();  
    markSelectedTrack('remove');
    playNum = playList.map((elem) => elem.title).indexOf(trackName);
    isPlay = false;
  console.log('!!!', ev.target.textContent)
    audio.src = playList[playNum].src;
    playAudio();
}

const selectTrackInPlaylist = (event) => {
  if (event.target.closest('.track-title')) {
    playSelectedTrack(event);
  }
  if (event.target.closest('.track-duration')) {
    const prevElement = event.target.previousElementSibling;
    playSelectedTrack(event, prevElement);
  }
}

playlist.addEventListener('click', selectTrackInPlaylist);

// Меню настроек
const settingsMenuData = [
  {
    "title": "Settings",
    "language": ["eng", "ru"],
    "imageSource": ["GitHub", "Unsplash API", "Flickr API"],
    "tags": "Select tag",
    "hideItem": ["time", "date", "greeting", "quote", "weather", "player"],
  }
]

const settingsMenu = document.querySelector('.settings-menu');
const settingsMenuCloseBtn = document.createElement('div');
settingsMenuCloseBtn.classList.add('close-settings-btn', 'close-settings-btn_hover', 'close-settings-btn_active', 'icono-cross');
settingsMenu.append(settingsMenuCloseBtn);


const line = document.createElement('div');
line.classList.add('line');

const selectLangMenu = document.createElement('div');
selectLangMenu.classList.add('select-lang');
let selectLangMenuContent = `
  <p>Select language</p>
  <div class="lang-radio">
    <input type="radio" id="lang-eng" name="radio" checked>
    <label  for="lang-eng" class="lang-label">English</label>
  </div>
  <div class="lang-radio">
    <input type="radio" id="lang-ru" name="radio">
    <label  for="lang-ru" class="lang-label">Russian</label>
  </div>`;
selectLangMenu.innerHTML = selectLangMenuContent;
settingsMenu.append(selectLangMenu);
const cloneLine1 = line.cloneNode(true);
selectLangMenu.after(cloneLine1);

const selectImgSource = document.createElement('div');
selectImgSource.classList.add('select-img-source');
let selectImgSourceContent = `<label for="imgSource">Photo source for background image</label>
  <select name="imgSource" id="imgSource">
    <option value="github">GitHub</option>
    <option value="unsplash">Unsplash Api</option>
    <option value="flickr">Flickr Api</option>`;
selectImgSource.innerHTML = selectImgSourceContent;
settingsMenu.append(selectImgSource);
const cloneLine2 = line.cloneNode(true);
selectImgSource.after(cloneLine2);

const selectImgTag = document.createElement('div');
selectImgTag.classList.add('select-img-tag');
let selectImgTagContent = `<p>Enter a tag for background image collection</p>
  <div class="search-box">
    <input type="text" id="image-tag" placeholder="nature">
  </div>`;
selectImgTag.innerHTML = selectImgTagContent;
settingsMenu.append(selectImgTag);
const cloneLine3 = line.cloneNode(true);
selectImgTag.after(cloneLine3);

const hideVidgetItems = document.createElement('div');
hideVidgetItems.classList.add('hide-vidgets');
let hideVidgetItemsContent = `<p>Hide/show block</p>
  <label for="block-time" class="checkbox-ios">
    <input type="checkbox" id="block-time" name="time" checked>Time
    <span class="checkbox-ios-switch"></span>
  </label>

    <label for="block-date" class="checkbox-ios">
      <input type="checkbox" id="block-date" name="date" checked>Date
      <span class="checkbox-ios-switch"></span>
    </label>

      <label for="block-greeting" class="checkbox-ios">
        <input type="checkbox" id="block-greeting" name="greeting" checked>Greeting
        <span class="checkbox-ios-switch"></span>
      </label>

        <label for="block-quote" class="checkbox-ios">
          <input type="checkbox" id="block-quote" name="quote" checked>Quote
          <span class="checkbox-ios-switch"></span>
        </label>

          <label for="block-weather" class="checkbox-ios">
            <input type="checkbox" id="block-weather" name="weather" checked>Weather
            <span class="checkbox-ios-switch"></span>
          </label>

            <label for="block-player" class="checkbox-ios">
              <input type="checkbox" id="block-player" name="player" checked>Audio player
              <span class="checkbox-ios-switch"></span>
            </label>

              <label for="block-todo" class="checkbox-ios">
                <input type="checkbox" id="block-todo" name="todo" checked>Todo
                <span class="checkbox-ios-switch"></span>
              </label>`;
hideVidgetItems.innerHTML = hideVidgetItemsContent;
settingsMenu.append(hideVidgetItems);
const cloneLine4 = line.cloneNode(true);
hideVidgetItems.after(cloneLine4);



//const unsplashApiURL = 'https://api.unsplash.com/search/photos/&query='+word+'&per_page=9&client_id=lXBJOju1hoGHQf4hdVXExR96_QM2EU7UiNH23xWaU30'