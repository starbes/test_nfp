document.addEventListener('DOMContentLoaded', () => {
  const questions = [
    {
      question: "Что определяет Наставление по физической подготовке в Вооруженных Силах Российской Федерации?",
      answers: [
        { text: "порядок организации физической подготовки военнослужащих ВС РФ, в том числе требования к уровню физической подготовленности военнослужащих, требования по уровню физической подготовки граждан РФ, поступающих на военную службу по контракту", correct: true },
        { text: "правила проведения спортивных соревнований в Вооруженных Силах РФ", correct: false },
        { text: "нормативы по обеспечению военнослужащих спортивным инвентарем", correct: false },
        { text: "порядок присвоения спортивных разрядов военнослужащим", correct: false },
        { text: "рекомендации по организации досуга военнослужащих в свободное от службы время", correct: false },
        { text: "требования к квалификации инструкторов по физической подготовке", correct: false }
      ]
    },
    {
      question: "Цель физической подготовки?",
      answers: [
        { text: "успешное выполнение военнослужащими своих служебных обязанностей", correct: true },
        { text: "достижение высоких спортивных результатов на соревнованиях", correct: false },
        { text: "поддержание идеальной физической формы для участия в конкурсах красоты", correct: false },
        { text: "формирование навыков выживания в экстремальных условиях дикой природы", correct: false },
        { text: "развитие исключительно силы и выносливости без учета других физических качеств", correct: false },
        { text: "обеспечение психологической разгрузки и снятия стресса", correct: false }
      ]
    },
    // Другие вопросы...
  ];

  let currentQuestionIndex = 0;
  let selectedAnswers = [];

  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const nextButton = document.getElementById("next-btn");
  const restartButton = document.getElementById("restart-btn");
  const resultElement = document.getElementById("result");

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

  function resetState() {
    while (answersElement.firstChild) {
      answersElement.removeChild(answersElement.firstChild);
    }
    selectedAnswers = [];
    nextButton.style.display = "none";
    nextButton.textContent = "Проверить";
    nextButton.classList.remove("checked");
  }

  function handleAnswerSelection(button) {
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");

    const index = Array.from(answersElement.children).indexOf(button);
    selectedAnswers = [index];
    nextButton.style.display = "inline-block";
  }

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

  nextButton.addEventListener("click", () => {
    if (!nextButton.classList.contains("checked")) {
      checkAnswers();
      nextButton.textContent = "Следующий";
      nextButton.classList.add("checked");
    } else {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        loadQuestion();
      } else {
        showResults();
      }
    }
  });

  function showResults() {
    questionElement.innerText = "Тест завершен!";
    answersElement.innerHTML = "";
    nextButton.style.display = "none";
    restartButton.style.display = "inline-block";
    resultElement.innerText = "Спасибо за участие!";
  }

  restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    restartButton.style.display = "none";
    resultElement.innerText = "";
    loadQuestion();
  });

  loadQuestion();
});
