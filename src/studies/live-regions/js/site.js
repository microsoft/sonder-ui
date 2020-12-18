// handle loading live regions

const announcerEl = document.getElementById('site-announcer');

function initiateLoading(parentEl) {
  const loadingEls = parentEl.querySelectorAll('[data-loading-delay]');

  loadingEls.forEach((el) => {
    const delay = Number(el.getAttribute('data-loading-delay'));
    const verbosity = el.getAttribute('data-loading-verbosity');
    const loadingEl = document.createElement('div');

    el.style.display = 'none';
    loadingEl.innerText = 'Loading...';
    el.parentElement.appendChild(loadingEl);

    if (verbosity === 'high') {
      announcerEl.innerText = 'Loading';
    }
    else if (verbosity !== 'low' && delay > 500) {
      setTimeout(() => {
        announcerEl.innerText = 'Loading';
      }, 500);
    }

    setTimeout(() => {
      announcerEl.innerText = 'Content loaded.';
      el.parentElement.removeChild(loadingEl);
      el.style.display = 'block';
    }, delay);
  });
}

// handle news stories and filter
// news article filters
function initNews(city) {
  const filterEl = document.querySelector('filter-list');
  if (filterEl) {
    let articles = [`Warning: you need to evacuate`, `Evacuation notice sent for greater ${city} area`, `${city} in peril`, `Find your temporary safe shelter`, `Water levels increasing as hurricane approaches`, `10 suggestions for better hurricane names`, `What our previous hurricanes can teach us`, `National Guard on standby for relief efforts`, `Searching for a place to sleep`, `Where to expect the worst floods`, 'What to pack and what not to pack when evacuating', `List of evacuation shelters near ${city}`, 'How to take care of your pets during a disaster'];

    filterEl.items = articles;
  }
}

// handle water level updates
const waterAnnouncerEl = document.querySelector('batch-announcer');
const waterDisplay = document.getElementById('cur-water-level');
const maxLevel = 240;
let showUpdates = true;
let currentLevel = 10;

function getNewLevel(prevLevel) {
  const randomFactor = Math.random() - 0.3;
  let stepUp = Math.round(randomFactor * 5 + 2);
  let stepDown = Math.round(randomFactor * 3 - 2);

  if (prevLevel < maxLevel && prevLevel > maxLevel * 0.75) {
    stepUp = Math.round(randomFactor * 2 + 1);
  }

  return Math.max(10, prevLevel + (currentLevel > maxLevel ? stepDown : stepUp));
}

function displayLevel(level) {
  waterAnnouncerEl.announcement = `Water at ${level} inches`;
  waterDisplay.innerText = level;
}

// handle pausing updates
const pauseButton = document.querySelector('.pause-updates');
if (pauseButton) {
  pauseButton.addEventListener('click', pausePlayUpdates);
  document.addEventListener('keyup', (event) => {
    if ((event.key === 'p' || event.key === 'P') && event.altKey) {
      pausePlayUpdates();
    }
  });
}

function pausePlayUpdates() {
  if (pauseButton.innerText === 'Pause') {
    pauseButton.innerText = 'Start';
    showUpdates = false;
  }
  else {
    pauseButton.innerText = 'Pause';
    showUpdates = true;
  }
}

window.setInterval(() => {
  currentLevel = getNewLevel(currentLevel);
  if (showUpdates){
    displayLevel(currentLevel);
  }
}, 2500);

// handle PSA submit
const formEl = document.getElementById('text-alert');
const alertList = document.querySelector('.alert-list');
if (formEl) {
  const formResultEl = formEl.querySelector('.form-announcement');

  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const textareaEl = formEl.querySelector('textarea');

    if (textareaEl.value.trim().length === 0) {
      formResultEl.classList.add('error');
      formResultEl.classList.remove('success');
      formResultEl.setAttribute('role', 'alert');
      formResultEl.innerText = 'Send error: please enter a message before sending.';
    }
    else if (textareaEl.value.length <=100) {
      formResultEl.classList.add('success');
      formResultEl.classList.remove('error');
      formResultEl.innerText = 'Success! Public text message sent.';

      // add to alert list
      const newAlert = document.createElement('li');
      newAlert.innerText = textareaEl.value;
      alertList.prepend(newAlert);
      textareaEl.value = '';
    }
    else {
      formResultEl.classList.add('error');
      formResultEl.classList.remove('success');
      formResultEl.setAttribute('role', 'alert');
      formResultEl.innerText = 'Send error: please make sure the message is less than 100 characters';
    }
  });
}