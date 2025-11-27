// screens.js - funciones compartidas para las pantallas estáticas
(function(){
  window.SCREENS = {}

  // --- DATOS DE PRUEBA (MOCKS) ---
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
    { id: 1, name: 'Cálculo Diferencial', code: 'MAT-101', students: 32, schedule: 'Lun-Mié-Vie 7:00-9:00', studentsList: [
      { id: '20001', name: 'Ana Pérez' },
      { id: '20002', name: 'Luis Gómez' },
      { id: '20003', name: 'María Ruiz' },
      { id: '20004', name: 'Jorge Díaz' }
    ] },
    { id: 2, name: 'Álgebra Lineal', code: 'MAT-205', students: 28, schedule: 'Mar-Jue 9:00-11:00', studentsList: [
      { id: '20011', name: 'Pedro Morales' },
      { id: '20012', name: 'Lucía Salas' },
      { id: '20013', name: 'Raúl Ortega' }
    ] },
    { id: 3, name: 'Estadística', code: 'MAT-310', students: 25, schedule: 'Lun-Mié 14:00-16:00', studentsList: [
      { id: '20021', name: 'Sofía Castro' },
      { id: '20022', name: 'Miguel Peña' },
      { id: '20023', name: 'Carla Ríos' }
    ] },
  ]

  // --- MANEJO DE STORAGE ---
  function getStoredRecords(){ try{ return JSON.parse(localStorage.getItem('attendanceRecords')||'[]') }catch(e){return[]} }
  function persistStoredRecords(arr){ try{ localStorage.setItem('attendanceRecords', JSON.stringify(arr)) }catch(e){} }

  function saveUserToStorage(user){ localStorage.setItem('saa_currentUser', JSON.stringify(user)) }
  function getUserFromStorage(){ try{return JSON.parse(localStorage.getItem('saa_currentUser')||'null')}catch(e){return null} }
  function logout(){ localStorage.removeItem('saa_currentUser'); window.location.href='login.html' }

  // --- UTILIDADES DE FECHA ---
  
  // Convierte string "YYYY-MM-DD" a Date local (00:00:00)
  function parseLocalYMD(dateString) {
    if (!dateString) return null;
    const [y, m, d] = dateString.split('-').map(Number);
    return new Date(y, m - 1, d); 
  }

  // Devuelve "YYYY-MM-DD" basado en hora local
  function formatDateForInput(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // --- LÓGICA DE NEGOCIO ---

  // Filtra registros comparando timestamps para precisión exacta
  function getAttendanceRecordsByDateRange(startDateStr, endDateStr, classId=null){
    const recs = getStoredRecords()
    
    // Convertimos los inputs a fechas locales (inicio y fin del día)
    const start = parseLocalYMD(startDateStr);
    const end = parseLocalYMD(endDateStr);
    
    // Ajustar el final del día para incluir registros de ese día completo
    if(end) end.setHours(23, 59, 59, 999);

    return recs.filter(r => {
      const rDate = new Date(r.date); // Fecha del registro
      
      // Normalizamos la fecha del registro para comparar solo la fecha calendario si es necesario,
      // pero aquí comparamos timestamps completos.
      const recordTime = rDate.getTime();
      
      let inRange = true;
      if (start && recordTime < start.getTime()) inRange = false;
      if (end && recordTime > end.getTime()) inRange = false;

      // Filtro opcional por ID de clase (asegurando tipos iguales)
      const matchClass = classId ? (String(r.classId) === String(classId)) : true;

      return inRange && matchClass;
    })
  }

  // --- EXPORTACIÓN ---

  function exportCSV(rows, filename='reportes.csv'){
    // Convertir array de arrays a string CSV
    const csvContent = rows.map(r => 
      r.map(c => {
        // Manejar valores nulos y escapar comillas dobles
        const val = c === null || c === undefined ? '' : String(c);
        return `"${val.replace(/"/g, '""')}"`; 
      }).join(',')
    ).join('\n');

    // Agregar BOM (\uFEFF) para que Excel reconozca caracteres latinos (tildes, ñ)
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Crear link de descarga y clickearlo
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url; 
    a.download = filename; 
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click(); 
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- QR HELPERS ---
  function generateQRData(studentId, studentName, classId, classCode){
    return JSON.stringify({
      type: 'attendance_qr',
      studentId: studentId,
      studentName: studentName,
      classId: classId,
      classCode: classCode,
      timestamp: new Date().toISOString()
    })
  }

  function parseQRData(qrText){
    try {
      const data = JSON.parse(qrText)
      return (data.type === 'attendance_qr') ? data : null
    } catch(e) {
      return null
    }
  }

  // --- EXPONER A WINDOW ---
  window.SCREENS.users = users
  window.SCREENS.studentClasses = studentClasses
  window.SCREENS.teacherClasses = teacherClasses
  window.SCREENS.getStoredRecords = getStoredRecords
  window.SCREENS.persistStoredRecords = persistStoredRecords
  window.SCREENS.exportCSV = exportCSV
  window.SCREENS.saveUserToStorage = saveUserToStorage
  window.SCREENS.getUserFromStorage = getUserFromStorage
  window.SCREENS.logout = logout
  window.SCREENS.getAttendanceRecordsByDateRange = getAttendanceRecordsByDateRange
  window.SCREENS.formatDateForInput = formatDateForInput
  window.SCREENS.parseLocalYMD = parseLocalYMD
  window.SCREENS.generateQRData = generateQRData
  window.SCREENS.parseQRData = parseQRData

})()