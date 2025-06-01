let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// Элементы интерфейса
const testSelection = document.getElementById("testSelection");
const app = document.getElementById("app");
const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const nextButton = document.getElementById("nextButton");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const restartButton = document.getElementById("restartButton");

let selectedAnswers = new Set();

// Функция запуска теста после выбора
function loadTest(fileName) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            questions = data;
            testSelection.style.display = "none";
            app.style.display = "block";
            startQuiz();
        })
        .catch(error => {
            alert("Ошибка загрузки теста: " + error);
        });
}

// Инициализация первого вопроса
function startQuiz() {
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    resultContainer.style.display = "none";
    nextButton.textContent = "Проверить";
    showQuestion();
}

// Отображение текущего вопроса
function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionNumber.textContent = `Вопрос №${currentQuestionIndex + 1} из ${questions.length}`;
    questionText.textContent = question.text;
    answersContainer.innerHTML = "";
    selectedAnswers.clear();

    question.allAnswers.forEach(answer => {
        const label = document.createElement("label");
        label.classList.add("answer-option");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = answer;
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                selectedAnswers.add(answer);
            } else {
                selectedAnswers.delete(answer);
            }
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(answer));
        answersContainer.appendChild(label);
    });
}

// Обработка кнопки "Проверить/Далее"
nextButton.addEventListener("click", () => {
    if (nextButton.textContent === "Проверить") {
        checkAnswer();
        nextButton.textContent = currentQuestionIndex < questions.length - 1 ? "Следующий" : "Показать результат";
    } else {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            nextButton.textContent = "Проверить";
            showQuestion();
        } else {
            showResult();
        }
    }
});

// Проверка правильности ответа
function checkAnswer() {
    const correctAnswers = new Set(questions[currentQuestionIndex].correctAnswers);
    if (setsEqual(correctAnswers, selectedAnswers)) {
        correctCount++;
    } else {
        incorrectCount++;
    }

    // Подсветка правильных/неправильных
    const inputs = answersContainer.querySelectorAll("input");
    inputs.forEach(input => {
        if (correctAnswers.has(input.value)) {
            input.parentElement.style.backgroundColor = "#c8f7c5"; // зеленый
        } else if (input.checked) {
            input.parentElement.style.backgroundColor = "#f7c5c5"; // красный
        }
        input.disabled = true;
    });
}

// Сравнение множеств
function setsEqual(a, b) {
    if (a.size !== b.size) return false;
    for (let item of a) {
        if (!b.has(item)) return false;
    }
    return true;
}

// Показ финального результата
function showResult() {
    questionNumber.style.display = "none";
    questionText.style.display = "none";
    answersContainer.style.display = "none";
    nextButton.style.display = "none";

    resultText.textContent = `Правильных ответов: ${correctCount}, Неправильных: ${incorrectCount}`;
    resultContainer.style.display = "block";
}

// Кнопка "Начать сначала"
restartButton.addEventListener("click", () => {
    app.style.display = "none";
    testSelection.style.display = "block";

    questionNumber.style.display = "block";
    questionText.style.display = "block";
    answersContainer.style.display = "block";
    nextButton.style.display = "inline-block";
});
