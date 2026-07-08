<?php
// Start output buffering to prevent any accidental image output
ob_start();

header('Content-Type: application/json');

// Helper function to output JSON and exit cleanly
function outputJson($data) {
    // Clear any output buffers to prevent image data leakage
    while (ob_get_level()) {
        ob_end_clean();
    }
    echo json_encode($data);
    exit;
}

// Get domain dynamically
$domain = $_SERVER['HTTP_HOST'];

// Define API URL for fetching header data
$headerApiUrl = "https://www.buyindiahomes.in/api/header?website=" . urlencode($domain);

// Fetch header data using cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $headerApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$headerResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!$headerResponse || $httpCode !== 200) {
    outputJson(["error" => "Failed to fetch header data"]);
}

$headerData = json_decode($headerResponse, true);

if (!$headerData || !isset($headerData['favicon']) || empty($headerData['favicon'])) {
    outputJson(["error" => "Invalid API response or favicon not found"]);
}

$faviconUrl = $headerData['favicon'];

// Determine paths
$scriptDir = __DIR__;
$indexHtmlPath = $scriptDir . '/index.html';

// Extract file extension from URL
$urlPath = parse_url($faviconUrl, PHP_URL_PATH);
$extension = pathinfo($urlPath, PATHINFO_EXTENSION);

// Default to png if no extension found
if (empty($extension)) {
    $extension = 'png';
}

// Normalize extension to lowercase
$extension = strtolower($extension);

// Determine favicon filename and MIME type
$faviconFilename = 'favicon.' . $extension;
$faviconPath = $scriptDir . '/' . $faviconFilename;

// Map extensions to MIME types for HTML link tag
$mimeTypes = [
    'ico' => 'image/x-icon',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml'
];

$mimeType = $mimeTypes[$extension] ?? 'image/png';

// Download favicon
$faviconCh = curl_init();
curl_setopt($faviconCh, CURLOPT_URL, $faviconUrl);
curl_setopt($faviconCh, CURLOPT_RETURNTRANSFER, true);
curl_setopt($faviconCh, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($faviconCh, CURLOPT_FOLLOWLOCATION, true);

$faviconData = curl_exec($faviconCh);
$faviconHttpCode = curl_getinfo($faviconCh, CURLINFO_HTTP_CODE);
curl_close($faviconCh);

if (!$faviconData || $faviconHttpCode !== 200) {
    outputJson(["error" => "Failed to download favicon from URL"]);
}

// Save favicon in original format
if (file_put_contents($faviconPath, $faviconData) === false) {
    outputJson(["error" => "Failed to save favicon"]);
}

// Read index.html
if (!file_exists($indexHtmlPath)) {
    outputJson(["error" => "index.html not found"]);
}

$htmlContent = file_get_contents($indexHtmlPath);

if ($htmlContent === false) {
    outputJson(["error" => "Failed to read index.html"]);
}

// Check if favicon link already exists
$faviconLinkPattern = '/<link\s+rel=["\']icon["\'][^>]*>/i';
$newFaviconLink = '<link rel="icon" type="' . $mimeType . '" href="/' . $faviconFilename . '">';

// Check if the exact link already exists
if (strpos($htmlContent, $newFaviconLink) !== false) {
    outputJson(["success" => true, "message" => "Favicon link already exists in HTML"]);
}

// Replace existing favicon link if it exists, otherwise inject in head
if (preg_match($faviconLinkPattern, $htmlContent)) {
    // Replace existing favicon link
    $htmlContent = preg_replace($faviconLinkPattern, $newFaviconLink, $htmlContent);
} else {
    // Inject after <head> tag
    if (preg_match('/<head[^>]*>/i', $htmlContent, $matches)) {
        $headTag = $matches[0];
        $htmlContent = str_replace($headTag, $headTag . $newFaviconLink, $htmlContent);
    } else {
        outputJson(["error" => "Could not find <head> tag in HTML"]);
    }
}

// Write updated HTML back to file
if (file_put_contents($indexHtmlPath, $htmlContent) === false) {
    outputJson(["error" => "Failed to update index.html"]);
}

outputJson([
    "success" => true,
    "message" => "Favicon downloaded and link injected successfully",
    "favicon_path" => $faviconPath,
    "html_updated" => true
]);
?>

