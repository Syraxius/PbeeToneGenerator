var audioContext

function ToneGenerator(audioContext, frequency, volume) {
    this.frequency = frequency
    this.volume = volume || 0
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

    this.start()
}

const toneGenerators = {};

const addVolumeSlider = (frequency) => {
    if (frequency <= 0 || toneGenerators[frequency]) {
        return;
    }

    toneGenerators[frequency] = new ToneGenerator(audioContext, frequency);

    let id = "volume" + frequency;
    let parentDiv = document.getElementById("volume-sliders");

    document.getElementById("saved-heading").style.display = 'block';

    let volumeInput = document.createElement("input");
    volumeInput.setAttribute("id", id);
    volumeInput.setAttribute("class", "volume-input-vertical");
    volumeInput.setAttribute("type", "range");
    volumeInput.setAttribute("value", 0);
    volumeInput.setAttribute("min", 0);
    volumeInput.setAttribute("max", 1);
    volumeInput.setAttribute("step", 0.01);
    volumeInput.setAttribute("oninput", "toneGenerators[" + frequency + "].setVolume(this.value);");
    volumeInput.setAttribute("orient", "vertical");
    volumeInput.setAttribute("style", "-webkit-appearance: slider-vertical; writing-mode: bt-lr;")

    let volumeInputLabel = document.createElement("label");
    volumeInputLabel.setAttribute("for", id);
    volumeInputLabel.textContent = frequency + " Hz";

    let volumeDiv = document.createElement("div");
    volumeDiv.appendChild(volumeInput);
    volumeDiv.appendChild(document.createElement("br"));
    volumeDiv.appendChild(volumeInputLabel);
    volumeDiv.setAttribute("style", "display: inline-block; width: 50px; padding: 16px; white-space: nowrap")

    parentDiv.appendChild(volumeDiv);
};

const addDefaultToneGenerator = () => {
    toneGenerators[-1] = new ToneGenerator(audioContext, 0, 1);

    let frequencyId = "frequencyDefault";
    let frequencyLabelId = "frequencyLabelDefault";
    let volumeId = "volumeDefault";
    let volumeLabelId = "volumeLabelDefault";

    document.getElementById("searcher-heading").style.display = 'block';

    let frequencyInput = document.createElement("input");
    frequencyInput.setAttribute("id", frequencyId);
    frequencyInput.setAttribute("class", "frequency-input");
    frequencyInput.setAttribute("type", "range");
    frequencyInput.setAttribute("value", 0);
    frequencyInput.setAttribute("min", 0);
    frequencyInput.setAttribute("max", 22000);
    frequencyInput.setAttribute("step", 1);
    frequencyInput.setAttribute("oninput", "toneGenerators[-1].setFrequency(this.value); document.getElementById(\"" + frequencyLabelId + "\").textContent = String(this.value).padStart(5, '0') + \" Hz\"");

    let frequencyInputLabel = document.createElement("label");
    frequencyInputLabel.setAttribute("id", frequencyLabelId);
    frequencyInputLabel.setAttribute("for", frequencyId);
    frequencyInputLabel.textContent = "00000 Hz";

    let frequencyDiv = document.createElement("div");
    frequencyDiv.appendChild(frequencyInput);
    frequencyDiv.appendChild(frequencyInputLabel);

    let volumeInput = document.createElement("input");
    volumeInput.setAttribute("id", volumeId);
    volumeInput.setAttribute("class", "volume-input");
    volumeInput.setAttribute("type", "range");
    volumeInput.setAttribute("value", 1);
    volumeInput.setAttribute("min", 0);
    volumeInput.setAttribute("max", 1);
    volumeInput.setAttribute("step", 0.01);
    volumeInput.setAttribute("oninput", "toneGenerators[-1].setVolume(this.value); document.getElementById(\"" + volumeLabelId + "\").textContent = Math.round(this.value * 100) + \"%\"");

    let volumeInputLabel = document.createElement("label");
    volumeInputLabel.setAttribute("id", volumeLabelId);
    volumeInputLabel.setAttribute("for", volumeId);
    volumeInputLabel.textContent = "100%";

    let volumeDiv = document.createElement("div");
    volumeDiv.appendChild(volumeInput);
    volumeDiv.appendChild(volumeInputLabel);

    let addButton = document.createElement("input");
    addButton.setAttribute("type", "button");
    addButton.setAttribute("value", "Add");
    addButton.setAttribute("onclick", null);
    addButton.setAttribute("style", "margin: 16px;");
    addButton.setAttribute("onclick", "addVolumeSlider(document.getElementById(\"" + frequencyId + "\").value);");

    let addDiv = document.createElement("div");
    addDiv.appendChild(addButton);

    let parentDiv = document.getElementById("searcher-sliders");
    parentDiv.appendChild(frequencyDiv);
    parentDiv.appendChild(volumeDiv);
    parentDiv.appendChild(addDiv);
};

init = () => {
    audioContext = new(window.AudioContext || window.webkitAudioContext || window.audioContext);
    addDefaultToneGenerator();
    document.getElementById("init-button").remove()
};
