//! This script ihas the following files companions:
//!  - theme.changer.css
//!  - light-icon.svg
//!  - dark-icon.svg
//!
//!
//! In the head add the css file or include it on another css
//! (replace '_html' with the proper path):
//!  - <link rel="stylesheet" href="_html/theme-changer.css" />
//!  - @import url('theme-changer.css');
//!
//! To use add the following into the body
//! (replace '_html' with the proper path):
//!
//!   <div class="theme-toggle"></div>
//!   <script src="_html/theme-changer.js"></script>
//!
//! @author: Paulo Dias

(() => {
    const insertThemeToggleElementsIntoThemeTogleElement = (() => {
      //   <div class="theme-toggle">
      //     <!-- img id="theme-light-icon" alt="light theme icon" src="_html/light-icon.svg" -->
      //     <!-- img id="theme-dark-icon" alt="dark theme icon" src="_html/dark-icon.svg" -->
      //     <label class="theme-toggle-switch" for="theme-toggle-input">
      //         <!-- button id="theme-toggle-input">Toggle Dark-Mode</button -->
      //         <input type="checkbox" id="theme-toggle-input" checked=""></input>
      //         <div class="theme-toggle-switch__control"></div>
      //     </label>
      //   </div>
      //   <script src="_html/theme-changer.js"></script>
      const containerDiv = document.getElementsByClassName('theme-toggle')[0];

      var labelElem = document.createElement('label');
      labelElem.classList.add('theme-toggle-switch');
      labelElem.setAttribute('for', 'theme-toggle-input');

      // var buttonElem = document.createElement('button');
      // buttonElem.id = 'theme-toggle-input';
      // buttonElem.appendChild(document.createTextNode('Toggle Dark-Mode'));

      var checkboxElem = document.createElement('input');
      checkboxElem.setAttribute('type', 'checkbox');
      checkboxElem.id = 'theme-toggle-input';
      checkboxElem.setAttribute('checked', '');

      var toggleCtlElem = document.createElement('div');
      toggleCtlElem.classList.add('theme-toggle-switch__control');

      // labelElem.appendChild(buttonElem);
      labelElem.appendChild(checkboxElem);
      labelElem.appendChild(toggleCtlElem);

      containerDiv.appendChild(labelElem);
    })

    insertThemeToggleElementsIntoThemeTogleElement();
    const btn = document.getElementById("theme-toggle-input");

    const osPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    const preferredTheme = localStorage.getItem('theme') || osPreference;
    
    // const sunIcon = document.getElementById('theme-light-icon');
    // const moonIcon = document.getElementById('theme-dark-icon');

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
        // const isLight = theme === 'dark';
        // (isLight ? sunIcon : moonIcon).classList.add('active');
        // (isLight ? moonIcon : sunIcon).classList.remove('active');
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
