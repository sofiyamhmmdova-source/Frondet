export type Course = {
  id: string
  title: string
  category: string
  level: string
  duration: string
  description: string
  progress: number
  color: string
  videoUrl: string
  lessons: string[]
}

export const courses: Course[] = [
  {
    id: 'html',
    title: 'HTML',
    category: 'Front-end Fundamentals',
    level: 'Başlanğıc',
    duration: '6 dərs',
    description: 'HTML structure, semantic tags, forms, accessibility, and practical layout foundations.',
    progress: 82,
    color: 'from-cyan-500 to-blue-600',
    videoUrl: 'https://youtu.be/wQVMi8F-H38?si=tL7lvRK-LXLgvy4_',
    lessons: ['Dərs 1', 'Dərs 2', 'Dərs 3', 'Dərs 4', 'Dərs 5', 'Dərs 6'],
  },
  {
    id: 'css',
    title: 'CSS',
    category: 'Styling & Layout',
    level: 'Başlanğıc',
    duration: '9 dərs',
    description: 'Typography, colors, Box Model, Flexbox, Grid, animations, media queries, variables, and responsive design.',
    progress: 76,
    color: 'from-violet-500 to-indigo-600',
    videoUrl: 'https://www.youtube.com/watch?v=K1FzMTpEjGM',
    lessons: ['Font, Background', 'Box Model', 'Flexbox', 'Grid', 'Figma Practice', 'Transforms', 'Animation', 'Pseudo', 'Media Queries'],
  },
  {
    id: 'js',
    title: 'JavaScript',
    category: 'Programming Logic',
    level: 'Orta',
    duration: '12 dərs',
    description: 'Variables, loops, conditions, arrays, objects, functions, DOM interaction, and problem-solving exercises.',
    progress: 68,
    color: 'from-amber-500 to-orange-600',
    videoUrl: 'https://youtu.be/9QarV_c8mls?si=jwRiP7g6NZSI6aFv',
    lessons: ['Variables', 'Operators', 'if/else', 'alert / confirm / prompt', 'Loops', 'String Methods', 'Functions', 'Array Methods', 'Objects'],
  },
  {
    id: 'advanced-js',
    title: 'Advanced JavaScript',
    category: 'Web Development',
    level: 'İrəli',
    duration: '14 dərs',
    description: 'Destructuring, spread/rest, closures, promises, async/await, OOP, regex, modules, and browser APIs.',
    progress: 59,
    color: 'from-emerald-500 to-teal-600',
    videoUrl: 'https://www.youtube.com/watch?v=Cmmpqcz0omU',
    lessons: ['Array & Object Methods', 'Math & Date', 'DOM 1', 'DOM 2', 'Events', 'Storage API', 'Promises', 'Async Await', 'OOP'],
  },
  {
    id: 'react',
    title: 'React',
    category: 'Front-end Framework',
    level: 'İrəli',
    duration: '13 dərs',
    description: 'Components, props, state, hooks, context, routing, Redux Toolkit, RTK Query, and performance optimization.',
    progress: 73,
    color: 'from-sky-500 to-blue-700',
    videoUrl: 'https://youtu.be/GmiXeYQ_sg4?si=W_IuPFKjVJ2Q5Dpy',
    lessons: ['Node.js', 'React Basics', 'Conditional Rendering', 'useRef', 'Context', 'Redux Toolkit', 'RTK Query', 'Axios', 'Router'],
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    category: 'Strong Typing',
    level: 'İrəli',
    duration: '2 dərs',
    description: 'Core TypeScript concepts, types, interfaces, and React + TypeScript integration for scalable apps.',
    progress: 55,
    color: 'from-blue-600 to-indigo-800',
    videoUrl: 'https://youtu.be/yBRSd5W5Pzk?si=TCBPHXqFsnbBHCMg',
    lessons: ['Fundamentals', 'React + TypeScript'],
  },
]

type CourseResource = {
  materials: { title: string; fileName: string }[]
  tasks: string[]
}

const cssMaterials = [
  { title: 'CSS dərs 1 — əsaslar (PDF)', fileName: 'CSS/CSS_Ders 1.pdf' },
  { title: 'Box Model və Position', fileName: 'CSS/css-box-model-and-position.html' },
  { title: 'Flexbox dərsliyi', fileName: 'CSS/css-flexbox-derslik (1).html' },
  { title: 'Grid və Overflow (PDF)', fileName: 'CSS/CSS_Grid_Overflow_Dersi (1).pdf' },
  { title: 'Transition və Animation (PDF)', fileName: 'CSS/CSS_Transition_Animation_Dersi.pdf' },
  { title: 'Transform, Filters və Overflow', fileName: 'CSS/transform,filters and overflow (1).html' },
  { title: 'Pseudo selectors, pseudo elements və variables', fileName: 'CSS/CSS PSEUDO SELECTORS - PSEUDO ELEMENTS - VARIABLES (1) (1).html' },
]

const javascriptMaterials = [
  { title: '1. Variables, Data Types və Console', fileName: 'js/1) JS-Variables-DataTypes-Console-Ders.html' },
  { title: '2. Operatorlar və Type Conversion (PDF)', fileName: 'js/2) JS_Operatorlar_TypeConversion.pdf' },
  { title: '3. Şərt operatorları', fileName: 'js/3) JS-Sertli-Operatorlar-Dersi.html' },
  { title: '4. Dövrlər', fileName: 'js/4) js-dovrler-dersi.html' },
  { title: '5. String metodları və dövrlər', fileName: 'js/5) js_string_loops.html' },
  { title: '6. Funksiyalar və scope', fileName: 'js/6) js-functions-scope.html' },
  { title: '7. Array', fileName: 'js/7) array.html' },
  { title: '7. Iterasiya', fileName: 'js/7) js-iterasiya.html' },
  { title: '8. Obyektlər', fileName: 'js/8) js-obyektler.html' },
  { title: '9. Math və Date', fileName: 'js/9) js-math-and-date.html' },
  { title: '10. DOM Selectors', fileName: 'js/10) js-dom-selectors.html' },
  { title: '10. Events', fileName: 'js/10) js-event.html' },
  { title: '11. Window, Destructuring, Spread və Rest', fileName: 'js/11) Window Obyekti ,destructring , Spread & Rest (...) .html' },
  { title: '12. Data Transformation', fileName: 'js/12) js-data-transformation.html' },
  { title: '13. setTimeout və setInterval', fileName: 'js/13) setTimeout-setInterval.html' },
  { title: '14. Event Delegation', fileName: 'js/14) event-delegation.html' },
  { title: '15. Local Storage və Session Storage', fileName: 'js/15) local-session-storage.html' },
  { title: '16. Promises', fileName: 'js/16) promises.html' },
  { title: '17. Async/Await', fileName: 'js/17) async-await.html' },
  { title: '18. Error Handling', fileName: 'js/18) error-handling.html' },
  { title: '19. Fetch API və HTTP əsasları', fileName: 'js/19) fetch-api-http-esaslari.html' },
  { title: '20. OOP, Class və Prototype', fileName: 'js/20) oop-class-prototype.html' },
  { title: '21. ES Modules', fileName: 'js/21) es-modules.html' },
  { title: '22. Regular Expressions', fileName: 'js/22)regex.html' },
]

const reactMaterials = [
  { title: '1. React-ə giriş', fileName: 'react/ders1-react-giris.html' },
  { title: '2. Komponentlər, Props və Composition', fileName: 'react/Ders2_Komponentler_Props_Composition.html' },
  { title: '3. State və useState', fileName: 'react/ders3-state-usestate.html' },
  { title: '4. useEffect və Lifecycle', fileName: 'react/ders4-useeffect-lifecycle.html' },
  { title: '5. Formalar və useRef', fileName: 'react/Ders5-Formalar-useRef.html' },
  { title: '6. Context API və useReducer', fileName: 'react/ders6-context-api-usereducer.html' },
  { title: '7. React Router', fileName: 'react/ders-7-react-router.html' },
  { title: '8. Performans optimallaşdırması', fileName: 'react/Ders-8-Performans-Optimallashdirmasi.html' },
  { title: '9. API inteqrasiyası', fileName: 'react/ders-9-api-inteqrasiyasi.html' },
  { title: '10. Mini layihə', fileName: 'react/ders-10-mini-layihe.html' },
]

export const courseResources: Record<string, CourseResource> = {
  html: {
    materials: [{ title: 'HTML əsasları — mühazirə və nümunələr', fileName: 'html/html-basics.html' }],
    tasks: [
      'Semantik HTML teqlərindən istifadə edərək başlıq, menyu, əsas məzmun və alt hissədən ibarət şəxsi portfolio səhifəsi qur.',
      'Ad, email və mesaj sahələri olan form əlavə et; hər input üçün label yaz.',
    ],
  },
  css: {
    materials: cssMaterials,
    tasks: [
      'Portfolio səhifəni Flexbox və ya Grid ilə düzənlə, mobil ekranlar üçün uyğunlaşdır.',
      'Düymələrə hover effekti və səhifəyə CSS dəyişənləri ilə rəng palitrası əlavə et.',
    ],
  },
  js: {
    materials: javascriptMaterials,
    tasks: [
      'İstifadəçi adlarını saxlayan massiv yarat və for dövrü ilə onları səhifədə göstər.',
      'Sadə hesablayıcı qur: iki rəqəm və əməliyyat seçildikdə nəticəni göstər.',
    ],
  },
  'advanced-js': {
    materials: javascriptMaterials,
    tasks: [
      'Promise və async/await istifadə edərək məlumatı asinxron emal et və nəticəni səhifədə göstər.',
      'Local Storage-da saxlanan tapşırıqlar siyahısı yarat; əlavə etmək və silmək mümkün olsun.',
    ],
  },
  react: {
    materials: reactMaterials,
    tasks: [
      'Komponentlərə bölünmüş, props vasitəsilə məlumat alan kurs kartları hazırla.',
      'State istifadə edərək tapşırıq siyahısına element əlavə et və tamamlandı kimi işarələ.',
    ],
  },
  typescript: {
    materials: [{ title: 'TypeScript əsasları — tələbə dərsliyi (PDF)', fileName: 'typescript-student-book.pdf' }],
    tasks: [
      'İstifadəçi məlumatı üçün interface yaz və həmin tipdən istifadə edən funksiya qur.',
      'React komponentinə props tipi əlavə et və optional property-ni təhlükəsiz yoxla.',
    ],
  },
}

export const stats = [
  { label: 'Dərs sayısı', value: '60+' },
  { label: 'Video material', value: '24/7' },
  { label: 'Öyrənmə yolu', value: 'Praktik' },
  { label: 'Admin paneli', value: 'Aktiv' },
]
