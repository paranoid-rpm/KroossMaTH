// KroossMaTH — база кроссвордов (минимальный корректный набор)

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
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'ТРИ',   clue: '1 + 2 = ?' },
      { id: 2, dir: 'across', row: 1, col: 0, answer: 'ПЯТЬ',  clue: '2 + 3 = ?' },
      { id: 3, dir: 'across', row: 2, col: 0, answer: 'СЕМЬ',  clue: '3 + 4 = ?' },
      { id: 4, dir: 'across', row: 3, col: 0, answer: 'ДВА',   clue: '1 + 1 = ?' },
      { id: 5, dir: 'down',   row: 0, col: 4, answer: 'ТРИ',   clue: '6 − 3 = ?' }
    ]
  },
  {
    id: 'demo_frac_5',
    title: 'Дроби и целые числа',
    grade: 5,
    type: 'word',
    difficulty: 'easy',
    description: 'Базовые термины: дробь, целое число, число.',
    size: { rows: 5, cols: 5 },
    grid: [
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1],
      [1,1,1,1,1]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'ДРОБЬ',  clue: 'Запись вида a/b.' },
      { id: 2, dir: 'across', row: 1, col: 0, answer: 'ЦЕЛОЕ',  clue: 'Число без дробной части.' },
      { id: 3, dir: 'across', row: 2, col: 0, answer: 'ЧИСЛО',  clue: 'Результат измерения или счёта.' }
    ]
  },
  {
    id: 'demo_trig_10',
    title: 'Тригонометрия: основные функции',
    grade: 10,
    type: 'word',
    difficulty: 'medium',
    description: 'Синус, косинус и тангенс как функции угла.',
    size: { rows: 5, cols: 7 },
    grid: [
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1]
    ],
    words: [
      { id: 1, dir: 'across', row: 0, col: 0, answer: 'СИНУС',   clue: 'Функция, обозначаемая sin.' },
      { id: 2, dir: 'across', row: 1, col: 0, answer: 'КОСИНУС', clue: 'Функция, обозначаемая cos.' },
      { id: 3, dir: 'across', row: 2, col: 0, answer: 'ТАНГЕНС', clue: 'Функция, обозначаемая tg.' }
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
  return CROSSWORDS.find(cw => cw.id === id);
}
function filterCrosswords({grade, type, difficulty}) {
  return CROSSWORDS.filter(cw => {
    if (grade && cw.grade !== parseInt(grade)) return false;
    if (type && cw.type !== type) return false;
    if (difficulty && cw.difficulty !== difficulty) return false;
    return true;
  });
}

const GRADES = [1,2,3,4,5,6,7,8,8,10,11];
const TYPE_LABELS = {numeric:'Числовой', word:'Словесный', equation:'Уравнения'};
const DIFF_LABELS = {easy:'Лёгкий', medium:'Средний', hard:'Сложный'};
const DIFF_COLORS = {easy:'var(--green)', medium:'var(--yellow)', hard:'var(--red)'};
