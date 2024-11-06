<template>
    <div class="loading">
        <div class="loading__icon"></div>
    </div>
</template>

<script setup lang="ts">


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.loading {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.3);
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    &__icon {
        width: px-to-rem(80);                   // Adjust size as needed
        height: px-to-rem(80);
        border-radius: 50%;
        background: conic-gradient(
                #ffffff,
                #575757,
                #ffffff
        );
        mask: radial-gradient(circle, transparent 58%, black 58%);
        animation: spin 1.2s linear infinite;
    }

    // Spin animation
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
