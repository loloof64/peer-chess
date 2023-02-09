import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMediaStore = defineStore('media', () => {
    const audioSourceId = ref()
    const videoSourceId = ref()

    function setAudioSourceId(newId) {
        audioSourceId.value = newId
    }

    function setVideoSourceId(newId) {
        videoSourceId.value = newId
    }

    return {
        audioSourceId, videoSourceId,
        setAudioSourceId, setVideoSourceId,
    }
})