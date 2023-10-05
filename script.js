// Select DOM elements
const inputText = document.querySelector('#inputText');
const listenBtn = document.querySelector('#speechListen');
const pauseBtn = document.querySelector('#speechPause');
const resumeBtn = document.querySelector('#speechResume');
const cancelBtn = document.querySelector('#speechCancel');
const msg = document.querySelector('.message');
const voicesSelect = document.querySelector('#voices'); // Select element for voices

// Web Speech API
const speech = new SpeechSynthesisUtterance();
speech.rate = 0.7; // Speed (Value range: 0.1 to 10)
speech.pitch = 1; // Pitch (Value range: 0 to 2)
speech.volume = 1; // Volume (Value range: 0 to 1)

// Fetch voices and populate the select element
function populateVoices() {
  const voices = speechSynthesis.getVoices();
  voicesSelect.innerHTML = ''; // Clear existing options

  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voicesSelect.appendChild(option);
  });
}

// Event listener for voices change
speechSynthesis.onvoiceschanged = populateVoices;

// Event listeners and their corresponding functions
listenBtn.addEventListener('click', () =>
  handleSpeech('Speech Started', 'Type something in the box', speechListen)
);
pauseBtn.addEventListener('click', () =>
  handleSpeech('Speech is paused, Click on Resume/Cancel', '', speechPause)
);
resumeBtn.addEventListener('click', () =>
  handleSpeech('Speech Resumed', '', speechResume)
);
cancelBtn.addEventListener('click', () =>
  handleSpeech('Speech Cancelled!', '', speechCancel)
);

function handleSpeech(message, emptyMessage, func) {
  // Handle empty input case
  if (inputText.value === '' && emptyMessage !== '') {
    showMessage(emptyMessage);
  } else {
    // Set speech text and selected voice, then speak
    speech.text = inputText.value;
    const selectedVoiceName = voicesSelect.value;
    const selectedVoice = speechSynthesis
      .getVoices()
      .find((voice) => voice.name === selectedVoiceName);
    if (selectedVoice) {
      speech.voice = selectedVoice;
    }
    func();
    showMessage(message);
  }
}

function speechListen() {
  speechSynthesis.speak(speech);
}

function speechPause() {
  speechSynthesis.pause();
}

function speechResume() {
  speechSynthesis.resume();
}

function speechCancel() {
  speechSynthesis.cancel();
}

function showMessage(message) {
  msg.classList.add('notification');
  msg.textContent = message;

  // Clear message after 2 seconds
  setTimeout(() => {
    msg.classList.remove('notification');
    msg.textContent = '';
  }, 2000);
}

// Speech Synthesis Events
speech.addEventListener('start', () => console.log('Speech Started'));
speech.addEventListener('end', () => console.log('Speech Ended'));
speech.addEventListener('pause', () => console.log('Speech Paused'));
speech.addEventListener('resume', () => console.log('Speech Resumed'));
speech.addEventListener('error', () =>
  console.log('Speech got some error / cancelled')
);
