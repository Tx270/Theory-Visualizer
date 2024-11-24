const nickname = document.getElementById("nickname");
var choosen;
var right = 0, wrong = 0, maxTurns = 4;
var sec = 0, min = 0, stop = false;
var username = "";
var block = false;
notes = notesSharps;


function playGuitarNote(note, octave) {
  console.log(sound);

  const soundKey = sharpToFlat(note) + octave;
  
  if (soundCache[soundKey]) {
    soundCache[soundKey].play();
  } else {
    console.log("nie ma pliku w cache!");
    const s = new Audio(baseUrl + `assets/audio/${sound}/` + sharpToFlat(note) + octave + ".mp3");
    s.play();
  }

  document.getElementById("choosen").style.transform = "scale(1.4)";
  setTimeout(function() {
    document.getElementById("choosen").style.transform = "scale(1)";
  }, 100);
}

function timer(){
  sec = 0, min = 0;
  var timer = setInterval(function(){
    if (stop === true) {
      clearInterval(timer);
      stop = false;
    }
    sec++;
    if(sec == 60) {
      sec = 0;
      min++;
    }
    if(sec < 10) { document.getElementById('timer').innerHTML=min+':0'+sec; }
    else { document.getElementById('timer').innerHTML=min+':'+sec; }
  }, 1000);
}

function calculateScore(correctAnswers, wrongAnswers, timeInSeconds) {
  const penalty = 2; // Kara za złą odpowiedź
  const timeFactor = 5; // Wpływ czasu na wynik

  const totalAnswers = correctAnswers + wrongAnswers

  const accuracyScore = (correctAnswers * 100) / totalAnswers;
  const penaltyScore = wrongAnswers * penalty;
  const timeScore = timeInSeconds / timeFactor;

  const finalScore = accuracyScore - penaltyScore - timeScore;
  return Math.floor(finalScore * 100);
}

// ########################################### - MAIN - #########################################################

function draw() {
  fretboard.style.gridTemplateColumns = `repeat(${tuning.length}, 45px) 1px`;
  fretboard.innerHTML = "";
  block = false;

  for (let fret = 0; fret <= 12; fret++) {
    const fretNumber = document.createElement('div');
    fretNumber.innerHTML = `<div>${fret}</div>`;
    fretNumber.classList.add('fret-number');

    fretNumber.style.gridRowStart = fret + 1;
    fretNumber.style.gridColumnStart = tuning.length + 1;

    fretboard.appendChild(fretNumber);
  }

  const rand1 = Math.floor(Math.random() * tuning.length);
  const rand2 = Math.floor(Math.random() * 13);
  let octave;

  tuning.forEach((openNote, stringIndex) => {
    openNote = openNote.slice(0, -1);
    openNote = flatToSharp(openNote);
    for (let fret = 0; fret <= 12; fret++) {
      const noteIndex = (notes.indexOf(openNote) + fret) % notes.length;
      const note = notes[noteIndex];

      const noteElement = document.createElement('div');
      noteElement.classList.add('string');
      
      if(rand1 === stringIndex && rand2 === fret) {
        octave = getOctave(rand1, rand2);
        choosen = note;
        noteElement.innerHTML = `<div class="note" id="choosen" onclick="playGuitarNote('${choosen}', ${octave});"></div>`;
      }

      if (markers.includes(fret)) {
        noteElement.style.backgroundColor = "#292929";
      }
      if (fret == 0) {
          noteElement.style.backgroundColor = "#262626";
          if(noteElement.innerHTML == "") {
            noteElement.innerHTML = note;
          }
      }

      noteElement.style.gridRowStart = fret + 1;
      noteElement.style.gridColumnStart = stringIndex + 1;

      fretboard.appendChild(noteElement);
    }
  });

  playGuitarNote(choosen, octave);
}

function main() {
  if(!isAlphaNumeric(nickname.value) || !nickname.value || nickname.value.length > 30) {
    alert('Enter a nickname consisting of only letters and numbers below 30 chars');
    return;
  }
  setTimeout(function () {
    username = nickname.value;
    Cookies.set('username', username, { expires: 14 });
    right = 0, wrong = 0;
    sec = 0, min = 0, stop = false;
    document.getElementById('datadisplay').style.display = 'flex';
    document.getElementById('noteInp').hidden = false;
    document.getElementById('startInfo').style.display = "none";
    document.getElementById('endInfo').style.display = "none";
    document.getElementById('leaderboard').style.display = "none";
    document.getElementById('right').innerText = "0";
    document.getElementById('wrong').innerText = "0";
    document.getElementById('timer').innerText = "0:00";
    fretboard.style.display = 'grid';
    fretboard.style.gridTemplateColumns = `repeat(${tuning.length}, 45px) 1px`;
    fretboard.style.gridTemplateRows = `repeat(13, calc(85vh/13 - 2px))`;
    fretboard.style.marginTop = 0;
    timer();
    draw();
  }, 300);
}

function init() {
  username = Cookies.get("username");
  nickname.value = username;
}

function entered(key) {
  let input = document.getElementById("noteInp");

  if (key == "Enter") {
    input.blur();
    return;
  }

  if (key !== "outclicked" || input.value === "" || block) { 
    return;
  }

  block = true;

  if(input.value.toUpperCase() === "H") { input.value = "B" }

  if(flatToSharp(input.value.toUpperCase()) === choosen) {
    right++;
    document.getElementById("choosen").style.backgroundColor = "green";
  } else {
    wrong++;
    document.getElementById("choosen").style.backgroundColor = "red";
  }
  document.getElementById("choosen").innerText = choosen;

  input.value = "";
  document.getElementById("right").innerText = right;
  document.getElementById("wrong").innerText = wrong;

  if(wrong+right >= maxTurns) {
    stop = true;
    const timer = setTimeout(() => {
      document.getElementById("loading").style.display = "flex";
      document.getElementById("loading").style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    }, 1500);

    setTimeout(finish, 1000, timer);
    return;
  }

  setTimeout(draw, 1000);
}

async function finish(timer) {
  let sc = calculateScore(right, wrong, sec + (min*60));
  let us = await fetchUser()
  if(!us || us < sc) { await addScore(sc); }
  await writeScore()
  clearTimeout(timer);
  document.getElementById("loading").style.display = "none";
  document.getElementById("loading").style.backgroundColor = "rgba(0, 0, 0, 0)";
  fretboard.style.display = "none";

  document.getElementById("endInfo").style.display = "flex";
  document.getElementById("leaderboard").style.display = "block";
  document.getElementById("datadisplay").style.display = "none";
  document.getElementById("noteInp").hidden = "true";
  if(sec < 10) { document.getElementById('time').innerHTML=min+':0'+sec; }
  else { document.getElementById('time').innerHTML=min+':'+sec; }
  document.getElementById("score").innerText = sc;
}

// ########################################### - DATABASE - #########################################################

async function fetchProx() {
  try {
    const response = await fetch(window.location.protocol	+ "//" + window.location.hostname + `/php/db.php?username=${username}&mode=prox`);
    const scores = await response.json();
    return scores;
  } catch (err) {
    console.error('Błąd przy pobieraniu wyników:', err);
  }
}

async function fetchUser() {
  try {
    const response = await fetch(window.location.protocol	+ "//" + window.location.hostname + `/php/db.php?username=${username}&mode=user`);
    const score = await response.json();
    if(score.length !== 0) { return score[0].score; }
    else { return 0; }
  } catch (err) {
    console.error('Błąd przy pobieraniu wyników:', err);
  }
}

async function fetchTop() {
  try {
    const response = await fetch(window.location.protocol	+ "//" + window.location.hostname + `/php/db.php?mode=top`);
    const scores = await response.json();
    return scores;
  } catch (err) {
    console.error('Błąd przy pobieraniu wyników:', err);
  }
}

async function addScore(score) {
  console.log(JSON.stringify({ username, score }));
  try {
    const response = await fetch(window.location.protocol	+ "//" + window.location.hostname + `/php/db.php?username=${username}&mode=add&score=${score}`);
    await response.json();
  } catch (err) {
    console.error('Błąd przy pobieraniu wyników:', err);
  }
}

async function writeScore() {
  const scoresTop = await fetchTop();
  const scoresProx = await fetchProx();
  const tbody = document.getElementById('leaderboardBody');
  tbody.innerHTML = '';

  function top() {
    scoresTop.forEach((score, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index+1}</td>
        <td>${score.username}</td>
        <td>${score.score}</td>
        <td>${(new Date(score.date).toLocaleString('pl-PL')).split(",")[0]}</td>
      `;
      if(score.username === username) { row.style.color = "hsl(var(--main), 93%, 40%)"; }
      tbody.appendChild(row);
    });
  }

  function prox() {
    scoresProx.forEach((score, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${score.place}</td>
        <td>${score.username}</td>
        <td>${score.score}</td>
        <td>${(new Date(score.date).toLocaleString('pl-PL')).split(",")[0]}</td>
      `;
      if(score.username === username) { row.style.color = "hsl(var(--main), 93%, 40%)"; }
      tbody.appendChild(row);
    });
  }

  if(scoresProx.length > 7) {
    prox();
  } else {
    top();
    const blank = document.createElement('tr');
    blank.innerHTML = '<td colspan="4">&#8226  &#8226  &#8226  &#8226</td>';
    tbody.appendChild(blank);
    prox();
  }
}