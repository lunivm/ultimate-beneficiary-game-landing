<?php
// Loads token from .env or config file (not exposed)
function loadEnv($path) {
    if (!file_exists($path)) return;

    $lines = file($path);
    foreach ($lines as $line) {
        $line = trim($line);

        // Skip empty lines or comments
        if ($line === '' || strpos($line, '#') === 0) continue;

        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);

            // Remove surrounding quotes
            $value = trim($value, "'\"");

            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
}

loadEnv(dirname(__FILE__) . '/.env');

// Fallbacks in case variables are not set
$token = isset($_ENV['TELEGRAM_BOT_TOKEN']) ? $_ENV['TELEGRAM_BOT_TOKEN'] : '';
$chatId = isset($_ENV['TELEGRAM_CHAT_ID']) ? $_ENV['TELEGRAM_CHAT_ID'] : '';
$text = isset($_GET['text']) ? $_GET['text'] : '';

if ($token && $chatId && $text) {
    file_get_contents("https://api.telegram.org/bot" . $token . "/sendMessage?chat_id=" . $chatId . "&text=" . urlencode($text));
} else {
    echo "Missing token, chat ID, or text.";
}