<?php
$def = (require $_SERVER['DOCUMENT_ROOT'] . '/php/config.php')['DEF_LANG'];

$avLangs = array_diff(scandir($_SERVER['DOCUMENT_ROOT'] . '/assets/languages'), array('.', '..'));
$avalibleLangs = [];

foreach ($avLangs as $key => $value) {
    array_push($avalibleLangs, explode(".", $value)[0]);
}

$acc = $_SERVER['HTTP_ACCEPT_LANGUAGE'];

$parts = explode(',', $acc);

$prefLangs = [];

foreach ($parts as $part) {
    $langCode = explode(';', $part)[0];
    $langCode = substr($langCode, 0, 2);
    if (!in_array($langCode, $prefLangs)) {
        $prefLangs[] = $langCode;
    }
}

$commonLangs = array_intersect($prefLangs, $avalibleLangs);

$prefered = reset($commonLangs);

if($prefered) {
    array_push($avalibleLangs, $prefered);
} else {
    array_push($avalibleLangs, $def);
}

// List of all av languages where the last one is the one prefered
return $avalibleLangs;