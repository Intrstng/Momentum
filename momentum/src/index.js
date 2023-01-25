// import './sass/styles.scss';

// import  TimeDate  from './js/TimeDate';
import playList from './js/Playlist.js';
import translation from '../assets/locales/translation.js';

// Настройки в Settings menu
let settingsMenuData = {
  title: 'settings',
  language: 'en',
  imageSource: 'github',
  tag: 'nature',
  vidgets: ['time', 'date', 'greeting', 'quote', 'weather', 'player', 'todobtn'],
};

const localizationObj = JSON.parse(JSON.stringify(translation));

// Set the inputs selections of settings menu from LocalStorage after reload of the page.
const getInputsPosInLocalStorage = () => {
  localStorage.getItem('inputs') && (settingsMenuData = JSON.parse(localStorage.getItem('inputs')));
}
window.onload = getInputsPosInLocalStorage();

// Initial vidgets show on screen
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
window.onload = updateScreen();

// Часы

const time = document.querySelector('.time');
const showTime = (lang = 'en') => {
  lang === 'en' ? lang = 'en-US' : lang;
  const date = new Date();

  const dtf = new Intl.DateTimeFormat(lang, { hour12: false,
                                              timeZone: 'Europe/Minsk',
                                              hour: 'numeric',
                                              minute: 'numeric',
                                              second: 'numeric' });
  // time.textContent = date.toLocaleTimeString();
  time.textContent = dtf.format(date);
  setTimeout(() => {
    showTime(settingsMenuData.language);
    showDate(settingsMenuData.language);
    showGreeting(settingsMenuData.language);
  }, 1000);
}
window.onload = showTime(settingsMenuData.language);


// Календарь
const calendar = document.querySelector('.date');
const showDate = (lang = 'en') => {
  lang === 'en' ? lang = 'en-US' : lang;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date();

  const getCurrentDateDependOnLang = (lang = 'en') => {
  
  // return date.toLocaleDateString(lang, options);
    const dtf = Intl.DateTimeFormat(lang, { weekday: 'long',
                                            month: 'long',
                                            day: 'numeric' });
    return dtf.format(date);
  }
  //calendar.textContent = `${getWeekDay()}, ${getCurrentDateDependOnLang()}`;
  calendar.textContent = getCurrentDateDependOnLang(lang);
}

// Greeting (+ localisation)

const greeting = document.querySelector('.greeting-container');
const getTimeOfDay = (lang = 'en') => {
  const date = new Date();
  const hour = date.getHours();
  if (hour < 6) {
    return `${localizationObj['greeting-night'][lang]}`;
  }
  else if (hour < 12) {
    return `${localizationObj['greeting-morning'][lang]}`;
  }
  else if (hour < 18) {
    return `${localizationObj['greeting-afternoon'][lang]}`;
  } else {
    return `${localizationObj['greeting-night'][lang]}`;
  }
}
const showGreeting = (lang = 'en') => {
  if (lang === 'en') greeting.textContent = `Good ${getTimeOfDay(lang)}`;
  if (lang === 'ru') greeting.textContent = getTimeOfDay(lang);
}


// userName Placeholder localisation
const userName = document.querySelector('.name');
const userNamePlaceholder = (lang = 'en') => {
  if (lang === 'en') userName.setAttribute('placeholder', `${localizationObj['greeting-name'][lang]}`);
  if (lang === 'ru') userName.setAttribute('placeholder', `${localizationObj['greeting-name'][lang]}`);
}
window.onload = userNamePlaceholder(settingsMenuData.language);

// Сохранение имени пользователя
const setLocalStorage = () => {
  localStorage.setItem('name', userName.value);
}
  // userName.addEventListener('blur', setLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);

const getLocalStorage = () => {
  localStorage.getItem('name') && (userName.value = localStorage.getItem('name'));
}
window.onload = getLocalStorage();


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
const units = 'units=metric';
let errorText = '';
let consoleErrorText = '';

// Мой API
// https://api.openweathermap.org/data/2.5/weather?q=Минск&lang=ru&appid=0a4ec74fecebfa7150be3ee22aad22ca&units=metric

const getWeather = (lang = 'en') => {
  if (lang === 'en') {
      errorText = 'Error, invalid values ​​entered. Error code';
      consoleErrorText = 'Looks like there was a problem. Status Code';
  }
  if (lang === 'ru') {
      errorText = 'Ошибка, введены некорректные значения. Код ошибки';
      consoleErrorText = 'Возникла проблема. Код ошибки';
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=0a4ec74fecebfa7150be3ee22aad22ca&${units}`;
  fetch(url)
    .then(  
      function(response) {  
        if (response.status !== 200) {
          weatherError.textContent = `${errorText}: ${response.status}`; 
          console.log(`${consoleErrorText}: ${response.status}`);  
          return;  
        }
        response.json().then(function(data) {
          weatherIcon.className = 'weather-icon owf';
          weatherIcon.classList.add(`owf-${data.weather[0].id}`)
          weatherDescription.firstElementChild.textContent = `${Math.round(data.main.temp)} ${String.fromCodePoint(8451)}`; // Farenheit 8457
          weatherDescription.lastElementChild.textContent = data.weather[0].description;
          wind.textContent = `${localizationObj['weather-wind'][lang]}: ${Math.round(data.wind.speed)} ${localizationObj['weather-units'][lang]}`;
          humidity.textContent = `${localizationObj['weather-humidity'][lang]}: ${Math.round(data.main.humidity)} ${String.fromCodePoint(37)}`;
          //console.log(data.weather[0].id);  
        });  
      }  
    )  
    .catch(function(err) {
      console.log('Fetch Error :-S', err);  
    })
}
window.onload = getWeather(settingsMenuData.language);
city.addEventListener('change', getWeather);

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
const selectQuotesSourceDependOnLang = (lang = 'en') => {
  if (lang === 'en') {
    getQuotes(quotesUrls.online);
    quoteBtn.addEventListener('click', () => getQuotes(quotesUrls.online));
  }
  if (lang === 'ru') {
    getQuotes(quotesUrls.ru);
    quoteBtn.addEventListener('click', () => getQuotes(quotesUrls.ru));
  }
}
window.onload = selectQuotesSourceDependOnLang(settingsMenuData.language);


// Аудиоплеер

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

const showGreetingTrackTitle = (lang = 'en') => {
  trackBlock.textContent = `${localizationObj['music-song'][lang]}`;
}
window.onload = showGreetingTrackTitle(settingsMenuData.language);

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
const settingsMenu = document.querySelector('.settings-menu');
const settingsMenuOpenBtn = document.querySelector('.copyright__settings');

// Actions when settings menu is opened
const actionsInOpenedSettingsMenu = () => {
const selectSrcMenuField = document.querySelector('.select-tag');
const srcDropDownMenu = document.querySelector('.select-tag__list');
const selectImgSrcForm = document.forms.src;
  const selectImgSrcFormItems = selectImgSrcForm.querySelectorAll('.select-tag__list__item');
let openedImgSrcField = false;

// Add to main field of photo src input the name of the selected item and setting data to settingsMenuData object 

const selectImgSrcItem = (event) => {
  selectSrcMenuField.innerHTML = `${event.target.innerHTML}`;
  settingsMenuData.imageSource = event.target.dataset.source;
  selectSrcMenuField.classList.remove('select-tag_active');
  srcDropDownMenu.classList.remove('select-tag__list_active');
  openedImgSrcField = false;
  selectImgSrcFormItems.forEach((element) => {
    element.removeEventListener('click', selectImgSrcItem);
  });

  // if (event.target.dataset.source == 'unsplash' || event.target.dataset.source == 'flickr') {
  //   document.forms.tag.classList.add('select-img-tag_active');
  //   document.querySelector('.select-img-tag__line').classList.add('select-img-tag__line_active');
  //   selectImgTagInput.classList.add('.inputtagactive');
  // };
}

// Open / close photo source select menu
const openCloseSrcMenu = () => {
  selectSrcMenuField.classList.toggle('select-tag_active');
  srcDropDownMenu.classList.toggle('select-tag__list_active');
  openedImgSrcField = !openedImgSrcField;
    if (openedImgSrcField == true) {
      selectImgSrcFormItems.forEach((element) => {
        element.addEventListener('click', selectImgSrcItem);
      });
      openedImgSrcField = false;
    };
}
selectSrcMenuField.addEventListener('click', openCloseSrcMenu);

// Change icon in photo src field
const searchImgTagField = document.getElementById('image-tag');

const changeSearchIcon = (event) => {
  const searchImgTagBlock = document.querySelector('.search-box');
  if (event.type === 'focus') searchImgTagBlock.classList.add('search-box_active');
  if (event.type === 'blur') searchImgTagBlock.classList.remove('search-box_active');
}
searchImgTagField.addEventListener('focus', changeSearchIcon);
searchImgTagField.addEventListener('blur', changeSearchIcon);
}

// Close settings menu by Escape or click outside of settings menu
let openedSettingsMenu = false;
const closeMenuByAction = () => {
  document.addEventListener('keyup', (event) => {
    // Close settings menu by Escape
    if (event.code === 'Escape' && openedSettingsMenu) {
      showSettingsMenu();
    }
  });
    // Close settings menu by click outside of settings menu
  document.addEventListener('click', (event) => {
    if (openedSettingsMenu) {
       const withinBoundaries = event.composedPath().includes(settingsMenu);
       if (!withinBoundaries && !(event.target == settingsMenuOpenBtn)) {
          showSettingsMenu();
        }
    }
  });
}

// Close settings menu

const showSettingsMenu = () => {
  if (!openedSettingsMenu) {
    openedSettingsMenu = true;
    settingsMenu.classList.add('settings-menu_active');
    closeMenuByAction();
        getInputsPosInLocalStorage();
  } else {
    openedSettingsMenu = false;
    settingsMenu.classList.remove('settings-menu_active');
        setInputsPosInLocalStorage();
  }

// Close menu by close btn (icon) in settings menu
const closeSettingsBtn = document.querySelector('.close-settings-btn');
closeSettingsBtn.addEventListener('click', showSettingsMenu);


// Choose settings
// Select Language
const selectLangForm = document.forms.lang;
const selectLangRadioInputs = selectLangForm.radio;
//console.log(selectLangRadioInputs)

const selectLanguage = (event) => {
  if (event.target.nodeName !='INPUT') return;
  let selectedLang = '';
  for (let element of selectLangRadioInputs) {
    if (element.checked) {
      selectedLang = element.value;
      showGreetingTrackTitle(selectedLang);
      userNamePlaceholder(selectedLang);
      selectQuotesSourceDependOnLang(selectedLang);
      getWeather(selectedLang);
      translateSettingsMenu(selectedLang);
    }
  }
  settingsMenuData.language = selectedLang;
}
selectLangForm.addEventListener('click', selectLanguage);

// Choose img tags
const selectImgTagForm = document.forms.tag;
const selectImgTagInput = selectImgTagForm.imgtag;
selectImgTagForm.imgtag.value = selectImgTagForm.imgtag.placeholder;

// Hover input tag select
const hoverTagInput = (event) => {
  if (event.type === 'mouseenter') selectImgTagForm.imgtag.style.boxShadow = '0 0 6px 1px rgba(255, 255, 255, 0.2)';
  if (event.type === 'mouseout') selectImgTagForm.imgtag.style.boxShadow = '0 0 12px 4px rgba(0, 0, 0, 0.2)';
  //if (event.type === 'keydown' && event.code === 'Enter') selectImgTagForm.imgtag.style.boxShadow = '0 0 12px 4px rgba(0, 0, 0, 0.2)';
}
selectImgTagForm.imgtag.addEventListener('mouseenter', hoverTagInput);
selectImgTagForm.imgtag.addEventListener('mouseout', hoverTagInput);

const getTagInfoFromInputEnter = (event) => {
  if (event.code != 'Enter') return;
  event.preventDefault();
  settingsMenuData.tag = selectImgTagForm.imgtag.value;
  document.querySelector('.search-box').classList.remove('search-box_active');
}

const getTagInfoFromInputBlur = () => {
  settingsMenuData.tag = selectImgTagForm.imgtag.value;
}
selectImgTagInput.addEventListener('keydown', getTagInfoFromInputEnter);
selectImgTagInput.addEventListener('blur', getTagInfoFromInputBlur);

    // Update screen after showing/hiding vidgets
    // const updateScreen = () => {
    //   let vidgets = document.getElementsByClassName('vidget');
    // //console.log ('updateScreen',settingsMenuData);
    //     [...vidgets].forEach((element) => {
    //     if (settingsMenuData.vidgets.indexOf(element.id) != -1) {
    //       document.querySelector(`.${element.id}`).classList.remove(`vidget_hidden`);
    //     } else {
    //       document.querySelector(`.${element.id}`).classList.add(`vidget_hidden`);
    //     }
    //   });
    // }

// Choose hide/show block (vidgets)
const selectVidgetsForm = document.forms.vidgets;
const selectVidgetsInputs = selectVidgetsForm.vidget;

const getInfoFromVidgetsInputs = () => {
let vidgetSet = new Set();
selectVidgetsInputs.forEach((element) => {
  if (element.checked) {
    vidgetSet.add(element.value);
  } else {
    vidgetSet.delete(element.value);
  }
});
  settingsMenuData.vidgets = [...vidgetSet];
  updateScreen();
}

selectVidgetsForm.addEventListener ('click', (event) => {
  if (event.target.nodeName != 'INPUT') return; 
  getInfoFromVidgetsInputs();
});

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
setRadioBackAfterReloadPage();

// Set input photo src for background image accordingly recieved data from LocalStorage (settingsMenuData object)
  const setInputImgSrcBackAfterReloadPage = () => {
    document.forms.src.querySelectorAll('.select-tag__list__item').forEach((element) => {
      if (element.dataset.source == settingsMenuData.imageSource) {
        document.forms.src.querySelector('.select-tag').innerHTML = element.textContent;
      };
    });
    getInfoFromVidgetsInputs();
  }
  window.onload = setInputImgSrcBackAfterReloadPage();

  // Set input tag for background image collection accordingly recieved data from LocalStorage (settingsMenuData object)
  const setInputImgTagBackAfterReloadPage = () => {
    selectImgTagForm.imgtag.placeholder = settingsMenuData.tag;
    getInfoFromVidgetsInputs();
  }
  window.onload = setInputImgTagBackAfterReloadPage();

  // Set input checkboxes accordingly recieved data from LocalStorage (settingsMenuData object)
  const setCheckboxesBackAfterReloadPage = () => {
    localStorage.getItem('inputs') && (settingsMenuData = JSON.parse(localStorage.getItem('inputs')));
    selectVidgetsInputs.forEach((element) => {
      if (settingsMenuData.vidgets.indexOf(element.value) != -1) {
        console.log("dd")
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    getInfoFromVidgetsInputs();
   // setInputsPosInLocalStorage();
  }
  setCheckboxesBackAfterReloadPage();
}

// Translate settings menu
const translateSettingsMenu = (lang = 'en') => {
  // select lang translation
  document.forms.lang.firstElementChild.textContent = `${localizationObj['select-language'][lang]}`;
  document.querySelectorAll('.lang-label')[0].textContent = `${localizationObj['language-en'][lang]}`;
  document.querySelectorAll('.lang-label')[1].textContent = `${localizationObj['language-ru'][lang]}`;
  
  // photo src translation
  document.forms.src.firstElementChild.textContent = `${localizationObj['selectImgSrcTitle'][lang]}`;

  // photo tag translation
  document.forms.tag.firstElementChild.textContent = `${localizationObj['selectImgTagTitle'][lang]}`;

  // checkbox inputs translation
  document.forms.vidgets.firstElementChild.textContent = `${localizationObj['checkBoxInputsTitle'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[0].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxTime'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[1].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxDate'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[2].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxGreeting'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[3].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxQuote'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[4].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxWeather'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[5].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxPlayer'][lang]}`;
  document.querySelectorAll('.checkbox-ios')[6].firstElementChild.nextSibling.textContent = `${localizationObj['checkBoxTodo'][lang]}`;
}

// Build (open) settings menu
const buildSettingsMenu = (lang = 'en') => {
const settingsMenuCloseBtn = document.createElement('div');
settingsMenuCloseBtn.classList.add('close-settings-btn', 'close-settings-btn_hover', 'close-settings-btn_active', 'icono-cross');
settingsMenu.append(settingsMenuCloseBtn);

const line = document.createElement('div');
line.classList.add('line');

const selectLangMenu = document.createElement('form');
selectLangMenu.classList.add('select-lang');
selectLangMenu.name = 'lang';
let selectLangMenuContent = `<p></p>
  <div class="lang-radio">
    <input type="radio" id="lang-eng" name="radio" value="en" checked>
    <label for="lang-eng" class="lang-label"></label>
  </div>
  <div class="lang-radio">
    <input type="radio" id="lang-ru" name="radio" value="ru">
    <label for="lang-ru" class="lang-label"></label>
  </div>`;
selectLangMenu.innerHTML = selectLangMenuContent;
settingsMenu.append(selectLangMenu);
const cloneLine1 = line.cloneNode(true);
selectLangMenu.after(cloneLine1);

const selectImgSource = document.createElement('form');
selectImgSource.classList.add('select-src');
selectImgSource.name = 'src';
let selectImgSourceContent = `<p></p>
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
let selectImgTagContent = `<p></p>
  <div class="search-box">
    <input type="text" id="image-tag" name="imgtag">
  </div>`;
selectImgTag.innerHTML = selectImgTagContent;
settingsMenu.append(selectImgTag);
const cloneLine3 = line.cloneNode(true);
cloneLine3.classList.add('select-img-tag__line');
selectImgTag.after(cloneLine3);

const hideVidgetItems = document.createElement('form');
hideVidgetItems.classList.add('hide-vidgets');
hideVidgetItems.name = 'vidgets';
let hideVidgetItemsContent = `<p></p>
  <label for="block-time" class="checkbox-ios">
    <input type="checkbox" id="block-time" name="vidget" value="time" checked>
    <span class="checkbox-ios-switch"></span>
  </label>

    <label for="block-date" class="checkbox-ios">
      <input type="checkbox" id="block-date" name="vidget" value="date" checked>
      <span class="checkbox-ios-switch"></span>
    </label>

      <label for="block-greeting" class="checkbox-ios">
        <input type="checkbox" id="block-greeting" name="vidget" value="greeting" checked>
        <span class="checkbox-ios-switch"></span>
      </label>

        <label for="block-quote" class="checkbox-ios">
          <input type="checkbox" id="block-quote" name="vidget" value="quote" checked>
          <span class="checkbox-ios-switch"></span>
        </label>

          <label for="block-weather" class="checkbox-ios">
            <input type="checkbox" id="block-weather" name="vidget" value="weather" checked>
            <span class="checkbox-ios-switch"></span>
          </label>

            <label for="block-player" class="checkbox-ios">
              <input type="checkbox" id="block-player" name="vidget" value="player" checked>
              <span class="checkbox-ios-switch"></span>
            </label>

              <label for="block-todo" class="checkbox-ios">
                <input type="checkbox" id="block-todo" name="vidget" value="todobtn" checked>
                <span class="checkbox-ios-switch"></span>
              </label>`;
hideVidgetItems.innerHTML = hideVidgetItemsContent;
settingsMenu.append(hideVidgetItems);
const cloneLine4 = line.cloneNode(true);
hideVidgetItems.after(cloneLine4);
translateSettingsMenu(lang);
actionsInOpenedSettingsMenu();
}
window.onload = buildSettingsMenu(settingsMenuData.language);
settingsMenuOpenBtn.addEventListener('click', showSettingsMenu);


// Todo App
const showTodoAppBtn = document.querySelector('.todobtn');
const todoApp = document.querySelector('.todo');
let todoAppOpened = false;
let todoOpened = false;
let todoNotes = [];

// Close Todo Notes app
const closeTodoNotesApp = () => {
  // Close Todo Notes app by Escape
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Escape' && todoAppOpened && todoOpened) return;
      if (event.code === 'Escape' && todoAppOpened) {
        showTodoApp();
      }
});
    // Close settings menu by click outside of settings menu
    document.addEventListener('click', (event) => {
      if (todoAppOpened) {
      const withinBoundaries = event.composedPath().includes(todoApp);
        if (!withinBoundaries && !(event.target === showTodoAppBtn)) {
        showTodoApp();
        }
      }
    });
}

// Open Todo Notes app
const showTodoApp = () => {
  if (!todoAppOpened) {
    todoApp.classList.add('todo_active');
    createTodoNoteBtn.addEventListener('click', showTodoCreateItem);
    document.querySelector('.todo-close-btn').addEventListener('click', showTodoApp);
    todoAppOpened = true;
    return;
  } if (todoAppOpened) {
    todoApp.classList.remove('todo_active');
    createTodoNoteBtn.removeEventListener('click', showTodoCreateItem);
    document.querySelector('.todo-close-btn').removeEventListener('click', showTodoApp);
    todoAppOpened = false;
  }
}
showTodoAppBtn.addEventListener('click', showTodoApp)

// Translate Todo app
const translateTodoApp = (lang= 'en') => {
  document.querySelector('.todo__head h2').textContent = `${localizationObj['todolist-title'][lang]}`;
  document.querySelector('.btn-todo').textContent = `${localizationObj['todolist-btn'][lang]}`;
  document.forms.todoform.todo.placeholder = `${localizationObj['todolist-create'][lang]}`;
}

// Build Todo App
const buildTodoApp = () => {
  const todoApp = document.querySelector('.todo');
  const todoContent =
  `<div class="todo__head">
    <h2></h2>
      <div class="todo-close-btn todo-close-btn_hover todo-close-btn_active icono-crossCircle"></div>
  </div>
    <button class="btn btn-todo btn-todo_hover btn-todo_active"></button>
      <div class="todo__field"></div>
        <div class="todo__note">
          <form name="todoform">
            <textarea name="todo" id="note-text" maxlength="96"></textarea>
            <img class="todo-btn-ok todo-btn-ok_hover todo-btn-ok_active" src="./assets/svg/check-ok.svg" alt="Todo Ok">
            <img class="todo-btn-close todo-btn-close_hover todo-btn-close_active" src="./assets/svg/check-close.svg" alt="Todo Close">
          </form>
        </div>`;
  todoApp.innerHTML = todoContent;
  translateTodoApp(settingsMenuData.language);
  closeTodoNotesApp();
};
window.onload = buildTodoApp();

const createTodoNoteBtn = document.querySelector('.btn-todo');
const todoNotesConatiner = document.querySelector('.todo__field');
const todoNotesCreateItem = document.querySelector('.todo__note');
const todoTextArea = document.forms.todoform.todo
const approveCreateTodoNoteBtn = document.querySelector('.todo-btn-ok');
const cancelCreateTodoNoteBtn = document.querySelector('.todo-btn-close');

// Close Todo create item (textarea input) by Escape or click outside of Todo create item
const closeTodoItemByAction = () => {
  document.addEventListener('keyup', (event) => {
    // Close Todo create item (textarea input) by Escape
    if (event.code === 'Escape') {
      todoNotesCreateItem.classList.remove('todo__note_active');
      todoOpened = false;
      todoTextArea.value = '';
      // или можно // showTodoCreateItem();
    }
  }); 
    // Close Todo create item (textarea input)  by click outside of settings menu
  document.addEventListener('click', (event) => {
    if (todoOpened == true) {
       const withinTodoBoundaries = event.composedPath().includes(todoNotesCreateItem);
        if (!withinTodoBoundaries && !(event.target == createTodoNoteBtn)) {
          showTodoCreateItem();
        }
    }
  });
    // Close Todo item by click on X button
    cancelCreateTodoNoteBtn.addEventListener('click', showTodoCreateItem);
}

// Show / hide todo create item (textarea input)
const showTodoCreateItem = () => {
  if (!todoOpened) {
    todoNotesCreateItem.classList.add('todo__note_active');
    todoOpened = true;
    approveCreateTodoNoteBtn.addEventListener('click', createTodoNoteByClick);
    todoNotesCreateItem.addEventListener('keyup', createTodoNoteByEnter);
    closeTodoItemByAction();
  } else {
    todoNotesCreateItem.classList.remove('todo__note_active');
    todoTextArea.value = '';
    todoOpened = false;
    approveCreateTodoNoteBtn.removeEventListener('click', createTodoNoteByClick);
    todoNotesCreateItem.removeEventListener('keyup', createTodoNoteByEnter);
  } 
}
//createTodoNoteBtn.addEventListener('click', showTodoCreateItem);

const marginTodoNote = () => {
  const marginValues = ['-5px', '1px', '5px', '10px', '15px', '20px'];
  const randomIndexArr = Math.floor(Math.random() * (marginValues.length)); // min + Math.random() * (max - min)
  return marginValues[randomIndexArr];
}
// Random styles for Todo Note
const rotateTodoNote = () => {
  const rotateValues = ['rotate(3deg)', 'rotate(1deg)', 'rotate(-1deg)', 'rotate(-3deg)', 'rotate(-5deg)', 'rotate(-10deg)'];
  const randomIndexArr = Math.floor(Math.random() * (rotateValues.length)); // min + Math.random() * (max - min)
  return rotateValues[randomIndexArr];
}

const colorTodoNote = () => {
  const colorValues = ['#c2ff3d', '#ff3de8', '#3dc2ff', '#04e022', '#bc83e6', '#ebb328'];
  const randomIndexArr = Math.floor(Math.random() * (colorValues.length)); // min + Math.random() * (max - min)
  return colorValues[randomIndexArr];
}

// Create Todo Note
const createTodoNote = () => {
  const newTodoNote = document.createElement('div');
  newTodoNote.classList.add('new-todo-note', 'new-todo-note_hover');
  const todoNoteText = document.createElement('p');
  const todoNoteItems = document.getElementsByClassName('new-todo-note');
  newTodoNote.append(todoNoteText);
  todoNoteText.innerHTML = todoTextArea.value;
  
  // If Todo Note is completed and removed, place instead of it a new Todo note on this place
  const arrayOfTodoNotes = Array.from(todoNoteItems);

  let indexOfEmptyNote = -1;
  for (let i = 0; i < arrayOfTodoNotes.length; i++) {
    if (arrayOfTodoNotes[i].classList.contains('new-todo-note_hidden')) {
      indexOfEmptyNote = i;
      break;
    }
  }

  if (indexOfEmptyNote !== -1) { 
    todoNotes[indexOfEmptyNote] = todoTextArea.value.replace('\n', '').trim();
    document.querySelector('.new-todo-note_hidden').before(newTodoNote);
    arrayOfTodoNotes[indexOfEmptyNote].remove();
  } if (indexOfEmptyNote === -1)  {
    todoNotes.push(todoTextArea.value.replace('\n', '').trim());
    todoNotesConatiner.append(newTodoNote);
  }

  // Add random styles for Todo Note
  newTodoNote.style.margin = `${marginTodoNote()}px`;
  newTodoNote.style.transform = rotateTodoNote();
  newTodoNote.style.backgroundColor = colorTodoNote();
  todoTextArea.value = '';

  // Todo hover
const hoverTodoNote = (event) => {
  if (event.type === 'mouseenter') newTodoNote.classList.add('new-todo-note_hover');
  if (event.type === 'mouseleave') newTodoNote.classList.remove('new-todo-note_hover');
}
  newTodoNote.addEventListener('mouseenter', hoverTodoNote);
  newTodoNote.addEventListener('mouseleave', hoverTodoNote);
  showTodoCreateItem();
}

const createTodoNoteByClick = () => {
  if (todoTextArea.value.length !== 0) {
  createTodoNote();
  } else {
    showTodoCreateItem();
    return;
  }
}

const createTodoNoteByEnter = (event) => {
  if (event.code !== 'Enter') return;
  if (todoTextArea.value.length === 1) {
    showTodoCreateItem();
    return;
  } else {
    createTodoNote();
    }
}

// Delete Todo note as completed

const deleteTodoNote = (event) => {
  if (!event.target.closest('.new-todo-note')) return;
  if (event.target.tagName === 'P') {
    event.target.style.textDecoration = 'line-through';
    // Modify todoNotes array (add '' instead element with 'line-through')
    Array.from(document.getElementsByClassName('new-todo-note')).forEach((element, index) => {
      if (element.firstElementChild.style.textDecoration === 'line-through' && todoNotes[index] === element.firstElementChild.textContent.trim()) todoNotes[index] = '';
    });
  }
  if (event.target.closest('.new-todo-note') && !event.target.closest('.new-todo-note p') && event.target.firstElementChild.style.textDecoration === 'line-through') {
    event.target.classList.add('new-todo-note_hidden');
  }
}

const deleteTodoNoteByDblclick = (event) => {
  if (event.target.closest('.new-todo-note')) {
  event.target.classList.add('new-todo-note_hidden');
    // Modify todoNotes array (add '' instead hidden element)
    Array.from(document.getElementsByClassName('new-todo-note')).forEach((element, index) => {
      if (element.classList.contains('new-todo-note_hidden') && todoNotes[index] === element.firstElementChild.textContent.trim()) todoNotes[index] = '';
    });
  }
  return;
}
todoNotesConatiner.addEventListener('click', deleteTodoNote);
todoNotesConatiner.addEventListener('dblclick', deleteTodoNoteByDblclick);

// Set / get active Todo Notes to / from LocalStorage
const setTodoToLocalStorage = () => {
  localStorage.setItem('todo', JSON.stringify(todoNotes));
}
window.addEventListener('beforeunload', setTodoToLocalStorage);

const getTodoToLocalStorage = () => {
  localStorage.getItem('todo') && (todoNotes = JSON.parse(localStorage.getItem('todo')));
}
window.onload = getTodoToLocalStorage();

// todoNotes = [] // <-- cancel data in LocalStorage (use during the developing)
// Show Todo Notes from LocalStorage
const createTodoNotesFromLocalStorage = () => {
  todoNotes.forEach((element) => {
    const newTodoNote = document.createElement('div');
    newTodoNote.classList.add('new-todo-note', 'new-todo-note_hover');
    const todoNoteText = document.createElement('p');
    newTodoNote.append(todoNoteText);
    todoNoteText.innerHTML = element;

    // Delete empty elements in the end of todoNotes array
    todoNotes = todoNotes.join(' ').trim().split(' ');
    // Show Todo Note
    todoNotesConatiner.append(newTodoNote);
    if (element === '') {
      newTodoNote.classList.add('new-todo-note_hidden');
    }

    newTodoNote.style.margin = `${marginTodoNote()}px`;
    newTodoNote.style.transform = rotateTodoNote();
    newTodoNote.style.backgroundColor = colorTodoNote();
    todoTextArea.value = '';

 // Todo hover
const hoverTodoNote = (event) => {
 if (event.type === 'mouseenter') newTodoNote.classList.add('new-todo-note_hover');
 if (event.type === 'mouseleave') newTodoNote.classList.remove('new-todo-note_hover');
}
 newTodoNote.addEventListener('mouseenter', hoverTodoNote);
 newTodoNote.addEventListener('mouseleave', hoverTodoNote);
   })
}
window.onload = createTodoNotesFromLocalStorage();


// Save the inputs selections of settings menu to LocalStorage (settingsMenuData object with all settings is stored in LocalStorage)

function setInputsPosInLocalStorage () {
  localStorage.setItem('inputs', JSON.stringify(settingsMenuData));
}
window.addEventListener('beforeunload', setInputsPosInLocalStorage);

// Save lang input selection of settings menu to LocalStorage (settingsMenuData object with all settings is stored in LocalStorage)
const setLangStorage = () => {
  localStorage.setItem('lang', settingsMenuData.language);
}
window.addEventListener('beforeunload', setLangStorage);








//const unsplashApiURL = 'https://api.unsplash.com/search/photos/&query='+word+'&per_page=9&client_id=lXBJOju1hoGHQf4hdVXExR96_QM2EU7UiNH23xWaU30'