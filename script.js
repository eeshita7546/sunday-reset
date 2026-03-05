(() => {
  const demoInputs = Array.from(document.querySelectorAll("input[data-demo-item]"));
  const progressBar = document.getElementById("demo-progress-bar");
  const progressText = document.getElementById("demo-progress-text");
  const completeAllBtn = document.getElementById("demo-complete-all");
  const focusLevel = document.getElementById("focus-level");
  const mondayClarity = document.getElementById("monday-clarity");

  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const nextStepBtn = document.getElementById("next-step");
  const stepStatus = document.getElementById("step-status");
  let activeStepIndex = 0;

  function updateDemoStats(percent) {
    if (!focusLevel || !mondayClarity) return;

    if (percent < 30) {
      focusLevel.textContent = "Low";
      mondayClarity.textContent = "Unclear";
      return;
    }

    if (percent < 80) {
      focusLevel.textContent = "Medium";
      mondayClarity.textContent = "Getting Clear";
      return;
    }

    focusLevel.textContent = "High";
    mondayClarity.textContent = "Very Clear";
  }

  function setDemoProgress() {
    if (!demoInputs.length || !progressBar || !progressText) return;

    const completeCount = demoInputs.filter((item) => item.checked).length;
    const percent = Math.round((completeCount / demoInputs.length) * 100);

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}% complete`;
    updateDemoStats(percent);
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

  if (completeAllBtn) {
    completeAllBtn.addEventListener("click", () => {
      demoInputs.forEach((input) => {
        input.checked = true;
      });
      setDemoProgress();
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      if (!steps.length) return;
      const nextIndex = (activeStepIndex + 1) % steps.length;
      setActiveStep(nextIndex);
    });
  }

  setDemoProgress();
  setActiveStep(activeStepIndex);
})();
