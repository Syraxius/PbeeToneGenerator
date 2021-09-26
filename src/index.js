function ToneGenerator(audioContext, frequency) {
    this.volume = 0
    this.frequency = frequency
    this.state = "stopped"

    this.start = () => {
        if (this.state == "started") {
            return;
        }
        this.oscillator = audioContext.createOscillator();
        this.gainNode = audioContext.createGain();
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(audioContext.destination);
        this.gainNode.gain.value = this.volume;
        this.oscillator.frequency.value = frequency;
        this.oscillator.type = "sine";
        this.oscillator.start();
        this.state = "started";
    }

    this.stop = () => {
        if (this.state == "stopped") {
            return;
        }
        this.oscillator.stop();
        this.state = "stopped";
    }

    this.setVolume = (volume) => {
        this.volume = volume;
        if (this.state == "stopped") {
            return;
        }
        this.gainNode.gain.value = volume;
    }

    this.setFrequency = (frequency) => {
        this.frequency = frequency;
        if (this.state == "stopped") {
            return;
        }
        this.oscillator.frequency.value = frequency;
    }
}

const addVolumeSlider = (frequency) => {
    let id = "volume" + frequency;
    let parentDiv = document.getElementById("volumesliders");

    let volumeInput = document.createElement("input");
    volumeInput.setAttribute("id", id);
    volumeInput.setAttribute("class", "volume-input");
    volumeInput.setAttribute("type", "range");
    volumeInput.setAttribute("value", 0);
    volumeInput.setAttribute("min", 0);
    volumeInput.setAttribute("max", 1);
    volumeInput.setAttribute("step", 0.01);
    volumeInput.setAttribute("oninput", "toneGenerators[" + frequency + "].setVolume(this.value);");

    let volumeInputLabel = document.createElement("label");
    volumeInputLabel.setAttribute("for", id);
    volumeInputLabel.textContent = frequency + " Hz";

    let childDiv = document.createElement("div");
    childDiv.appendChild(volumeInput);
    childDiv.appendChild(volumeInputLabel);

    parentDiv.appendChild(childDiv);
};

const frequencies = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000];

const toneGenerators = {};

const startAll = () => {
    for (const frequency of frequencies) {
        toneGenerators[frequency].start();
    }
};

const stopAll = () => {
    for (const frequency of frequencies) {
        toneGenerators[frequency].stop();
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    var audioContext = new(window.AudioContext || window.webkitAudioContext || window.audioContext);
    for (const frequency of frequencies) {
        toneGenerators[frequency] = new ToneGenerator(audioContext, frequency);
        addVolumeSlider(frequency);
    }
});

