/* eslint-disable no-undef, no-unused-vars */
function hasConsent (category) {
  // TODO: placeholder function
  return true
}

function getLocalStorage (key, def, category) {
  if (hasConsent(category)) {
    return localStorage.getItem(key)
  } else {
    return def
  }
}

function setLocalStorage (key, val, category) {
  if (hasConsent(category)) {
    localStorage.setItem(key, val)
  }
}

function getSessionStorage (key, def, category) {
  if (hasConsent(category)) {
    return sessionStorage.getItem(key)
  } else {
    return def
  }
}

function setSessionStorage (key, val, category) {
  if (hasConsent(category)) {
    sessionStorage.setItem(key, val)
  }
}

;/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2022 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const supportedThemes = ['auto', 'dark', 'light'];

  // retrieves the currently stored theme from local storage
  const storedTheme = getLocalStorage('theme', 'auto', 'functional')

  // retrieves the theme preferred by the client, defaults to light
  function getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // retrieves the current theme, either from local storage or client's preferences
  function getTheme() {
    if (storedTheme) {
      return storedTheme
    } else {
      const preference = getPreferredTheme()
      setLocalStorage('theme', preference, 'functional')
      return preference
    }
  }

  // applies and stores requested theme
  function setTheme(theme) {
    if (!supportedThemes.includes(theme)) {
      theme = 'auto'
    }
    setLocalStorage('theme', theme, 'functional')

    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (getPreferredTheme()))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }

    document.querySelectorAll('.navbar-mode-selector').forEach(chk => {
      chk.checked = (document.documentElement.getAttribute('data-bs-theme') === 'light')
    })
  }

  // alternates the currently active theme
  function toggleTheme() {
    const target = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'
    setTheme(target)
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (storedTheme !== 'light' || storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.navbar-mode-selector').forEach(chk => {
      chk.addEventListener('change', function () {
        document.documentElement.setAttribute('data-bs-theme-animate', 'true')
        toggleTheme()
      })
    })
  })

  // initialize theme directly when script is invoked
  setTheme(getTheme())
})();
/* eslint-disable */(() => {
  'use strict'

  const folder = '/my-hinode-site/'

  // Function to get the selected language from local storage
  function getLanguage () {
    return getLocalStorage('selectedLanguage', document.documentElement.lang, 'functional')
  }

  // Function to set the selected language in local storage
  function setLanguage (language) {
    setLocalStorage('selectedLanguage', language, 'functional')
  }
  
  // Function to apply the selected language to the website
  function applyLanguage (language, href) {
    if (document.documentElement.lang !== language) {
      if (href) {
        if (window.location.pathname !== href) {
          window.location.href = href
        }
      } else {
        let target = folder + language + '/'
        if (window.location.href !== target) {
          window.location.href = target
        }
      }
    }
  }

  // Event listener for language selection
  document.addEventListener('DOMContentLoaded', () => {
    // override stored language when query string contains force is true
    let params = new URLSearchParams(document.location.search)
    let force = params.get('force')
    if (force !== null && force.toLowerCase() == 'true') {
      setLanguage(document.documentElement.lang)
      return
    }

    // continue with regular code
    const storedLanguage = getLanguage()
    const languageItems = document.querySelectorAll('#language-selector[data-translated=true] .dropdown-item')

    const link = document.querySelector("link[rel='canonical']")
    let alias = ''
    if (link !== null) {
      alias = link.getAttribute('href')
    }
    
    if ((alias !== '') && (window.location.href !== alias)) {
      window.location.href = alias
    } else if (languageItems.length > 0) {
      // Redirect if the stored language differs from the active language
      if ((storedLanguage) && (document.documentElement.lang !== storedLanguage)) {
        languageItems.forEach(item => {
          if (item.getAttribute('hreflang') === storedLanguage) {
            applyLanguage(storedLanguage, item.getAttribute('href'))
          }
        })
      }

      // Update the stored language when the user selects a new one
      languageItems.forEach(item => {
        item.addEventListener('click', () => {
          const selectedLanguage = item.getAttribute('hreflang')

          if (selectedLanguage) {
            setLanguage(selectedLanguage)
          }
        })
      })
    }
    else {
      // overrule the current stored language when no translation is available
      setLanguage(document.documentElement.lang)
    }
  })
})()/* eslint-enable */
