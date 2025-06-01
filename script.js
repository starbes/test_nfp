document.addEventListener('DOMContentLoaded', () => {

},
];

    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    let wrongAnswersCount = 0;
    let selectedAnswers = [];
    let isAnswersChecked = false;

    const questionNumberEl = document.getElementById('questionNumber');
    const questionTextEl = document.getElementById('questionText');
    const answersContainerEl = document.getElementById('answersContainer');
    const nextButtonEl = document.getElementById('nextButton');
    const resultContainerEl = document.getElementById('resultContainer');
    const resultTextEl = document.getElementById('resultText');
    const restartButtonEl = document.getElementById('restartButton');

    // Функция для отображения вопроса
    function displayQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }

        const question = questions[currentQuestionIndex];
        questionNumberEl.textContent = `Вопрос №${currentQuestionIndex + 1} из ${questions.length}`;
        questionTextEl.textContent = question.text;

        answersContainerEl.innerHTML = '';  // Очищаем контейнер с ответами

        const shuffledAnswers = shuffle([
            ...question.correctAnswers,
            ...question.allAnswers.filter(a => !question.correctAnswers.includes(a)).slice(0, 6 - question.correctAnswers.length)
        ]);

        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.addEventListener('click', () => toggleAnswer(button, answer));
            answersContainerEl.appendChild(button);
        });

        nextButtonEl.textContent = 'Проверить';
        nextButtonEl.disabled = true;
        isAnswersChecked = false;
    }

    // Функция для выделения выбранного ответа
function toggleAnswer(button, answer) {
    if (selectedAnswers.includes(answer)) {
        selectedAnswers = selectedAnswers.filter(a => a !== answer);
        button.classList.remove('selected');
    } else {
        selectedAnswers.push(answer);
        button.classList.add('selected');
    }

    nextButtonEl.disabled = selectedAnswers.length === 0;
}


    // Функция для проверки правильности ответов
function checkAnswers() {
    const question = questions[currentQuestionIndex];

    // Проверяем правильность выбранных ответов
    const allCorrect =
        selectedAnswers.every(answer => question.correctAnswers.includes(answer)) &&
        question.correctAnswers.every(answer => selectedAnswers.includes(answer));

    if (allCorrect) {
        correctAnswersCount++;
    } else {
        wrongAnswersCount++;
    }

    // Обрабатываем кнопки
    Array.from(answersContainerEl.children).forEach(button => {
        const answer = button.textContent;

        if (question.correctAnswers.includes(answer)) {
            // Если ответ правильный
            if (selectedAnswers.includes(answer)) {
                button.classList.add('correct'); // Выбранный правильный ответ
            } else {
                button.classList.add('unselected-correct'); // Правильный, но не выбранный
            }
        } else if (selectedAnswers.includes(answer)) {
            // Если ответ неправильный и был выбран
            button.classList.add('incorrect');
        }

        // Делаем кнопку неактивной
        button.disabled = true;
    });

    // Устанавливаем флаг и текст кнопки
    isAnswersChecked = true;
    nextButtonEl.textContent = 'Далее';

    Array.from(answersContainerEl.children).forEach(button => {
    button.style.backgroundColor = ''; // Убираем инлайновые стили
});
}

    // Функция для отображения результатов
    function showResults() {
        questionNumberEl.textContent = 'Тест завершен!';
        questionTextEl.textContent = '';
        answersContainerEl.innerHTML = '';
        resultTextEl.textContent = `Правильных ответов: ${correctAnswersCount}\nНеправильных ответов: ${wrongAnswersCount}`;
        resultContainerEl.style.display = 'block';
        nextButtonEl.style.display = 'none';
    }

    // Функция для перезапуска викторины
    function restartQuiz() {
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        wrongAnswersCount = 0;
        selectedAnswers = [];
        resultContainerEl.style.display = 'none';
        nextButtonEl.style.display = 'block';
        displayQuestion();
    }

    // Обработчик нажатия кнопки "Проверить" или "Далее"
    nextButtonEl.addEventListener('click', () => {
        if (!isAnswersChecked) {
            checkAnswers();
        } else {
            currentQuestionIndex++;
            selectedAnswers = [];
            displayQuestion();
        }
    });

    // Обработчик нажатия кнопки "Начать сначала"
    restartButtonEl.addEventListener('click', restartQuiz);

    // Функция для перемешивания массива
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];  // Меняем местами элементы
        }
        return array;
    }

    // Инициализация викторины
    displayQuestion();
});
