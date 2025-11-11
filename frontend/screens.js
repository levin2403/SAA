// screens.js - funciones compartidas para las pantallas estáticas
(function(){
  window.SCREENS = {}

  const users = {
    '1234567890': { password: 'alumno123', type: 'student', name: 'Ana García' },
    '0987654321': { password: 'maestro123', type: 'teacher', name: 'Prof. Carlos Méndez' }
  }

  const studentClasses = [
    { id: 1, name: 'Matemáticas Avanzadas', code: 'MAT-301', teacher: 'Dr. Roberto Silva', schedule: 'Lun-Mié 8:00-10:00' },
    { id: 2, name: 'Programación Web', code: 'CS-201', teacher: 'Ing. Laura Torres', schedule: 'Mar-Jue 10:00-12:00' },
    { id: 3, name: 'Base de Datos', code: 'CS-305', teacher: 'M.C. Pedro Ramírez', schedule: 'Vie 14:00-18:00' },
  ]

  const teacherClasses = [
    { id: 1, name: 'Cálculo Diferencial', code: 'MAT-101', students: 32, schedule: 'Lun-Mié-Vie 7:00-9:00', studentsList: ['Ana Pérez','Luis Gómez','María Ruiz','Jorge Díaz'] },
    { id: 2, name: 'Álgebra Lineal', code: 'MAT-205', students: 28, schedule: 'Mar-Jue 9:00-11:00', studentsList: ['Pedro Morales','Lucía Salas','Raúl Ortega'] },
    { id: 3, name: 'Estadística', code: 'MAT-310', students: 25, schedule: 'Lun-Mié 14:00-16:00', studentsList: ['Sofía Castro','Miguel Peña','Carla Ríos'] },
  ]

  function getStoredRecords(){ try{ return JSON.parse(localStorage.getItem('attendanceRecords')||'[]') }catch(e){return[]} }
  function persistStoredRecords(arr){ try{ localStorage.setItem('attendanceRecords', JSON.stringify(arr)) }catch(e){} }

  function exportCSV(rows, filename='reportes.csv'){
    const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
  }

  function saveUserToStorage(user){ localStorage.setItem('saa_currentUser', JSON.stringify(user)) }
  function getUserFromStorage(){ try{return JSON.parse(localStorage.getItem('saa_currentUser')||'null')}catch(e){return null} }
  function logout(){ localStorage.removeItem('saa_currentUser'); window.location.href='login.html' }

  // Exponer
  window.SCREENS.users = users
  window.SCREENS.studentClasses = studentClasses
  window.SCREENS.teacherClasses = teacherClasses
  window.SCREENS.getStoredRecords = getStoredRecords
  window.SCREENS.persistStoredRecords = persistStoredRecords
  window.SCREENS.exportCSV = exportCSV
  window.SCREENS.saveUserToStorage = saveUserToStorage
  window.SCREENS.getUserFromStorage = getUserFromStorage
  window.SCREENS.logout = logout

})()
