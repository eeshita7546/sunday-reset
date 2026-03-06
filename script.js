(() => {
  // Keep the user's scroll position on refresh/navigation within this page.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const savedScrollY = sessionStorage.getItem("sr-scroll-y");
  if (savedScrollY) {
    window.addEventListener("load", () => {
      window.scrollTo(0, Number(savedScrollY));
    });
  }

  const demoInputs = Array.from(document.querySelectorAll("input[data-demo-item]"));
  const progressBar = document.getElementById("demo-progress-bar");
  const progressText = document.getElementById("demo-progress-text");
  const completeAllBtn = document.getElementById("demo-complete-all");
  const focusLevel = document.getElementById("focus-level");
  const mondayClarity = document.getElementById("monday-clarity");
  const weeklyNote = document.getElementById("weekly-note");
  const confettiLayer = document.getElementById("confetti-layer");
  const dayChips = Array.from(document.querySelectorAll("[data-day-chip]"));
  const intentChips = Array.from(document.querySelectorAll("[data-intent-chip]"));
  const intentionValue = document.getElementById("intention-value");

  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const nextStepBtn = document.getElementById("next-step");
  const stepStatus = document.getElementById("step-status");
  const splitPanels = Array.from(document.querySelectorAll("[data-split-panel]"));
  let activeStepIndex = 0;
  let confettiPlayed = false;

  function launchConfetti() {
    if (!confettiLayer) return;
    const colors = ["#c7e4be", "#f3d18a", "#d3dff1", "#f2b8b5", "#d5e7db"];
    for (let i = 0; i < 26; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty("--dx", `${Math.random() * 120 - 60}px`);
      piece.style.animationDelay = `${Math.random() * 220}ms`;
      confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 1500);
    }
  }

  function updateDemoStats(percent) {
    if (!focusLevel || !mondayClarity) return;
    const activeDays = dayChips.filter((chip) => chip.classList.contains("is-on")).length;
    const activeIntent = intentChips.find((chip) => chip.classList.contains("is-on"));
    const intentScore = Number(
      activeIntent ? activeIntent.getAttribute("data-intent-score") : 4
    );
    const intentLabel = activeIntent ? activeIntent.textContent.trim() : "Steady";
    const combinedScore = Math.round(
      percent * 0.62 + (activeDays / 7) * 24 + intentScore * 1.4
    );

    if (combinedScore < 40) {
      focusLevel.textContent = "Low";
      mondayClarity.textContent = "Unclear";
      if (weeklyNote) weeklyNote.textContent = "Start your reset to build momentum.";
      return;
    }

    if (combinedScore < 75) {
      focusLevel.textContent = "Medium";
      mondayClarity.textContent = "Getting Clear";
      if (weeklyNote) {
        if (intentLabel === "Steady") {
          weeklyNote.textContent = "Steady pace is working. Keep your rhythm consistent.";
        } else if (intentLabel === "Focused") {
          weeklyNote.textContent = "Focused mode is active. Protect your top 3 priorities.";
        } else {
          weeklyNote.textContent = "Ambitious setup. Keep your plan realistic and intentional.";
        }
      }
      return;
    }

    focusLevel.textContent = "High";
    mondayClarity.textContent = "Very Clear";
    if (weeklyNote) weeklyNote.textContent = "Strong setup. Monday will feel calm and focused.";
  }

  function setDemoProgress() {
    if (!demoInputs.length || !progressBar || !progressText) return;

    const completeCount = demoInputs.filter((item) => item.checked).length;
    const percent = Math.round((completeCount / demoInputs.length) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}% complete`;
    updateDemoStats(percent);

    if (percent === 100 && !confettiPlayed) {
      confettiPlayed = true;
      launchConfetti();
    }
    if (percent < 100) {
      confettiPlayed = false;
    }
  }

  function getCurrentPercent() {
    if (!demoInputs.length) return 0;
    const completeCount = demoInputs.filter((item) => item.checked).length;
    return Math.round((completeCount / demoInputs.length) * 100);
  }

  function setActiveStep(index) {
    if (!steps.length || !stepStatus) return;

    steps.forEach((step, i) => {
      step.classList.toggle("is-active", i === index);
    });

    activeStepIndex = index;
    stepStatus.textContent = `Current step: ${activeStepIndex + 1} of ${steps.length}`;
  }

  demoInputs.forEach((input) => {
    input.addEventListener("change", setDemoProgress);
  });

  dayChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("is-on");
      chip.setAttribute("aria-pressed", chip.classList.contains("is-on") ? "true" : "false");
      setDemoProgress();
    });
  });

  intentChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      intentChips.forEach((other) => {
        other.classList.remove("is-on");
        other.setAttribute("aria-pressed", "false");
      });
      chip.classList.add("is-on");
      chip.setAttribute("aria-pressed", "true");
      if (intentionValue) intentionValue.textContent = chip.textContent.trim();
      setDemoProgress();
    });
  });

  if (completeAllBtn) {
    completeAllBtn.addEventListener("click", () => {
      // Recalculate progress from current selections only.
      setDemoProgress();
      if (getCurrentPercent() === 100) {
        launchConfetti();
      }
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      if (!steps.length) return;
      const nextIndex = (activeStepIndex + 1) % steps.length;
      setActiveStep(nextIndex);
    });
  }

  if (splitPanels.length) {
    const activatePanel = (target) => {
      splitPanels.forEach((panel) => {
        const isActive = panel === target;
        panel.classList.toggle("is-active", isActive);
        panel.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    splitPanels.forEach((panel) => {
      panel.addEventListener("click", () => activatePanel(panel));
      panel.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activatePanel(panel);
        }
      });
    });
  }

  setDemoProgress();
  setActiveStep(activeStepIndex);

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("sr-scroll-y", String(window.scrollY));
  });
})();
