<!DOCTYPE html>
<html lang="en">
  <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/templates/head.php'; ?>
  <body onload="starter()">
    <audio id="guitarSound"></audio>

    <div id="scaleMenu" class="modal">
      <div id="scaleMenu-content" class="modal-content">
        
      </div>
    </div>

    <div id="settings" class="modal">
      <div id="settings-content" class="modal-content">
        <span class="close" onclick="ok();">&times;</span>

        <label id="funcModeScaleLabel" for="funcModeScale" class="trn">
        <input type="radio" value="scales" name="funcMode" id="funcModeScale" onchange="changedSettings.funcMode = this.value" checked="true"><span></span></label>
        <label id="funcModeChordLabel" for="funcModeChord" class="trn">
        <input type="radio" value="chords" name="funcMode" id="funcModeChord" onchange="changedSettings.funcMode = this.value"><span></span></label>
        <label id="displayModeNoteLabel" for="displayModeNote" class="trn">
        <input type="radio" value="notes" name="displayMode" id="displayModeNote" onchange="changedSettings.displayMode = this.value" checked="true"><span></span></label>
        <label id="displayModeNumberLable" for="displayModeNumber" class="trn">
        <input type="radio" value="numbers" name="displayMode" id="displayModeNumber" onchange="changedSettings.displayMode = this.value"><span></span></label>

        <label id="tuningLable" for="tuning" class="trn"><span></span><br>
        <input list="tunings" type="text" id="tuning" spellcheck="falsefuncMode" onkeypress="enteredTuning(event.key)" onfocusout="enteredTuning('outclicked')" onclick="enteredTuning('clicked')"></label>
        <datalist id="tunings">
          <option value="E2 A2 D3 G3 B3 E4">E Standard</option>
          <option value="D2 A2 D3 G3 B3 E4">Drop D</option>
          <option value="E1 A1 D2 G2">Bass Standard</option>
          <option value="B1 E2 A2 D3 G3 B3 E4">7 String Standard</option>
          <option value="Eb2 Ab2 Db3 Gb3 Bb3 Eb4">Eb Standard</option>
          <option value="E2 B2 E3 G#3 B3 E4">Open E</option>
          <option value="E2 A2 E3 A3 C#3 E4">Open A</option>
        </datalist>

        <label id="soundLable" for="sound" class="trn"><span></span><br>
        <select id="sound" onchange="changedSettings.sound = true">
          <option value="acoustic_guitar_nylon" id="acoustic_guitar_nylon" class="trn"></option>
          <option value="acoustic_guitar_steel" id="acoustic_guitar_steel" class="trn"></option>
          <option value="electric_guitar_clean" id="electric_guitar_clean" class="trn"></option>
          <option value="electric_guitar_jazz" id="electric_guitar_jazz" class="trn"></option>
          <option value="distortion_guitar" id="distortion_guitar" class="trn"></option>
          <option value="acoustic_grand_piano" id="acoustic_grand_piano" class="trn"></option>
          <option value="acoustic_bass" id="acoustic_bass" class="trn"></option>
          <option value="electric_bass_finger" id="electric_bass_finger" class="trn"></option>
        </select></label>

        <label id="languageLable" for="language" class="trn"><span></span><br>
        <select id="language" onchange="changedSettings.language = true"></select></label>

        <label id="colorChangeRangeLable" for="colorChangeRange" class="trn"><span></span>
        <input type="range" id="colorChangeRange" min="0" max="360" step="5" value="205" oninput="this.style.backgroundColor = 'hsl(' + this.value + ', 93%, 30%)';" onchange="changedSettings.color = this.value"></label>
      
        <button id="ok" onclick="ok()">Ok</button>
      </div>
    </div>

     <nav id="nav">
      <img src="/assets/ham.png" alt="menu" id="hamburger" onclick="openMenu()">
      <input type="text" id="scaleInp" spellcheck="false" placeholder="C major" autocomplete="off" onkeypress="entered(event.key)" onfocusout="entered('outclicked')" onclick="entered('clicked')">
      <img src="/assets/set.png" alt="settings" id="notesOrNumbers" class="notesOrNumbers" onclick="openSettings();">
    </nav>

    <?php include $_SERVER['DOCUMENT_ROOT'] . '/php/templates/menu.php'; ?>

    <script src="/js/script.js"></script>
    <script src="/visualizer/visualizer.js"></script>
  </body>
</html>