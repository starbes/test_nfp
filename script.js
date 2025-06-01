let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let questions = [];
let selectedAnswers = new Set();

const questionNumberElement = document.getElementById('questionNumber');
const questionTextElement = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const nextButton = document.getElementById('nextButton');
const resultContainer = document.getElementById('resultContainer');
const resultText = document.getElementById('resultText');
const restartButton = document.getElementById('restartButton');
const testSelector = document.getElementById('testSelector');
const quizContainer = document.getElementById('quizContainer');

function loadTest(testFile) {
    fetch(testFile)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Тест пустой или повреждён");
            }
            questions = data;
            testSelector.style.display = 'none';
            quizContainer.style.display = 'block';
            currentQuestionIndex = 0;
            correctCount = 0;
            incorrectCount = 0;
            resultContainer.style.display = 'none';
            showQuestion();
        })
        .catch(error => {
            console.error("Ошибка загрузки теста:", error);
            alert("Ошибка загрузки теста: " + error.message);
        });
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionNumberElement.textContent = `Вопрос №${currentQuestionIndex + 1} из ${questions.length}`;
    questionTextElement.textContent = question.text;

    answersContainer.innerHTML = '';
    selectedAnswers.clear();

    question.allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => toggleAnswer(button, answer));
        answersContainer.appendChild(button);
    });

    nextButton.disabled = false;
    nextButton.textContent = 'Проверить';
    nextButton.onclick = () => checkAnswer(question);
}

function toggleAnswer(button, answer) {
    if (selectedAnswers.has(answer)) {
        selectedAnswers.delete(answer);
        button.classList.remove('selected');
    } else {
        selectedAnswers.add(answer);
        button.classList.add('selected');
    }
}

function checkAnswer(question) {
    const correctSet = new Set(question.correctAnswers);
    const allButtons = answersContainer.querySelectorAll('button');

    const isCorrect = setsEqual(selectedAnswers, correctSet);

    allButtons.forEach(button => {
        const answer = button.textContent;
        const isRight = correctSet.has(answer);
        const isSelected = selectedAnswers.has(answer);

        if (isRight && isSelected) {
            button.classList.add('correct');
        } else if (isRight && !isSelected) {
            button.classList.add('unselected-correct');
        } else if (!isRight && isSelected) {
            button.classList.add('incorrect');
        }

        button.disabled = true;
    });

    if (isCorrect) {
        correctCount++;
    } else {
        incorrectCount++;
    }

    nextButton.textContent = (currentQuestionIndex < questions.length - 1) ? 'Следующий' : 'Показать результат';
    nextButton.onclick = nextQuestion;
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
    resultText.textContent = `Правильных ответов: ${correctCount}, Неправильных ответов: ${incorrectCount}`;
}

restartButton.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    testSelector.style.display = 'block';
});

function setsEqual(a, b) {
    if (a.size !== b.size) return false;
    for (let item of a) {
        if (!b.has(item)) return false;
    }
    return true;
}
