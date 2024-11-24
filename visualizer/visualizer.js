function draw(scale) {
  fretboard.style.display = 'grid';
  fretboard.style.gridTemplateColumns = `repeat(${tuning.length}, 45px) 1px`;
  fretboard.style.gridTemplateRows = `repeat(13, calc(90vh/13 - 2px))`;
  console.log(`Scale ${Cookies.get("scale").replace("-"," ")} is ${scale}`)
  if(scale.join().indexOf("b") !== -1) {
    notes = notesFlats;
    sharpOrFlat = "flat";
  } else {
    notes = notesSharps;
    sharpOrFlat = "sharp";
  }

  for (let fret = 0; fret <= 12; fret++) {
    const fretNumber = document.createElement('div');
    fretNumber.innerHTML = `<div>${fret}</div>`;
    fretNumber.classList.add('fret-number');

    fretNumber.style.gridRowStart = fret + 1;
    fretNumber.style.gridColumnStart = tuning.length + 1;

    fretboard.appendChild(fretNumber);
  }

  tuning.forEach((openNote, stringIndex) => {
    let originalOpenNote;
    openNote = openNote.slice(0, -1);
    if(sharpOrFlat == "sharp" && openNote.indexOf("b") !== -1) {
      originalOpenNote = openNote;
      openNote = flatToSharp(openNote);
    } else if(sharpOrFlat == "flat" && openNote.indexOf("#") !== -1) {
      originalOpenNote = openNote;
      openNote = sharpToFlat(openNote);
    }
    for (let fret = 0; fret <= 12; fret++) {
      const noteIndex = (notes.indexOf(openNote) + fret) % notes.length;
      const note = notes[noteIndex];
      
      let id = note.length === 1 ? note : note[0].toLowerCase(); // nuta z oznaczeniem krzyżyka/bemola
      id += encodeNote(openNote); // otwarta nuta zakodowana
      id += String.fromCharCode(fret + 65); // próg zakodowany
      id += String.fromCharCode(scale.indexOf(note) + 65); // stopień skali zakodowany
      id += getOctave(stringIndex, fret); // oktawa
      id += stringIndex.toString(); // numer struny

      const noteElement = document.createElement('div');
      noteElement.classList.add('string');
      let noteDiv = `<div class="note ${intervals[scale.indexOf(note)]}" id="${id}" onclick="playGuitarNote(this.id)">${note}</div>`;
      noteElement.innerHTML = noteDiv;

      if (markers.includes(fret)) {
        noteElement.style.backgroundColor = "#292929";
      }
      if (fret == 0) {
          noteElement.style.backgroundColor = "#262626";
      }
      if(id[3] == "@") {
        noteElement.innerHTML = "";
        if(fret == 0) {
          if(originalOpenNote !== undefined) {
            noteElement.innerHTML = originalOpenNote;
          } else {
            noteElement.innerHTML = note;
          }
        }
      }

      noteElement.style.gridRowStart = fret + 1;
      noteElement.style.gridColumnStart = stringIndex + 1;

      fretboard.appendChild(noteElement);
    }
  });

  if(Cookies.get('display') == "numbers") {
    notesOrNumbers("numbers");
  }
}

function init() {
  document.getElementById("scaleInp").value = Cookies.get("scale").replace("-"," ");

  scaleName = document.getElementById("scaleInp").value;
  document.getElementById("scaleInp").placeholder = scaleName;
  
  if( Cookies.get('mode') === "chords") {
    draw(chord2scale(tonal.Chord.get(Cookies.get("scale").replace("-"," ")).notes));
  } else {
    draw(tonal.Scale.get(Cookies.get("scale").replace("-"," ")).notes);
  }
}

function entered(key) {
  let input = document.getElementById("scaleInp");
  if(Cookies.get("mode") === "scales") {
    var scale = tonal.Scale.get(input.value).notes;
  } else {
    var scale = tonal.Chord.get(input.value).notes;
    scale = chord2scale(scale);
  }

  if (key == "Enter") {
    input.blur();
    return;
  }

  if (key == "outclicked") {
    if(scale.length > 0 && scale.some(element => element !== "")) {
      scaleName = input.value;
      input.placeholder = scaleName;
      Cookies.set('scale', input.value.replace(" ", "-"), { expires: 14 });

      let notes = document.querySelectorAll(".note");
      notes.forEach(n => {
        n.style.transform = "scale(0)";
      });
      setTimeout(() => {
        document.getElementById("fretboard").innerHTML = "";
        draw(scale);
      }, 200);
    }
    else if(input.value == "") {
      input.value = scaleName;
    }
    else {
      alert("Not a valid scale/chord!")
      input.value = scaleName;
    }
  } 
  else if(key == "clicked") {
    input.value = "";
  }
}

function playGuitarNote(id) {
  let note;
  if(id[0].toUpperCase() !== id[0]) {
    if(notes.join("")[notes.join("").indexOf(id[0].toUpperCase()) + 1] === "b") {
      note = notes.join("")[notes.join("").indexOf(id[0].toUpperCase())] + notes.join("")[notes.join("").indexOf(id[0].toUpperCase()) + 1] + id[4];
    } else {
      note = sharpToFlat(notes.join("")[notes.join("").indexOf(id[0].toUpperCase())] + notes.join("")[notes.join("").indexOf(id[0].toUpperCase()) + 2]) + id[4];
    }
  } else {
    note = id[0] + id[4];
  }
  document.getElementById('guitarSound').src = baseUrl + `/audio/${sound}/` + note + ".mp3";
  document.getElementById('guitarSound').play();
  document.getElementById(id).style.transform = "scale(1.4)";
  setTimeout(function() {
    document.getElementById(id).style.transform = "scale(1)";
  }, 100);
}