// This script ihas the following files companions:
//  - theme.changer.css
//  - light-icon.svg
//  - dark-icon.svg
//
//
// In the head add the css file or includit on another css:
//  - @import url('theme-changer.css');
//  - <link rel="stylesheet" href="_html/theme-changer.css" />
//
// To use add the following into the body
// replace '_html' with the proper path:
//
//   <div class="theme-toggle-container">
//     <img id="theme-light-icon" alt="light theme icon" src="_html/light-icon.svg">
//     <img id="theme-dark-icon" alt="dark theme icon" src="_html/dark-icon.svg">
//     <label class="theme-toggle-switch" for="theme-toggle-input">
//         <button id="theme-toggle-input">Toggle Dark-Mode</button>
//         <div class="theme-toggle-switch__control"></div>
//     </label>
//   </div>
//   <script src="_html/theme-changer.js"></script>
//
// @author: Paulo Dias

(() => {
    const btn = document.getElementById("theme-toggle-input");

    const osPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    const preferredTheme = localStorage.getItem('theme') || osPreference;
    
    const sunIcon = document.getElementById('theme-light-icon');
    const moonIcon = document.getElementById('theme-dark-icon');

    var currentTheme = preferredTheme;

    const setTheme = (theme, persist = true) => {
        const htmlElem = document.documentElement;
        if (theme == "dark") {
            htmlElem.classList.add("dark");
            htmlElem.classList.remove("light");
            btn.checked = true;
        } else {
            htmlElem.classList.remove("dark");
            htmlElem.classList.add("light");
            btn.checked = false;
        }
        currentTheme = theme;

        if (persist) {
            localStorage.setItem("theme", theme);
        }
    }

    const updateUI = (theme) => {
        const isLight = theme === 'dark';
        (isLight ? sunIcon : moonIcon).classList.add('active');
        (isLight ? moonIcon : sunIcon).classList.remove('active');
    }

    btn.addEventListener("click", function () {
        const htmlElem = document.documentElement;
        if (currentTheme == "dark") {
            htmlElem.classList.remove("dark");
            htmlElem.classList.add("light");
        } else {
            htmlElem.classList.add("dark");
            htmlElem.classList.remove("light");
        }
        var theme = currentTheme == "dark"
            ? "light"
            : "dark";
        currentTheme = theme;
        localStorage.setItem("theme", theme);

        updateUI(theme);
    });

    setTheme(preferredTheme, false);
    updateUI(preferredTheme);
})();

// Not tested bellow this line //

const insertThemeToggleElementIntoBody = ((
    baseUrl = '',
    parentElement = document.getElementsByTagName('body')[0],
    prependOrAppend = true) => {

//   <div class="theme-toggle-container">
//     <img id="theme-light-icon" alt="light theme icon" src="_html/light-icon.svg">
//     <img id="theme-dark-icon" alt="dark theme icon" src="_html/dark-icon.svg">
//     <label class="theme-toggle-switch" for="theme-toggle-input">
//         <button id="theme-toggle-input">Toggle Dark-Mode</button>
//         <div class="theme-toggle-switch__control"></div>
//     </label>
//   </div>
//   <script src="_html/theme-changer.js"></script>

    // Create new Element
    var containerDiv = document.createElement('div');
    containerDiv.classList.add('theme-toggle-container');
    var imageLight = document.createElement('img');
    var imageDark = document.createElement('img');
    imageLight.id = 'theme-light-icon';
    imageDark.id = 'theme-dark-icon';
    imageLight.setAttribute('alt', 'light theme icon');
    imageDark.setAttribute('alt', 'dark theme icon');
    imageLight.setAttribute('src', baseUrl + 'light-icon.svg');
    imageDark.setAttribute('src', baseUrl + 'dark-icon.svg');

    containerDiv.appendChild(imageLight);
    containerDiv.appendChild(imageDark);

    var labelElem = document.createElement('label');
    labelElem.classList.add('theme-toggle-switch');
    labelElem.setAttribute('for', 'theme-toggle-input');

    var buttonElem = document.createElement('button');
    buttonElem.id = 'theme-toggle-input';
    buttonElem.appendChild(document.createTextNode('Toggle Dark-Mode'));

    var toggleCtlElem = document.createElement('div');
    toggleCtlElem.classList.add('theme-toggle-switch__control');

    labelElem.appendChild(buttonElem);
    labelElem.appendChild(toggleCtlElem);

    containerDiv.appendChild(labelElem);

    // Now the script element
    var scriptElem = document.createElement('script');
    scriptElem.src = baseUrl + 'theme-changer.js';

    if (prependOrAppend) {
        parentElement.prepend(containerDiv);
        parentElement.prepend(scriptElem);
    } else {
        parentElement.appendChild(containerDiv);
        parentElement.appendChild(scriptElem);
    }
})
    
const insertStylesheetIntoHead = ((baseUrl = '') => {
    var head = document.getElementsByTagName('HEAD')[0]; 
    // Create new link Element
    var link = document.createElement('link');
    // set the attributes for link element 
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = baseUrl + 'theme-changer.css';

    // Append link element to HTML head
    head.appendChild(link);
})
