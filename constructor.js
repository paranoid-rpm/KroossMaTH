// KroossMaTH — constructor.js — БЛОЧНЫЙ ПОШАГОВЫЙ КОНСТРУКТОР

let consGrid = [];
let consRows = 10, consCols = 10;
let consWords = [];
let consWordIdCounter = 1;
let consNumberMap = {};
let consStep = 1; // текущий шаг конструктора 1-4
let consDragMode = false; // рисование черных клеток зажатием
let consDragValue = 0;    // что рисуем при зажатии: 0=черная, 1=белая

// ====== ИНИЦИАЛИЗАЦИЯ ======
function initConstructor() {
  const cwClass = document.getElementById('cwClass');
  if (!cwClass) return;

  GRADES.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = `${g} класс`;
    cwClass.appendChild(opt);
  });

  // Шаговые кнопки
  document.getElementById('consStep1Btn')?.addEventListener('click', () => goToStep(1));
  document.getElementById('consStep2Btn')?.addEventListener('click', () => goToStep(2));
  document.getElementById('consStep3Btn')?.addEventListener('click', () => goToStep(3));
  document.getElementById('consStep4Btn')?.addEventListener('click', () => goToStep(4));

  document.getElementById('generateGridBtn')?.addEventListener('click', () => {
    buildGrid();
    goToStep(2);
  });
  document.getElementById('consToStep3Btn')?.addEventListener('click', () => goToStep(3));
  document.getElementById('consToStep4Btn')?.addEventListener('click', () => goToStep(4));
  document.getElementById('consBackStep2Btn')?.addEventListener('click', () => goToStep(2));
  document.getElementById('consBackStep3Btn')?.addEventListener('click', () => goToStep(3));

  document.getElementById('saveCwBtn')?.addEventListener('click', saveCustomCW);
  document.getElementById('exportJsonBtn')?.addEventListener('click', exportJSON);
  document.getElementById('exportPngBtn')?.addEventListener('click', exportPNG);

  // Быстрые шаблоны сетки
  document.querySelectorAll('[data-grid-preset]').forEach(btn => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.gridPreset));
  });

  goToStep(1);
}

// ====== ШАГ НАВИГАЦИЯ ======
function goToStep(n) {
  consStep = n;
  for (let i = 1; i <= 4; i++) {
    const block = document.getElementById(`consBlock${i}`);
    const stepBtn = document.getElementById(`consStep${i}Btn`);
    if (block) block.style.display = i === n ? '' : 'none';
    if (stepBtn) {
      stepBtn.classList.toggle('active', i === n);
      stepBtn.classList.toggle('done', i < n);
    }
  }
  if (n === 2 && consGrid.length) renderConsGrid();
  if (n === 3) renderWordsList();
  if (n === 4) renderPreview();
}

// ====== ГЕНЕРАЦИЯ СЕТКИ ======
function buildGrid() {
  consRows = Math.min(Math.max(parseInt(document.getElementById('cwRows')?.value) || 10, 4), 20);
  consCols = Math.min(Math.max(parseInt(document.getElementById('cwCols')?.value) || 10, 4), 20);

  consGrid = Array.from({length: consRows}, () => Array(consCols).fill(1));
  consWords = [];
  consWordIdCounter = 1;
  consNumberMap = {};
  renderConsGrid();
}

// ====== ПРЕСЕТЫ СЕТКИ ======
function applyPreset(name) {
  buildGrid(); // сначала чистая сетка
  const mid = Math.floor(consRows / 2);
  const midC = Math.floor(consCols / 2);
  if (name === 'plus') {
    // Оставляем только крест, остальное черное
    for (let r = 0; r < consRows; r++)
      for (let c = 0; c < consCols; c++)
        if (r !== mid && c !== midC) consGrid[r][c] = 0;
  } else if (name === 'checker') {
    for (let r = 0; r < consRows; r++)
      for (let c = 0; c < consCols; c++)
        if ((r + c) % 3 === 0) consGrid[r][c] = 0;
  } else if (name === 'frame') {
    for (let r = 1; r < consRows-1; r++)
      for (let c = 1; c < consCols-1; c++)
        if (r !== mid && c !== midC) consGrid[r][c] = 0;
  }
  renderConsGrid();
}

// ====== РЕНДЕР СЕТКИ (ШАГ 2) ======
function renderConsGrid() {
  const container = document.getElementById('constructorGrid');
  if (!container) return;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${consCols}, 36px)`;

  recalcNumbers();

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      const cell = document.createElement('div');
      const isBlack = consGrid[r][c] === 0;
      cell.className = 'cons-cell' + (isBlack ? ' black' : '');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.title = `[${r},${c}]`;

      const key = `${r},${c}`;
      if (!isBlack && consNumberMap[key]) {
        const numSpan = document.createElement('span');
        numSpan.className = 'cons-num';
        numSpan.textContent = consNumberMap[key];
        cell.appendChild(numSpan);
      }

      // Клик: переключить чёрная/белая
      cell.addEventListener('click', () => {
        consGrid[r][c] = consGrid[r][c] === 0 ? 1 : 0;
        renderConsGrid();
      });

      // Drag для рисования нескольких клеток подряд
      cell.addEventListener('mousedown', (e) => {
        consDragMode = true;
        consDragValue = consGrid[r][c] === 0 ? 1 : 0;
        consGrid[r][c] = consDragValue;
        renderConsGrid();
        e.preventDefault();
      });
      cell.addEventListener('mouseenter', () => {
        if (!consDragMode) return;
        consGrid[r][c] = consDragValue;
        renderConsGrid();
      });

      container.appendChild(cell);
    }
  }

  document.addEventListener('mouseup', () => { consDragMode = false; }, { once: false });

  // Показываем кнопку «Далее»
  const nextBtn = document.getElementById('consToStep3Btn');
  if (nextBtn) nextBtn.style.display = '';
}

// ====== ПЕРЕСЧЁТ НУМЕРАЦИИ ======
function recalcNumbers() {
  consNumberMap = {};
  let num = 1;
  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      if (consGrid[r][c] === 0) continue;
      const startsAcross = (c === 0 || consGrid[r][c-1] === 0)
                        && (c + 1 < consCols && consGrid[r][c+1] === 1);
      const startsDown   = (r === 0 || consGrid[r-1][c] === 0)
                        && (r + 1 < consRows && consGrid[r+1][c] === 1);
      if (startsAcross || startsDown) {
        consNumberMap[`${r},${c}`] = num++;
      }
    }
  }
}

// ====== ШАГ 3 — СПИСОК СЛОВ ======
function renderWordsList() {
  recalcNumbers();
  // Автоматически собираем все возможные слова по числам
  syncWordsWithGrid();

  const container = document.getElementById('cluesList');
  if (!container) return;
  container.innerHTML = '';

  if (!consWords.length) {
    container.innerHTML = `
      <div class="cons-empty-words">
        <p>Нет слов в сетке.</p>
        <p>Вернись на шаг 2 и убедись, что в сетке есть белые клетки, образующие строки или столбцы длиной ≥ 2.</p>
      </div>`;
    return;
  }

  // Разделяем по направлению
  const across = consWords.filter(w => w.dir === 'across');
  const down   = consWords.filter(w => w.dir === 'down');

  function renderGroup(words, title) {
    if (!words.length) return;
    const header = document.createElement('div');
    header.className = 'clue-group-header';
    header.textContent = title;
    container.appendChild(header);

    words.forEach(w => {
      const div = document.createElement('div');
      div.className = 'clue-editor';
      div.dataset.wid = w.id;
      div.innerHTML = `
        <div class="clue-editor-header">
          <span class="clue-num-badge">${consNumberMap[`${w.row},${w.col}`] || '?'}${w.dir === 'across' ? '→' : '↓'}</span>
          <span class="clue-len-hint">${w.len} букв</span>
        </div>
        <input class="clue-answer-input" type="text"
          placeholder="Ответ (${w.len} букв, только буквы)"
          value="${w.answer || ''}"
          maxlength="${w.len}"
          data-wid="${w.id}" data-field="answer" />
        <input class="clue-question-input" type="text"
          placeholder="Вопрос / задание"
          value="${w.clue || ''}"
          data-wid="${w.id}" data-field="clue" />`;
      container.appendChild(div);
    });
  }

  renderGroup(across, '→ По горизонтали');
  renderGroup(down, '↓ По вертикали');

  container.querySelectorAll('input[data-field]').forEach(inp => {
    inp.addEventListener('input', () => {
      const wid = parseInt(inp.dataset.wid);
      const field = inp.dataset.field;
      const w = consWords.find(x => x.id === wid);
      if (!w) return;
      if (field === 'answer') {
        w.answer = inp.value.toUpperCase().replace(/[^А-ЯЁA-Z0-9]/gi, '').slice(0, w.len);
        inp.value = w.answer;
      } else {
        w[field] = inp.value;
      }
    });
  });
}

// ====== СИНХРОНИЗАЦИЯ СЛОВ С СЕТКОЙ ======
function syncWordsWithGrid() {
  recalcNumbers();
  const newWords = [];

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      if (consGrid[r][c] === 0) continue;
      const key = `${r},${c}`;

      // Горизонталь
      const startsAcross = (c === 0 || consGrid[r][c-1] === 0)
                         && (c + 1 < consCols && consGrid[r][c+1] === 1);
      if (startsAcross) {
        let len = 0;
        for (let cc = c; cc < consCols && consGrid[r][cc] === 1; cc++) len++;
        const existing = consWords.find(w => w.row === r && w.col === c && w.dir === 'across');
        newWords.push({
          id:     existing ? existing.id : consWordIdCounter++,
          dir:    'across',
          row:    r, col: c,
          len,
          answer: existing ? existing.answer : '',
          clue:   existing ? existing.clue   : ''
        });
      }

      // Вертикаль
      const startsDown = (r === 0 || consGrid[r-1][c] === 0)
                       && (r + 1 < consRows && consGrid[r+1][c] === 1);
      if (startsDown) {
        let len = 0;
        for (let rr = r; rr < consRows && consGrid[rr][c] === 1; rr++) len++;
        const existing = consWords.find(w => w.row === r && w.col === c && w.dir === 'down');
        newWords.push({
          id:     existing ? existing.id : consWordIdCounter++,
          dir:    'down',
          row:    r, col: c,
          len,
          answer: existing ? existing.answer : '',
          clue:   existing ? existing.clue   : ''
        });
      }
    }
  }

  consWords = newWords;
}

// ====== ШАГ 4 — ПРЕДПРОСМОТР ======
function renderPreview() {
  const container = document.getElementById('consPreviewGrid');
  if (!container) return;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${consCols}, 34px)`;

  recalcNumbers();

  // Строим карту ответов
  const letterMap = {};
  consWords.forEach(w => {
    if (!w.answer) return;
    for (let i = 0; i < w.answer.length && i < w.len; i++) {
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      const ch = w.answer[i];
      if (ch) letterMap[`${r},${c}`] = ch;
    }
  });

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      const cell = document.createElement('div');
      const key = `${r},${c}`;
      const isBlack = consGrid[r][c] === 0;
      cell.className = 'cons-cell preview' + (isBlack ? ' black' : '');
      if (!isBlack) {
        if (consNumberMap[key]) {
          const ns = document.createElement('span');
          ns.className = 'cons-num';
          ns.textContent = consNumberMap[key];
          cell.appendChild(ns);
        }
        if (letterMap[key]) {
          const ls = document.createElement('span');
          ls.className = 'cons-letter';
          ls.textContent = letterMap[key];
          cell.appendChild(ls);
        }
      }
      container.appendChild(cell);
    }
  }

  // Список вопросов в предпросмотре
  const clList = document.getElementById('consPreviewClues');
  if (clList) {
    clList.innerHTML = '';
    const across = consWords.filter(w => w.dir === 'across' && w.clue);
    const down   = consWords.filter(w => w.dir === 'down'   && w.clue);
    if (across.length) {
      clList.innerHTML += `<div class="clue-group-header">→ По горизонтали</div>`;
      across.forEach(w => {
        clList.innerHTML += `<div class="preview-clue"><b>${consNumberMap[`${w.row},${w.col}`]}.</b> ${w.clue}</div>`;
      });
    }
    if (down.length) {
      clList.innerHTML += `<div class="clue-group-header">↓ По вертикали</div>`;
      down.forEach(w => {
        clList.innerHTML += `<div class="preview-clue"><b>${consNumberMap[`${w.row},${w.col}`]}.</b> ${w.clue}</div>`;
      });
    }
  }
}

// ====== ПРОВЕРКА КОНФЛИКТОВ БУКВ ======
function validateConflicts() {
  const map = {};
  for (const w of consWords) {
    if (!w.answer) continue;
    for (let i = 0; i < w.answer.length; i++) {
      const ch = w.answer[i];
      if (!ch || ch === '_') continue;
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      const key = `${r},${c}`;
      if (map[key] && map[key] !== ch.toUpperCase()) {
        return { ok: false, key, conflict: [map[key], ch.toUpperCase()] };
      }
      map[key] = ch.toUpperCase();
    }
  }
  return { ok: true };
}

// ====== СОХРАНИТЬ В localStorage ======
function saveCustomCW() {
  const name  = document.getElementById('cwName')?.value.trim() || 'Мой кроссворд';
  const grade = parseInt(document.getElementById('cwClass')?.value) || 1;
  const type  = document.getElementById('cwType')?.value || 'numeric';
  const diff  = document.getElementById('cwDiff')?.value || 'easy';

  // Только слова с заполненным ответом и вопросом
  const valid = consWords.filter(w => {
    if (!w.answer || w.answer.length !== w.len) return false;
    if (!w.clue || !w.clue.trim()) return false;
    return true;
  });

  if (!valid.length) {
    showToast('⚠️ Заполни хотя бы одно слово с ответом (все буквы) и вопросом.');
    return;
  }

  const check = validateConflicts();
  if (!check.ok) {
    showToast(`⚠️ Конфликт букв в клетке [${check.key}]: «${check.conflict[0]}» и «${check.conflict[1]}». Исправь ответы.`);
    return;
  }

  // Строим финальный объект с answer как массив символов или строка
  const finalWords = valid.map((w, idx) => ({
    id:     idx + 1,
    dir:    w.dir,
    row:    w.row,
    col:    w.col,
    answer: w.answer.toUpperCase(),
    clue:   w.clue.trim()
  }));

  const cw = {
    id:          `km_custom_${Date.now()}`,
    title:       name,
    grade, type,
    difficulty:  diff,
    description: `Кроссворд создан ${new Date().toLocaleDateString('ru')}`,
    size:        { rows: consRows, cols: consCols },
    grid:        consGrid.map(row => [...row]),
    words:       finalWords
  };

  localStorage.setItem(cw.id, JSON.stringify(cw));
  showToast('✅ Кроссворд сохранён! Найди его в «Сохранённые → Созданные мной».');
  if (typeof renderSavedSection === 'function') renderSavedSection('created');
}

// ====== ЭКСПОРТ JSON ======
function exportJSON() {
  const check = validateConflicts();
  if (!check.ok) {
    showToast(`⚠️ Конфликт букв в клетке [${check.key}]. Исправь перед экспортом.`);
    return;
  }
  const name = document.getElementById('cwName')?.value.trim() || 'crossword';
  const cw = {
    title:      name,
    grade:      parseInt(document.getElementById('cwClass')?.value) || 1,
    type:       document.getElementById('cwType')?.value || 'numeric',
    difficulty: document.getElementById('cwDiff')?.value || 'easy',
    size:       { rows: consRows, cols: consCols },
    grid:       consGrid.map(row => [...row]),
    words:      consWords
  };
  const blob = new Blob([JSON.stringify(cw, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.json`;
  a.click();
  showToast('📥 JSON скачан.');
}

// ====== ЭКСПОРТ PNG ======
function exportPNG() {
  const check = validateConflicts();
  if (!check.ok) {
    showToast(`⚠️ Конфликт букв. Исправь перед экспортом.`);
    return;
  }
  const canvas = document.createElement('canvas');
  const cellSize = 42, pad = 24;
  canvas.width  = consCols * cellSize + pad * 2;
  canvas.height = consRows * cellSize + pad * 2 + 50;
  const ctx = canvas.getContext('2d');
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg   = isDark ? '#0d0d0f' : '#f4f4f8';
  const fg   = isDark ? '#f0f0f5' : '#111118';
  const acc  = '#6c63ff';
  const blk  = isDark ? '#1a1a24' : '#d0d0dc';
  const brd  = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const name = document.getElementById('cwName')?.value || 'KroossMaTH';
  ctx.fillStyle = fg;
  ctx.font = 'bold 15px Inter, sans-serif';
  ctx.fillText(name, pad, pad + 14);

  recalcNumbers();
  const letterMap = {};
  consWords.forEach(w => {
    if (!w.answer) return;
    for (let i = 0; i < w.answer.length; i++) {
      const r = w.dir === 'down'   ? w.row + i : w.row;
      const c = w.dir === 'across' ? w.col + i : w.col;
      if (w.answer[i]) letterMap[`${r},${c}`] = w.answer[i].toUpperCase();
    }
  });

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      const x = pad + c * cellSize;
      const y = pad + 28 + r * cellSize;
      const key = `${r},${c}`;
      if (consGrid[r][c] === 0) {
        ctx.fillStyle = blk;
        ctx.fillRect(x, y, cellSize, cellSize);
      } else {
        ctx.fillStyle = isDark ? '#1a1a2e' : '#ffffff';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = brd;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        if (consNumberMap[key]) {
          ctx.fillStyle = acc;
          ctx.font = '8px Inter, sans-serif';
          ctx.fillText(consNumberMap[key], x + 2, y + 9);
        }
        if (letterMap[key]) {
          ctx.fillStyle = fg;
          ctx.font = 'bold 18px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(letterMap[key], x + cellSize/2, y + cellSize/2 + 7);
          ctx.textAlign = 'left';
        }
      }
    }
  }

  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name || 'crossword'}.png`;
    a.click();
    showToast('🖼️ PNG скачан.');
  });
}

document.addEventListener('DOMContentLoaded', initConstructor);
