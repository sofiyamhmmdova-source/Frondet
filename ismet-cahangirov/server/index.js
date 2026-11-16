const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'ismet-cahangirov-secret-key'

app.use(cors())
app.use(express.json())

const users = [
  {
    id: 'admin-1',
    name: 'İsmet Cahangirov',
    email: 'admin@ismet.dev',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
]

const courses = [
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

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
})

const getToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Token tapılmadı' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token etibarsızdır' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin icazəsi tələb olunur' })
  }
  next()
}

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Ismet Cahangirov Academy' }))

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Ad, email və şifrə mütləqdir' })
  }

  const existing = users.find((user) => user.email.toLowerCase() === String(email).toLowerCase())
  if (existing) {
    return res.status(409).json({ message: 'Bu email artıq qeydiyyatdan keçib' })
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'student',
  }

  users.push(newUser)

  res.status(201).json({
    token: getToken(newUser),
    user: sanitizeUser(newUser),
  })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email və şifrə tələb olunur' })
  }

  const user = users.find((item) => item.email.toLowerCase() === String(email).toLowerCase())
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Email və ya şifrə yanlışdır' })
  }

  res.json({
    token: getToken(user),
    user: sanitizeUser(user),
  })
})

app.get('/api/courses', (_, res) => {
  res.json(courses)
})

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find((item) => item.id === req.params.id)
  if (!course) {
    return res.status(404).json({ message: 'Dərs tapılmadı' })
  }
  res.json(course)
})

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const stats = [
    { label: 'Ümumi tələbə', value: String(users.length) },
    { label: 'Aktiv dərslər', value: String(courses.length) },
    { label: 'Admin', value: req.user.role === 'admin' ? 'Aktiv' : 'Məhdud' },
    { label: 'Status', value: 'Hazır' },
  ]

  res.json({
    stats,
    recentUsers: users.slice(0, 5).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })),
  })
})

app.get('/api/admin/users', authMiddleware, adminMiddleware, (_, res) => {
  res.json(users.map(sanitizeUser))
})

app.patch('/api/admin/users/:id/role', authMiddleware, adminMiddleware, (req, res) => {
  const { role } = req.body || {}
  const target = users.find((user) => user.id === req.params.id)

  if (!target) {
    return res.status(404).json({ message: 'İstifadəçi tapılmadı' })
  }

  if (!['admin', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Yanlış rol' })
  }

  target.role = role
  res.json({ message: 'Rol dəyişdirildi', user: sanitizeUser(target) })
})

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`)
})
