const Application = function () {
    this.tuner = new Tuner(this.a4);
};


translate = {
    'A': 9, 'A♯': 10, 'B': 11, 'C': 0, 'C♯': 1, 'D': 2, 'D♯': 3, 'E': 4, 'F': 5, 'F♯': 6, 'G': 7, 'G♯': 8, 'X': -1
}

played = false

setTimeout(() => {
    document.getElementById('loading').style.opacity = "0"
    document.getElementById('main-menu').style.display = "block"
}, 2000)

function run() {
    document.getElementById('ready-menu').style.display = "none"
    document.getElementById('player').style.display = "block"
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;
}
url = ""
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: url, playerVars: { 'controls': 0 }, events: {
            'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerReady(event) {
}

title = ""
speed = 1.0
accuracy = 0.5
load_music = (data) => {
    try {
        _data = data.split(';')
        url = _data[0]
        _tempo = _data[3]
        _tmplist = _tempo.split(',')
        title = _data[1]
        html = _data[2]
        tem = []
        mel = []
        _tmplist.forEach((elem) => {
            tem.push(elem.split('|')[0])
            mel.push(elem.split('|')[1])
        })
        document.getElementById('main-menu').style.display = "none"
        document.getElementById('ready-menu').style.display = "block"
        document.getElementById('songname').innerHTML = title
        document.getElementById('up-speed').addEventListener('click', () => {
            if (speed <= 4.9) {
                speed += 0.1
                speed = Math.round(speed * 10) / 10
                document.getElementById('tempo-speed').textContent = speed.toFixed(1) + "x"
            }
        })
        document.getElementById('down-speed').addEventListener('click', () => {
            if (speed >= 0.2) {
                speed -= 0.1
                speed = Math.round(speed * 10) / 10
                document.getElementById('tempo-speed').textContent = speed.toFixed(1) + "x"
            }
        })
        document.getElementById('up-accuracy').addEventListener('click', () => {
            if (accuracy <= 0.9) {
                accuracy += 0.1
                accuracy = Math.round(accuracy * 10) / 10
                document.getElementById('accuracy').textContent = accuracy.toFixed(1) + "s"
            }
        })
        document.getElementById('down-accuracy').addEventListener('click', () => {
            if (accuracy >= 0.2) {
                accuracy -= 0.1
                accuracy = Math.round(accuracy * 10) / 10
                document.getElementById('accuracy').textContent = accuracy.toFixed(1) + "s"
            }
        })
        document.getElementById('grid-start').addEventListener('click', () => {
            if (!played) {
                played = true
                document.getElementById('title_screen').innerHTML = document.getElementById('title_screen').innerHTML + "<div style='color: white; position: absolute; left: 50%; transform: translateX(-50%); bottom: 30px;'>" + html + "</div>"
                run()
            }
        })
        document.querySelector("#disable-key").click()
        document.querySelector("#disable-key").focus()
    }
    catch (e) {
        alert("손상된 KARA파일 입니다.")
    }
}
play3 = 0
skipped = 0
function onPlayerStateChange(event) {
    if (event.data == 3 && play3 == 1){
        location.reload()
    } else if (event.data == 3){
        play3 = 1
    }
    if (event.data == 1) {
        document.addEventListener('click', (e)=>{
            if (e.target.className == "interlude"){
                play3 = 0
                skipped = 1
                document.getElementById('status').style.opacity = "0"
                player.seekTo(tem[step] - 3)
            }
        })
        if (!trustInteraction) {
            document.getElementById('barrier').style.display = "block"
        }

        document.getElementById('title_screen').style.display = 'block'
        trustInteraction = true

        setInterval(() => {
            if (step - 1 >= 0) {
                if (failure.indexOf(step - 1) == -1 && success.indexOf(step - 1) == -1 && slient.indexOf(step - 1) == -1) {
                    slient.push(step - 1)
                }
                if (Math.abs(tem[step - 1] - tem[step]) > 10 && step != tem.length-1 && skipped == 0) {
                    document.getElementById('status').className = "interlude"
                    document.getElementById('status').innerHTML = "간주 건너뛰기"
                }
            }
            if (player.getCurrentTime() >= tem[0] - 8) {
                document.getElementById('title_screen').style.opacity = "0"

            } else {
                document.getElementById('status').style.opacity = "0"
                document.getElementById('title_screen').style.opacity = "0.5"
                document.getElementById('title_screen_title').innerHTML = title
            }
            if (Math.abs(player.getCurrentTime() - tem[step]) < 0.04) {
                _t = 1
                step++;
            } else {
                _t = 0
            }
        }, 10)
        player.setPlaybackRate(speed)
        player.playVideo()
        app.start()
    }
    if (event.data == 0) {
        musicStop = true
        document.getElementById('barrier').style.background = "black"
        document.getElementById('barrier').style.opacity = "1"
        document.getElementById('status').className = "end"
        document.getElementById('status').innerHTML = "정확한 음 : " + success.length + "/" + mel.length + "<br>부정확한 음 : " + (mel.length - success.length) + "/" + mel.length + "<br>타이밍 놓친 음 : " + slient.length + "<br><p onclick='location.reload()'>다시 고르기</p>"
    }
}

step = 0
_t = 0
failure = []
success = []
slient = []

Application.prototype.start = function () {
    const self = this;
    this.tuner.onNoteDetected = function (note) {
        self.update(note);
    };
    self.tuner.init();
    self.frequencyData = new Uint8Array(self.tuner.analyser.frequencyBinCount);
};

tempo = {}
mel = []

Application.prototype.update = function (note) {
    if (player.getCurrentTime() >= tem[0] - accuracy) {
        skipped = 0
        document.getElementById('status').style.opacity = "0.5"
        if (mel[step] == "X") {
            if (success.indexOf(step) == -1) {
                document.getElementById('status').innerHTML = "O"
                document.getElementById('status').className = "clear_animation"
                success.push(step)
            }
        }
        if (mel[step] != "X"){
            if (Math.abs(translate[mel[step]] - translate[note['name']]) <= 2) {

                if (success.indexOf(step) == -1) {
                    document.getElementById('status').innerHTML = "O"
                    document.getElementById('status').className = "clear_animation"
                    success.push(step)
                }
            } else {
                if (failure.indexOf(step) == -1) {
                    if (translate[mel[step]] < translate[note['name']]) {
                        document.getElementById('status').innerHTML = "HIGH"
                    } else {
                        document.getElementById('status').innerHTML = "LOW"
                    }
                    document.getElementById('status').className = "fail_animation"
                    failure.push(step)
    
                }
            }
        }
    }
};

const app = new Application()

trustInteraction = false

document.addEventListener('keydown', (e)=>{
    e.preventDefault()
    e.stopPropagation()
})