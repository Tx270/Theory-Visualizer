<head>
    <meta charset="UTF-8">
    <meta name="description" content="Guitar scale and chord visualizer">
    <meta name="keywords" content="Guitar,Scale,Music,Chords,Bass,Theory">
    <meta name="author" content="Tx27">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Musixen Machen </title>
    <link rel="stylesheet" href="/assets/style.css">
    <link rel="shortcut icon" href="/assets/favicon.png" type="image/x-icon">
    <script src="/js/libs/tonal.js"></script>
    <script src="/js/libs/cookies.js"></script>
    <meta name="base-url" content="<?= htmlspecialchars((require $_SERVER['DOCUMENT_ROOT'] . '/php/config.php')['BASE_URL']); ?>">
    <meta name="languages" content="<?= htmlspecialchars(json_encode(require $_SERVER['DOCUMENT_ROOT'] . '/php/languages.php')); ?>">
</head>