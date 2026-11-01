# Momentum task

Momentum — a personal start page. It is a web application inspired by the browser extension of the same name.
It transforms your start page into a personal space that brings together a clock, calendar, greeting, weather forecast, quotes, a music player, and a to-do list.

Users can customize the page’s appearance, select the interface language, choose the source for background images and thematic photo categories, and control which individual widgets are displayed.

[Task description](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/momentum/momentum-stage1.md)

[Deploy](https://intrstng.github.io/Momentum/)

### Key FeaturesInterface Personalization:

    - Choose your preferred language (English or Russian), select the source for background images, and customize which widgets are displayed

    - **Dynamic Background**: Automatically rotating images with smooth loading; photos are fetched via the Unsplash and Flickr APIs, or sourced from a local GitHub image collection

    - **Clock and Calendar**: Displays the current time and date, localized according to your chosen language

    - **Greeting**: A dynamic greeting that changes based on the time of day

    - **Weather**: Real-time weather updates via the OpenWeatherMap API, with the option to select your city

    - **Quotes**: Displays random quotes and sayings, with support for multiple sources

    - **Audio Player**: Play music tracks, skip between songs, and control volume and playback progress

    - **To-Do List**: Create, complete, and delete tasks, with the ability to save your to-do list

    - **Settings Persistence**: Uses LocalStorage to remember your username, language, city, interface preferences, and to-do list


### Technologies

JavaScript (ES6+), HTML5, CSS3, Sass/SCSS, Fetch API, Async/Await, REST API, LocalStorage, Git

### Implemented technical solutions
Asynchronous interaction with external APIs
Dynamic creation and updating of DOM elements
Audio handling via HTMLAudioElement
Management of user settings state
Interface localization
Error handling during API data retrieval
Persistence of user data across page reloads
