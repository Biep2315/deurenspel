// Simpele, duidelijke implementatie zonder frameworks.
// Spelregels: 3 deuren, één prijs (🎁). Klik op een deur om te kiezen.
// Als je juist raadt, telt dit als winst. Anders verlies.
// Knop "Nieuwe ronde" zorgt voor nieuwe willekeurige positie.

(function () {
  const DOOR_COUNT = 3;
  let prizeIndex = null;
  let chosenIndex = null;
  let round = 0;
  let wins = 0;
  let losses = 0;
  let locked = false;

  // UI elementen
  const doorsEl = document.getElementById('doors');
  const roundEl = document.getElementById('round');
  const winsEl = document.getElementById('wins');
  const lossesEl = document.getElementById('losses');
  const messageEl = document.getElementById('message');
  const nextBtn = document.getElementById('nextRound');
  const revealBtn = document.getElementById('revealAll');
  const resetBtn = document.getElementById('reset');

  // Maak deuren
  function createDoors() {
    doorsEl.innerHTML = '';
    for (let i = 0; i < DOOR_COUNT; i++) {
      const d = document.createElement('button');
      d.className = 'door closed';
      d.setAttribute('data-index', i);
      d.setAttribute('aria-label', `Deur ${i + 1}`);
      d.innerHTML = `<div class="label">Deur ${i + 1}</div>`;
      d.addEventListener('click', onDoorClick);
      d.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          d.click();
        }
      });
      doorsEl.appendChild(d);
    }
  }

  function newRound(autoMessage = true) {
    if (locked) return;
    round++;
    roundEl.textContent = round;
    chosenIndex = null;
    locked = false;
    prizeIndex = Math.floor(Math.random() * DOOR_COUNT);
    updateMessage(autoMessage ? 'Kies een deur.' : 'Kies een deur om te starten.');
    resetDoorsVisual();
  }

  function resetDoorsVisual() {
    document.querySelectorAll('.door').forEach((el) => {
      el.classList.remove('opened', 'disabled');
      el.classList.add('closed');
      el.innerHTML = `<div class="label">Deur ${parseInt(el.getAttribute('data-index')) + 1}</div>`;
      el.disabled = false;
    });
  }

  function onDoorClick(e) {
    if (locked) return;
    const el = e.currentTarget;
    const idx = Number(el.getAttribute('data-index'));
    chosenIndex = idx;
    revealChoice(idx);
  }

  function revealChoice(idx) {
    locked = true;
    // onthul gekozen deur
    const chosenEl = document.querySelector(`.door[data-index="${idx}"]`);
    if (!chosenEl) return;

    // toon visuals
    document.querySelectorAll('.door').forEach((el) => {
      el.classList.add('disabled');
      el.disabled = true;
    });

    // open chosen
    const symbol = (idx === prizeIndex) ? '🎁' : '🐐';
    chosenEl.classList.remove('closed');
    chosenEl.classList.add('opened');
    chosenEl.innerHTML = `<div class="reveal">${symbol}</div><div style="position:absolute;bottom:8px; font-weight:700;">Deur ${idx+1}</div>`;

    // open others (after korte delay voor dramatiek)
    setTimeout(() => {
      for (let i = 0; i < DOOR_COUNT; i++) {
        if (i === idx) continue;
        const other = document.querySelector(`.door[data-index="${i}"]`);
        const sym = (i === prizeIndex) ? '🎁' : '🐐';
        other.classList.remove('closed');
        other.classList.add('opened');
        other.innerHTML = `<div class="reveal">${sym}</div><div style="position:absolute;bottom:8px; font-weight:700;">Deur ${i+1}</div>`;
      }

      // update score
      if (idx === prizeIndex) {
        wins++;
        winsEl.textContent = wins;
        updateMessage('Goed geraden! 🎉 Je hebt de prijs gevonden.');
      } else {
        losses++;
        lossesEl.textContent = losses;
        updateMessage('Helaas, geen prijs. Probeer nog eens!');
      }

    }, 350);
  }

  function revealAll() {
    if (locked) {
      // laat zien als al gespeeld is
      document.querySelectorAll('.door').forEach((el) => {
        const i = Number(el.getAttribute('data-index'));
        const sym = (i === prizeIndex) ? '🎁' : '🐐';
        el.classList.remove('closed');
        el.classList.add('opened');
        el.innerHTML = `<div class="reveal">${sym}</div><div style="position:absolute;bottom:8px; font-weight:700;">Deur ${i+1}</div>`;
      });
      updateMessage('Alle deuren zijn onthuld.');
      return;
    }

    // als nog niet gekozen, toon tijdelijk en ga dan terug naar gesloten
    document.querySelectorAll('.door').forEach((el) => {
      const i = Number(el.getAttribute('data-index'));
      const sym = (i === prizeIndex) ? '🎁' : '🐐';
      el.classList.remove('closed');
      el.classList.add('opened');
      el.innerHTML = `<div class="reveal">${sym}</div><div style="position:absolute;bottom:8px; font-weight:700;">Deur ${i+1}</div>`;
    });

    setTimeout(() => {
      if (!locked) {
        resetDoorsVisual();
        updateMessage('Toon tijdelijk voltooid. Kies een deur om te spelen.');
      }
    }, 900);
  }

  function updateMessage(txt) {
    messageEl.textContent = txt;
  }

  function resetScores() {
    wins = 0;
    losses = 0;
    round = 0;
    winsEl.textContent = wins;
    lossesEl.textContent = losses;
    roundEl.textContent = round;
    updateMessage('Scores gereset. Klik "Nieuwe ronde" om te beginnen.');
    resetDoorsVisual();
    locked = false;
  }

  // events
  nextBtn.addEventListener('click', () => newRound(true));
  revealBtn.addEventListener('click', revealAll);
  resetBtn.addEventListener('click', resetScores);

  // initialisatie
  createDoors();
  resetScores();
})();
