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

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    
    // Проверим, что мы получаем правильный вопрос
    console.log(question.text);

    // Обновляем номер вопроса
    questionNumberEl.textContent = `Вопрос №${currentQuestionIndex + 1} из ${questions.length}`;
    // Обновляем текст вопроса
    questionTextEl.textContent = question.text;

    // Обновляем контейнер с вариантами ответов
    answersContainerEl.innerHTML = ''; // очищаем старые кнопки перед добавлением новых

    // Перемешиваем правильные и неправильные ответы
    const shuffledAnswers = shuffle([...question.correctAnswers, ...question.allAnswers.filter(a => !question.correctAnswers.includes(a)).slice(0, 6 - question.correctAnswers.length)]);

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

    function toggleAnswer(button, answer) {
        if (selectedAnswers.includes(answer)) {
            selectedAnswers = selectedAnswers.filter(a => a !== answer);
            button.style.backgroundColor = '#f0f0f0';
        } else {
            selectedAnswers.push(answer);
            button.style.backgroundColor = '#cce5ff';
        }

        nextButtonEl.disabled = selectedAnswers.length === 0;
    }

function checkAnswers() {
    const question = questions[currentQuestionIndex];
    const allCorrect = selectedAnswers.every(answer => question.correctAnswers.includes(answer)) &&
                       question.correctAnswers.every(answer => selectedAnswers.includes(answer));

    if (allCorrect) {
        correctAnswersCount++;
    } else {
        wrongAnswersCount++;
    }

    // Для каждой кнопки в answersContainer проверяем, правильный ли это ответ
    Array.from(answersContainerEl.children).forEach(button => {
        const answer = button.textContent;
        
        if (question.correctAnswers.includes(answer)) {
            // Если ответ правильный, но не выбран — жёлтый цвет
            button.classList.add(selectedAnswers.includes(answer) ? 'correct' : 'unselected-correct');
        } else if (selectedAnswers.includes(answer)) {
            // Если ответ выбран, но неправильный — красный цвет
            button.classList.add('incorrect');
        }

        button.disabled = true; // После проверки блокируем все кнопки
    });

    isAnswersChecked = true;
    nextButtonEl.textContent = 'Далее';
}
        Array.from(answersContainerEl.children).forEach(button => {
            const answer = button.textContent;
            if (question.correctAnswers.includes(answer)) {
                button.classList.add(selectedAnswers.includes(answer) ? 'correct' : 'unselected-correct');
            } else if (selectedAnswers.includes(answer)) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });

        isAnswersChecked = true;
        nextButtonEl.textContent = 'Далее';
    }

    function showResults() {
        questionNumberEl.textContent = 'Тест завершен!';
        questionTextEl.textContent = '';
        answersContainerEl.innerHTML = '';
        resultTextEl.textContent = `Правильных ответов: ${correctAnswersCount}\nНеправильных ответов: ${wrongAnswersCount}`;
        resultContainerEl.style.display = 'block';
        nextButtonEl.style.display = 'none';
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        wrongAnswersCount = 0;
        selectedAnswers = [];
        resultContainerEl.style.display = 'none';
        nextButtonEl.style.display = 'block';
        displayQuestion();
    }

    nextButtonEl.addEventListener('click', () => {
        if (!isAnswersChecked) {
            checkAnswers();
        } else {
            currentQuestionIndex++;
            selectedAnswers = [];
            displayQuestion();
        }
    });

    restartButtonEl.addEventListener('click', restartQuiz);

    displayQuestion();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
