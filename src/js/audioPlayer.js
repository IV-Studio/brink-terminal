import {Howl, Howler} from 'howler';
import Command from './command';

const AudioPlayer = {

    active: false,
    activeSound: null,
    activeSoundName: '',
    activeSoundTranscript: '',
    showTranscript: false,
    init: function () {

    },
    enableAudioPlayer: function (audioFile, fileTitle, transcript) {
        
        if (audioFile == '') {
            return;
        }
        
        if (transcript != null) {
            AudioPlayer.activeSoundTranscript = transcript;
        } else {
            AudioPlayer.activeSoundTranscript = '';
        }
        
        // Turn on the div
        var audioPlayerDiv = document.getElementById('audioPlayer');
        audioPlayerDiv.style.display = 'block';

        AudioPlayer.activeSoundName = fileTitle;

        // Create sound
        AudioPlayer.activeSound = new Howl({
            src: [audioFile],
            onplay: function() {
                requestAnimationFrame(UpdateAudioPlayer);
            }
        });
          
        AudioPlayer.activeSound.play();

        

        Command.addCommandResponse('Playing audio file: "' + fileTitle +'"');

        AudioPlayer.active = true;
    },
    disableAudioPlayer: function () {
        // Turn off the div
        var audioPlayerDiv = document.getElementById('audioPlayer');
        audioPlayerDiv.style.display = 'none';

        if (AudioPlayer.active == true) {
            AudioPlayer.activeSound.unload();
            AudioPlayer.activeSound = null;
            AudioPlayer.active = false;
        }
        
    },
    pause: function() {
        if(AudioPlayer.activeSound != null) {
            AudioPlayer.activeSound.pause();
        }
    },
    play: function() {
        if(AudioPlayer.activeSound != null) {
            AudioPlayer.activeSound.play();
        }
    },
    restart: function() {
        if(AudioPlayer.activeSound != null) {
            AudioPlayer.activeSound.stop();
        }
    },
    actionList: {
        'play': {
            command: function (command) {
                return ['play'].includes(command);
            },
            displayName: 'Play',
            section: 'commands',
            hidden: true,
            available: function () {
                if (AudioPlayer.active) {
                    return true;
                } else {
                    return false;
                }
            },
            action: function () {
                AudioPlayer.play();
            },
        },
        'pause': {
            command: function (command) {
                return ['pause'].includes(command);
            },
            displayName: 'Pause',
            section: 'commands',
            hidden: true,
            available: function () {
                if (AudioPlayer.active) {
                    return true;
                } else {
                    return false;
                }
            },
            action: function () {
                AudioPlayer.pause();
            },
        },
        'restart': {
            command: function (command) {
                return ['restart', 'stop'].includes(command);
            },
            displayName: 'Restart',
            section: 'commands',
            hidden: true,
            available: function () {
                if (AudioPlayer.active) {
                    return true;
                } else {
                    return false;
                }
            },
            action: function () {
                AudioPlayer.restart();
            },
        },
        'transcript': {
            command: function (command) {
                return ['transcript', 'hide transcript', 'show transcript'].includes(command);
            },
            displayName: 'Transcript',
            section: 'commands',
            hidden: true,
            available: function () {
                if (AudioPlayer.active) {
                    return true;
                } else {
                    return false;
                }
            },
            action: function () {
                AudioPlayer.showTranscript = !AudioPlayer.showTranscript;
                if (!AudioPlayer.activeSound.playing()) {
                    UpdateAudioPlayer();
                }

            },
        },
    }

}

function UpdateAudioPlayer () {
    if (AudioPlayer.activeSound != null) {
        document.getElementById('audioPlayer').innerHTML = GetAudioPlayerText();

        if (AudioPlayer.activeSound.playing()) {
            requestAnimationFrame(UpdateAudioPlayer);
        }
    }
}

function GetAudioPlayerText() {
    
    const audioHeader = "<span class='read'>" + 'Title: ' + AudioPlayer.activeSoundName + '<br>' + "<hr></span>";

    let audioPlayer = "[                  ] 00:00 / 00:00";

    let buttons = "<hr>" +"<h>[Play]</h> <h>[Pause]</h> <h>[Restart]</h>";

    if (AudioPlayer.showTranscript == true) {
        buttons = buttons + " <h>[Transcript]</h>";
    } else {
        buttons = buttons + " <h>[Transcript]</h>";
    }

    if (AudioPlayer.activeSound != null) {
        const currentTime = AudioPlayer.activeSound.seek();
        const duration = AudioPlayer.activeSound.duration();
        const totalBars = 16;
        const percentage = (currentTime / duration);
        const filledBars = Math.round(totalBars * percentage);
        const emptyBars = totalBars - filledBars;
        audioPlayer = '[' + '='.repeat(filledBars) + '|' + '-'.repeat(emptyBars) + ']' + ' ' + formatTime(Math.round(currentTime)) + ' / ' + formatTime(Math.round(duration));
    }

    let transcript = '';

    if (AudioPlayer.showTranscript == true) {
        transcript = '<hr>' + AudioPlayer.activeSoundTranscript;
    }

    return audioHeader + audioPlayer + buttons + transcript;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
}

export default AudioPlayer;