import React, { useState, useEffect } from 'react'
import { Calendar, BookOpen, Users, ClipboardList, LogOut, Bell } from 'lucide-react'

const AttendanceSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('') // 'student' or 'teacher'
  const [loginData, setLoginData] = useState({ id: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [notice, setNotice] = useState('')

  // Datos de ejemplo (demo solamente)
  const users = {
    '1234567890': { password: 'alumno123', type: 'student', name: 'Ana García' },
    '0987654321': { password: 'maestro123', type: 'teacher', name: 'Prof. Carlos Méndez' }
  }

  const studentClasses = [
    { id: 1, name: 'Matemáticas Avanzadas', code: 'MAT-301', teacher: 'Dr. Roberto Silva', schedule: 'Lun-Mié 8:00-10:00', color: 'from-blue-400 to-blue-600' },
    { id: 2, name: 'Programación Web', code: 'CS-201', teacher: 'Ing. Laura Torres', schedule: 'Mar-Jue 10:00-12:00', color: 'from-purple-400 to-purple-600' },
    { id: 3, name: 'Base de Datos', code: 'CS-305', teacher: 'M.C. Pedro Ramírez', schedule: 'Vie 14:00-18:00', color: 'from-pink-400 to-pink-600' },
  ]

  const teacherClasses = [
    { id: 1, name: 'Cálculo Diferencial', code: 'MAT-101', students: 32, schedule: 'Lun-Mié-Vie 7:00-9:00', color: 'from-blue-400 to-blue-600', studentsList: ['Ana Pérez','Luis Gómez','María Ruiz','Jorge Díaz'] },
    { id: 2, name: 'Álgebra Lineal', code: 'MAT-205', students: 28, schedule: 'Mar-Jue 9:00-11:00', color: 'from-indigo-400 to-indigo-600', studentsList: ['Pedro Morales','Lucía Salas','Raúl Ortega'] },
    { id: 3, name: 'Estadística', code: 'MAT-310', students: 25, schedule: 'Lun-Mié 14:00-16:00', color: 'from-purple-400 to-purple-600', studentsList: ['Sofía Castro','Miguel Peña','Carla Ríos'] },
  ];

  // state for simple client-side navigation
  const [view, setView] = useState('dashboard') // 'dashboard' | 'attendance' | 'reports'
  const [attendanceRecords, setAttendanceRecords] = useState([])

  useEffect(() => {
    // load persisted attendance records from localStorage (demo)
    try {
      const raw = localStorage.getItem('attendanceRecords')
      if (raw) setAttendanceRecords(JSON.parse(raw))
    } catch (e) { /* ignore */ }
  }, [])

  const persistRecords = (recs) => {
    setAttendanceRecords(recs)
    try { localStorage.setItem('attendanceRecords', JSON.stringify(recs)) } catch(e){}
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')

    if (loginData.id.length !== 10) {
      setLoginError('El ID debe tener 10 dígitos')
      return
    }

    const user = users[loginData.id]
    if (!user || user.password !== loginData.password) {
      setLoginError('Credenciales incorrectas. Verifica tu ID y contraseña.')
      return
    }

    setUserType(user.type)
    setIsLoggedIn(true)
    setNotice('')
  }

  const handleClassClick = (classItem) => {
    if (userType === 'student') {
        setSelectedClass(classItem);
        setShowQR(true);
      } else {
        // Para maestros, abrir la vista de toma de lista para la clase seleccionada
        setSelectedClass(classItem);
        setView('attendance');
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserType('')
    setLoginData({ id: '', password: '' })
    setShowQR(false)
    setSelectedClass(null)
  }

  // Pantalla de Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">AttendanceHub</h1>
            </div>
            <p className="text-gray-500">Sistema de Control de Asistencias</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Usuario
              </label>
              <input
                type="text"
                maxLength="10"
                value={loginData.id}
                onChange={(e) => setLoginData({ ...loginData, id: e.target.value.replace(/\D/g, '') })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Ingresa tu ID (10 dígitos)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-gray-600 text-center mb-2">Usuarios de prueba:</p>
            <p className="text-xs text-gray-700"><strong>Alumno:</strong> 1234567890 / alumno123</p>
            <p className="text-xs text-gray-700"><strong>Maestro:</strong> 0987654321 / maestro123</p>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard Principal (render general + modal overlay)
  const classes = userType === 'student' ? studentClasses : teacherClasses
  const userName = users[loginData.id] ? users[loginData.id].name : 'Usuario'
  // Helpers for attendance and reports (client-side demo)
  const saveAttendance = (classId, className, dateStr, records) => {
    const rec = { id: Date.now(), classId, className, date: dateStr, records }
    const next = [rec, ...attendanceRecords]
    persistRecords(next)
    setNotice('Asistencia guardada')
  }

  const exportCSV = (items) => {
    const rows = [ ['Fecha','Clase','Presente','Total'] ]
    items.forEach(r => {
      const present = r.records.filter(x=>x.present).length
      rows.push([r.date, r.className, String(present), String(r.records.length)])
    })
    const csv = rows.map(r=>r.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'reportes_asistencia.csv'; a.click(); URL.revokeObjectURL(url)
  }

  const AttendancePage = ({ initialClass }) => {
    const cls = initialClass || classes[0]
    const [selected, setSelected] = useState(cls)
    const [studentsState, setStudentsState] = useState(() => (selected.studentsList || []).map(s=>({name:s,present:true})))

    useEffect(()=>{
      setStudentsState((selected.studentsList||[]).map(s=>({name:s,present:true})))
    },[selected])

    const toggle = (i) => {
      const next = [...studentsState]
      next[i].present = !next[i].present
      setStudentsState(next)
    }

    const onSave = () => {
      const dateStr = new Date().toLocaleString()
      saveAttendance(selected.id, selected.name, dateStr, studentsState)
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Toma de lista</h3>
          <div>
            <select value={selected.id} onChange={(e)=>{
              const id = Number(e.target.value)
              const c = classes.find(x=>x.id===id)
              setSelected(c)
            }} className="p-2 rounded-md border">
              {classes.map(c=> <option key={c.id} value={c.id}>{c.name} — {c.code}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <ul className="space-y-3">
            {studentsState.map((s,i)=> (
              <li key={i} className="flex items-center justify-between">
                <span>{s.name}</span>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={s.present} onChange={()=>toggle(i)} />
                  <span className="text-sm text-gray-600">Presente</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button onClick={onSave} className="btn">Guardar asistencia</button>
            <button onClick={()=>setView('dashboard')} className="btn outline ml-2">Volver</button>
          </div>
        </div>
      </div>
    )
  }

  const ReportsPage = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Reportes de Asistencia</h3>
        <div>
          <button onClick={()=>exportCSV(attendanceRecords)} className="btn">Exportar CSV</button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-600"><th>Fecha</th><th>Clase</th><th>Presente</th><th>Total</th></tr></thead>
          <tbody>
            {attendanceRecords.map(r=> (
              <tr key={r.id}><td className="py-2">{r.date}</td><td>{r.className}</td><td>{r.records.filter(x=>x.present).length}</td><td>{r.records.length}</td></tr>
            ))}
            {attendanceRecords.length===0 && <tr><td colSpan={4} className="py-4 text-gray-500">No hay registros</td></tr>}
          </tbody>
        </table>
        <div className="mt-4"><button onClick={()=>setView('dashboard')} className="btn outline">Volver</button></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">AttendanceHub</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          {userType === 'teacher' && (
            <>
              <button onClick={() => setView('attendance')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                <Users className="w-5 h-5" />
                <span>Toma de Lista</span>
              </button>
              <button onClick={() => setView('reports')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50">
                <Calendar className="w-5 h-5" />
                <span>Reportes</span>
              </button>
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <div className="ml-64 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido, {userName}!</h2>
            <p className="text-gray-500">{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold">{userName.charAt(0)}</div>
          </div>
        </div>

        <div>
          {view === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">{userType === 'student' ? 'Mis Clases' : 'Clases que Imparto'}</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium">Ver todas →</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <div key={classItem.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden group">
                    <div className={`h-32 bg-gradient-to-br ${classItem.color} p-6 flex flex-col justify-between`}>
                      <div className="flex justify-between items-start">
                        <span className="text-white text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-lg">{classItem.code}</span>
                        <BookOpen className="w-6 h-6 text-white opacity-80" />
                      </div>
                      <h4 className="text-white font-bold text-lg">{classItem.name}</h4>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{classItem.schedule}</span>
                        </div>
                        {userType === 'student' ? (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{classItem.teacher}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{classItem.students} estudiantes</span>
                          </div>
                        )}
                      </div>

                      <button onClick={() => { setSelectedClass(classItem); if(userType==='student') { setShowQR(true) } else { setView('attendance') }} } className="mt-4 w-full py-2 bg-gray-50 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white rounded-xl font-medium text-gray-700 transition">
                        {userType === 'student' ? 'Ver Código QR' : 'Tomar Lista'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'attendance' && <AttendancePage initialClass={selectedClass} />}
          {view === 'reports' && <ReportsPage />}
        </div>

        {notice && <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">{notice}</div>}
      </div>

      {/* Modal QR */}
      {showQR && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Código QR de Asistencia</h2>
            <p className="text-gray-500 text-center mb-6">{selectedClass.name}</p>

            <div className="bg-white p-6 rounded-2xl border-4 border-gray-100 mb-6">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white rounded-lg shadow-inner flex items-center justify-center mx-auto mb-4">
                    <div className="text-xs text-gray-400">QR generado para<br/>{selectedClass.code}</div>
                  </div>
                  <p className="text-sm text-gray-600">Muestra este código al maestro</p>
                </div>
              </div>
            </div>

            <button onClick={() => setShowQR(false)} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AttendanceSystem
