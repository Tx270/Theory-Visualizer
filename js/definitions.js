const fretboard = document.getElementById('fretboard');
const settings = document.getElementById("settings");
const scaleMenu = document.getElementById("scaleMenu");
const menu = document.getElementById("menu");
const baseUrl = document.querySelector('meta[name="base-url"]').getAttribute('content');
const notesFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const notesSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const markers = [3, 5, 7, 9, 12];
const intervals = ["pryma", "nona", "tercja", "kwarta", "kwinta", "seksta", "septyma"]
const tonal = window.Tonal;
var languages = JSON.parse(document.querySelector('meta[name="languages"]').getAttribute('content'));
const languageGet = document.querySelector('meta[name="languageGet"]').getAttribute('content');
var language = languages.pop();
var soundCache = {};
var scaleRarity = "common";
var tuning = [];
var sound = "";
var notes = [];
var sharpOrFlat = "";
var scaleName = "";
var isAnimating = false;

var changedSettings = {
    funcMode: false,
    displayMode: false,
    tuning: false,
    sound: false,
    color: false,
    language: false,
    su45: true
}

const scaleNames = { 
  common: [
    "major,ionian",
    "minor,aeolian",
    "pentatonic,major pentatonic",
    "major blues",
    "minor blues,blues",
    "melodic minor",
    "harmonic minor",
    "bebop",
    "diminished,whole-half diminished",
    "dorian",
    "lydian",
    "mixolydian,dominant",
    "phrygian",
    "locrian"
  ],
  rare: [
    "ionian pentatonic",
    "mixolydian pentatonic,indian",
    "ritusen",
    "egyptian",
    "neopolitan major pentatonic",
    "vietnamese 1",
    "pelog",
    "composite blues",
    "kumoijoshi",
    "hirajoshi",
    "iwato",
    "in-sen",
    "lydian pentatonic,chinese",
    "malkos raga",
    "locrian pentatonic,minor seven flat five pentatonic",
    "minor pentatonic,vietnamese 2",
    "minor six pentatonic",
    "flat three pentatonic,kumoi",
    "flat six pentatonic",
    "scriabin",
    "whole tone pentatonic",
    "lydian #5P pentatonic",
    "lydian dominant pentatonic",
    "minor #7M pentatonic",
    "super locrian pentatonic",
    "minor hexatonic",
    "augmented",
    "piongio",
    "prometheus neopolitan",
    "prometheus",
    "mystery #1",
    "six tone symmetric",
    "whole tone,messiaen's mode #1",
    "messiaen's mode #5",
    "chromatic"
  ],
  exotic: [
    "locrian major,arabian",
    "double harmonic lydian",
    "altered,super locrian,diminished whole tone,pomeroy",
    "locrian #2,half-diminished,aeolian b5",
    "mixolydian b6,melodic minor fifth mode,hindu",
    "lydian dominant,lydian b7,overtone",
    "lydian augmented",
    "dorian b2,phrygian #6,melodic minor second mode",
    "ultralocrian,superlocrian bb7,superlocrian diminished",
    "locrian 6,locrian natural 6,locrian sharp 6",
    "augmented heptatonic",
    "dorian #4,ukrainian dorian,romanian minor,altered dorian",
    "lydian diminished",
    "leading whole tone",
    "lydian minor",
    "phrygian dominant,spanish,phrygian major",
    "balinese",
    "neopolitan major",
    "harmonic major",
    "double harmonic major,gypsy",
    "hungarian minor",
    "hungarian major",
    "oriental",
    "flamenco",
    "todi raga",
    "persian",
    "enigmatic",
    "major augmented,major #5,ionian augmented,ionian #5",
    "lydian #9",
    "messiaen's mode #4",
    "purvi raga",
    "spanish heptatonic",
    "bebop minor",
    "bebop major",
    "bebop locrian",
    "minor bebop",
    "ichikosucho",
    "minor six diminished",
    "half-whole diminished,dominant diminished,messiaen's mode #2",
    "kafi raga",
    "messiaen's mode #6",
    "messiaen's mode #3",
    "messiaen's mode #7"
  ]
};
