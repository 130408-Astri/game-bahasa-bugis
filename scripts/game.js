document.addEventListener("DOMContentLoaded", function () {
  // Variabel game
  let currentQuestion = 0;
  let score = 0;
  let timer;
  let timeLeft = 10;
  let questions = [];
  let gameData = [];

  // Elemen DOM
  const questionImage = document.getElementById("question-image");
  const optionsContainer = document.getElementById("options-container");
  const descriptionContainer = document.getElementById("description-container");
  const scoreElement = document.getElementById("score");
  const timerElement = document.getElementById("timer");
  const currentQuestionElement = document.getElementById("current-question");
  const gameOverContainer = document.getElementById("game-over-container");
  const finalScoreElement = document.getElementById("final-score");
  const playAgainBtn = document.getElementById("play-again-btn");

  // Fungsi untuk memuat data dari JSON
  async function loadGameData() {
    try {
      const response = await fetch("data.json");
      gameData = await response.json();
      startGame();
    } catch (error) {
      console.error("Error loading game data:", error);
    }
  }

  // Fungsi untuk memulai game
  function startGame() {
    currentQuestion = 0;
    score = 0;
    scoreElement.textContent = score;
    questions = generateQuestions();
    showQuestion();
  }

  // Fungsi untuk menghasilkan pertanyaan
  function generateQuestions() {
    const shuffledData = [...gameData].sort(() => 0.5 - Math.random());
    return shuffledData.slice(0, 20).map((item) => {
      // Pilih 3 jawaban salah secara acak
      const wrongAnswers = gameData
        .filter((data) => data.aksara !== item.aksara)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((data) => data.aksara);

      // Gabungkan jawaban benar dan salah, lalu acak
      const allOptions = [item.aksara, ...wrongAnswers].sort(
        () => 0.5 - Math.random()
      );

      return {
        imagePath: item.imagePath,
        correctAnswer: item.aksara,
        imageName: item.imageName,
        options: allOptions,
        description: item.imageDescription,
        aksara: item.aksara,
      };
    });
  }

  // Fungsi untuk menampilkan pertanyaan
  function showQuestion() {
    if (currentQuestion >= questions.length) {
      endGame();
      return;
    }

    // Reset state
    descriptionContainer.style.display = "none";
    optionsContainer.innerHTML = "";
    currentQuestionElement.textContent = currentQuestion + 1;

    // Set pertanyaan saat ini
    const question = questions[currentQuestion];
    questionImage.src = question.imagePath;
    questionImage.alt = "Gambar pertanyaan " + (currentQuestion + 1);

    // Buat opsi jawaban
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "option-btn";
      button.textContent = option;
      button.addEventListener("click", () =>
        checkAnswer(option, question.correctAnswer)
      );
      optionsContainer.appendChild(button);
    });

    // Mulai timer
    startTimer();
  }

  // Fungsi untuk memulai timer
  function startTimer() {
    timeLeft = 10;
    timerElement.textContent = timeLeft;

    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timer);
        skipQuestion();
      }
    }, 1000);
  }

  // Fungsi untuk memeriksa jawaban
  function checkAnswer(selectedAnswer, correctAnswer) {
    clearInterval(timer);

    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach((button) => {
      button.disabled = true;
      if (button.textContent === correctAnswer) {
        button.classList.add("correct");
      } else if (
        button.textContent === selectedAnswer &&
        selectedAnswer !== correctAnswer
      ) {
        button.classList.add("incorrect");
      }
    });

    // Tampilkan deskripsi
    descriptionContainer.innerHTML = `
            <p><strong>Jawaban benar:</strong> ${correctAnswer} (${questions[currentQuestion].imageName})</p>
            <p>${questions[currentQuestion].description}</p>
        `;
    descriptionContainer.style.display = "block";

    // Update skor jika benar
    if (selectedAnswer === correctAnswer) {
      score += 10;
      scoreElement.textContent = score;
    }

    // Lanjut ke pertanyaan berikutnya setelah 2 detik
    setTimeout(() => {
      currentQuestion++;
      showQuestion();
    }, 5000);
  }

  // Fungsi untuk melewati pertanyaan
  function skipQuestion() {
    const correctAnswer = questions[currentQuestion].correctAnswer;
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.textContent === correctAnswer) {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    });

    // Tampilkan deskripsi
    descriptionContainer.innerHTML = `
            <p><strong>Jawaban benar:</strong> ${correctAnswer}</p>
            <p>${questions[currentQuestion].description}</p>
        `;
    descriptionContainer.style.display = "block";

    // Lanjut ke pertanyaan berikutnya setelah 2 detik
    setTimeout(() => {
      currentQuestion++;
      showQuestion();
    }, 2000);
  }

  // Fungsi untuk mengakhiri game
  function endGame() {
    gameOverContainer.style.display = "flex";
    finalScoreElement.textContent = score;
  }

  // Event listener untuk tombol main lagi
  playAgainBtn.addEventListener("click", () => {
    gameOverContainer.style.display = "none";
    startGame();
  });

  // Mulai game
  loadGameData();
  
});
