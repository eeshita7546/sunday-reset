(() => {
  const demoInputs = Array.from(
    document.querySelectorAll("input[data-demo-item]")
  );
  const progressBar = document.getElementById("demo-progress-bar");
  const progressText = document.getElementById("demo-progress-text");
  const completeAllBtn = document.getElementById("demo-complete-all");

  const steps = Array.from(document.querySelectorAll("[data-step]"));
  const nextStepBtn = document.getElementById("next-step");
  const stepStatus = document.getElementById("step-status");
  let activeStepIndex = 0;

  function setDemoProgress() {
    if (!demoInputs.length || !progressBar || !progressText) return;
    const completeCount = demoInputs.filter((item) => item.checked).length;
    const percent = Math.round((completeCount / demoInputs.length) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}% complete`;
  }

  function setActiveStep(nextIndex) {
    if (!steps.length || !stepStatus) return;
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === nextIndex);
    });
    activeStepIndex = nextIndex;
    stepStatus.textContent = `Current step: ${activeStepIndex + 1} of ${
      steps.length
    }`;
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

  if (nextStepBtn && steps.length) {
    nextStepBtn.addEventListener("click", () => {
      const nextIndex = (activeStepIndex + 1) % steps.length;
      setActiveStep(nextIndex);
    });
  }

  setDemoProgress();
  setActiveStep(activeStepIndex);
})();
