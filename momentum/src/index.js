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

const greeting = document.querySelector('.greeting-container');
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
const quote = document.querySelector('.quote-block');
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
  audio.addEventListener('loadeddata', () => {
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



// Settings menu
let settingsMenuData = {
    title: 'settings',
    language: 'eng',
    imageSource: 'github',
    tag: 'nature',
    vidgets: [], /* 'time', 'date', 'greeting', 'quote', 'weather', 'player', 'todo' */
  };
const settingsMenu = document.querySelector('.settings-menu');
const settingsMenuOpenBtn = document.querySelector('.copyright__settings');

const actionsInSettingsMenu = () => {
  // Open / close photo source select menu
const selectSrcMenuField = document.querySelector('.select-tag');

const openCloseSrcMenu = () => {
  const srcDropDownMenu = document.querySelector('.select-tag__list');
  selectSrcMenuField.classList.toggle('select-tag_active');
  srcDropDownMenu.classList.toggle('select-tag__list_active');
  // ...
}
selectSrcMenuField.addEventListener('click', openCloseSrcMenu);

// Change icon in photo src field
const searchImgTagField = document.getElementById('image-tag');

const changeSearchIcon = () => {
  const searchImgTagBlock = document.querySelector('.search-box');
  searchImgTagBlock.classList.toggle('search-box_active');
}
searchImgTagField.addEventListener('focus', changeSearchIcon);
searchImgTagField.addEventListener('blur', changeSearchIcon);
}

// Close settings menu by Escape or click outside of settings menu

const closeMenuByAction = () => {
  document.addEventListener('keyup', (event) => {
    // Close settings meny by Escape
    if (event.code === 'Escape') {
      showSettingsMenu();
    };
  });
    // Close settings menu by click outside of settings menu
  document.addEventListener('click', (event) => {
    if (settingsMenu.style.opacity == '1') {
       const withinBoundaries = event.composedPath().includes(settingsMenu);
       if (!withinBoundaries && !(event.target == settingsMenuOpenBtn)) {
          showSettingsMenu();
        }
    }
  });
};

// Close settings menu

settingsMenu.style.opacity = '0';
const showSettingsMenu = () => {
  if (settingsMenu.style.opacity == '0') {
    settingsMenu.style.opacity = '1';
    settingsMenu.classList.add('settings-menu_active');
    closeMenuByAction();
  } else {
    settingsMenu.style.opacity = '0';
    settingsMenu.classList.remove('settings-menu_active');
  };
}

// Build (open) settings menu
const buildSettingsMenu = () => {
const settingsMenuCloseBtn = document.createElement('div');
settingsMenuCloseBtn.classList.add('close-settings-btn', 'close-settings-btn_hover', 'close-settings-btn_active', 'icono-cross');
settingsMenu.append(settingsMenuCloseBtn);

const line = document.createElement('div');
line.classList.add('line');

const selectLangMenu = document.createElement('form');
selectLangMenu.classList.add('select-lang');
selectLangMenu.name = 'lang';
let selectLangMenuContent = `<p>Select language</p>
  <div class="lang-radio">
    <input type="radio" id="lang-eng" name="radio" value="eng" checked>
    <label for="lang-eng" class="lang-label">English</label>
  </div>
  <div class="lang-radio">
    <input type="radio" id="lang-ru" name="radio" value="ru">
    <label for="lang-ru" class="lang-label">Russian</label>
  </div>`;
selectLangMenu.innerHTML = selectLangMenuContent;
settingsMenu.append(selectLangMenu);
const cloneLine1 = line.cloneNode(true);
selectLangMenu.after(cloneLine1);

const selectImgSource = document.createElement('form');
selectImgSource.classList.add('select-src');
selectImgSource.name = 'src';
let selectImgSourceContent = `<p>Photo source for background image</p>
<div>
<div class="select-tag select-tag_hover">GitHub</div>
  <ul class="select-tag__list">
    <li class="select-tag__list__item select-tag__list__item_hover" data-source="github">GitHub</li>
    <li class="select-tag__list__item select-tag__list__item_hover" data-source="unsplash">Unsplash Api</li>
    <li class="select-tag__list__item select-tag__list__item_hover" data-source="flickr">Flickr Api</li>
  </ul>
  </div>`;
selectImgSource.innerHTML = selectImgSourceContent;
settingsMenu.append(selectImgSource);
const cloneLine2 = line.cloneNode(true);
selectImgSource.after(cloneLine2);

const selectImgTag = document.createElement('form');
selectImgTag.classList.add('select-img-tag');
selectImgTag.name = 'tag';
let selectImgTagContent = `<p>Enter a tag for background image collection</p>
  <div class="search-box">
    <input type="text" id="image-tag" placeholder="nature" name="imgtag">
  </div>`;
selectImgTag.innerHTML = selectImgTagContent;
settingsMenu.append(selectImgTag);
const cloneLine3 = line.cloneNode(true);
selectImgTag.after(cloneLine3);

const hideVidgetItems = document.createElement('form');
hideVidgetItems.classList.add('hide-vidgets');
hideVidgetItems.name = 'vidgets';
let hideVidgetItemsContent = `<p>Hide/show block</p>
  <label for="block-time" class="checkbox-ios">
    <input type="checkbox" id="block-time" name="vidget" value="time" checked>Time
    <span class="checkbox-ios-switch"></span>
  </label>

    <label for="block-date" class="checkbox-ios">
      <input type="checkbox" id="block-date" name="vidget" value="date" checked>Date
      <span class="checkbox-ios-switch"></span>
    </label>

      <label for="block-greeting" class="checkbox-ios">
        <input type="checkbox" id="block-greeting" name="vidget" value="greeting" checked>Greeting
        <span class="checkbox-ios-switch"></span>
      </label>

        <label for="block-quote" class="checkbox-ios">
          <input type="checkbox" id="block-quote" name="vidget" value="quote" checked>Quote
          <span class="checkbox-ios-switch"></span>
        </label>

          <label for="block-weather" class="checkbox-ios">
            <input type="checkbox" id="block-weather" name="vidget" value="weather" checked>Weather
            <span class="checkbox-ios-switch"></span>
          </label>

            <label for="block-player" class="checkbox-ios">
              <input type="checkbox" id="block-player" name="vidget" value="player" checked>Audio player
              <span class="checkbox-ios-switch"></span>
            </label>

              <label for="block-todo" class="checkbox-ios">
                <input type="checkbox" id="block-todo" name="vidget" value="todo" checked>Todo
                <span class="checkbox-ios-switch"></span>
              </label>`;
hideVidgetItems.innerHTML = hideVidgetItemsContent;
settingsMenu.append(hideVidgetItems);
const cloneLine4 = line.cloneNode(true);
hideVidgetItems.after(cloneLine4);

actionsInSettingsMenu();
}
window.onload = buildSettingsMenu();
settingsMenuOpenBtn.addEventListener('click', showSettingsMenu);

// Close menu by close btn (icon) in settings menu
const closeSettingsBtn = document.querySelector('.close-settings-btn');
closeSettingsBtn.addEventListener('click', showSettingsMenu);




// Choose settings
// Select Language
const selectLangForm = document.forms.lang;
const selectLangRadioInputs = selectLangForm.radio;
//console.log(selectLangRadioInputs)
selectLangForm.addEventListener('click', (event) => {
  if (event.target.nodeName !='INPUT') return;
    let selectedLang = '';
    for (let element of selectLangRadioInputs) {
      if (element.checked) {
        selectedLang = element.value;
      }
    }
    settingsMenuData.language = selectedLang;
    //console.log(settingsMenuData.language); 
});

// Choose img tags
const selectImgTagForm = document.forms.tag;
const selectImgTagInput = selectImgTagForm.imgtag;

const getTagInfoFromInput = () => {
  settingsMenuData.tag = selectImgTagForm.imgtag.value;
}
selectImgTagInput.addEventListener('blur', getTagInfoFromInput);

// Update screen after showing/hiding vidgets
const updateScreen = () => {
  let vidgets = document.getElementsByClassName('vidget');
    [...vidgets].forEach((element) => {
    if (settingsMenuData.vidgets.indexOf(element.id) != -1) {
      document.querySelector(`.${element.id}`).classList.remove(`vidget_hidden`);
    } else {
      document.querySelector(`.${element.id}`).classList.add(`vidget_hidden`);
    }
  });
}

// Choose hide/show block (vidgets)
const selectVidgetsForm = document.forms.vidgets;
const selectVidgetsInputs = selectVidgetsForm.vidget;

const getInfoFromVidgetsInputs = () =>{
let vidgetSet = new Set();
selectVidgetsInputs.forEach((element) => {
  if (element.checked) {
    vidgetSet.add(element.value);
  } else {
    vidgetSet.delete(element.value);
  }
});
  settingsMenuData.vidgets = [...vidgetSet];
  //console.log('settings object', settingsMenuData.vidgets);
  updateScreen();
}
                                //window.onload = getInfoFromVidgetsInputs();
                                //window.onload = updateScreen(); // или поместить после "window.onload = setCheckboxesBackAfterReloadPage();"

selectVidgetsForm.addEventListener ('click', (event) => {
 if (event.target.nodeName != 'INPUT') return; 
 getInfoFromVidgetsInputs();
});


// Save the inputs selections of settings menu to LocalStorage (settingsMenuData object with all settings is stored in LocalStorage)

const setInputsPosInLocalStorage = () => {
  localStorage.setItem('inputs', JSON.stringify(settingsMenuData));
}
// userName.addEventListener('blur', setLocalStorage);
window.addEventListener('beforeunload', setInputsPosInLocalStorage);

// Set the inputs selections of settings menu from LocalStorage after reload of the page.
const getInputsPosInLocalStorage = () => {
  localStorage.getItem('inputs') && (settingsMenuData = JSON.parse(localStorage.getItem('inputs')));
}
window.onload = getInputsPosInLocalStorage();

// Set input radio language select accordingly recieved data from LocalStorage (settingsMenuData object)
const setRadioBackAfterReloadPage = () => {
  selectLangRadioInputs.forEach((element) => {
    if (settingsMenuData.language == element.value) {
      element.checked = true;
  } else {
    element.checked = false;
  }
});
  getInfoFromVidgetsInputs();
}
window.onload = setRadioBackAfterReloadPage();

// Set input checkboxes accordingly recieved data from LocalStorage (settingsMenuData object)
const setCheckboxesBackAfterReloadPage = () => {
  selectVidgetsInputs.forEach((element) => {
    if (settingsMenuData.vidgets.indexOf(element.value) != -1) {
      element.checked = true;
    } else {
      element.checked = false;
    }
  });
  getInfoFromVidgetsInputs();
}
window.onload = setCheckboxesBackAfterReloadPage();


// Open img tag select input if Unsplash API or Flickr API are selected
const selectImgSrcForm = document.forms.src;
const selectImgSrcFormHead = selectImgSrcForm.querySelector('.select-tag');
const selectImgSrcFormListItems = selectImgSrcForm.querySelector('.select-tag__list');
const selectImgSrcFormItems = selectImgSrcForm.querySelectorAll('.select-tag__list__item');

//select-tag__list__item_active











const setSelecImgSrcFormValue = () => {
  selectImgSrcFormHead.innerHTML = '!!!!!!!!!!!!!!!'
}
document.addEventListener('select', setSelecImgSrcFormValue)























//const unsplashApiURL = 'https://api.unsplash.com/search/photos/&query='+word+'&per_page=9&client_id=lXBJOju1hoGHQf4hdVXExR96_QM2EU7UiNH23xWaU30'