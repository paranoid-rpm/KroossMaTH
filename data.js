// KroossMaTH — База кроссвордов 1-11 класс
const CROSSWORDS = [

// ==================== 1-2 КЛАСС ====================
{
  id:'cw_1_1', title:'Сложение до 10', grade:1, type:'numeric', difficulty:'easy',
  description:'Простые примеры на сложение',
  size:{rows:5,cols:7},
  grid:[
    [0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1],
    [0,1,0,0,0,1,0],
    [0,1,0,1,1,1,1],
    [0,1,0,0,0,1,0]
  ],
  words:[
    {id:1,dir:'across',row:1,col:0,answer:'ТРИ',clue:'1+2=?'},
    {id:2,dir:'down',row:0,col:1,answer:'ДВА',clue:'1+1=?'},
    {id:3,dir:'across',row:3,col:3,answer:'ПЯТЬ',clue:'2+3=?'},
    {id:4,dir:'down',row:0,col:5,answer:'СЕМЬ',clue:'3+4=?'}
  ]
},
{
  id:'cw_1_2', title:'Числа от 1 до 9', grade:1, type:'numeric', difficulty:'easy',
  description:'Угадай числа по описанию',
  size:{rows:5,cols:7},
  grid:[
    [0,1,0,0,0,0,0],
    [1,1,1,0,1,1,1],
    [0,1,0,0,0,1,0],
    [0,1,1,1,1,1,0],
    [0,0,0,0,0,1,0]
  ],
  words:[
    {id:1,dir:'down',row:0,col:1,answer:'ЧЕТ',clue:'2,4,6,8 — это числа ...'},
    {id:2,dir:'across',row:1,col:0,answer:'ТРИ',clue:'Нечётное число между 2 и 4'},
    {id:3,dir:'across',row:1,col:4,answer:'ШЕС',clue:'5+1=?'},
    {id:4,dir:'across',row:3,col:1,answer:'ДЕВЯТ',clue:'10-1=?'},
    {id:5,dir:'down',row:1,col:5,answer:'ВОС',clue:'7+1=?'}
  ]
},

// ==================== 3-4 КЛАСС ====================
{
  id:'cw_3_1', title:'Таблица умножения', grade:3, type:'numeric', difficulty:'easy',
  description:'Проверь знание таблицы умножения',
  size:{rows:7,cols:9},
  grid:[
    [0,1,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,1,1],
    [0,1,0,0,0,1,0,0,0],
    [0,1,0,1,1,1,1,0,0],
    [0,1,0,0,0,1,0,0,0],
    [1,1,1,1,0,0,0,0,0],
    [0,1,0,1,0,0,0,0,0]
  ],
  words:[
    {id:1,dir:'across',row:1,col:0,answer:'ДВАДЦАТЬ',clue:'4×5=?'},
    {id:2,dir:'down',row:0,col:1,answer:'ШЕСТЬДЕС',clue:'Результат 6×10'},
    {id:3,dir:'across',row:3,col:3,answer:'ВОСЕМЬ',clue:'2×4=?'},
    {id:4,dir:'across',row:5,col:0,answer:'ДЕВЯТЬ',clue:'3×3=?'},
    {id:5,dir:'down',row:0,col:5,answer:'ТРИДЦАТ',clue:'5×6=?'}
  ]
},
{
  id:'cw_3_2', title:'Геометрия: фигуры', grade:3, type:'word', difficulty:'easy',
  description:'Названия геометрических фигур',
  size:{rows:7,cols:9},
  grid:[
    [1,1,1,1,1,0,1,1,1],
    [0,0,0,1,0,0,1,0,0],
    [1,1,1,1,1,0,1,1,1],
    [1,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1],
    [0,0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'КВАДРАТ',clue:'Прямоугольник с равными сторонами'},
    {id:2,dir:'across',row:0,col:6,answer:'КРУ',clue:'Фигура без углов'},
    {id:3,dir:'across',row:2,col:0,answer:'РОМБ',clue:'Параллелограмм с равными сторонами'},
    {id:4,dir:'across',row:4,col:0,answer:'ТРЕУГОЛЬНИК',clue:'Фигура с тремя углами'},
    {id:5,dir:'down',row:0,col:3,answer:'ВЕРШИНА',clue:'Точка пересечения сторон угла'},
    {id:6,dir:'down',row:2,col:0,answer:'РАД',clue:'Отрезок от центра до окружности'}
  ]
},

// ==================== 5 КЛАСС ====================
{
  id:'cw_5_1', title:'Обыкновенные дроби', grade:5, type:'word', difficulty:'medium',
  description:'Термины теории дробей',
  size:{rows:9,cols:11},
  grid:[
    [0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,0,1,1,1,1],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,0,0],
    [0,1,0,0,0,0,1,0,0,0,0],
    [0,1,1,1,1,1,1,0,0,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:1,answer:'ЧИСЛИТЕЛЬ',clue:'Верхняя часть дроби'},
    {id:2,dir:'across',row:2,col:0,answer:'ЗНАМЕНАТЕЛЬ',clue:'Нижняя часть дроби'},
    {id:3,dir:'across',row:4,col:1,answer:'ЧАСТНОЕ',clue:'Результат деления'},
    {id:4,dir:'across',row:6,col:0,answer:'ПРАВИЛЬНАЯ',clue:'Дробь, где числитель < знаменателя'},
    {id:5,dir:'across',row:8,col:1,answer:'СМЕШАНА',clue:'Число + правильная дробь'},
    {id:6,dir:'down',row:0,col:3,answer:'ЦЕЛОЕ',clue:'Число без дробной части'},
    {id:7,dir:'down',row:0,col:7,answer:'ДРОБЬ',clue:'Запись вида a/b'}
  ]
},
{
  id:'cw_5_2', title:'Проценты', grade:5, type:'numeric', difficulty:'medium',
  description:'Задачи на проценты',
  size:{rows:7,cols:9},
  grid:[
    [0,1,1,1,1,0,0,0,0],
    [0,0,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,1,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0],
    [0,1,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:1,answer:'СОРОК',clue:'40% от 100'},
    {id:2,dir:'across',row:2,col:0,answer:'ДВАДЦАТЬ',clue:'20% от 100'},
    {id:3,dir:'across',row:4,col:1,answer:'ДЕСЯТЬ',clue:'10% от 100'},
    {id:4,dir:'across',row:6,col:1,answer:'ПЯТЬДЕС',clue:'50% от 100'},
    {id:5,dir:'down',row:0,col:3,answer:'ПРОЦЕНТ',clue:'Сотая доля числа'},
    {id:6,dir:'down',row:2,col:6,answer:'СКИДКА',clue:'Уменьшение цены в %'}
  ]
},

// ==================== 6 КЛАСС ====================
{
  id:'cw_6_1', title:'Отрицательные числа', grade:6, type:'equation', difficulty:'medium',
  description:'Действия с отрицательными числами',
  size:{rows:7,cols:9},
  grid:[
    [0,1,1,1,1,0,0,0,0],
    [0,1,0,0,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0],
    [0,1,0,0,1,0,1,0,0],
    [0,1,1,1,1,0,1,0,0],
    [0,0,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:1,answer:'МИНУС',clue:'Знак отрицательного числа'},
    {id:2,dir:'across',row:2,col:0,answer:'МОДУЛЬ',clue:'|−7| = ?... это называется...'},
    {id:3,dir:'across',row:4,col:1,answer:'ЦЕЛЫЕ',clue:'Множество чисел: ..., −2, −1, 0, 1, 2, ...'},
    {id:4,dir:'across',row:6,col:1,answer:'РАЗНОСТЬ',clue:'Результат вычитания'},
    {id:5,dir:'down',row:0,col:1,answer:'МИНУЕНД',clue:'Из чего вычитают'},
    {id:6,dir:'down',row:0,col:4,answer:'ЧИСЛА',clue:'5, −3, 0 — это ...'}
  ]
},

// ==================== 7 КЛАСС ====================
{
  id:'cw_7_1', title:'Алгебра: уравнения', grade:7, type:'equation', difficulty:'medium',
  description:'Решение линейных уравнений',
  size:{rows:7,cols:11},
  grid:[
    [1,1,1,1,1,1,1,1,1,0,0],
    [1,0,0,0,1,0,0,0,1,0,0],
    [1,1,1,1,1,0,1,1,1,1,1],
    [0,0,0,0,1,0,1,0,0,0,1],
    [0,1,1,1,1,1,1,0,0,0,1],
    [0,1,0,0,0,0,1,0,0,0,1],
    [0,1,1,1,1,1,1,0,0,0,1]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'УРАВНЕНИЕ',clue:'Равенство с неизвестным'},
    {id:2,dir:'across',row:2,col:0,answer:'ЛИНЕЙНОЕ',clue:'Уравнение вида ax+b=0'},
    {id:3,dir:'across',row:2,col:6,answer:'КОРЕНЬ',clue:'Значение переменной, обращающее уравнение в тождество'},
    {id:4,dir:'across',row:4,col:1,answer:'РЕШЕНИЕ',clue:'Нахождение корня уравнения'},
    {id:5,dir:'across',row:6,col:1,answer:'ПЕРЕНОС',clue:'Метод: слагаемое переходит на другую сторону'},
    {id:6,dir:'down',row:0,col:0,answer:'УРАВНЕН',clue:'Первые 7 букв слова «уравнение»'},
    {id:7,dir:'down',row:0,col:4,answer:'ИКСЕ',clue:'Обозначение неизвестного'},
    {id:8,dir:'down',row:0,col:8,answer:'ИКСКОР',clue:'Неизвестное и его нахождение'}
  ]
},
{
  id:'cw_7_2', title:'Степени и корни', grade:7, type:'numeric', difficulty:'medium',
  description:'Свойства степеней',
  size:{rows:7,cols:9},
  grid:[
    [0,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,1,1],
    [0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,0,0,0],
    [0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:1,answer:'СТЕПЕНЬ',clue:'2³ — это 2 в третьей ...'},
    {id:2,dir:'across',row:2,col:0,answer:'ОСНОВАНИЕ',clue:'В выражении aⁿ — это a'},
    {id:3,dir:'across',row:4,col:1,answer:'ПОКАЗА',clue:'В выражении aⁿ — это n (сокр.)'},
    {id:4,dir:'across',row:6,col:1,answer:'КВАДРАТ',clue:'Вторая степень числа'},
    {id:5,dir:'down',row:0,col:1,answer:'СТЕПОК',clue:'Степень с показателем ноль всегда равна...'},
    {id:6,dir:'down',row:0,col:5,answer:'НУЛЬСТ',clue:'a⁰ = ?'}
  ]
},

// ==================== 8 КЛАСС ====================
{
  id:'cw_8_1', title:'Квадратные уравнения', grade:8, type:'equation', difficulty:'hard',
  description:'Теория квадратных уравнений',
  size:{rows:9,cols:11},
  grid:[
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1],
    [0,1,0,0,0,1,0,0,0,0,1],
    [0,1,1,1,1,1,1,0,0,0,1],
    [0,0,0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'ДИСКРИМИНАНТ',clue:'D = b²−4ac'},
    {id:2,dir:'across',row:2,col:0,answer:'ПАРАБОЛАD',clue:'График квадратного трёхчлена'},
    {id:3,dir:'across',row:4,col:1,answer:'ТЕОРЕМА',clue:'Доказанное математическое утверждение'},
    {id:4,dir:'across',row:6,col:1,answer:'ВЕРШИНА',clue:'Наивысшая/низшая точка параболы'},
    {id:5,dir:'across',row:8,col:1,answer:'ФОРМУЛА',clue:'x = (−b ± √D) / 2a — это ...'},
    {id:6,dir:'down',row:0,col:1,answer:'ДИСКР',clue:'Сокращение от «дискриминант»'},
    {id:7,dir:'down',row:0,col:5,answer:'БЭИНАС',clue:'Коэффициенты квадратного уравнения'},
    {id:8,dir:'down',row:0,col:10,answer:'ДАКОРНЕ',clue:'D>0: два ...'}
  ]
},

// ==================== 9 КЛАСС ====================
{
  id:'cw_9_1', title:'Функции и графики', grade:9, type:'word', difficulty:'hard',
  description:'Основные понятия теории функций',
  size:{rows:9,cols:11},
  grid:[
    [1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,1,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,0,0,0,1,0],
    [0,1,0,0,0,1,0,0,0,1,0],
    [0,1,1,1,1,1,0,0,0,1,0],
    [0,0,0,0,0,1,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'ФУНКЦИЯ',clue:'Соответствие между множествами'},
    {id:2,dir:'across',row:2,col:1,answer:'АРГУМЕНТ',clue:'Независимая переменная функции'},
    {id:3,dir:'across',row:4,col:0,answer:'ОБЛАСТЬ',clue:'... определения функции'},
    {id:4,dir:'across',row:6,col:1,answer:'ГРАФИК',clue:'Геометрическое изображение функции'},
    {id:5,dir:'across',row:8,col:1,answer:'МОНОТОННА',clue:'Функция, которая только возрастает или убывает'},
    {id:6,dir:'down',row:0,col:3,answer:'ТАКТАРГ',clue:'Точка перегиба (сокр.)'},
    {id:7,dir:'down',row:0,col:7,answer:'ЯБЗНАЧ',clue:'y = f(x): y — это...'},
    {id:8,dir:'down',row:2,col:9,answer:'ЗНАЧЕН',clue:'Множество ... функции'}
  ]
},
{
  id:'cw_9_2', title:'Прогрессии', grade:9, type:'numeric', difficulty:'hard',
  description:'Арифметическая и геометрическая прогрессии',
  size:{rows:7,cols:9},
  grid:[
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,1,0,1,0,0],
    [0,1,1,1,1,1,1,0,0],
    [0,1,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'ПРОГРЕСС',clue:'Последовательность по закону'},
    {id:2,dir:'across',row:2,col:0,answer:'ЗНАМЕНАТ',clue:'Постоянное отношение в геом. прогрессии'},
    {id:3,dir:'across',row:4,col:1,answer:'РАЗНОСТЬ',clue:'Постоянная разница в ариф. прогрессии'},
    {id:4,dir:'across',row:6,col:1,answer:'СУММАНЧ',clue:'Результат сложения членов'},
    {id:5,dir:'down',row:0,col:0,answer:'ПРЗНА',clue:'Прогрессия+знаменатель (сокр.)'},
    {id:6,dir:'down',row:0,col:4,answer:'ПЕРВЫЙ',clue:'Первый член прогрессии a₁'}
  ]
},

// ==================== 10 КЛАСС ====================
{
  id:'cw_10_1', title:'Тригонометрия', grade:10, type:'word', difficulty:'hard',
  description:'Основные тригонометрические функции',
  size:{rows:9,cols:11},
  grid:[
    [0,1,1,1,1,1,0,0,0,0,0],
    [0,1,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,0],
    [0,0,0,1,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:1,answer:'СИНУС',clue:'sin — это ...'},
    {id:2,dir:'across',row:2,col:0,answer:'КОСИНУС',clue:'cos — это ...'},
    {id:3,dir:'across',row:4,col:1,answer:'ТАНГЕНС',clue:'tg = sin/cos'},
    {id:4,dir:'across',row:6,col:1,answer:'КОТАНГЕ',clue:'ctg = cos/sin'},
    {id:5,dir:'across',row:8,col:1,answer:'ФОРМУЛ',clue:'Тождество sin²+cos²=1 — это основная ...'},
    {id:6,dir:'down',row:0,col:1,answer:'СИНКОТ',clue:'Синус и котангенс (сокр.)'},
    {id:7,dir:'down',row:2,col:6,answer:'УГОЛ',clue:'Аргумент тригонометрических функций'},
    {id:8,dir:'down',row:2,col:9,answer:'РАДИАН',clue:'Единица измерения углов'}
  ]
},
{
  id:'cw_10_2', title:'Производная', grade:10, type:'equation', difficulty:'hard',
  description:'Понятие производной функции',
  size:{rows:7,cols:11},
  grid:[
    [1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,1,0,0,0,1,0],
    [1,1,1,1,0,1,1,1,1,1,0],
    [0,1,0,1,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,0,0,0]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'ПРОИЗВОДНАЯ',clue:'f′(x) — это ...'},
    {id:2,dir:'across',row:2,col:0,answer:'ДИФФЕРЕНЦ',clue:'Нахождение производной — это ...ирование'},
    {id:3,dir:'across',row:4,col:1,answer:'ЭКСТРЕМУМ',clue:'Максимум или минимум функции'},
    {id:4,dir:'across',row:6,col:1,answer:'КАСАТЕЛ',clue:'Прямая, касающаяся графика в точке'},
    {id:5,dir:'down',row:0,col:1,answer:'ДИФФПР',clue:'Дифференциал и производная (сокр.)'},
    {id:6,dir:'down',row:0,col:5,answer:'ПРЕДЕЛ',clue:'Производная как ... отношения'},
    {id:7,dir:'down',row:0,col:9,answer:'УБЫВАЕТ',clue:'Если f′<0, функция ...'}
  ]
},

// ==================== 11 КЛАСС ====================
{
  id:'cw_11_1', title:'Интегралы', grade:11, type:'equation', difficulty:'hard',
  description:'Понятие определённого и неопределённого интеграла',
  size:{rows:9,cols:13},
  grid:[
    [1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,1,0,0,0,1,0,0,1,0,0,0,0],
    [1,1,1,1,1,1,0,1,1,1,1,1,1],
    [0,1,0,0,0,1,0,0,1,0,0,0,1],
    [0,1,1,1,1,1,0,0,1,0,0,0,1],
    [0,0,0,0,0,1,0,0,1,0,0,0,1],
    [0,1,1,1,1,1,1,1,1,0,0,0,1],
    [0,1,0,0,0,0,0,0,1,0,0,0,1],
    [0,1,1,1,1,1,1,1,1,0,0,0,1]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'ИНТЕГРАЛ',clue:'∫f(x)dx — символ ...'},
    {id:2,dir:'across',row:2,col:0,answer:'ПЕРВООБРАЗНА',clue:'F(x): F′(x)=f(x)'},
    {id:3,dir:'across',row:2,col:7,answer:'ПЛОЩАДЬ',clue:'Геометрический смысл определённого интеграла'},
    {id:4,dir:'across',row:4,col:1,answer:'НЬЮТОН',clue:'... — Лейбниц: формула для определённого интеграла'},
    {id:5,dir:'across',row:6,col:1,answer:'ПРЕДЕЛЫ',clue:'Нижний и верхний ... интегрирования'},
    {id:6,dir:'across',row:8,col:1,answer:'КОНСТАНТА',clue:'C в неопределённом интеграле'},
    {id:7,dir:'down',row:0,col:1,answer:'ИПЕРВО',clue:'Интеграл + первообразная (сокр.)'},
    {id:8,dir:'down',row:0,col:5,answer:'ФОРМУЛ',clue:'Ньютона-Лейбница — это ...'},
    {id:9,dir:'down',row:0,col:8,answer:'НОГРАНКИ',clue:'Пределы ин... (сокр.)'},
    {id:10,dir:'down',row:2,col:12,answer:'ДИКС',clue:'dx — дифференциал ...'}
  ]
},
{
  id:'cw_11_2', title:'Комплексные числа', grade:11, type:'word', difficulty:'hard',
  description:'Мнимая единица и комплексные числа',
  size:{rows:7,cols:11},
  grid:[
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,0,0,1],
    [0,0,0,1,0,0,0,1,0,0,1],
    [0,1,1,1,1,1,1,1,0,0,1],
    [0,1,0,0,0,0,0,0,0,0,1],
    [0,1,1,1,1,1,1,1,1,1,1]
  ],
  words:[
    {id:1,dir:'across',row:0,col:0,answer:'КОМПЛЕКСНОЕ',clue:'... число: a + bi'},
    {id:2,dir:'across',row:2,col:0,answer:'МНИМАЯЕД',clue:'i: i²=−1, называется ... единица'},
    {id:3,dir:'across',row:4,col:1,answer:'МОДУЛЬ',clue:'|a+bi| = √(a²+b²)'},
    {id:4,dir:'across',row:6,col:1,answer:'СОПРЯЖЕННОЕ',clue:'a+bi и a−bi — ... числа'},
    {id:5,dir:'down',row:0,col:3,answer:'КОМИМ',clue:'Комплексная+мнимая (сокр.)'},
    {id:6,dir:'down',row:0,col:10,answer:'ЕВЕЛИ',clue:'Формула Эйлера (сокр.)'}
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

const GRADES = [1,2,3,4,5,6,7,8,9,10,11];
const TYPE_LABELS = {numeric:'Числовой', word:'Словесный', equation:'Уравнения'};
const DIFF_LABELS = {easy:'Лёгкий', medium:'Средний', hard:'Сложный'};
const DIFF_COLORS = {easy:'var(--green)', medium:'var(--yellow)', hard:'var(--red)'};
