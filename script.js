// Обработчик данных викторины
const questions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Paris", correct: true },
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false },
      { text: "Rome", correct: false },
      { text: "Lisbon", correct: false }
    ]
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Mars", correct: true },
      { text: "Venus", correct: false },
      { text: "Earth", correct: false },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
      { text: "Mercury", correct: false }
    ]
  }
];

let currentQuestionIndex = 0;
let selectedAnswers = [];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const resultElement = document.getElementById("result");

// Загрузка вопроса
function loadQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = `Вопрос №${currentQuestionIndex + 1}: ${currentQuestion.question}`;

  currentQuestion.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;

    button.addEventListener("click", () => {
      handleAnswerSelection(button);
    });

    answersElement.appendChild(button);
  });
}

// Очистка предыдущего состояния
function resetState() {
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
  selectedAnswers = [];
  nextButton.style.display = "none";
}

// Обработка выбора ответа
function handleAnswerSelection(button) {
  // Очистка ранее выбранных ответов
  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.classList.remove("selected");
  });

  // Выделение выбранной кнопки
  button.classList.add("selected");

  // Сохранение выбранного ответа
  const index = Array.from(answersElement.children).indexOf(button);
  selectedAnswers = [index];

  nextButton.style.display = "inline-block";
}

// Проверка ответа
function checkAnswers() {
  const currentQuestion = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((button, index) => {
    const isCorrect = button.dataset.correct === "true";
    const isSelected = selectedAnswers.includes(index);

    if (isSelected) {
      button.classList.add(isCorrect ? "correct" : "wrong");
    } else if (isCorrect) {
      button.classList.add("missed");
    }
    button.disabled = true;
  });
}

// Переход к следующему вопросу
nextButton.addEventListener("click", () => {
  const isAnswered = selectedAnswers.length > 0;
  if (isAnswered) {
    checkAnswers();
    nextButton.textContent = "Следующий";

    nextButton.removeEventListener("click", loadNextQuestion);
    nextButton.addEventListener("click", loadNextQuestion);
  }
});

// Загрузка следующего вопроса
function loadNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    nextButton.textContent = "Проверить";
    loadQuestion();
  } else {
    showResults();
  }
}

// Показ результатов
function showResults() {
  questionElement.innerText = "Тест завершен!";
  answersElement.innerHTML = "";
  nextButton.style.display = "none";
  restartButton.style.display = "inline-block";
  resultElement.innerText = "Спасибо за участие!";
}

// Сброс теста
restartButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  restartButton.style.display = "none";
  resultElement.innerText = "";
  loadQuestion();
});

// Инициализация
loadQuestion();
