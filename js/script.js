const fretboard = document.getElementById('fretboard');
const settings = document.getElementById("settings");
const menu = document.getElementById("menu");
const baseUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');
const notesFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const notesSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const markers = [3, 5, 7, 9, 12];
const intervals = ["pryma", "nona", "tercja", "kwarta", "kwinta", "seksta", "septyma"]
const tonal = window.Tonal;
var languages = JSON.parse(document.querySelector('meta[name="languages"]').getAttribute('content'));
const language = languages.pop();
var soundCache = {};
var tuning = [];
var sound = "";
var notes = [];
var sharpOrFlat = "";
var scaleName = "";
var isAnimating = false;

// ########################################## - HELPERS - ##########################################################

function encodeNote(input) {
  const conversionMap = {
      "A": "a",
      "A#": "b",
      "Ab": "c",
      "B": "d",
      "C": "e",
      "C#": "f",
      "Cb": "g",
      "D": "h",
      "D#": "i",
      "Db": "j",
      "E": "k",
      "Eb": "l",
      "F": "m",
      "F#": "n",
      "Fb": "o",
      "G": "p",
      "G#": "q",
      "Gb": "r"
  };

  let result = "";
  let i = 0;

  while (i < input.length) {
      const twoCharNote = input.slice(i, i + 2);
      
      if (conversionMap[twoCharNote]) {
          result += conversionMap[twoCharNote];
          i += 2;
      } else {
          const oneCharNote = input[i];
          result += conversionMap[oneCharNote] || "";
          i += 1;
      }
  }

  return result;
}

function decodeNote(input) {
  const conversionMap = {
      "a": "A",
      "b": "A#",
      "c": "Ab",
      "d": "B",
      "e": "C",
      "f": "C#",
      "g": "Cb",
      "h": "D",
      "i": "D#",
      "j": "Db",
      "k": "E",
      "l": "Eb",
      "m": "F",
      "n": "F#",
      "o": "Fb",
      "p": "G",
      "q": "G#",
      "r": "Gb"
  };

  let result = "";

  for (let char of input) {
      result += conversionMap[char] || "";
  }
  return result;
}

function sharpToFlat(note) {
  const sharpsToFlats = {
    "C#": "Db",
    "D#": "Eb",
    "F#": "Gb",
    "G#": "Ab",
    "A#": "Bb"
  };
  return sharpsToFlats[note] || note;
}

function flatToSharp(note) {
  const flatsToSharps = {
    "Db": "C#",
    "Eb": "D#",
    "Gb": "F#",
    "Ab": "G#",
    "Bb": "A#"
  };
  return flatsToSharps[note] || note;
}

function getOctave(stringIndex, fret) {
  const startOctave = parseInt(tuning[stringIndex].match(/\d+$/)[0]) - 1;
  const note = tuning[stringIndex].replace(/\d+$/, "");
  const noteIndex = notes.indexOf(note);
  const octaveShift = Math.floor((noteIndex + fret) / notes.length);
  const isAfterBToC = (noteIndex + fret) >= notes.indexOf("C");
  return startOctave + octaveShift + (isAfterBToC ? 1 : 0);
}

function chord2scale(chord) {
  let scale = ["", "", "", "", "", "", ""]
  chord.forEach(function (value, i) {
    scale[parseInt(tonal.Interval.distance(chord[0], value)[0]) - 1] = value;
  });
  return scale;
}

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

async function preloadSounds() {
  let end = Number(tuning.at(-1).slice(-1)) + 1;
  let start = Number(tuning[0].slice(-1));
  const range = Array.from({ length: (end - start) }, (v, k) => k + start);

  let loadedCount = 0;

  const promises = [];

  notesFlats.forEach(note => {
    range.forEach(octave => {
      const noteFile = sharpToFlat(note) + octave + ".mp3";
      const s = new Audio(baseUrl + `assets/audio/${sound}/` + noteFile);

      s.preload = 'auto';

      const soundPromise = new Promise((resolve) => {
        s.oncanplaythrough = () => {
          loadedCount++;
          resolve();
        };
      });

      promises.push(soundPromise);

      soundCache[note + octave] = s;
    });
  });
  await Promise.all(promises);
  console.log("Preloading complete");
}

// ########################################### - MODALS - #########################################################

function openSettings() {
  if (isAnimating) return;
  let notes = document.querySelectorAll(".note");
  notes.forEach(n => {
    n.style.transition = "0ms";
  });
  settings.classList.add('open');
  settings.classList.remove('closing');
}

function closeSettings() {
  if (isAnimating) return;
  isAnimating = true;
  let notes = document.querySelectorAll(".note");
  notes.forEach(n => {
    n.style.transition = "200ms ease-in-out";
  });
  settings.classList.add('closing');
  settings.style.backgroundColor = "rgba(0, 0, 0, 0)";
  settings.addEventListener('animationend', () => {
    isAnimating = false;
    settings.classList.remove('open', 'closing');
    settings.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }, { once: true });
}

function openMenu() {
  if (isAnimating) return;
  menu.classList.add('open');
  menu.classList.remove('closing');
}

function closeMenu() {
  if (isAnimating) return;
  isAnimating = true;
  menu.classList.add('closing');
  menu.style.backgroundColor = "rgba(0, 0, 0, 0)";
  menu.addEventListener('animationend', () => {
    isAnimating = false;
    menu.classList.remove('open', 'closing');
    menu.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }, { once: true });
}

// ########################################## - SETTINGS - ##########################################################

async function enteredTuning(key) {
  let input = document.getElementById("tuning");
  if (key == "Enter") {
    input.blur();
    return;
  }

  if(Cookies.get("mode") === "scales") {
    var scale = tonal.Scale.get(scaleName).notes;
  } else {
    var scale = tonal.Chord.get(scaleName).notes;
    scale = chord2scale(scale);
  }

  if (key == "outclicked") {
    if(input.value == "") {
      input.value = tuning.join(" ");
      return;
    }
    for(let note of input.value.split(" ")) {
      try {
        let n = note.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {return +v;});
        if(tonal.Note.get(note)["empty"] || n > 7 || n < 1) {
          alert("Not a valid tuning!")
          input.value = tuning.join(" ");
          break
        }
      } catch {
        alert("Not a valid tuning!")
        input.value = tuning.join(" ");
        break
      }
    }

    tuning = input.value.split(" ");
    input.placeholder = tuning;
    document.getElementById("fretboard").innerHTML = "";
    Cookies.set('tuning', tuning.join("-"), { expires: 14 });
    await preloadSounds();
    draw(scale);
  } else if(key == "clicked") {
    input.placeholder = input.value;
    input.value = "";
  }
}

async function soundChange() {
  sound = document.getElementById("sound").value;
  Cookies.set('sound', sound, { expires: 14 });
  await preloadSounds()
}

function scalesOrChords(value) {
  Cookies.set('mode', value, { expires: 14 });
  if(value === "chords") {
    document.getElementById("scaleInp").value = scaleName[0] + (scaleName[1] === "#" || scaleName[1] === "b" ? scaleName[1] : "") + "9";
    scaleName = document.getElementById("scaleInp").value;
    document.getElementById("scaleInp").placeholder = scaleName;
    Cookies.set('scale', scaleName, { expires: 14 });
    draw(chord2scale(tonal.Chord.get(scaleName.replace("-"," ")).notes));
  } else {
    document.getElementById("scaleInp").value = scaleName[0] + (scaleName[1] === "#" || scaleName[1] === "b" ? scaleName[1] : "") + " major";
    scaleName = document.getElementById("scaleInp").value;
    document.getElementById("scaleInp").placeholder = scaleName;
    Cookies.set('scale', scaleName, { expires: 14 });
    draw(tonal.Scale.get(scaleName.replace("-"," ")).notes);
  }
}

function notesOrNumbers(value) {
  Cookies.set('display', value, { expires: 14 });
  const items = document.querySelectorAll('#fretboard .note');
  items.forEach(item => {
    if(value === "numbers") {
      if(Cookies.get("mode") === "chords") {
        let num = item.id[3].charCodeAt(0) - 64;
        //TODO: obsługa interwałów w akordach
        item.textContent = num.toString();
      } else {
        item.textContent = (item.id[3].charCodeAt(0) - 64).toString();
      }
    } else {
      let note = item.id[0];
      if(item.id[0].toUpperCase() == note) {
        item.textContent = note;
      } else {
        if(sharpOrFlat === "sharp") {
          item.textContent = note.toUpperCase() + "#";
        } else {
          item.textContent = note.toUpperCase() + "b";
        }
      }
    }
  });
}

function colorChange(value) {
  document.getElementById("colorChangeRange").style.backgroundColor = 'hsl(' + value + ', 93%, 30%)';
  document.documentElement.style.cssText = "--main: " + value;
}

// ########################################## - TRANSLATIONS - ##########################################################

async function loadTranslation(language) {
  try {
    const response = await fetch(`/languages/${language}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const elements = document.querySelectorAll('.trn');

    elements.forEach(element => {
      const key = element.id;

      if (data[key]) {
        const span = element.querySelector('span');

        if (span) {
          span.textContent = data[key];
        } else {
          element.textContent = data[key];
        }
      }
    });
  } catch (error) {
    console.error('Error loading translation:', error);
  }
}

// ########################################## - STARTER - ##########################################################

async function starter() {
  await loadTranslation(language);

  if (window.innerWidth > 768) {
    document.getElementById('unsupported').style.display = 'flex';
    return;
  }
  
  window.onclick = function(event) { 
    event.target === settings && (closeSettings());
    event.target === menu && (closeMenu());
  }
  
  Cookies.get('scale') === undefined && Cookies.set('scale', 'C-major', { expires: 14 });
  Cookies.get('mode') === undefined && Cookies.set('mode', 'scales', { expires: 14 });
  Cookies.get('color') === undefined && Cookies.set('color', '200', { expires: 14 });
  Cookies.get('display') === undefined && Cookies.set('display', 'notes', { expires: 14 });
  Cookies.get('sound') === undefined && Cookies.set('sound', 'acoustic_guitar_nylon', { expires: 14 });
  Cookies.get('tuning') === undefined && Cookies.set('tuning', 'E2-A2-D3-G3-B3-E4', { expires: 14 });
  Cookies.get('username') === undefined && Cookies.set('username', '', { expires: 14 });

  document.getElementById("colorChangeRange").value = Cookies.get("color");
  colorChange(Cookies.get("color"));

  tuning = Cookies.get('tuning').split("-");
  document.getElementById("tuning").value = tuning.join(" ");

  sound = Cookies.get("sound");
  document.getElementById("sound").value = sound;

  Cookies.get('mode') == "chords" && (document.getElementById("funcModeChord").checked = "true");
  Cookies.get('display') == "numbers" && (document.getElementById("displayModeNumber").checked = "true");

  document.getElementById("nav").style.display = "flex";

  preloadSounds();

  init();
}