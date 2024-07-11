<template>
    <div id="loading">
        <div class="loading">
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
            <div class="loading-bar"></div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
    #loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(255, 255, 240, .5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .loading {
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .loading-bar {
        display: inline-block;
        width: 4px;
        height: 18px;
        border-radius: 4px;
        animation: loading 1s ease-in-out infinite;
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

    @keyframes loading {
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
