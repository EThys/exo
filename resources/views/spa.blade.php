<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>AirtelMoney</title>
    @inject('headers', 'Bepsvpt\SecureHeaders\SecureHeaders')

    <style>
        html, body {
            margin: 0;
            width: 100%;
            height: 100%;
        }
        #app{
            width:0px;
            height:0px;
            position:fixed !important; 
            position:absolute /* fallback for IE6 */;
        }
        #loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .loading {
            position: absolute;
            top: 40%;
            left: 50%;
        }
        .loading-bar {
            display: inline-block;
            width: 4px;
            height: 18px;
            border-radius: 4px;
            animation: loadingdd 1s ease-in-out infinite;
        }
        .loading-bar:nth-child(1) {
            background-color: #3498db;
            animation-delay: 0;
        }
        .loading-bar:nth-child(2) {
            background-color: #c0392b;
            animation-delay: 0.09s;
        }
        .loading-bar:nth-child(3) {
            background-color: #f1c40f;
            animation-delay: .18s;
        }
        .loading-bar:nth-child(4) {
            background-color: #27ae60;
            animation-delay: .27s;
        }
  
        @keyframes loadingdd {
            0% {
                transform: scale(1);
            }
            20% {
                transform: scale(1, 2.2);
            }
            40% {
                transform: scale(1);
            }
        }
    </style>

    <link rel="manifest" href="/manifest.json">
    {{-- <link rel="icon" type="image/png" sizes="192x192"  href="/icons/android-icon-192x192.png"> --}}
    {{-- <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"> --}}
    <link rel="manifest" href="/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    {{-- <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png"> --}}
    <meta name="theme-color" content="#ffffff">
    <script nonce="{{ $headers->nonce() }}">
        window.myprovider = '{{ env("PROVIDER") }}'
    </script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ mix('js/manifest.js') }}"></script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ mix('js/vendor.js') }}"></script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ asset('js/custom/webprint.js') }}"></script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ asset('js/custom/idb.js') }}"></script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ asset('js/custom/utility.js') }}"></script>
    <script nonce="{{ $headers->nonce() }}" defer src="{{ mix('js/app.js') }}"></script>
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">

</head>
<body>
    <noscript>
        <strong>We're sorry but client doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="loading-screen"><br><br><br>
        <h3 style="margin-top: 10%" style="text-align: center;">Veuillez patienter s'il vous plaît</h3>
        <div class="loading">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
        </div>
    </div>
    <div id="app">
        <app></app>
    </div>
    <!-- built files will be auto injected -->
</body>
</html>