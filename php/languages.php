<?php
$def = (require $_SERVER['DOCUMENT_ROOT'] . '/php/config.php')['DEF_LANG'];

$files = array_diff(scandir($_SERVER['DOCUMENT_ROOT'] . '/assets/languages'), array('.', '..'));
$avalibleLangs = [];

foreach ($files as $key => $value) {
    array_push($avalibleLangs, explode(".", $value)[0]);
}

$acc = $_SERVER['HTTP_ACCEPT_LANGUAGE'];

$parts = explode(',', $acc);

$preredLangs = [];

foreach ($parts as $part) {
    $langCode = explode(';', $part)[0];
    $langCode = substr($langCode, 0, 2);
    if (!in_array($langCode, $preredLangs)) {
        $preredLangs[] = $langCode;
    }
}

$commonLangs = array_intersect($preredLangs, $avalibleLangs);

$prefered = reset($commonLangs);

if($prefered) {
    array_push($avalibleLangs, $prefered);
} else {
    array_push($avalibleLangs, $def);
}

return $avalibleLangs;