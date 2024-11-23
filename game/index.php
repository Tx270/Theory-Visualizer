<!DOCTYPE html>
<html lang="en">
<head>
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/head.php'; ?>
</head>
<body onload="starter()">
  <script> const baseUrl = <?php echo json_encode((require $_SERVER['DOCUMENT_ROOT'] . '/private/config.php')['BASE_URL']);?>; </script>

  <audio id="guitarSound"></audio>

  <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/menu.php'; ?>

  <div id="settings" class="modal">
    <div id="settings-content" class="modal-content">
      <span class="close" onclick="closeSettings();">&times;</span>

      <input type="radio" value="scales" name="funcMode" id="funcModeScale" onchange="scalesOrChords(this.value)" checked="true">
      <label id="funcModeScaleLabel" for="funcModeScale" class="trn"></label>
      <input type="radio" value="chords" name="funcMode" id="funcModeChord" onchange="scalesOrChords(this.value)">
      <label id="funcModeChordLabel" for="funcModeChord" class="trn"></label>
      <input type="radio" value="notes" name="displayMode" id="displayModeNote" onchange="notesOrNumbers(this.value)" checked="true">
      <label id="displayModeNoteLabel" for="displayModeNote" class="trn"></label>
      <input type="radio" value="numbers" name="displayMode" id="displayModeNumber" onchange="notesOrNumbers(this.value)">
      <label id="displayModeNumberLable" for="displayModeNumber" class="trn"></label>

      <label id="tuningLable" for="tuning" class="trn"></label> <br>
      <input list="tunings" type="text" id="tuning" spellcheck="false" onkeypress="enteredTuning(event.key)" onfocusout="enteredTuning('outclicked')" onclick="enteredTuning('clicked')">
      <datalist id="tunings">
        <option value="E2 A2 D3 G3 B3 E4">E Standard</option>
        <option value="D2 A2 D3 G3 B3 E4">Drop D</option>
        <option value="E1 A1 D2 G2">Bass Standard</option>
        <option value="B1 E2 A2 D3 G3 B3 E4">7 String Standard</option>
        <option value="Eb2 Ab2 Db3 Gb3 Bb3 Eb4">Eb Standard</option>
        <option value="E2 B2 E3 G#3 B3 E4">Open E</option>
        <option value="E2 A2 E3 A3 C#3 E4">Open A</option>
      </datalist>

      <label id="soundLable" for="sound" class="trn"></label> <br>
      <select id="sound" onchange="soundChange()">
        <option value="acoustic_guitar_nylon" id="acoustic_guitar_nylon" class="trn"></option>
        <option value="acoustic_guitar_steel" id="acoustic_guitar_steel" class="trn"></option>
        <option value="electric_guitar_clean" id="electric_guitar_clean" class="trn"></option>
        <option value="electric_guitar_jazz" id="electric_guitar_jazz" class="trn"></option>
        <option value="distortion_guitar" id="distortion_guitar" class="trn"></option>
        <option value="acoustic_grand_piano" id="acoustic_grand_piano" class="trn"></option>
        <option value="acoustic_bass" id="acoustic_bass" class="trn"></option>
        <option value="electric_bass_finger" id="electric_bass_finger" class="trn"></option>
      </select>

      <label id="colorChangeRangeLable" for="colorChangeRange" class="trn"></label>
      <input type="range" id="colorChangeRange" min="0" max="360" step="5" value="205" oninput="colorChange(this.value);" onchange="Cookies.set('color', this.value, { expires: 14 });">
    
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

  <h1 id="unsupported" class="trn"></h1>

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

  <script src="/js/script.js"></script>
  <script src="/game/game.js"></script>
</body>
</html>