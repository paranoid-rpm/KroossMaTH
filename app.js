// KroossMaTH — app.js — игровая логика

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

// ====== НАВБАР СКРОЛЛ / МУЛЬТИСТРАНИЧНОСТЬ ======
function initNavScroll() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    const href = l.getAttribute('href') || '';
    // Для ссылок внутри страницы оставляем плавный скролл
    if (href.startsWith('#')) {
      l.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
        links.forEach(x => x.classList.remove('active'));
        l.classList.add('active');
      });
    }
    // Для ссылок на другие страницы даём браузеру работать как обычно
  });
}

// ====== HERO КРОССВОРД (превью) ======
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
  // анимация пульса
  setInterval(() => {
    const cells = el.querySelectorAll('.prev-cell:not(.black)');
    cells.forEach(c => c.classList.remove('active'));
    const rnd = Math.floor(Math.random() * cells.length);
    if (cells[rnd]) cells[rnd].classList.add('active');
  }, 800);
}

// ====== ВАЛИДАЦИЯ КРОССВОРДА (чтобы не показывать битые) ======
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

  // заполняем классы
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
  typeSelect && typeSelect.addEventListener('change', refresh);
  diffSelect && diffSelect.addEventListener('change', refresh);
  refresh();

  backBtn && backBtn.addEventListener('click', () => {
    if (!gameArea || !grid) return;
    gameArea.style.display = 'none';
    grid.style.display = '';
    const filters = document.querySelector('.play-filters');
    if (filters) filters.style.display = '';
    currentCW = null;
  });

  checkBtn && checkBtn.addEventListener('click', checkAnswers);
  hintBtn  && hintBtn.addEventListener('click', giveHint);
  resetBtn && resetBtn.addEventListener('click', resetGame);
}

function renderCards(cws, container) {
  if (!container) return;
  container.innerHTML = '';
  if (!cws.length) {
    container.innerHTML = '<div class="empty-state"><span>🔍</span>Нет корректных кроссвордов по выбранному фильтру</div>';
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
  currentCW = cw;
  userAnswers = loadProgress(cw.id) || {};
  activeWord = null;

  const gameArea  = document.getElementById('gameArea');
  const grid      = document.getElementById('crosswordsGrid');
  const title     = document.getElementById('gameTitle');
  const banner    = document.getElementById('resultBanner');

  if (!gameArea || !grid) return;

  grid.style.display = 'none';
  const filters = document.querySelector('.play-filters');
  if (filters) filters.style.display = 'none';
  gameArea.style.display = 'block';
  if (banner) banner.style.display = 'none';

  if (title) title.textContent = `${cw.title} · ${cw.grade} класс · ${DIFF_LABELS[cw.difficulty]}`;

  renderGameGrid(cw);
  renderClues(cw);
}

// ====== РЕНДЕР СЕТКИ ======
function renderGameGrid(cw) {
  const container = document.getElementById('crosswordGrid');
  if (!container) return;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${cw.size.cols}, 40px)`;

  // строим карту номеров
  const numberMap = {};
  cw.words.forEach(w => {
    const key = `${w.row},${w.col}`;
    if (!numberMap[key]) numberMap[key] = w.id;
  });

  // строим карту принадлежности клеток словам
  const cellWordMap = {};
  cw.words.forEach(w => {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'down'  ? w.row + i : w.row;
      const c = w.dir === 'across'? w.col + i : w.col;
      if (!cellWordMap[`${r},${c}`]) cellWordMap[`${r},${c}`] = [];
      cellWordMap[`${r},${c}`].push(w.id);
    }
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
        input.dataset.row = r;
        input.dataset.col = c;
        if (userAnswers[key]) input.value = userAnswers[key];
        input.addEventListener('focus', () => onCellFocus(r, c, cw));
        input.addEventListener('input', (e) => onCellInput(e, r, c, cw));
        input.addEventListener('keydown', (e) => onCellKeydown(e, r, c, cw));
        cell.appendChild(input);
      }
      container.appendChild(cell);
    }
  }
}

// ====== ФОКУС НА КЛЕТКЕ ======
function onCellFocus(r, c, cw) {
  const words = cw.words.filter(w => {
    for (let i = 0; i < w.answer.length; i++) {
      const wr = w.dir === 'down'  ? w.row + i : w.row;
      const wc = w.dir === 'across'? w.col + i : w.col;
      if (wr === r && wc === c) return true;
    }
    return false;
  });
  if (!words.length) return;

  let word = words.find(w => w.dir === activeDir) || words[0];
  if (activeWord && activeWord.id === word.id) {
    const other = words.find(w => w.id !== word.id);
    if (other) word = other;
  }
  activeWord = word;
  activeDir = word.dir;
  highlightWord(word, cw);
  updateClueHighlight(word.id);
}

function highlightWord(word, cw) {
  document.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('highlighted', 'active'));
  for (let i = 0; i < word.answer.length; i++) {
    const r = word.dir === 'down'  ? word.row + i : word.row;
    const c = word.dir === 'across'? word.col + i : word.col;
    const cell = getCellEl(r, c);
    if (cell) cell.classList.add('highlighted');
  }
  document.querySelectorAll('.grid-cell input:focus').forEach(inp => {
    const cell = inp.parentElement;
    cell.classList.add('active');
    cell.classList.remove('highlighted');
  });
}

function updateClueHighlight(wordId) {
  document.querySelectorAll('.clue-item').forEach(el => {
    el.classList.toggle('active', parseInt(el.dataset.id) === wordId);
  });
}

// ====== ВВОД ======
function onCellInput(e, r, c, cw) {
  const val = e.target.value.toUpperCase().slice(-1);
  e.target.value = val;
  userAnswers[`${r},${c}`] = val;
  saveProgress(cw);
  const cell = getCellEl(r, c);
  if (cell) { cell.classList.remove('correct', 'wrong'); }
  if (val && activeWord) moveToNext(r, c, cw);
}

function onCellKeydown(e, r, c, cw) {
  if (e.key === 'Backspace' && !e.target.value) {
    moveToPrev(r, c, cw);
  }
  if (e.key === 'ArrowRight') moveFocus(r, c+1, cw);
  if (e.key === 'ArrowLeft')  moveFocus(r, c-1, cw);
  if (e.key === 'ArrowDown')  moveFocus(r+1, c, cw);
  if (e.key === 'ArrowUp')    moveFocus(r-1, c, cw);
}

function moveToNext(r, c, cw) {
  if (!activeWord) return;
  const idx = getIndexInWord(activeWord, r, c);
  if (idx < activeWord.answer.length - 1) {
    const nr = activeWord.dir === 'down'   ? r + 1 : r;
    const nc = activeWord.dir === 'across' ? c + 1 : c;
    focusCell(nr, nc);
  }
}

function moveToPrev(r, c, cw) {
  if (!activeWord) return;
  const idx = getIndexInWord(activeWord, r, c);
  if (idx > 0) {
    const nr = activeWord.dir === 'down'   ? r - 1 : r;
    const nc = activeWord.dir === 'across' ? c - 1 : c;
    focusCell(nr, nc);
  }
}

function moveFocus(r, c, cw) {
  const el = getCellEl(r, c);
  if (el && !el.classList.contains('black')) {
    const inp = el.querySelector('input');
    if (inp) inp.focus();
  }
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
  if (el) { const inp = el.querySelector('input'); if (inp) inp.focus(); }
}

function getCellEl(r, c) {
  return document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
}

// ====== ПОДСКАЗКИ ======
function renderClues(cw) {
  const across = document.getElementById('cluesAcross');
  const down   = document.getElementById('cluesDown');
  if (!across || !down) return;
  across.innerHTML = '';
  down.innerHTML   = '';
  cw.words.forEach(w => {
    const el = document.createElement('div');
    el.className = 'clue-item';
    el.dataset.id = w.id;
    el.innerHTML = `<span>${w.id}.</span>${w.clue}`;
    el.addEventListener('click', () => {
      activeWord = w;
      activeDir  = w.dir;
      focusCell(w.row, w.col);
      highlightWord(w, cw);
      updateClueHighlight(w.id);
    });
    (w.dir === 'across' ? across : down).appendChild(el);
  });
}

// ====== ПРОВЕРКА ======
function checkAnswers() {
  if (!currentCW) return;
  let correct = 0, total = 0;
  currentCW.words.forEach(w => {
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      const key = `${r},${c}`;
      const cell = getCellEl(r, c);
      const val  = (userAnswers[key] || '').toUpperCase();
      const exp  = w.answer[i].toUpperCase();
      total++;
      if (val === exp) {
        correct++;
        cell && cell.classList.add('correct');
        cell && cell.classList.remove('wrong');
      } else if (val) {
        cell && cell.classList.add('wrong');
        cell && cell.classList.remove('correct');
      }
    }
  });
  const pct = Math.round(correct / total * 100);
  saveProgressResult(currentCW.id, correct, total);
  showBanner(pct);
}

function showBanner(pct) {
  const banner = document.getElementById('resultBanner');
  if (!banner) return;
  banner.style.display = 'block';
  if (pct === 100) {
    banner.style.borderColor = 'var(--green)';
    banner.style.color = 'var(--green)';
    banner.textContent = '🎉 Отлично! Все ответы верны!';
  } else if (pct >= 60) {
    banner.style.borderColor = 'var(--yellow)';
    banner.style.color = 'var(--yellow)';
    banner.textContent = `👍 Хорошо! ${pct}% правильных ответов`;
  } else {
    banner.style.borderColor = 'var(--red)';
    banner.style.color = 'var(--red)';
    banner.textContent = `❌ ${pct}% — попробуй ещё раз`;
  }
}

// ====== ПОДСКАЗКА (1 буква) ======
function giveHint() {
  if (!currentCW || !activeWord) return;
  for (let i = 0; i < activeWord.answer.length; i++) {
    const r = activeWord.dir === 'down'   ? activeWord.row + i : activeWord.row;
    const c = activeWord.dir === 'across' ? activeWord.col + i : activeWord.col;
    const key = `${r},${c}`;
    if (!userAnswers[key] || userAnswers[key] !== activeWord.answer[i]) {
      userAnswers[key] = activeWord.answer[i];
      const cell = getCellEl(r, c);
      if (cell) {
        const inp = cell.querySelector('input');
        if (inp) inp.value = activeWord.answer[i];
        cell.classList.add('correct');
      }
      saveProgress(currentCW);
      break;
    }
  }
}

// ====== СБРОС ======
function resetGame() {
  if (!currentCW) return;
  userAnswers = {};
  localStorage.removeItem(`km_progress_${currentCW.id}`);
  document.querySelectorAll('.grid-cell').forEach(c => {
    c.classList.remove('correct', 'wrong', 'highlighted', 'active');
  });
  document.querySelectorAll('.grid-cell input').forEach(inp => inp.value = '');
  const banner = document.getElementById('resultBanner');
  if (banner) banner.style.display = 'none';
}

// ====== СОХРАНЕНИЕ ПРОГРЕССА ======
function saveProgress(cw) {
  localStorage.setItem(`km_progress_${cw.id}`, JSON.stringify(userAnswers));
}

function loadProgress(id) {
  const raw = localStorage.getItem(`km_progress_${id}`);
  return raw ? JSON.parse(raw) : null;
}

function saveProgressResult(id, correct, total) {
  const key = `km_result_${id}`;
  localStorage.setItem(key, JSON.stringify({ correct, total, date: Date.now() }));
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
      const card = document.createElement('div');
      card.className = 'saved-card fade-in';
      card.innerHTML = `
        <h4>${cw.title}</h4>
        <p>${cw.grade} класс · ${DIFF_LABELS[cw.difficulty]}</p>
        <p style="margin-top:6px;color:${pct===100?'var(--green)':pct>=60?'var(--yellow)':'var(--red)'}">${pct}% верно</p>
        <div class="saved-card-actions">
          <button onclick="startGame(getCrosswordById('${cw.id}'))">▶ Продолжить</button>
          <button class="del-btn" onclick="deleteProgress('${cw.id}')">✕</button>
        </div>`;
      grid.appendChild(card);
    });
  } else {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('km_custom_'));
    if (!keys.length) {
      grid.innerHTML = '<div class="empty-state"><span>✏️</span>Нет созданных кроссвордов</div>';
      return;
    }
    keys.forEach(k => {
      const cw = JSON.parse(localStorage.getItem(k));
      const card = document.createElement('div');
      card.className = 'saved-card fade-in';
      card.innerHTML = `
        <h4>${cw.title || 'Без названия'}</h4>
        <p>${cw.grade ? cw.grade + ' класс' : ''} · ${TYPE_LABELS[cw.type] || ''}</p>
        <div class="saved-card-actions">
          <button onclick="loadCustomCW('${k}')">▶ Решать</button>
          <button onclick="exportCustomJSON('${k}')">⬇ JSON</button>
          <button class="del-btn" onclick="deleteCustomCW('${k}')">✕</button>
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
  const cw = JSON.parse(localStorage.getItem(key));
  if (cw) startGame(cw);
  const play = document.querySelector('#play');
  if (play) play.scrollIntoView({ behavior: 'smooth' });
}

function exportCustomJSON(key) {
  const cw = JSON.parse(localStorage.getItem(key));
  const blob = new Blob([JSON.stringify(cw, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${cw.title || 'crossword'}.json`;
  a.click();
}

// ====== СТАРТ ======
document.addEventListener('DOMContentLoaded', initApp);
