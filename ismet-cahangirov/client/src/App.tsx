import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { ArrowRight, BookOpen, CheckCircle2, Code2, ExternalLink, LogIn, LogOut, Mail, Moon, Play, RotateCcw, ShieldCheck, Sun, UserPlus } from 'lucide-react'
import type { RootState } from './app/store'
import { logout, setCredentials } from './features/auth/authSlice'
import { useGetCoursesQuery, useGetDashboardQuery, useLoginMutation, useRegisterMutation } from './features/courses/coursesApi'
import { courseResources, courses, stats, type Course } from './data/courseData'
import lessonCatalog from './data/lessonCatalog.json'

type LessonCatalogCourse = typeof lessonCatalog.courses[number]
type LessonTopic = LessonCatalogCourse['topics'][number]
type EditorFile = keyof LessonCatalogCourse['starterCode']

function getYoutubeEmbedUrl(videoUrl: string) {
  const url = new URL(videoUrl)
  const videoId = url.hostname === 'youtu.be'
    ? url.pathname.slice(1)
    : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)
      ? url.searchParams.get('v')
      : null

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
    throw new Error(`Unsupported YouTube video URL: ${videoUrl}`)
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const auth = useSelector((state: RootState) => state.auth)

  return (
    <BrowserRouter>
      <div className={darkMode ? 'dark min-h-screen bg-slate-950 text-white' : 'min-h-screen bg-slate-50 text-slate-900'}>
        <div className={darkMode ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-white text-slate-900'}>
          <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} user={auth.user} />
        </div>
      </div>
    </BrowserRouter>
  )
}

function AppLayout({ darkMode, setDarkMode, user }: { darkMode: boolean; setDarkMode: (value: boolean) => void; user: RootState['auth']['user'] }) {
  const dispatch = useDispatch()
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      isActive ? 'bg-blue-600 text-white shadow-md' : darkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <>
      <header className={darkMode ? 'border-b border-slate-800 bg-slate-900/80 backdrop-blur' : 'border-b border-slate-200 bg-white/80 backdrop-blur'}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 font-black text-white shadow-lg shadow-blue-500/30">
              İ
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">İsmet Cahangirov</p>
              <p className={darkMode ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>Academy</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navClass}>Ana səhifə</NavLink>
            <NavLink to="/courses" className={navClass}>Dərslər</NavLink>
            <NavLink to="/about" className={navClass}>Haqqımızda</NavLink>
            <NavLink to="/contact" className={navClass}>Əlaqə</NavLink>
            {user?.role === 'admin' && <NavLink to="/dashboard" className={navClass}>Dashboard</NavLink>}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${darkMode ? 'border-slate-700 bg-slate-800 text-yellow-300' : 'border-slate-200 bg-slate-100 text-slate-700'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-600"
              >
                <LogOut size={16} /> Çıxış
              </button>
            ) : (
              <NavLink to="/login" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
                <LogIn size={16} /> Giriş
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="/courses" element={<CoursesPage darkMode={darkMode} />} />
          <Route path="/courses/:courseId" element={<CourseLessonPage darkMode={darkMode} />} />
          <Route path="/courses/:courseId/lessons/:lessonIndex" element={<CourseLessonPage darkMode={darkMode} />} />
          <Route path="/ders/:id" element={<LessonTopicPage darkMode={darkMode} />} />
          <Route path="/about" element={<AboutPage darkMode={darkMode} />} />
          <Route path="/contact" element={<ContactPage darkMode={darkMode} />} />
          <Route path="/login" element={<LoginPage darkMode={darkMode} />} />
          <Route path="/register" element={<RegisterPage darkMode={darkMode} />} />
          <Route path="/dashboard" element={user?.role === 'admin' ? <DashboardPage darkMode={darkMode} /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}

function HomePage({ darkMode }: { darkMode: boolean }) {
  const { data: courseData } = useGetCoursesQuery(undefined)
  const list = courseData ?? courses

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-500/20 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium text-blue-50">
            Frontend + Backend Learning Platform
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">İsmet Cahangirov</h1>
            <p className="max-w-xl text-base text-blue-50 md:text-lg">
              HTML, CSS, JavaScript, React, TypeScript və backend təcrübəsi ilə real dünya layihələrə hazırlanan interaktiv öyrənmə platforması.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/courses" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-slate-100">
              Dərslərə başla <ArrowRight size={18} />
            </a>
            <a href="/register" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-transparent px-5 py-3 font-semibold text-white transition hover:bg-white/10">
              <UserPlus size={18} /> Qeydiyyat
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/20 bg-slate-900/20 p-6 backdrop-blur-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-500">Kurslar</p>
            <h2 className="mt-2 text-3xl font-extrabold">Öyrənməyə hazır dərslər</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((course: Course) => (
            <article key={course.id} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50'}>
              <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${course.color}`} />
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{course.level}</span>
                <span className="text-sm font-medium text-blue-500">{course.duration}</span>
              </div>
              <h3 className="text-2xl font-bold">{course.title}</h3>
              <p className={darkMode ? 'mt-3 text-sm text-slate-300' : 'mt-3 text-sm text-slate-600'}>{course.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{course.category}</span>
                <span>{course.progress}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full rounded-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-slate-500">{course.lessons.length} lesson</span>
                <NavLink to="/courses" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Bax <ArrowRight size={14} />
                </NavLink>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function CoursesPage({ darkMode }: { darkMode: boolean }) {
  const { data } = useGetCoursesQuery(undefined)
  const list = data ?? courses

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BookOpen className="text-blue-500" size={28} />
        <h1 className="text-3xl font-black">Dərslər siyahısı</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {list.map((course: Course) => (
          <article key={course.id} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50'}>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">{course.category}</span>
              <span className="text-sm font-medium text-slate-500">{course.duration}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold">{course.title}</h2>
            <p className={darkMode ? 'mt-3 text-slate-300' : 'mt-3 text-slate-600'}>{course.description}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(lessonCatalog.courses.find((item) => item.id === course.id)?.topics ?? []).map((topic) => (
                <NavLink
                  key={topic.id}
                  to={`/ders/${topic.id}`}
                  className={darkMode
                    ? 'group flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 px-3 py-2 text-sm hover:border-blue-500 hover:bg-slate-800'
                    : 'group flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:border-blue-400 hover:bg-blue-50'}
                >
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                  <span className="flex-1">{topic.title}</span>
                  <ArrowRight size={14} className="shrink-0 text-slate-400 group-hover:text-blue-500" />
                </NavLink>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function LessonTopicPage({ darkMode }: { darkMode: boolean }) {
  const { id } = useParams()
  const entry = lessonCatalog.courses
    .flatMap((course) => course.topics.map((topic) => ({ course, topic })))
    .find((item) => item.topic.id === id)

  if (!entry) return <Navigate to="/courses" replace />

  return <LessonWorkspace key={entry.topic.id} darkMode={darkMode} course={entry.course} topic={entry.topic} />
}

function LessonWorkspace({ darkMode, course, topic }: { darkMode: boolean; course: LessonCatalogCourse; topic: LessonTopic }) {
  const [activeTab, setActiveTab] = useState<'lecture' | 'editor' | 'task'>('lecture')
  const [code, setCode] = useState<Record<EditorFile, string>>({ ...course.starterCode })
  const [activeFile, setActiveFile] = useState<EditorFile>('html')
  const [preview, setPreview] = useState('')
  const [checkResult, setCheckResult] = useState<{ results: boolean[]; passed: boolean } | null>(null)
  const files = Object.keys(code) as EditorFile[]

  const runCode = () => {
    const safeStyles = code.css.replace(/<\/style/gi, '<\\/style')
    const safeScript = code.javascript.replace(/<\/script/gi, '<\\/script')
    setPreview(`<!doctype html><html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${safeStyles}</style></head><body>${code.html}<script>${safeScript}</script></body></html>`)
  }

  const checkTask = () => {
    const results = topic.checks.map((check) => code[check.file as EditorFile].toLowerCase().includes(check.contains.toLowerCase()))
    setCheckResult({ results, passed: results.every(Boolean) })
  }

  const tabs: { id: 'lecture' | 'editor' | 'task'; title: string; icon: typeof BookOpen }[] = [
    { id: 'lecture', title: 'Mühazirə', icon: BookOpen },
    { id: 'editor', title: 'Kod redaktoru', icon: Code2 },
    { id: 'task', title: 'Tapşırıq', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <NavLink to="/courses" className="text-sm font-semibold text-blue-500 hover:text-blue-600">← Dərslər siyahısı</NavLink>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">{course.title}</p>
        <h1 className="mt-1 text-3xl font-black sm:text-4xl">{topic.title}</h1>
      </div>

      <div className={darkMode ? 'overflow-hidden rounded-3xl border border-slate-800 bg-slate-900' : 'overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg'}>
        <div role="tablist" aria-label={`${topic.title} dərs bölmələri`} className={darkMode ? 'grid grid-cols-3 border-b border-slate-800 bg-slate-950/40' : 'grid grid-cols-3 border-b border-slate-200 bg-slate-50'}>
          {tabs.map(({ id: tabId, title, icon: Icon }) => (
            <button
              key={tabId}
              id={`tab-${tabId}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tabId}
              aria-controls={`panel-${tabId}`}
              onClick={() => setActiveTab(tabId)}
              className={`flex min-h-14 items-center justify-center gap-2 border-b-2 px-2 py-3 text-center text-xs font-semibold transition sm:text-sm ${activeTab === tabId ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-blue-500'}`}
            >
              <Icon size={17} /> {title}
            </button>
          ))}
        </div>

        <div id="panel-lecture" role="tabpanel" aria-labelledby="tab-lecture" hidden={activeTab !== 'lecture'} className="space-y-6 p-4 sm:p-6">
          <article className={darkMode ? 'rounded-2xl bg-slate-800/70 p-4 sm:p-6' : 'rounded-2xl bg-slate-50 p-4 sm:p-6'}>
            <h2 className="text-xl font-bold">{topic.title}</h2>
            <p className={darkMode ? 'mt-3 leading-7 text-slate-300' : 'mt-3 leading-7 text-slate-700'}>{topic.lecture}</p>
          </article>
          <section>
            <h2 className="mb-3 text-lg font-bold">Video dərs</h2>
            <div className="aspect-video overflow-hidden rounded-2xl bg-black">
              <iframe
                src={getYoutubeEmbedUrl(course.videoUrl)}
                title={`${topic.title} video dərsi`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
          {topic.materialFile && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Mühazirə materialı</h2>
              <LectureViewer key={topic.materialFile} material={{ title: topic.title, fileName: topic.materialFile }} />
            </section>
          )}
        </div>

        <div id="panel-editor" role="tabpanel" aria-labelledby="tab-editor" hidden={activeTab !== 'editor'} className="space-y-4 p-3 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">VS Code tipli redaktor</h2>
              <p className="text-xs text-slate-500">HTML, CSS və JavaScript kodunu yazıb nəticəni işə sal.</p>
            </div>
            <button type="button" onClick={runCode} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
              <Play size={16} /> İşə sal
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <div className="flex overflow-x-auto bg-[#252526]">
              {files.map((file) => (
                <button
                  key={file}
                  type="button"
                  onClick={() => setActiveFile(file)}
                  className={`shrink-0 border-r border-slate-700 px-4 py-2 font-mono text-xs ${activeFile === file ? 'border-t-2 border-t-blue-400 bg-[#1e1e1e] text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  {file === 'javascript' ? 'script.js' : file === 'css' ? 'style.css' : 'index.html'}
                </button>
              ))}
            </div>
            <Editor
              height="min(52vh, 480px)"
              language={activeFile === 'javascript' ? 'javascript' : activeFile}
              theme="vs-dark"
              value={code[activeFile]}
              onChange={(value) => {
                setCode((current) => ({ ...current, [activeFile]: value ?? '' }))
                setCheckResult(null)
              }}
              options={{
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12 },
              }}
            />
          </div>
          <section className="overflow-hidden rounded-xl border border-slate-700 bg-white">
            <h3 className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Nəticə</h3>
            {preview
              ? <iframe title={`${topic.title} kod nəticəsi`} sandbox="allow-scripts" srcDoc={preview} className="h-72 w-full" />
              : <p className="p-6 text-sm text-slate-500">Nəticəni görmək üçün “İşə sal” düyməsinə bas.</p>}
          </section>
        </div>

        <div id="panel-task" role="tabpanel" aria-labelledby="tab-task" hidden={activeTab !== 'task'} className="space-y-5 p-4 sm:p-6">
          <section className={darkMode ? 'rounded-2xl border border-slate-800 bg-slate-800/70 p-5' : 'rounded-2xl border border-slate-200 bg-slate-50 p-5'}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-500">Tapşırıq</p>
            <h2 className="mt-2 text-xl font-bold">{topic.title}</h2>
            <p className={darkMode ? 'mt-3 leading-7 text-slate-300' : 'mt-3 leading-7 text-slate-700'}>{topic.task}</p>
          </section>
          <div className="space-y-3">
            <h3 className="font-semibold">Yoxlama meyarları</h3>
            {topic.checks.map((check, index) => (
              <div key={`${check.file}-${check.contains}`} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                {checkResult
                  ? <CheckCircle2 size={18} className={checkResult.results[index] ? 'mt-0.5 shrink-0 text-emerald-500' : 'mt-0.5 shrink-0 text-slate-400'} />
                  : <span className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border border-slate-400" />}
                <span className="text-sm">{check.label}</span>
              </div>
            ))}
          </div>
          {checkResult && (
            <p role="status" className={`rounded-xl p-4 text-sm font-semibold ${checkResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              {checkResult.passed ? 'Əla! Bütün yoxlama meyarları yerinə yetirildi.' : 'Bəzi meyarlar hələ tamamlanmayıb. Kodu düzəldib yenidən yoxla.'}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={checkTask} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <CheckCircle2 size={16} /> Tapşırığı yoxla
            </button>
            <button type="button" onClick={() => setActiveTab('editor')} className={darkMode ? 'rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800' : 'rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50'}>
              Kod redaktoruna keç
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CourseLessonPage({ darkMode }: { darkMode: boolean }) {
  const { courseId, lessonIndex } = useParams()
  const { data } = useGetCoursesQuery(undefined)
  const course = (data ?? courses).find((item: Course) => item.id === courseId)
  const resources = course ? courseResources[course.id] ?? { materials: [], tasks: [] } : { materials: [], tasks: [] }

  if (!course) return <Navigate to="/courses" replace />

  const selectedIndex = lessonIndex === undefined ? -1 : Number(lessonIndex)
  const selectedMaterial = Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < resources.materials.length
    ? resources.materials[selectedIndex]
    : undefined

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <NavLink to="/courses" className="text-sm font-semibold text-blue-500 hover:text-blue-600">← Bütün dərslər</NavLink>
          <h1 className="mt-3 text-3xl font-black">{course.title} dərsi</h1>
          <p className={darkMode ? 'mt-2 text-slate-300' : 'mt-2 text-slate-600'}>{course.description}</p>
        </div>
      </div>

      <section className={darkMode ? 'overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6' : 'overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6'}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Video dərs</h2>
          <a href={course.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600">
            YouTube-da aç <ExternalLink size={15} />
          </a>
        </div>
        <div className="aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            src={getYoutubeEmbedUrl(course.videoUrl)}
            title={`${course.title} video dərsi`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      <section className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg'}>
        <div className="flex items-center gap-3">
          <BookOpen className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-bold">Dərslər və mühazirələr</h2>
            <p className="text-sm text-slate-500">İstədiyiniz dərsi seçin — ardıcıllıq məcburi deyil.</p>
          </div>
        </div>
        {resources.materials.length ? (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {resources.materials.map((material, index) => (
                <NavLink
                  key={material.fileName}
                  aria-pressed={selectedMaterial?.fileName === material.fileName}
                  to={`/courses/${course.id}/lessons/${index}`}
                  className={`${darkMode ? 'border-slate-700 bg-slate-800 hover:border-blue-500' : 'border-slate-200 bg-slate-50 hover:border-blue-400'} flex items-center justify-between gap-3 rounded-2xl border p-4 text-left ${selectedMaterial?.fileName === material.fileName ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <span className="font-semibold">{material.title}</span>
                  <BookOpen size={18} className="shrink-0 text-blue-500" />
                </NavLink>
              ))}
            </div>
            {selectedMaterial && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800">
                  {selectedMaterial.title}
                </div>
                <LectureViewer key={selectedMaterial.fileName} material={selectedMaterial} />
              </div>
            )}
            {!selectedMaterial && (
              <p className={darkMode ? 'rounded-xl bg-slate-800 p-4 text-sm text-slate-300' : 'rounded-xl bg-slate-50 p-4 text-sm text-slate-600'}>
                Açmaq istədiyiniz dərsi yuxarıdakı siyahıdan seçin.
              </p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Bu kurs üçün mühazirə faylı hələ əlavə edilməyib.</p>
        )}
      </section>

      <section id="code-editor" className="overflow-hidden rounded-3xl border border-slate-700 bg-[#1e1e1e] text-slate-100 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 bg-[#252526] px-5 py-4">
          <div className="flex items-center gap-3">
            <Code2 size={21} className="text-blue-400" />
            <div>
              <h2 className="font-bold">Brauzerdə kod yaz</h2>
              <p className="text-xs text-slate-400">VS Code-a bənzər sadə HTML, CSS və JavaScript sahəsi</p>
            </div>
          </div>
        </div>
        <CodeEditor />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Praktika</p>
          <h2 className="mt-1 text-2xl font-black">Tapşırıqlar</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {resources.tasks.map((task, index) => (
            <article key={task} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-5' : 'rounded-3xl border border-slate-200 bg-white p-5 shadow-sm'}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{index + 1}</span>
              <p className="mt-3 leading-7">{task}</p>
              <a href="#code-editor" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600">
                <Code2 size={16} /> Kod sahəsində həll et
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function LectureViewer({ material }: { material: { title: string; fileName: string } }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isPdf = material.fileName.toLowerCase().endsWith('.pdf')

  useEffect(() => {
    if (isPdf) return

    let active = true
    const loadLecture = async () => {
      try {
        const response = await fetch(encodeURI(`/lectures/${material.fileName}`))
        if (!response.ok) throw new Error(`Mühazirə yüklənmədi (HTTP ${response.status}).`)

        const html = await response.text()
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        const host = contentRef.current
        if (!host) throw new Error('Mühazirə göstərilə bilmədi.')

        const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' })
        shadow.replaceChildren()

        const baseUrl = new URL(`/lectures/${material.fileName}`, window.location.origin)
        const styles = [...parsed.head.querySelectorAll('style')].map((source) => {
          const style = document.createElement('style')
          style.textContent = (source.textContent ?? '')
            .replace(/:root/g, ':host')
            .replace(/(^|[,{]\s*)(html|body)(?=[\s.#:[>+~,{])/gm, '$1:host')
          return style
        })

        const content = document.createElement('article')
        content.innerHTML = parsed.body.innerHTML
        content.querySelectorAll('script, iframe, object, embed, form').forEach((element) => element.remove())
        content.querySelectorAll('*').forEach((element) => {
          for (const attribute of [...element.attributes]) {
            if (attribute.name.toLowerCase().startsWith('on')) element.removeAttribute(attribute.name)
            if (['src', 'poster'].includes(attribute.name) && attribute.value) {
              element.setAttribute(attribute.name, new URL(attribute.value, baseUrl).href)
            }
            if (attribute.name === 'href' && /^\s*javascript:/i.test(attribute.value)) element.removeAttribute('href')
          }
        })

        shadow.append(...styles, content)
        if (active) setLoading(false)
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Mühazirə yüklənərkən xəta baş verdi.')
          setLoading(false)
        }
      }
    }

    void loadLecture()
    return () => { active = false }
  }, [isPdf, material.fileName])

  if (isPdf) {
    return (
      <iframe
        src={encodeURI(`/lectures/${material.fileName}`)}
        title={material.title}
        className="h-[70vh] min-h-[480px] w-full bg-white"
      />
    )
  }

  return (
    <div className="min-h-32">
      {loading && <p className="p-6 text-slate-600">Mühazirə yüklənir...</p>}
      {error && <p role="alert" className="p-6 text-red-600">{error}</p>}
      <div ref={contentRef} className={loading || error ? 'hidden' : 'block'} />
    </div>
  )
}

function CodeEditor() {
  const sample = {
    'index.html': '<h1>Salam, İsmet Academy!</h1>\n<p>İlk səhifəni redaktə et.</p>\n<button id="hello">Kliklə</button>\n<p id="result"></p>',
    'style.css': 'body {\n  font-family: Arial, sans-serif;\n  padding: 24px;\n  color: #1e293b;\n}\n\nbutton {\n  padding: 8px 14px;\n  cursor: pointer;\n}',
    'script.js': "document.querySelector('#hello').addEventListener('click', () => {\n  document.querySelector('#result').textContent = 'Əla! Kod işləyir.'\n})",
  }
  const [activeFile, setActiveFile] = useState<keyof typeof sample>('index.html')
  const [code, setCode] = useState(sample)
  const [preview, setPreview] = useState('')

  const runCode = () => {
    const safeScript = code['script.js'].replace(/<\/script/gi, '<\\/script')
    setPreview(`<!doctype html><html><head><meta charset="utf-8"><style>${code['style.css']}</style></head><body>${code['index.html']}<script>${safeScript}</script></body></html>`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">Kodun nəticəsi ayrıca təhlükəsiz pəncərədə göstərilir.</p>
        <div className="flex gap-2">
          <button type="button" onClick={runCode} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
            <Play size={15} /> İşə sal
          </button>
          <button type="button" onClick={() => { setCode(sample); setPreview('') }} className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700">
            <RotateCcw size={15} /> Sıfırla
          </button>
        </div>
      </div>
      <div className="grid w-full gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-700">
          <div className="flex overflow-x-auto bg-[#252526]">
            {(Object.keys(sample) as (keyof typeof sample)[]).map((file) => (
              <button key={file} type="button" onClick={() => setActiveFile(file)} className={`shrink-0 border-r border-slate-700 px-4 py-2 text-sm ${activeFile === file ? 'border-t-2 border-t-blue-400 bg-[#1e1e1e] text-white' : 'text-slate-400 hover:text-white'}`}>
                {file}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="code-input">{activeFile} kodu</label>
          <textarea
            id="code-input"
            spellCheck={false}
            value={code[activeFile]}
            onChange={(event) => setCode({ ...code, [activeFile]: event.target.value })}
            className="min-h-72 w-full resize-y bg-[#1e1e1e] p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          />
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-white">
          <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Nəticə</div>
          {preview ? (
            <iframe title="Kodun nəticəsi" sandbox="allow-scripts" srcDoc={preview} className="h-72 w-full bg-white" />
          ) : (
            <div className="flex h-72 items-center justify-center px-6 text-center text-sm text-slate-500">Nəticəni görmək üçün kodu yaz və “İşə sal” düyməsinə bas.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function AboutPage({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <h1 className="text-3xl font-black">Proyekt haqqında</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Bu layihə müəllim və tələbə üçün nəzərdə tutulmuş interaktiv öyrənmə platformasıdır. Dərslər video linkləri, kurs kartları, qeydiyyat, giriş və admin paneli ilə birlikdə təqdim edilir.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          ['React + TypeScript', 'Modern frontend arxitekturası və tipli komponentlər'],
          ['Redux Toolkit + RTK Query', 'State management və API əlaqəsi'],
          ['Express.js Back-end', 'Login, register, admin rolu və API endpointləri'],
        ].map(([title, description]) => (
          <div key={title} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg'}>
            <ShieldCheck className="mb-4 text-blue-500" size={28} />
            <h3 className="text-xl font-bold">{title}</h3>
            <p className={darkMode ? 'mt-3 text-slate-300' : 'mt-3 text-slate-600'}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPage({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <div className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-8' : 'rounded-3xl border border-slate-200 bg-white p-8 shadow-lg'}>
        <h1 className="text-3xl font-black">Əlaqə</h1>
        <p className={darkMode ? 'mt-4 text-slate-300' : 'mt-4 text-slate-600'}>
          Layihə ilə bağlı sual, təklif və əməkdaşlıq üçün bizimlə əlaqə saxlayın.
        </p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3"><Mail size={18} className="text-blue-500" /> ismet.cahangirov@example.com</div>
          <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-blue-500" /> Telegram / WhatsApp: +994 50 123 45 67</div>
        </div>
      </div>

      <div className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-8' : 'rounded-3xl border border-slate-200 bg-white p-8 shadow-lg'}>
        <h2 className="text-2xl font-bold">Dərs təklifləri</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-500">
          <li>• HTML/CSS/JS üzrə yeni dərslər</li>
          <li>• React və TypeScript praktiki tapşırıqlar</li>
          <li>• Real project-based learning</li>
          <li>• Admin panel və feedback sistemi</li>
        </ul>
      </div>
    </div>
  )
}

function LoginPage({ darkMode }: { darkMode: boolean }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({ email: 'admin@ismet.dev', password: 'admin123' })
  const [login, { isLoading }] = useLoginMutation()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await login(form).unwrap()
    dispatch(setCredentials({ token: result.token, user: result.user }))
    navigate(result.user.role === 'admin' ? '/dashboard' : '/courses')
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={submit} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl' : 'rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl'}>
        <div className="mb-6 flex items-center gap-3">
          <LogIn className="text-blue-500" size={28} />
          <h1 className="text-3xl font-black">Giriş</h1>
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none ring-0 focus:border-blue-500" type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Şifrə</label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none ring-0 focus:border-blue-500" type="password" />
          </div>
          <button disabled={isLoading} className="w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Gözləyin...' : 'Daxil ol'}
          </button>
        </div>
        <p className={darkMode ? 'mt-5 text-sm text-slate-300' : 'mt-5 text-sm text-slate-600'}>
          Hesabınız yoxdur? <a href="/register" className="font-semibold text-blue-500">Qeydiyyatdan keçin</a>
        </p>
      </form>
    </div>
  )
}

function RegisterPage({ darkMode }: { darkMode: boolean }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [register, { isLoading }] = useRegisterMutation()

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const result = await register(form).unwrap()
    dispatch(setCredentials({ token: result.token, user: result.user }))
    navigate('/courses')
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={submit} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl' : 'rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl'}>
        <div className="mb-6 flex items-center gap-3">
          <UserPlus className="text-blue-500" size={28} />
          <h1 className="text-3xl font-black">Qeydiyyat</h1>
        </div>
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Ad və soyad</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none ring-0 focus:border-blue-500" type="text" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none ring-0 focus:border-blue-500" type="email" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Şifrə</label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 outline-none ring-0 focus:border-blue-500" type="password" />
          </div>
          <button disabled={isLoading} className="w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? 'Qeydiyyat edilir...' : 'Hesab yarat'}
          </button>
        </div>
      </form>
    </div>
  )
}

function DashboardPage({ darkMode }: { darkMode: boolean }) {
  const auth = useSelector((state: RootState) => state.auth)
  const { data } = useGetDashboardQuery(undefined, { skip: !auth.token })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-500">Admin paneli</p>
          <h1 className="mt-2 text-3xl font-black">Xoş gəlmisiniz, {auth.user?.name}</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data?.stats ?? []).map((item: { label: string; value: string }) => (
          <div key={item.label} className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg'}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className={darkMode ? 'rounded-3xl border border-slate-800 bg-slate-900 p-6' : 'rounded-3xl border border-slate-200 bg-white p-6 shadow-lg'}>
        <h2 className="text-2xl font-bold">Son istifadəçilər</h2>
        <div className="mt-5 space-y-3">
          {(data?.recentUsers ?? []).map((user: { id: string; name: string; email: string; role: string }) => (
            <div key={user.id} className="flex items-center justify-between rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700">{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
