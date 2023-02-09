<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMediaStore } from '@renderer/stores/media'

const mediaStore = useMediaStore()
const {videoSourceId, audioSourceId} = storeToRefs(mediaStore)

const board = ref()
function newGame() {
    board.value.newGame()
}

onMounted(() => {
    console.log(audioSourceId.value)
    console.log(videoSourceId.value)
})

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