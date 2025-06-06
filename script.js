const quizData = [
  {
    question: "What is the most used programming language in 2023?",
    a: "Java",
    b: "Python",
    c: "JavaScript",
    d: "C++",
    correct: "c",
  },
  {
    question: "What does CSS stand for?",
    a: "Cascading Style Sheets",
    b: "Computer Style Sheets",
    c: "Creative Style Sheets",
    d: "Colorful Style Sheets",
    correct: "a",
  },
  {
    question: "What does HTML stand for?",
    a: "Hypertext Markup Language",
    b: "Hypertext Machine Language",
    c: "Hyper Tool Markup Language",
    d: "Hyper Trainer Markup Language",
    correct: "a",
  },
  {
    question: "Which of these is a JavaScript framework?",
    a: "Django",
    b: "Flask",
    c: "React",
    d: "Laravel",
    correct: "c",
  },
];

const quiz = document.getElementById('quiz');
const answerEls = [];
let currentQuiz = 0;
let score = 0;

function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizData[currentQuiz];
  quiz.innerHTML = `
    <h3>${currentQuizData.question}</h3>
    <div class="quiz-option">
        <input type="radio" name="answer" id="a" value="a">
        <label for="a">${currentQuizData.a}</label>
    </div>
    <div class="quiz-option">
        <input type="radio" name="answer" id="b" value="b">
        <label for="b">${currentQuizData.b}</label>
    </div>
    <div class="quiz-option">
        <input type="radio" name="answer" id="c" value="c">
        <label for="c">${currentQuizData.c}</label>
    </div>
    <div class="quiz-option">
        <input type="radio" name="answer" id="d" value="d">
        <label for="d">${currentQuizData.d}</label>
    </div>
  `;
  answerEls[0] = document.getElementById('a');
  answerEls[1] = document.getElementById('b');
  answerEls[2] = document.getElementById('c');
  answerEls[3] = document.getElementById('d');
}

function deselectAnswers() {
  answerEls.forEach(answerEl => {
    if (answerEl) answerEl.checked = false;
  });
}

function getSelected() {
  let answer;
  answerEls.forEach(answerEl => {
    if (answerEl && answerEl.checked) {
      answer = answerEl.value;
    }
  });
  return answer;
}

document.getElementById('submit').addEventListener('click', () => {
  const answer = getSelected();
  if (answer) {
    if (answer === quizData[currentQuiz].correct) score++;
    currentQuiz++;
    if (currentQuiz < quizData.length) {
      loadQuiz();
    } else {
      quiz.innerHTML = `
        <h3>You answered ${score}/${quizData.length} questions correctly</h3>
        <button onclick="location.reload()">Reload</button>
      `;
    }
  }
});

loadQuiz();

document.getElementById('fetch-data').addEventListener('click', fetchJoke);
async function fetchJoke() {
  const apiData = document.getElementById('api-data');
  apiData.innerHTML = '<p>Loading joke...</p>';
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
    const data = await response.json();
    if (data.error) {
      apiData.innerHTML = `<p>Error: ${data.message}</p>`;
    } else {
      apiData.innerHTML = `
        <div class="joke">
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Joke:</strong> ${data.joke}</p>
        </div>
      `;
    }
  } catch (error) {
    apiData.innerHTML = `<p>Failed to fetch joke. Please try again later.</p>`;
    console.error('Error fetching joke:', error);
  }
}

document.getElementById('fetch-weather').addEventListener('click', fetchWeatherByLocation);
async function fetchWeatherByLocation() {
  const apiKey = "b1b15e88fa797225412429c1c50c122a1"; // Replace with real key
  const weatherDiv = document.getElementById('weather-location');
  weatherDiv.innerHTML = '<p>Fetching weather for your location...</p>';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        weatherDiv.innerHTML = `
          <h3>Weather at Your Location</h3>
          <p>📍 Location: ${data.name || 'Unknown'}</p>
          <p>🌡️ Temperature: ${data.main.temp}°C</p>
          <p>☁️ Weather: ${data.weather[0].description}</p>
        `;
      } catch (error) {
        weatherDiv.innerHTML = '<p>Failed to fetch weather.</p>';
      }
    }, () => {
      weatherDiv.innerHTML = '<p>Location access denied.</p>';
    });
  } else {
    weatherDiv.innerHTML = '<p>Geolocation not supported.</p>';
  }
}
