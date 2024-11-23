<?php
$lan = array_diff(scandir($_SERVER['DOCUMENT_ROOT'] . '/languages'), array('.', '..'));
$lan2 = [];

foreach ($lan as $key => $value) {
    array_push($lan2, explode(".", $value)[0]);
}

return $lan2;