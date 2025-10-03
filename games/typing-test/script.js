document.addEventListener("DOMContentLoaded", function () {
  // Sample texts for typing test
  const sampleTexts = [
    // Beginner Level (Short and Simple)
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
    "Practice makes perfect when it comes to typing speed and accuracy. Regular practice can significantly improve your words per minute.",
    "Learning to type without looking at the keyboard is called touch typing and can greatly increase your productivity.",
    "The sun is shining brightly today and the birds are singing in the trees outside my window.",
    "Coffee is one of the most popular beverages in the world and is enjoyed by millions of people daily.",

    // Technology and Programming
    "JavaScript is a versatile programming language that powers the modern web. It enables interactive websites and dynamic user experiences.",
    "Technology has revolutionized the way we communicate, work, and live our daily lives in the twenty-first century.",
    "The art of programming requires patience, logic, and creativity to solve complex problems and build amazing applications.",
    "Web development combines creativity with technical skills to create beautiful and functional websites and applications.",
    "Software development is a collaborative process that involves planning, coding, testing, and maintaining applications.",
    "Artificial intelligence and machine learning are transforming industries by automating tasks and providing intelligent insights.",
    "Cloud computing has made it possible for businesses to scale their operations without investing in expensive hardware infrastructure.",
    "Cybersecurity is becoming increasingly important as more of our lives move online and digital threats continue to evolve.",
    "Mobile applications have changed how we interact with technology, making computing power accessible in our pockets.",
    "Data science combines statistics, programming, and domain expertise to extract meaningful insights from large datasets.",

    // Business and Professional
    "Effective communication is essential for success in any professional environment and helps build strong relationships with colleagues.",
    "Time management skills are crucial for productivity and help individuals balance work responsibilities with personal commitments.",
    "Leadership involves inspiring others, making difficult decisions, and taking responsibility for both successes and failures.",
    "Customer service excellence requires active listening, empathy, and a genuine desire to help solve problems effectively.",
    "Marketing strategies must adapt to changing consumer behavior and leverage both traditional and digital channels.",
    "Project management involves coordinating resources, timelines, and stakeholders to achieve specific goals within budget constraints.",
    "Innovation drives business growth by creating new products, services, and processes that meet evolving market demands.",

    // Science and Nature
    "The Internet has connected billions of people around the world and has become an essential part of modern life.",
    "Climate change is one of the most pressing challenges facing humanity and requires immediate global action.",
    "The human brain contains approximately eighty-six billion neurons that work together to process information and control behavior.",
    "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.",
    "The theory of evolution explains how species change over time through natural selection and genetic variation.",
    "Renewable energy sources like solar and wind power are becoming more efficient and cost-effective alternatives to fossil fuels.",
    "The ocean covers more than seventy percent of Earth's surface and plays a crucial role in regulating global climate patterns.",

    // Literature and Arts
    "Reading books expands the mind, improves vocabulary, and provides insights into different cultures and perspectives throughout history.",
    "Music has the power to evoke emotions, bring people together, and transcend cultural and linguistic barriers.",
    "Art allows individuals to express creativity, communicate ideas, and interpret the world through various mediums and techniques.",
    "Writing is a powerful tool for communication that can inform, persuade, entertain, and inspire readers across generations.",
    "Poetry uses rhythm, rhyme, and imagery to convey complex emotions and ideas in a condensed and artistic form.",

    // History and Culture
    "Ancient civilizations built magnificent structures that continue to amaze and inspire people thousands of years later.",
    "The Renaissance was a period of cultural rebirth that brought significant advances in art, science, and human understanding.",
    "Exploration and trade have shaped human history by connecting distant cultures and facilitating the exchange of goods and ideas.",
    "Language is a living system that evolves over time, reflecting changes in society, technology, and cultural values.",
    "Democracy depends on informed citizens who participate actively in the political process and hold their leaders accountable.",

    // Health and Lifestyle
    "Regular exercise and a balanced diet are fundamental components of a healthy lifestyle that can prevent many chronic diseases.",
    "Mental health is just as important as physical health and requires attention, care, and professional support when needed.",
    "Sleep plays a vital role in physical recovery, mental clarity, and overall well-being, yet many people do not get enough rest.",
    "Meditation and mindfulness practices can reduce stress, improve focus, and enhance emotional regulation in daily life.",

    // Advanced Level (Longer and Complex)
    "Typing speed is measured in words per minute, with the average person typing around forty words per minute with decent accuracy, though professional typists can exceed one hundred words per minute.",
    "The development of artificial intelligence has raised important questions about the future of work, privacy, and the role of humans in an increasingly automated world.",
    "Globalization has created unprecedented opportunities for international collaboration while also presenting challenges related to economic inequality and cultural preservation.",
    "Environmental sustainability requires a fundamental shift in how we produce, consume, and dispose of goods, emphasizing renewable resources and circular economy principles.",
    "Educational technology has transformed traditional learning environments by providing personalized instruction, interactive content, and access to knowledge regardless of geographical location.",

    // Challenging Punctuation and Numbers
    "The meeting is scheduled for 3:30 PM on March 15th, 2024, in Conference Room B; please bring your laptops, notebooks, and identification cards.",
    "According to the research, approximately 67% of students prefer online learning, while 33% favor traditional classroom instruction methods.",
    "The company's quarterly revenue increased by $2.5 million (15.7%) compared to the same period last year, exceeding all expectations.",
    "Dr. Smith's presentation on 'Climate Change: Challenges & Solutions' will be held at the university's main auditorium tomorrow at 2:00 PM.",
    "The recipe calls for 2 cups of flour, 1/2 cup of sugar, 3 eggs, and 1 teaspoon of vanilla extract; bake at 350°F for 25-30 minutes.",
  ];

  // DOM Elements
  const timerDisplay = document.getElementById("timer");
  const wpmDisplay = document.getElementById("wpm");
  const cpmDisplay = document.getElementById("cpm");
  const errorsDisplay = document.getElementById("errors");
  const accuracyDisplay = document.getElementById("accuracy");
  const textDisplay = document.getElementById("text-display");
  const typingInput = document.getElementById("typing-input");
  const startBtn = document.getElementById("start-btn");
  const resetBtn = document.getElementById("reset-btn");
  const timeSelector = document.getElementById("time-selector");
  const results = document.getElementById("results");
  const finalWpm = document.getElementById("final-wpm");
  const finalCpm = document.getElementById("final-cpm");
  const finalAccuracy = document.getElementById("final-accuracy");
  const finalErrors = document.getElementById("final-errors");

  // Game variables
  let currentText = "";
  let startTime = 0;
  let endTime = 0;
  let timerInterval = null;
  let timeLeft = 60;
  let isTestActive = false;
  let totalCharactersTyped = 0;
  let correctCharacters = 0;
  let errors = 0;
  let currentPosition = 0;
  let isFirstLoad = true;

  // Initialize game
function initGame() {
    // Clear any existing intervals first
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset all variables FIRST
    isTestActive = false;
    currentPosition = 0;
    totalCharactersTyped = 0;
    correctCharacters = 0;
    errors = 0;
    
    // Clear input BEFORE setting text
    typingInput.value = "";
    typingInput.disabled = true;
    
    // Set the text
    if (isFirstLoad) {
        currentText = sampleTexts[0]; // Always the pangram
        isFirstLoad = false;
    } else {
        // For subsequent resets, use random text
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    }
    
    // Reset UI elements
    startBtn.textContent = "Start Test";
    startBtn.disabled = false;
    results.style.display = "none";
    
    // Reset stats
    resetStats();
    
    // Display text LAST (after everything is reset)
    displayText();
}


// Display text with character highlighting
function displayText() {
    textDisplay.innerHTML = "";
    const inputText = typingInput.value;

    // Ensure we have a valid currentText
    if (!currentText || currentText.length === 0) {
        textDisplay.innerHTML = "Loading text...";
        return;
    }

    for (let i = 0; i < currentText.length; i++) {
        const char = document.createElement("span");
        char.textContent = currentText[i];

        if (i < inputText.length) {
            if (inputText[i] === currentText[i]) {
                char.classList.add("correct");
            } else {
                char.classList.add("incorrect");
            }
        } else if (i === inputText.length) {
            char.classList.add("current");
        }
        // Remove any other classes that might be interfering
        
        textDisplay.appendChild(char);
    }
}


  // Reset statistics
  function resetStats() {
    timeLeft = parseInt(timeSelector.value);
    timerDisplay.textContent = timeLeft + "s";
    wpmDisplay.textContent = "0";
    cpmDisplay.textContent = "0";
    errorsDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
  }

  // Start the typing test
  function startTest() {
    if (!isTestActive) {
      isTestActive = true;
      startTime = Date.now();
      typingInput.disabled = false;
      typingInput.focus();
      startBtn.textContent = "Testing...";
      startBtn.disabled = true;

      timerInterval = setInterval(updateTimer, 1000);
    }
  }

  // Update timer
  function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft + "s";

    if (timeLeft <= 0 || typingInput.value === currentText) {
      endTest();
    }

    updateStats();
  }

  // Update real-time statistics
  function updateStats() {
    const inputText = typingInput.value;
    const timeElapsed = (Date.now() - startTime) / 1000;

    if (timeElapsed > 0) {
      // Calculate errors and accuracy
      let currentErrors = 0;
      let currentCorrect = 0;

      for (let i = 0; i < inputText.length; i++) {
        if (i < currentText.length) {
          if (inputText[i] === currentText[i]) {
            currentCorrect++;
          } else {
            currentErrors++;
          }
        }
      }

      errors = currentErrors;
      correctCharacters = currentCorrect;
      totalCharactersTyped = inputText.length;

      // Calculate WPM (words per minute)
      const wordsTyped = inputText
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const wpm = Math.round((wordsTyped / timeElapsed) * 60);

      // Calculate CPM (characters per minute)
      const cpm = Math.round((correctCharacters / timeElapsed) * 60);

      // Calculate accuracy
      const accuracy =
        totalCharactersTyped > 0
          ? Math.round((correctCharacters / totalCharactersTyped) * 100)
          : 100;

      // Update displays
      wpmDisplay.textContent = wpm;
      cpmDisplay.textContent = cpm;
      errorsDisplay.textContent = errors;
      accuracyDisplay.textContent = accuracy + "%";
    }
  }

  // End the typing test
  function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    endTime = Date.now();

    typingInput.disabled = true;
    startBtn.textContent = "Start Test";
    startBtn.disabled = false;

    showResults();
  }

  // Show final results
  function showResults() {
    const timeElapsed = Math.max((endTime - startTime) / 1000, 1);
    const inputText = typingInput.value;

    // Calculate final statistics
    const wordsTyped = inputText
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const finalWpmValue = Math.round((wordsTyped / timeElapsed) * 60);
    const finalCpmValue = Math.round((correctCharacters / timeElapsed) * 60);
    const finalAccuracyValue =
      totalCharactersTyped > 0
        ? Math.round((correctCharacters / totalCharactersTyped) * 100)
        : 100;

    // Update result displays
    finalWpm.textContent = finalWpmValue;
    finalCpm.textContent = finalCpmValue;
    finalAccuracy.textContent = finalAccuracyValue + "%";
    finalErrors.textContent = errors;

    // Show results with animation
    results.style.display = "block";
    results.classList.add("celebration");

    setTimeout(() => {
      results.classList.remove("celebration");
    }, 600);

    // Save best score to localStorage
    saveBestScore(finalWpmValue, finalAccuracyValue);
  }

  // Save best score
  function saveBestScore(wpm, accuracy) {
    const bestScore = localStorage.getItem("typing-test-best-wpm") || 0;
    if (wpm > bestScore) {
      localStorage.setItem("typing-test-best-wpm", wpm);
      localStorage.setItem("typing-test-best-accuracy", accuracy);
    }
  }

  // Event Listeners
  startBtn.addEventListener("click", startTest);

  resetBtn.addEventListener("click", function () {
    clearInterval(timerInterval);
    isTestActive = false;
    // Set isFirstLoad to false so reset gives random text
    isFirstLoad = false;
    initGame();
  });

  timeSelector.addEventListener("change", function () {
    if (!isTestActive) {
      resetStats();
    }
  });

  typingInput.addEventListener("input", function () {
    if (isTestActive) {
      displayText();
      updateStats();

      // Check if test is completed
      if (typingInput.value === currentText) {
        endTest();
      }
    }
  });

  typingInput.addEventListener("focus", function () {
    if (!isTestActive && startBtn.textContent === "Start Test") {
      startTest();
    }
  });

  // Prevent cheating by disabling common shortcuts
  typingInput.addEventListener("keydown", function (e) {
    // Disable Ctrl+V (paste), Ctrl+C (copy), Ctrl+A (select all)
    if (e.ctrlKey && (e.key === "v" || e.key === "c" || e.key === "a")) {
      e.preventDefault();
      return false;
    }

    // Disable F12, Ctrl+Shift+I (developer tools)
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
      e.preventDefault();
      return false;
    }
  });

  // Initialize the game when page loads
  initGame();

  // Auto-focus on typing input when clicking anywhere in the text display
  textDisplay.addEventListener("click", function () {
    if (!typingInput.disabled) {
      typingInput.focus();
    }
  });
});
