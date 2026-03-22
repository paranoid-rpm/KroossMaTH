// KroossMaTH — app.js — ПЕРЕРАБОТАННАЯ игровая логика

let currentCW = null;
let userAnswers = {};
let activeWord = null;
let activeDir = 'across';

// ====== ИНИЦИАЛИЗАЦИЯ ======
function initApp() {
  initTheme();
  initNavScroll();
  initHeroCrossword();
  initPlaySection();
  initSavedSection();
}

// ====== ТЕМА ======
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('km_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : '');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? '' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('km_theme', next === 'light' ? 'light' : 'dark');
    });
  }
}

// ====== НАВБАР СКРОЛЛ ======
function initNavScroll() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    const href = l.getAttribute('href') || '';
    if (href.startsWith('#')) {
      l.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        links.forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      });
    }
  });
}

// ====== HERO КРОССВОРД ======
function initHeroCrossword() {
  const el = document.getElementById('heroCrossword');
  if (!el) return;
  const pattern = [
    [0,1,0,0,1,0,0],
    [1,1,1,1,1,1,1],
    [0,1,0,0,1,0,0],
    [0,1,1,1,1,1,0],
    [0,0,0,0,1,0,0],
    [1,1,1,1,1,0,0],
    [0,0,0,0,1,0,0]
  ];
  const letters = 'МАТЕМ АТИКА ЧИСЛ ОДРОБ ЬАЛГЕ БРА';
  let li = 0;
  el.innerHTML = '';
  pattern.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement('div');
      div.className = 'prev-cell' + (cell === 0 ? ' black' : '');
      if (cell === 1) {
        const ch = letters[li] || '';
        div.textContent = ch.trim() ? ch : '';
        li++;
      }
      el.appendChild(div);
    });
  });
  setInterval(() => {
    const cells = el.querySelectorAll('.prev-cell:not(.black)');
    cells.forEach(c => c.classList.remove('active'));
    const rnd = Math.floor(Math.random() * cells.length);
    if (cells[rnd]) cells[rnd].classList.add('active');
  }, 800);
}

// ====== ВАЛИДАЦИЯ КРОССВОРДА ======
function isCrosswordValid(cw) {
  if (!cw || !cw.size || !cw.grid || !cw.words) return false;
  const { rows, cols } = cw.size;
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows <= 0 || cols <= 0) return false;
  if (cw.grid.length !== rows) return false;
  for (let r = 0; r < rows; r++) {
    if (!Array.isArray(cw.grid[r]) || cw.grid[r].length !== cols) return false;
  }
  const used = {};
  for (const w of cw.words) {
    if (!w.answer || !w.answer.length) return false;
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
      if (cw.grid[r][c] === 0) return false;
      const key = `${r},${c}`;
      const ch = (w.answer[i] || '').toUpperCase();
      if (!ch) return false;
      if (used[key] && used[key] !== ch) return false;
      used[key] = ch;
    }
  }
  return true;
}

// ====== СЕКЦИЯ РЕШЕНИЯ ======
function initPlaySection() {
  const gradeSelect = document.getElementById('playClass');
  const typeSelect  = document.getElementById('playType');
  const diffSelect  = document.getElementById('playDiff');
  const grid        = document.getElementById('crosswordsGrid');
  const gameArea    = document.getElementById('gameArea');
  const backBtn     = document.getElementById('backBtn');
  const checkBtn    = document.getElementById('checkBtn');
  const hintBtn     = document.getElementById('hintBtn');
  const resetBtn    = document.getElementById('resetBtn');

  if (!gradeSelect || !grid) return;

  GRADES.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = `${g} класс`;
    gradeSelect.appendChild(opt);
  });

  function refresh() {
    const cws = filterCrosswords({
      grade: gradeSelect.value,
      type: typeSelect ? typeSelect.value : '',
      difficulty: diffSelect ? diffSelect.value : ''
    }).filter(isCrosswordValid);
    renderCards(cws, grid);
  }

  gradeSelect.addEventListener('change', refresh);
  typeSelect  && typeSelect.addEventListener('change', refresh);
  diffSelect  && diffSelect.addEventListener('change', refresh);
  refresh();

  backBtn && backBtn.addEventListener('click', () => {
    gameArea.style.display = 'none';
    grid.style.display = '';
    const filters = document.querySelector('.play-filters');
    if (filters) filters.style.display = '';
    currentCW = null;
    activeWord = null;
  });

  checkBtn && checkBtn.addEventListener('click', checkAnswers);
  hintBtn  && hintBtn.addEventListener('click', giveHint);
  resetBtn && resetBtn.addEventListener('click', resetGame);
}

function renderCards(cws, container) {
  if (!container) return;
  container.innerHTML = '';
  if (!cws.length) {
    container.innerHTML = '<div class="empty-state"><span>😔</span>Нет корректных кроссвордов по выбранному фильтру</div>';
    return;
  }
  cws.forEach(cw => {
    const progress = getProgress(cw.id);
    const pct = progress ? Math.round(progress.correct / progress.total * 100) : 0;
    const card = document.createElement('div');
    card.className = 'cw-card fade-in';
    card.innerHTML = `
      <div class="cw-card-badge badge-${cw.type}">${TYPE_LABELS[cw.type]}</div>
      <h4>${cw.title}</h4>
      <p>${cw.description}</p>
      <div class="cw-card-meta">
        <span>${cw.grade} класс</span>
        <span style="color:${DIFF_COLORS[cw.difficulty]}">${DIFF_LABELS[cw.difficulty]}</span>
        ${pct > 0 ? `<span style="color:var(--green)">${pct}%</span>` : ''}
      </div>
      <div class="cw-card-progress" style="width:${pct}%"></div>`;
    card.addEventListener('click', () => startGame(cw));
    container.appendChild(card);
  });
}

// ====== ЗАПУСК ИГРЫ ======
function startGame(cw) {
  if (!cw) return;
  currentCW = cw;
  userAnswers = loadProgress(cw.id) || {};
  activeWord = null;
  activeDir = 'across';

  const gameArea = document.getElementById('gameArea');
  const grid     = document.getElementById('crosswordsGrid');
  const title    = document.getElementById('gameTitle');
  const banner   = document.getElementById('resultBanner');

  if (!gameArea) return;
  grid && (grid.style.display = 'none');
  const filters = document.querySelector('.play-filters');
  if (filters) filters.style.display = 'none';
  gameArea.style.display = 'block';
  if (banner) banner.style.display = 'none';
  if (title) title.textContent = `${cw.title} · ${cw.grade} класс · ${DIFF_LABELS[cw.difficulty]}`;

  renderGameGrid(cw);
  renderClues(cw);

  // авто-фокус на первое слово
  if (cw.words.length) {
    const first = cw.words[0];
    activeWord = first;
    activeDir  = first.dir;
    setTimeout(() => {
      focusCell(first.row, first.col);
      highlightWord(first);
      updateClueHighlight(first.id);
    }, 50);
  }
}

// ====== РЕНДЕР СЕТКИ ======
function renderGameGrid(cw) {
  const container = document.getElementById('crosswordGrid');
  if (!container) return;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cw.size.cols}, 40px)`;

  // Строим numberMap — номер слова по стартовой клетке
  const numberMap = {};
  cw.words.forEach(w => {
    const key = `${w.row},${w.col}`;
    if (!numberMap[key]) numberMap[key] = w.id;
  });

  for (let r = 0; r < cw.size.rows; r++) {
    for (let c = 0; c < cw.size.cols; c++) {
      const cell = document.createElement('div');
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (cw.grid[r][c] === 0) {
        cell.className = 'grid-cell black';
      } else {
        cell.className = 'grid-cell';
        const key = `${r},${c}`;
        if (numberMap[key]) {
          const num = document.createElement('span');
          num.className = 'cell-number';
          num.textContent = numberMap[key];
          cell.appendChild(num);
        }
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.autocomplete = 'off';
        input.autocorrect = 'off';
        input.spellcheck = false;
        input.dataset.row = r;
        input.dataset.col = c;
        if (userAnswers[key]) input.value = userAnswers[key];
        input.addEventListener('focus', () => onCellFocus(r, c));
        input.addEventListener('input',   e  => onCellInput(e, r, c));
        input.addEventListener('keydown', e  => onCellKeydown(e, r, c));
        cell.appendChild(input);
      }
      container.appendChild(cell);
    }
  }
}

// ====== ФОКУС НА КЛЕТКЕ ======
function onCellFocus(r, c) {
  if (!currentCW) return;
  const words = getWordsAtCell(r, c);
  if (!words.length) return;

  // Если кликнули на клетку того же слова — не меняем
  if (activeWord && words.find(w => w.id === activeWord.id)) {
    // если есть слово в другом направлении — переключаем при повторном клике
    highlightWord(activeWord);
    updateClueHighlight(activeWord.id);
    return;
  }

  // Предпочитаем текущее направление
  let word = words.find(w => w.dir === activeDir) || words[0];
  activeWord = word;
  activeDir  = word.dir;
  highlightWord(word);
  updateClueHighlight(word.id);
}

function getWordsAtCell(r, c) {
  if (!currentCW) return [];
  return currentCW.words.filter(w => {
    for (let i = 0; i < w.answer.length; i++) {
      const wr = w.dir === 'down'   ? w.row + i : w.row;
      const wc = w.dir === 'across' ? w.col + i : w.col;
      if (wr === r && wc === c) return true;
    }
    return false;
  });
}

function highlightWord(word) {
  // Снимаем все подсветки
  document.querySelectorAll('.grid-cell').forEach(c => {
    c.classList.remove('highlighted', 'active-cell');
  });
  if (!word) return;
  // Подсвечиваем слово
  for (let i = 0; i < word.answer.length; i++) {
    const r = word.dir === 'down'   ? word.row + i : word.row;
    const c = word.dir === 'across' ? word.col + i : word.col;
    const cell = getCellEl(r, c);
    if (cell) cell.classList.add('highlighted');
  }
  // Активная клетка (та где курсор)
  const focused = document.activeElement;
  if (focused && focused.tagName === 'INPUT') {
    const cell = focused.parentElement;
    if (cell && cell.classList.contains('highlighted')) {
      cell.classList.add('active-cell');
    }
  }
}

function updateClueHighlight(wordId) {
  document.querySelectorAll('.clue-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id) === wordId);
  });
  // Скроллим активную подсказку в видимую область
  const active = document.querySelector('.clue-item.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ====== ВВОД СИМВОЛА ======
function onCellInput(e, r, c) {
  const val = e.target.value.replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '').toUpperCase().slice(-1);
  e.target.value = val;
  const key = `${r},${c}`;
  if (val) {
    userAnswers[key] = val;
  } else {
    delete userAnswers[key];
  }
  if (currentCW) saveProgress(currentCW);

  const cell = getCellEl(r, c);
  if (cell) cell.classList.remove('correct', 'wrong');

  if (val && activeWord) moveToNext(r, c);
}

// ====== НАВИГАЦИЯ КЛАВИШАМИ ======
function onCellKeydown(e, r, c) {
  switch (e.key) {
    case 'Backspace':
      if (!e.target.value) {
        e.preventDefault();
        moveToPrev(r, c);
      }
      break;
    case 'ArrowRight': e.preventDefault(); moveFocusDirect(r, c + 1); break;
    case 'ArrowLeft':  e.preventDefault(); moveFocusDirect(r, c - 1); break;
    case 'ArrowDown':  e.preventDefault(); moveFocusDirect(r + 1, c); break;
    case 'ArrowUp':    e.preventDefault(); moveFocusDirect(r - 1, c); break;
    case 'Tab': {
      e.preventDefault();
      switchToNextWord(e.shiftKey);
      break;
    }
  }
}

function moveToNext(r, c) {
  if (!activeWord) return;
  const idx = getIndexInWord(activeWord, r, c);
  if (idx < 0) return;
  if (idx < activeWord.answer.length - 1) {
    const nr = activeWord.dir === 'down'   ? r + 1 : r;
    const nc = activeWord.dir === 'across' ? c + 1 : c;
    focusCell(nr, nc);
  }
}

function moveToPrev(r, c) {
  if (!activeWord) return;
  const idx = getIndexInWord(activeWord, r, c);
  if (idx > 0) {
    const nr = activeWord.dir === 'down'   ? r - 1 : r;
    const nc = activeWord.dir === 'across' ? c - 1 : c;
    const cell = getCellEl(nr, nc);
    if (cell) {
      const inp = cell.querySelector('input');
      if (inp) {
        // Очищаем предыдущую клетку
        inp.value = '';
        const key = `${nr},${nc}`;
        delete userAnswers[key];
        if (currentCW) saveProgress(currentCW);
        cell.classList.remove('correct', 'wrong');
        inp.focus();
      }
    }
  }
}

function moveFocusDirect(r, c) {
  const el = getCellEl(r, c);
  if (el && !el.classList.contains('black')) {
    const inp = el.querySelector('input');
    if (inp) inp.focus();
  }
}

function switchToNextWord(reverse) {
  if (!currentCW || !currentCW.words.length) return;
  const words = currentCW.words;
  if (!activeWord) {
    activeWord = words[0];
    activeDir  = activeWord.dir;
    focusCell(activeWord.row, activeWord.col);
    highlightWord(activeWord);
    updateClueHighlight(activeWord.id);
    return;
  }
  const idx = words.findIndex(w => w.id === activeWord.id);
  const next = reverse
    ? words[(idx - 1 + words.length) % words.length]
    : words[(idx + 1) % words.length];
  activeWord = next;
  activeDir  = next.dir;
  focusCell(next.row, next.col);
  highlightWord(next);
  updateClueHighlight(next.id);
}

function getIndexInWord(word, r, c) {
  for (let i = 0; i < word.answer.length; i++) {
    const wr = word.dir === 'down'   ? word.row + i : word.row;
    const wc = word.dir === 'across' ? word.col + i : word.col;
    if (wr === r && wc === c) return i;
  }
  return -1;
}

function focusCell(r, c) {
  const el = getCellEl(r, c);
  if (el) {
    const inp = el.querySelector('input');
    if (inp) inp.focus();
  }
}

function getCellEl(r, c) {
  return document.querySelector(`#crosswordGrid .grid-cell[data-row="${r}"][data-col="${c}"]`);
}

// ====== ПОДСКАЗКИ (список слов) ======
function renderClues(cw) {
  const across = document.getElementById('cluesAcross');
  const down   = document.getElementById('cluesDown');
  if (!across || !down) return;
  across.innerHTML = '';
  down.innerHTML   = '';
  cw.words.forEach(w => {
    const el = document.createElement('div');
    el.className = 'clue-item';
    el.dataset.id  = w.id;
    el.innerHTML = `<span class="clue-num">${w.id}.</span><span class="clue-text">${w.clue}</span>`;
    el.addEventListener('click', () => {
      activeWord = w;
      activeDir  = w.dir;
      focusCell(w.row, w.col);
      highlightWord(w);
      updateClueHighlight(w.id);
    });
    (w.dir === 'across' ? across : down).appendChild(el);
  });
}

// ====== ПРОВЕРКА ОТВЕТОВ ======
function checkAnswers() {
  if (!currentCW) return;
  let correct = 0, total = 0;
  const seen = new Set();
  currentCW.words.forEach(w => {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      const key = `${r},${c}`;
      if (seen.has(key)) continue; // не считаем пересечения дважды
      seen.add(key);
      total++;
      const cell = getCellEl(r, c);
      const val  = (userAnswers[key] || '').toUpperCase();
      const exp  = w.answer[i].toUpperCase();
      if (val === exp) {
        correct++;
        cell && cell.classList.replace('wrong', 'correct') || cell && cell.classList.add('correct');
      } else if (val) {
        cell && cell.classList.replace('correct', 'wrong') || cell && cell.classList.add('wrong');
      } else {
        cell && cell.classList.remove('correct', 'wrong');
      }
    }
  });
  const pct = Math.round(correct / total * 100);
  saveProgressResult(currentCW.id, correct, total);
  showBanner(pct, correct, total);
}

function showBanner(pct, correct, total) {
  const banner = document.getElementById('resultBanner');
  if (!banner) return;
  banner.style.display = 'block';
  if (pct === 100) {
    banner.className = 'result-banner result-success';
    banner.innerHTML = `🎉 Отлично! Все <b>${total}</b> букв верны!`;
  } else if (pct >= 60) {
    banner.className = 'result-banner result-warn';
    banner.innerHTML = `👍 Хороший результат: <b>${correct}</b> из <b>${total}</b> (${pct}%). Попробуй улучшить!`;
  } else {
    banner.className = 'result-banner result-error';
    banner.innerHTML = `😕 Нужно постараться: <b>${correct}</b> из <b>${total}</b> (${pct}%). Используй подсказки!`;
  }
}

// ====== ПОДСКАЗКА (1 буква активного слова) ======
function giveHint() {
  if (!currentCW || !activeWord) {
    showToast('Сначала выбери слово (кликни по клетке или подсказке).');
    return;
  }
  for (let i = 0; i < activeWord.answer.length; i++) {
    const r = activeWord.dir === 'down'   ? activeWord.row + i : activeWord.row;
    const c = activeWord.dir === 'across' ? activeWord.col + i : activeWord.col;
    const key = `${r},${c}`;
    if ((userAnswers[key] || '').toUpperCase() !== activeWord.answer[i].toUpperCase()) {
      userAnswers[key] = activeWord.answer[i].toUpperCase();
      const cell = getCellEl(r, c);
      if (cell) {
        const inp = cell.querySelector('input');
        if (inp) inp.value = activeWord.answer[i].toUpperCase();
        cell.classList.add('correct');
        cell.classList.remove('wrong');
      }
      saveProgress(currentCW);
      return;
    }
  }
  showToast('Все буквы этого слова уже правильно заполнены!');
}

// ====== СБРОС ======
function resetGame() {
  if (!currentCW) return;
  userAnswers = {};
  localStorage.removeItem(`km_progress_${currentCW.id}`);
  document.querySelectorAll('#crosswordGrid .grid-cell').forEach(c => {
    c.classList.remove('correct', 'wrong', 'highlighted', 'active-cell');
  });
  document.querySelectorAll('#crosswordGrid .grid-cell input').forEach(inp => inp.value = '');
  const banner = document.getElementById('resultBanner');
  if (banner) banner.style.display = 'none';
  activeWord = null;
  showToast('Сброс выполнен.');
}

// ====== ПРОГРЕСС ======
function saveProgress(cw) {
  localStorage.setItem(`km_progress_${cw.id}`, JSON.stringify(userAnswers));
}

function loadProgress(id) {
  const raw = localStorage.getItem(`km_progress_${id}`);
  return raw ? JSON.parse(raw) : null;
}

function saveProgressResult(id, correct, total) {
  localStorage.setItem(`km_result_${id}`, JSON.stringify({ correct, total, date: Date.now() }));
  renderSavedSection();
}

function getProgress(id) {
  const raw = localStorage.getItem(`km_result_${id}`);
  return raw ? JSON.parse(raw) : null;
}

// ====== СОХРАНЁННЫЕ ======
function initSavedSection() {
  const tabs = document.querySelectorAll('[data-saved]');
  if (!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSavedSection(btn.dataset.saved);
    });
  });
  renderSavedSection('progress');
}

function renderSavedSection(tab = 'progress') {
  const grid = document.getElementById('savedGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (tab === 'progress') {
    const items = CROSSWORDS.filter(isCrosswordValid)
      .map(cw => ({ cw, prog: getProgress(cw.id) }))
      .filter(x => x.prog);
    if (!items.length) {
      grid.innerHTML = '<div class="empty-state"><span>📭</span>Нет сохранённого прогресса</div>';
      return;
    }
    items.forEach(({ cw, prog }) => {
      const pct = Math.round(prog.correct / prog.total * 100);
      const color = pct === 100 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';
      const card = document.createElement('div');
      card.className = 'saved-card fade-in';
      card.innerHTML = `
        <h4>${cw.title}</h4>
        <p>${cw.grade} класс · ${DIFF_LABELS[cw.difficulty]}</p>
        <p style="margin-top:6px;color:${color}">${pct}% верно (${prog.correct}/${prog.total})</p>
        <div class="saved-card-actions">
          <button onclick="startGame(getCrosswordById('${cw.id}'))">Продолжить</button>
          <button class="del-btn" onclick="deleteProgress('${cw.id}')">Удалить</button>
        </div>`;
      grid.appendChild(card);
    });
  } else {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('km_custom_'));
    if (!keys.length) {
      grid.innerHTML = '<div class="empty-state"><span>📭</span>Нет созданных кроссвордов</div>';
      return;
    }
    keys.forEach(k => {
      let cw;
      try { cw = JSON.parse(localStorage.getItem(k)); } catch(e) { return; }
      if (!cw) return;
      const card = document.createElement('div');
      card.className = 'saved-card fade-in';
      card.innerHTML = `
        <h4>${cw.title || 'Без названия'}</h4>
        <p>${cw.grade ? cw.grade + ' класс' : ''} · ${TYPE_LABELS[cw.type] || ''}</p>
        <div class="saved-card-actions">
          <button onclick="loadCustomCW('${k}')">Открыть</button>
          <button onclick="exportCustomJSON('${k}')">Скачать JSON</button>
          <button class="del-btn" onclick="deleteCustomCW('${k}')">Удалить</button>
        </div>`;
      grid.appendChild(card);
    });
  }
}

function deleteProgress(id) {
  localStorage.removeItem(`km_progress_${id}`);
  localStorage.removeItem(`km_result_${id}`);
  renderSavedSection('progress');
}

function deleteCustomCW(key) {
  localStorage.removeItem(key);
  renderSavedSection('created');
}

function loadCustomCW(key) {
  let cw;
  try { cw = JSON.parse(localStorage.getItem(key)); } catch(e) { return; }
  if (!cw) return;
  const playSection = document.querySelector('#play');
  if (playSection) playSection.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => startGame(cw), 300);
}

function exportCustomJSON(key) {
  let cw;
  try { cw = JSON.parse(localStorage.getItem(key)); } catch(e) { return; }
  if (!cw) return;
  const blob = new Blob([JSON.stringify(cw, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${cw.title || 'crossword'}.json`;
  a.click();
}

// ====== ТОСТ ======
function showToast(msg) {
  let toast = document.getElementById('km-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'km-toast';
    toast.style.cssText = `
      position:fixed;bottom:32px;right:32px;z-index:9999;
      padding:12px 20px;
      background:var(--bg2);
      border:1px solid var(--border);
      border-radius:10px;
      backdrop-filter:blur(12px);
      font-size:.875rem;
      color:var(--text);
      transition:opacity .3s;
      pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2800);
}

document.addEventListener('DOMContentLoaded', initApp);
