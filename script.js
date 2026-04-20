let timerInterval; //holds the interval
let seconds=0; //time counter
let isRunning = false; //state tracking

//get elements
const startButton = document.getElementById('startBtn');
const timerDisplay = document.getElementById('timer');
const sessionList = document.getElementById('sessionList');
const totalTimeDisplay = document.getElementById('totalTime');
const clearSessionsButton = document.getElementById('clearBtn');
const feedback = document.getElementById('feedback');
const bestSessionDisplay = document.getElementById('bestSession');

//format the time into (mm:ss:ms)
function formatTime(sec) {
    let minutes = Math.floor(sec/60);
    let remainingSeconds = sec % 60;

    //add leading zeros
    if(minutes < 10) minutes = "0" + minutes;
    if(remainingSeconds < 10) remainingSeconds = "0" + remainingSeconds;

    return `${minutes}:${remainingSeconds}`;
}

//button click
startButton.addEventListener('click', function(){
    
    if(!isRunning) {
        console.log('timer started')
        timerInterval = setInterval(function (){
            seconds++;
            timerDisplay.textContent = formatTime(seconds); //changers what the user sees in real time
        }, 1000); //runs code every second

        startButton.textContent = 'Locked in!';
        feedback.textContent = "";
        isRunning = true; //state tracking
    } else {
        console.log('timer stopped')
        clearInterval(timerInterval);
        
        console.log('Session length:', seconds, 'seconds');

        saveSession(seconds); //save session data
        displaySessions(); //update list
        
        if(seconds < 20){
            feedback.textContent = 'That was WEAK';
        } else if (seconds >= 20 && seconds < 60){
            feedback.textContent = 'Okay... not bad';
        } else {
            feedback.textContent = "We're LOCKED IN!!";
        }

        seconds = 0; //reset the actual data so it doesnt go out of sync with what the user sees
        startButton.textContent = 'Start Again';
        timerDisplay.textContent = '00:00';
        
        isRunning = false; //state tracking
    }
});

clearSessionsButton.addEventListener('click', function () {
    localStorage.removeItem("sessions");
    displaySessions();
    feedback.textContent = "All sessions cleared";
});

//function to save sessions
function saveSession(duration){
    const session = {
        time: duration,
        date: new Date().toLocaleDateString(),
        timeOfDay: new Date().toLocaleTimeString()
    };

    let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
    sessions.push(session);

    localStorage.setItem("sessions", JSON.stringify(sessions)); //saves data to browser
}

//function to display sessions
function displaySessions(){
    
    const sessions = JSON.parse(localStorage.getItem("sessions")) || [];

    if(sessions.length === 0){
        sessionList.innerHTML = `No sessions yet. Start locking in!`;
        totalTimeDisplay.textContent = "Total Study Time: 00:00";
        return;
    }

    //sort session from longest to shortest
    sessions.sort((a, b) => b.time - a.time);
    const best = sessions[0];
    bestSessionDisplay.innerHTML = `Best Session: ${formatTime(best.time)} 🏆`;


    //total time studying
    const totalTime = sessions.reduce((total, session) => total + session.time, 0);
    totalTimeDisplay.textContent = `Total Time Locked In: ${formatTime(totalTime)}`;

    sessionList.innerHTML = "";

    sessions.forEach(function (session){
        const li = document.createElement('li');
        li.textContent = `${formatTime(session.time)} - ${session.date} @ ${session.timeOfDay}`;
        sessionList.appendChild(li);
    });

    
}

displaySessions();
