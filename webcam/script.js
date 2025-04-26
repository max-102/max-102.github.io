let stream = null;
const video = document.getElementById('webcam');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const deviceSelect = document.getElementById('deviceSelect');
const info = document.getElementById('info');
const deviceInfoHint = document.getElementById('deviceInfoHint');

// Speichert die Liste der verfügbaren Kameras
let videoInputDevices = [];

// Hilfsfunktion: Prüft, ob mindestens ein Label vorhanden ist
function hasDeviceLabels(devices) {
    return devices.some(d => d.label && d.label.trim() !== '');
}

async function listDevices(selectedId) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoInputDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('Gefundene Kameras:', videoInputDevices.map(d => d.label));
    deviceSelect.innerHTML = '';
    if (videoInputDevices.length === 0) {
        deviceSelect.style.display = "none";
        if (deviceInfoHint) deviceInfoHint.style.display = "none";
    } else {
        // Nur anzeigen, wenn kein Stream läuft
        if (!stream) {
            deviceSelect.style.display = "";
        } else {
            deviceSelect.style.display = "none";
        }
        videoInputDevices.forEach((device, idx) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label ? device.label : `Webcam ${idx + 1}`;
            deviceSelect.appendChild(option);
        });
        if (selectedId) {
            deviceSelect.value = selectedId;
        }
        // Hinweistext nur anzeigen, wenn keine Labels vorhanden sind
        if (deviceInfoHint) {
            if (hasDeviceLabels(videoInputDevices)) {
                deviceInfoHint.style.display = "none";
            } else {
                deviceInfoHint.style.display = "";
            }
        }
    }
}

async function startWebcam(selectedDeviceId) {
    if (stream) await stopWebcam();
    const constraints = {
        video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : (deviceSelect.value ? { exact: deviceSelect.value } : undefined) }
    };
    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            showInfo();
        };
        stopBtn.disabled = false;
        startBtn.disabled = true;
        deviceSelect.style.display = "none";
        if (deviceInfoHint) deviceInfoHint.style.display = "none";
        startBtn.style.display = "none";
        // Nach erstem Start Labels und Geräte-Liste aktualisieren
        await listDevices(selectedDeviceId || deviceSelect.value);
    } catch (err) {
        info.textContent = 'Fehler beim Zugriff auf die Webcam: ' + err.message;
    }
}

// Stoppt die Webcam und wartet, bis alles wirklich freigegeben ist
async function stopWebcam() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        // Warten, bis Firefox/Chrome wirklich alles freigegeben hat
        await new Promise(resolve => setTimeout(resolve, 400));
    }
    stopBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.style.display = "";
    info.textContent = '';
    await listDevices(deviceSelect.value);
}

function showInfo() {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
        const settings = track.getSettings();
        info.textContent = `Auflösung: ${settings.width} x ${settings.height}, Gerät: ${track.label}`;
    }
}

// Umschalten zwischen Webcams während der Stream läuft (Dropdown ist ausgeblendet)
async function switchCamera() {
    if (stream && deviceSelect.value) {
        await stopWebcam();
        await startWebcam(deviceSelect.value);
    }
}

deviceSelect.addEventListener('change', switchCamera);
startBtn.addEventListener('click', () => startWebcam());
stopBtn.addEventListener('click', stopWebcam);

window.addEventListener('DOMContentLoaded', async () => {
    await listDevices();
    if (deviceSelect.options.length > 0) {
        startBtn.disabled = false;
    } else {
        info.textContent = 'Keine Webcam gefunden.';
        startBtn.disabled = true;
        deviceSelect.style.display = "none";
        if (deviceInfoHint) deviceInfoHint.style.display = "none";
    }
});
