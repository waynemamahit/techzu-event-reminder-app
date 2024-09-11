<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])

    <!-- PWA Manifest -->
    <link rel="manifest" href="/build/manifest.webmanifest">
    <meta name="theme-color" content="#ffffff">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.png">
    <script type="module" src="/build/registerSW.js"></script>

    <!-- Optional: Other Meta Tags -->
    <meta name="description" content="Event Reminder Web App">
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
