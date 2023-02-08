<script setup>
import { ref, onMounted, computed } from 'vue'

const video = ref()

const audioInputSelect = ref()
const audioOutputSelect = ref()
const videoSelect = ref();

import { default as MicrophoneOn } from '@renderer/assets/vectors/mic.svg'
import { default as MicrophoneOff } from '@renderer/assets/vectors/mic-off.svg'

import { default as VideoOn } from '@renderer/assets/vectors/video.svg'
import { default as VideoOff } from '@renderer/assets/vectors/video-off.svg'

const audioEnabled = ref();
const videoEnabled = ref();
const microLogo = computed(() => audioEnabled.value ? MicrophoneOn : MicrophoneOff)
const videoLogo = computed(() => videoEnabled.value ? VideoOn : VideoOff)

const widthPx = 500
const heightPx = 300

let selectors = []

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value)
    selectors.forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `microphone ${audioInputSelect.value.length + 1}`;
            audioInputSelect.value.appendChild(option);
        } else if (deviceInfo.kind === 'audiooutput') {
            option.text = deviceInfo.label || `speaker ${audioOutputSelect.value.length + 1}`;
            audioOutputSelect.value.appendChild(option);
        } else if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoSelect.value.length + 1}`;
            videoSelect.value.appendChild(option);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }

    selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex];
        }
    });
}

function handleError(error) {
    console.log('Media devices error: ', error.message);
}

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
    if (typeof element.sinkId !== 'undefined') {
        element.setSinkId(sinkId)
            .then(() => {
                console.log(`Success, audio output device attached: ${sinkId}`);
            })
            .catch(error => {
                let errorMessage = error;
                if (error.name === 'SecurityError') {
                    errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                }
                console.error(errorMessage);
                // Jump back to first output device in the list as it's the default.
                audioOutputSelect.selectedIndex = 0;
            });
    } else {
        console.warn('Browser does not support output device selection.');
    }
}

function changeAudioDestination() {
    attachSinkId(videoSelect, audioOutputSelect.value);
}

async function gotStream(stream) {
    window.stream = stream;
    video.value.srcObject = stream;
    videoEnabled.value = true;
    audioEnabled.value = true;
    // Refresh button list in case labels have become available
    return await navigator.mediaDevices.enumerateDevices();
}

function start() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioInputSelect.value.value;
    const videoSource = videoSelect.value.value;

    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
        video: { deviceId: videoSource ? { exact: videoSource, width: widthPx, height: heightPx } : undefined }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

function toggleAudio() {
    if (window.stream) {
        window.stream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled
            audioEnabled.value = track.enabled
        })
    }
}

function toggleVideo() {
    if (window.stream) {
        window.stream.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled
            videoEnabled.value = track.enabled
        })
    }
}

onMounted(() => {
    selectors = [audioInputSelect.value, audioOutputSelect.value, videoSelect.value]
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    audioInputSelect.value.onchange = start;
    audioOutputSelect.value.onchange = changeAudioDestination;

    videoSelect.value.onchange = start;

    start();
});
</script>

<template>
    <div id="main_container">
        <div id="video_zone">
            <video ref="video" class="video" playsinline autoplay></video>
            <div id="options_zone">
                <img :src="microLogo" @click="toggleAudio" />
                <img :src="videoLogo" @click="toggleVideo" />
            </div>
        </div>

        <div id="stream_controls_zone">


            <label for="audioInput">Microphone</label>
            <select name="audioInput" ref="audioInputSelect"></select>


            <label for="audioOutput">Speaker</label>
            <select name="audioOutput" ref="audioOutputSelect"></select>


            <label for="video">Video</label>
            <select name="video" ref="videoSelect"></select>
        </div>
    </div>
</template>

<style scoped>
#main_container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border: 2px solid black;
    border-radius: 10px;
}

#video_zone {
    position: relative;
    background-color: black;
    width: v-bind(widthPx + 'px');
    height: v-bind(heightPx + 'px');
}

.video {
    width: v-bind(widthPx + 'px');
    height: v-bind(heightPx + 'px');
}

#options_zone {
    position: absolute;
    left: 0;
    top: 0;
    background-color: aqua;
    z-index: 5;
    display: flex;
    flex-direction: row;
}

#stream_controls_zone {
    display: grid;
    grid-template:
        "a a"
        "a a"
        "a a";
}
</style>