document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            text: "Какие из перечисленных языков программирования статически типизированы?",
            correctAnswers: ["Java", "Kotlin", "C++"],
            allAnswers: ["Java", "Kotlin", "C++", "Python", "JavaScript", "Ruby", "PHP", "Swift", "Go", "Rust"],
        },
        {
            text: "Какие компании разработали языки программирования?",
            correctAnswers: ["Google - Go", "Oracle - Java"],
            allAnswers: ["Google - Go", "Oracle - Java", "Apple - Swift", "Microsoft - C#", "IBM - COBOL", "Facebook - Hack"],
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
            button.style.backgroundColor = '#f0f0f0';  // Сбрасываем цвет
        } else {
            selectedAnswers.push(answer);
            button.style.backgroundColor = '#cce5ff';  // Выделяем выбранный ответ
        }

        nextButtonEl.disabled = selectedAnswers.length === 0;  // Делаем кнопку активной только при выборе хотя бы одного ответа
    }

    // Функция для проверки правильности ответов
    function checkAnswers() {
        const question = questions[currentQuestionIndex];
        const allCorrect = selectedAnswers.every(answer => question.correctAnswers.includes(answer)) &&
                           question.correctAnswers.every(answer => selectedAnswers.includes(answer));

        if (allCorrect) {
            correctAnswersCount++;
        } else {
            wrongAnswersCount++;
        }

        Array.from(answersContainerEl.children).forEach(button => {
            const answer = button.textContent;
            if (question.correctAnswers.includes(answer)) {
                button.classList.add(selectedAnswers.includes(answer) ? 'correct' : 'unselected-correct');
            } else if (selectedAnswers.includes(answer)) {
                button.classList.add('incorrect');
            }
            button.disabled = true;  // Делаем кнопки неактивными после проверки
        });

        isAnswersChecked = true;
        nextButtonEl.textContent = 'Далее';
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
