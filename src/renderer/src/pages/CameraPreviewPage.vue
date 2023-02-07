<script setup>
import { ref, onMounted } from 'vue'

const camera = ref();

const audioInputSelect = ref();
const audioOutputSelect = ref();
const videoSelect = ref();

const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);
    selectors.forEach(select => {
        while (select.value.firstChild) {
            select.value.removeChild(select.value.firstChild);
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
        if (Array.prototype.slice.call(select.value.childNodes).some(n => n.value === values[selectorIndex].value)) {
            select.value = values[selectorIndex].value;
        }
    });
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
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
    const audioDestination = audioOutputSelect.value;
    attachSinkId(videoSelect.value, audioDestination.value);
}

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    videoSelect.srcObject = stream;
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
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
        video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

onMounted(() => {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    audioInputSelect.value.onchange = start;
    audioOutputSelect.value.onchange = changeAudioDestination;

    videoSelect.value.onchange = start;

    start();
});
</script>

<template>
    <div id="main_container">
        <video ref="camera" class="camera"></video>

        <span class="component_line">
            <label for="audioInput">Microphone</label>
            <select name="audioInput" ref="audioInputSelect"></select>
        </span>

        <span class="component_line">
            <label for="audioOutput">Speaker</label>
            <select name="audioOutput" ref="audioOutputSelect"></select>
        </span>

        <span class="component_line">
            <label for="video">Speaker</label>
            <select name="video" ref="videoSelect"></select>
        </span>
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

.camera {
    background-color: black;
    width: 500;
    height: 300;
}

.component_line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>