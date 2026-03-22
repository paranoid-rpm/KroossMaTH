// KroossMaTH — data.js — база кроссвордов

const CROSSWORDS = [
  {
    id: 'demo_add_1',
    title: 'Сложение до 10',
    grade: 1,
    type: 'numeric',
    difficulty: 'easy',
    description: 'Примеры на сложение и вычитание в пределах 10.',
    size: { rows: 5, cols: 5 },
    grid: [
      [1,1,1,0,1],
      [1,0,1,0,1],
      [1,1,1,1,1],
      [1,0,1,0,0],
      [1,1,1,0,0]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'ТРИ',   clue: '1 + 2 = ?' },
      { id: 2, dir: 'across', row: 0, col: 4, answer: 'ДВА',   clue: '5 − 3 = ?' },
      { id: 3, dir: 'across', row: 2, col: 0, answer: 'ПЯТЬ',  clue: '2 + 3 = ?' },
      { id: 4, dir: 'across', row: 4, col: 0, answer: 'ТРИ',   clue: '6 − 3 = ?' },
      { id: 5, dir: 'down',   row: 0, col: 0, answer: 'ТРИТ',  clue: '(не используется — тест)' },
      { id: 6, dir: 'down',   row: 0, col: 2, answer: 'РИПР',  clue: '(не используется — тест)' }
    ]
  },
  {
    id: 'demo_frac_5',
    title: 'Дроби и целые числа',
    grade: 5,
    type: 'word',
    difficulty: 'easy',
    description: 'Базовые термины по теме дробей.',
    size: { rows: 7, cols: 7 },
    grid: [
      [1,1,1,1,1,0,0],
      [0,0,1,0,1,0,0],
      [1,1,1,1,1,1,1],
      [0,0,1,0,0,0,1],
      [0,0,1,1,1,0,1],
      [0,0,0,0,1,0,1],
      [0,0,0,0,1,1,1]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'ДРОБЬ',  clue: 'Запись вида a/b.' },
      { id: 2, dir: 'across', row: 2, col: 0, answer: 'ДЕЛИТЕЛЬ', clue: 'Число, на которое делят.' },
      { id: 3, dir: 'across', row: 4, col: 2, answer: 'ЧАС',   clue: '60 минут.' },
      { id: 4, dir: 'across', row: 6, col: 4, answer: 'НОД',   clue: 'Наибольший общий ... двух чисел.' },
      { id: 5, dir: 'down',   row: 0, col: 2, answer: 'ДЕЛИТЕЛЬ', clue: 'То же что знаменатель при делении.' },
      { id: 6, dir: 'down',   row: 0, col: 4, answer: 'БОЧКА', clue: 'Не математический термин (тест).' },
      { id: 7, dir: 'down',   row: 2, col: 6, answer: 'ЦЕЛОЕ', clue: 'Число без дробной части.' }
    ]
  },
  {
    id: 'demo_trig_10',
    title: 'Тригонометрия: основные функции',
    grade: 10,
    type: 'word',
    difficulty: 'medium',
    description: 'Синус, косинус и тангенс.',
    size: { rows: 5, cols: 9 },
    grid: [
      [1,1,1,1,1,0,0,0,0],
      [1,0,0,0,1,0,0,0,0],
      [1,1,1,1,1,1,1,1,1],
      [0,0,0,0,1,0,0,0,0],
      [0,0,0,0,1,1,1,1,0]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'СИНУС',   clue: 'Функция sin.' },
      { id: 2, dir: 'across', row: 2, col: 0, answer: 'КОСИНУСЫ', clue: 'Мн. число от cos.' },
      { id: 3, dir: 'across', row: 4, col: 4, answer: 'ТАНГЕНС',  clue: 'Функция tg.' },
      { id: 4, dir: 'down',   row: 0, col: 0, answer: 'СИК',     clue: 'Не используется (тест).' },
      { id: 5, dir: 'down',   row: 0, col: 4, answer: 'НУТЕГ',   clue: 'Не используется (тест).' }
    ]
  }
];

// Утилиты
function getCrosswordsByGrade(grade) {
  return CROSSWORDS.filter(cw => cw.grade === grade);
}
function getCrosswordsByType(type) {
  return CROSSWORDS.filter(cw => cw.type === type);
}
function getCrosswordsByDifficulty(diff) {
  return CROSSWORDS.filter(cw => cw.difficulty === diff);
}
function getCrosswordById(id) {
  return CROSSWORDS.find(cw => cw.id === id) || null;
}
function filterCrosswords({grade, type, difficulty}) {
  return CROSSWORDS.filter(cw => {
    if (grade && cw.grade !== parseInt(grade)) return false;
    if (type && cw.type !== type) return false;
    if (difficulty && cw.difficulty !== difficulty) return false;
    return true;
  });
}

const GRADES = [1,2,3,4,5,6,7,8,9,10,11];
const TYPE_LABELS = { numeric: 'Числовой', word: 'Словесный', equation: 'Уравнения' };
const DIFF_LABELS = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' };
const DIFF_COLORS = { easy: 'var(--green)', medium: 'var(--yellow)', hard: 'var(--red)' };
