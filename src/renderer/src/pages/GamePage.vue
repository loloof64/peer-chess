<script setup>
import { ref } from 'vue'

const board = ref()
function newGame() {
    board.value.newGame()
}

</script>

<template>
    <div id="main_zone">
        <loloof64-chessboard ref="board" size="500" />
        <button @click="newGame">New game</button>
    </div>
</template>

<style scoped>
#main_zone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>