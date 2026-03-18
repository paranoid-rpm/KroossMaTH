// KroossMaTH — constructor.js

let consGrid = [];
let consRows = 10, consCols = 10;
let consTool = 'block';
let consWords = [];
let consWordCounter = 1;
let consNumberMap = {};

// ====== ИНИЦИАЛИЗАЦИЯ ======
function initConstructor() {
  const cwClass = document.getElementById('cwClass');
  if (cwClass) {
    GRADES.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g; opt.textContent = `${g} класс`;
      cwClass.appendChild(opt);
    });
  }

  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      consTool = btn.dataset.tool;
    });
  });

  document.getElementById('generateGridBtn')?.addEventListener('click', generateGrid);
  document.getElementById('saveCwBtn')?.addEventListener('click', saveCustomCW);
  document.getElementById('exportJsonBtn')?.addEventListener('click', exportJSON);
  document.getElementById('exportPngBtn')?.addEventListener('click', exportPNG);

  generateGrid();
}

// ====== ГЕНЕРАЦИЯ СЕТКИ ======
function generateGrid() {
  consRows = parseInt(document.getElementById('cwRows')?.value) || 10;
  consCols = parseInt(document.getElementById('cwCols')?.value) || 10;
  consRows = Math.min(Math.max(consRows, 5), 20);
  consCols = Math.min(Math.max(consCols, 5), 20);

  consGrid = [];
  for (let r = 0; r < consRows; r++) {
    consGrid[r] = [];
    for (let c = 0; c < consCols; c++) {
      consGrid[r][c] = 1;
    }
  }
  consWords = [];
  consWordCounter = 1;
  consNumberMap = {};
  renderConsGrid();
  renderCluesList();
}

// ====== РЕНДЕР СЕТКИ ======
function renderConsGrid() {
  const container = document.getElementById('constructorGrid');
  if (!container) return;
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${consCols}, 34px)`;

  // пересчитываем номера
  recalcNumbers();

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cons-cell' + (consGrid[r][c] === 0 ? ' black' : '');
      cell.dataset.row = r;
      cell.dataset.col = c;

      const key = `${r},${c}`;
      if (consNumberMap[key]) {
        cell.textContent = consNumberMap[key];
      }

      cell.addEventListener('click', () => onConsClick(r, c, cell));
      container.appendChild(cell);
    }
  }
}

function onConsClick(r, c, cell) {
  if (consTool === 'block') {
    consGrid[r][c] = consGrid[r][c] === 0 ? 1 : 0;
    renderConsGrid();
  } else if (consTool === 'cell') {
    consGrid[r][c] = 1;
    renderConsGrid();
  } else if (consTool === 'number') {
    if (consGrid[r][c] === 1) {
      addWordFromCell(r, c);
    }
  }
}

// ====== НУМЕРАЦИЯ ======
function recalcNumbers() {
  consNumberMap = {};
  let num = 1;
  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      if (consGrid[r][c] === 0) continue;
      const startsAcross = (c === 0 || consGrid[r][c-1] === 0) &&
                           (c+1 < consCols && consGrid[r][c+1] === 1);
      const startsDown   = (r === 0 || consGrid[r-1][c] === 0) &&
                           (r+1 < consRows && consGrid[r+1][c] === 1);
      if (startsAcross || startsDown) {
        consNumberMap[`${r},${c}`] = num++;
      }
    }
  }
}

// ====== ДОБАВЛЕНИЕ СЛОВА ======
function addWordFromCell(r, c) {
  // определяем направление
  const canAcross = (c === 0 || consGrid[r][c-1] === 0) && (c+1 < consCols && consGrid[r][c+1] === 1);
  const canDown   = (r === 0 || consGrid[r-1][c] === 0) && (r+1 < consRows && consGrid[r+1][c] === 1);

  if (!canAcross && !canDown) {
    alert('Слово должно начинаться в проходимой клетке и иметь хотя бы 2 буквы'); return;
  }

  const dir = canAcross ? 'across' : 'down';
  // вычисляем длину
  let len = 0;
  if (dir === 'across') {
    for (let cc = c; cc < consCols && consGrid[r][cc] === 1; cc++) len++;
  } else {
    for (let rr = r; rr < consRows && consGrid[rr][c] === 1; rr++) len++;
  }

  // проверяем не дублируем
  const dup = consWords.find(w => w.row === r && w.col === c && w.dir === dir);
  if (dup) { alert('Слово уже добавлено'); return; }

  const word = {
    id: consWordCounter++,
    dir, row: r, col: c,
    answer: '_'.repeat(len),
    clue: ''
  };
  consWords.push(word);
  renderCluesList();
}

// ====== СПИСОК ВОПРОСОВ ======
function renderCluesList() {
  const container = document.getElementById('cluesList');
  if (!container) return;
  container.innerHTML = '';

  if (!consWords.length) {
    container.innerHTML = '<p style="font-size:.8rem;color:var(--text2)">Выбери инструмент «123» и кликни на начальную клетку слова</p>';
    return;
  }

  consWords.forEach(w => {
    const div = document.createElement('div');
    div.className = 'clue-editor';
    div.innerHTML = `
      <label>${w.id}. ${w.dir === 'across' ? '→ Гориз.' : '↓ Верт.'} (дл. ${w.answer.length})</label>
      <input type="text" placeholder="Ответ (буквы)"
        value="${w.answer === '_'.repeat(w.answer.length) ? '' : w.answer}"
        maxlength="${w.answer.length}"
        data-wid="${w.id}" data-field="answer" />
      <input type="text" placeholder="Вопрос/подсказка"
        value="${w.clue}"
        data-wid="${w.id}" data-field="clue" />
      <button class="del-btn" style="font-size:.75rem;padding:2px 8px;border:1px solid var(--border);background:none;color:var(--text2);cursor:pointer"
        data-wid="${w.id}">✕ Удалить</button>`;
    container.appendChild(div);
  });

  // слушаем изменения
  container.querySelectorAll('input[data-field]').forEach(inp => {
    inp.addEventListener('input', () => {
      const wid = parseInt(inp.dataset.wid);
      const field = inp.dataset.field;
      const w = consWords.find(x => x.id === wid);
      if (w) w[field] = inp.value.toUpperCase();
    });
  });

  container.querySelectorAll('button.del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wid = parseInt(btn.dataset.wid);
      consWords = consWords.filter(w => w.id !== wid);
      renderCluesList();
    });
  });
}

// ====== СОХРАНИТЬ В localStorage ======
function saveCustomCW() {
  const name  = document.getElementById('cwName')?.value.trim() || 'Мой кроссворд';
  const grade = parseInt(document.getElementById('cwClass')?.value) || 1;
  const type  = document.getElementById('cwType')?.value || 'numeric';
  const diff  = document.getElementById('cwDiff')?.value || 'easy';

  const valid = consWords.filter(w => w.answer && !w.answer.includes('_') && w.clue);
  if (!valid.length) {
    alert('Добавь хотя бы одно слово с ответом и вопросом'); return;
  }

  const cw = {
    id: `km_custom_${Date.now()}`,
    title: name, grade, type,
    difficulty: diff,
    description: `Кроссворд создан ${new Date().toLocaleDateString('ru')}`,
    size: { rows: consRows, cols: consCols },
    grid: consGrid.map(row => [...row]),
    words: valid
  };

  localStorage.setItem(cw.id, JSON.stringify(cw));
  showToast('✅ Кроссворд сохранён!');
  renderSavedSection('created');
}

// ====== ЭКСПОРТ JSON ======
function exportJSON() {
  const name = document.getElementById('cwName')?.value.trim() || 'crossword';
  const cw = {
    title: name,
    grade: parseInt(document.getElementById('cwClass')?.value) || 1,
    type: document.getElementById('cwType')?.value || 'numeric',
    difficulty: document.getElementById('cwDiff')?.value || 'easy',
    size: { rows: consRows, cols: consCols },
    grid: consGrid.map(row => [...row]),
    words: consWords
  };
  const blob = new Blob([JSON.stringify(cw, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.json`;
  a.click();
  showToast('⬇ JSON скачан');
}

// ====== ЭКСПОРТ PNG ======
function exportPNG() {
  const canvas = document.createElement('canvas');
  const cellSize = 40;
  const pad = 20;
  canvas.width  = consCols * cellSize + pad * 2;
  canvas.height = consRows * cellSize + pad * 2 + 40;
  const ctx = canvas.getContext('2d');

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg    = isDark ? '#0d0d0f' : '#f4f4f8';
  const fg    = isDark ? '#f0f0f5' : '#111118';
  const acc   = '#6c63ff';
  const blk   = isDark ? '#1a1a24' : '#ececf4';
  const bord  = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // фон
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // заголовок
  const name = document.getElementById('cwName')?.value || 'KroossMaTH';
  ctx.fillStyle = fg;
  ctx.font = 'bold 16px Inter, sans-serif';
  ctx.fillText(name, pad, pad + 12);

  recalcNumbers();

  for (let r = 0; r < consRows; r++) {
    for (let c = 0; c < consCols; c++) {
      const x = pad + c * cellSize;
      const y = pad + 30 + r * cellSize;

      if (consGrid[r][c] === 0) {
        ctx.fillStyle = blk;
        ctx.fillRect(x, y, cellSize, cellSize);
      } else {
        // белая клетка
        ctx.fillStyle = isDark ? '#1a1a24' : '#ffffff';
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = bord;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
        // номер
        const key = `${r},${c}`;
        if (consNumberMap[key]) {
          ctx.fillStyle = acc;
          ctx.font = '8px Inter, sans-serif';
          ctx.fillText(consNumberMap[key], x + 2, y + 9);
        }
        // ответ если есть
        const w = consWords.find(ww => {
          for (let i = 0; i < ww.answer.length; i++) {
            const wr = ww.dir === 'down'   ? ww.row + i : ww.row;
            const wc = ww.dir === 'across' ? ww.col + i : ww.col;
            if (wr === r && wc === c) return true;
          }
          return false;
        });
        if (w && w.answer) {
          const idx = w.dir === 'across' ? c - w.col : r - w.row;
          const ch = w.answer[idx];
          if (ch && ch !== '_') {
            ctx.fillStyle = fg;
            ctx.font = 'bold 18px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(ch, x + cellSize/2, y + cellSize/2 + 6);
            ctx.textAlign = 'left';
          }
        }
      }
    }
  }

  // подсказки
  const clueY = pad + 30 + consRows * cellSize + 16;
  ctx.fillStyle = fg;
  ctx.font = '10px Inter, sans-serif';
  let cx = pad, cy = clueY;
  consWords.forEach(w => {
    const txt = `${w.id}${w.dir==='across'?'→':'↓'} ${w.clue}`;
    ctx.fillText(txt, cx, cy);
    cy += 14;
    if (cy > canvas.height - 10) { cy = clueY; cx += 200; }
  });

  canvas.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name || 'crossword'}.png`;
    a.click();
    showToast('🖼 PNG скачан');
  });
}

// ====== ТОСТ ======
function showToast(msg) {
  let toast = document.getElementById('km-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'km-toast';
    toast.style.cssText = `
      position:fixed;bottom:32px;right:32px;z-index:999;
      padding:12px 20px;
      background:var(--bg2);
      border:1px solid var(--border);
      backdrop-filter:blur(12px);
      font-size:.875rem;
      color:var(--text);
      transition:opacity .3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// ====== СТАРТ ======
document.addEventListener('DOMContentLoaded', initConstructor);
