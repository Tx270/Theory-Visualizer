<!DOCTYPE html>
<html lang="en">
<head>
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/head.php'; ?>
</head>
<body onload="init()">
  <script> const baseUrl = <?php echo json_encode((require $_SERVER['DOCUMENT_ROOT'] . '/private/config.php')['BASE_URL']);?>; </script>

  <audio id="guitarSound"></audio>

  <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/menu.php'; ?>

  <div id="settings" class="modal">
    <div id="settings-content" class="modal-content">
      <span class="close" onclick="closeSettings();">&times;</span>
      <label id="funcModeScaleLabel"><input type="radio" value="scales" name="funcMode" id="funcModeScale" onchange="scalesOrChords(this.value)" checked="true"> Scales Mode </label>
      <label><input type="radio" value="chords" name="funcMode" id="funcModeChord" onchange="scalesOrChords(this.value)"> Chords Mode </label>
      <label id="displayModeNoteLabel"><input type="radio" value="notes" name="displayMode" id="displayModeNote" onchange="notesOrNumbers(this.value)" checked="true"> Note Names </label>
      <label><input type="radio" value="numbers" name="displayMode" id="displayModeNumber" onchange="notesOrNumbers(this.value)"> Harmonic Degrees</label>
      <label> Tuning: <br> <input list="tunings" type="text" id="tuning" spellcheck="false" onkeypress="enteredTuning(event.key)" onfocusout="enteredTuning('outclicked')" onclick="enteredTuning('clicked')"></label>
      <datalist id="tunings">
        <option value="E2 A2 D3 G3 B3 E4">E Standard</option>
        <option value="D2 A2 D3 G3 B3 E4">Drop D</option>
        <option value="E1 A1 D2 G2">Bass Standard</option>
        <option value="B1 E2 A2 D3 G3 B3 E4">7 String Standard</option>
        <option value="Eb2 Ab2 Db3 Gb3 Bb3 Eb4">Eb Standard</option>
        <option value="E2 B2 E3 G#3 B3 E4">Open E</option>
        <option value="E2 A2 E3 A3 C#3 E4">Open A</option>
      </datalist>
      <label> Sound: <br> <select id="sound" onchange="soundChange()">
        <option value="acoustic_guitar_nylon"> Classical guitar </option>
        <option value="acoustic_guitar_steel"> Acustic guitar </option>
        <option value="electric_guitar_clean"> Electric Clean </option>
        <option value="electric_guitar_jazz"> Electric Jazz</option>
        <option value="distortion_guitar"> Electric Distortion </option>
        <option value="acoustic_grand_piano"> Piano </option>
        <option value="acoustic_bass"> Acoustic Bass </option>
        <option value="electric_bass_finger"> Electric Bass </option>
      </select> </label>
      <label>App Color:<input type="range" id="colorChangeRange" min="0" max="360" step="5" value="205" oninput="colorChange(this.value);" onchange="Cookies.set('color', this.value, { expires: 14 });"></label>
    </div>
  </div>

  <nav id="nav">
    <img src="/assets/ham.png" alt="menu" id="hamburger" onclick="openMenu()">
    <input type="text" id="noteInp" hidden="true" spellcheck="false" style="text-transform: uppercase" autocomplete="off" onkeypress="entered(event.key)" onfocusout="entered('outclicked')">
    <img src="/assets/set.png" alt="settings" id="notesOrNumbers" class="notesOrNumbers" onclick="openSettings();">
  </nav>

  <div id="datadisplay">
    <p id="right"> 0 </p>
    <p id="timer"> 0:00 </p>
    <p id="wrong"> 0 </p>
  </div>

  <div id="startInfo" class="info">
    <h1> Musixen! </h1>
    <input type="text" id="nickname" placeholder="Nickaname" spellcheck="false" onkeypress="if(event.key === 'Enter') { this.blur() }">
    <button onclick="main()" id="startButton"><span>Start</span></button>
  </div>

  <div id="endInfo" class="info">
    <h2>Your score is <a id="score" style="color: hsl(var(--main), 100%, 30%)">0</a>!</h2>
    <h4>In time of <a id="time" style="color: hsl(var(--main), 100%, 30%)">0:00</a> seconds</h4>
    <button onclick="main()" id="restartButton"><span>Restart</span></button>
  </div>

  <div id="loading"><div class="loader"></div></div>

  <div id="fretboard"></div>

  <table id="leaderboard">
    <thead>
      <tr>
        <th>Place</th>
        <th>Player</th>
        <th>Best</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody id="leaderboardBody"></tbody>
  </table>

  <script src="/js/script.js"></>
  <script src="/game/game.js"></script>
</body>
</html>