import ClassSessionService from '../services/classSession.service.js'

const classSession = new ClassSessionService()
const user = JSON.parse(localStorage.getItem('user'))
const selectedClass = JSON.parse(sessionStorage.getItem('selectedClass'))

//initial validation
if(!user) window.location.replace('login.html') // return to login
if(user.rol !== 'PROFESSOR')  window.location.replace('dashboard.html') // return to dashboard
if(!selectedClass)  window.location.replace('dashboard.html') // return to dashboard

$(async ()=>{
  setInitialScreenInfo()
})

function setInitialScreenInfo() {
  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Colocarla en el input
  $('#attendanceDate').val(today);

  $('#attendanceTitle').text(`Toma de lista: ${selectedClass.name} ${selectedClass.code}`);

  $('#classScheduleInfo').text(`${selectedClass.days.join(', ')}`);
  
  $('#hours-info').text(`${selectedClass.hours}`);
}

async function handleAttendanceLoading(){
  try{
    const classId = selectedClass._id
    const professorId = user.id

    const selectedDate = new Date($('#attendanceDate').val())
    const formatedDate = selectedDate.toISOString();
    
    const retrivedSession = await classSession.getClassSession(classId, professorId, formatedDate)
    await loadAttendanceInTable(retrivedSession.attendances); // load the attendances
  }
  catch(error){
    showNotification(error.message, 'error')
  }
}

async function loadAttendanceInTable(attendance){
const $container = $('#attendanceStudents')

attendance.forEach(student => {
  const $studentItem = $('<div>', {class: 'student-item'}).html(
    `
    <div>
      <strong>${student.name}</strong>
      <div style="color:#6b7280;font-size:12px">ID: ${student.id}</div>
    </div>
    <label>
      <input type="checkbox"  class="student-checkbox" ${student.status === 'ABSENT' ? '' : 'checked'}/> 
      Presente
    </label>
    `
  )
  $container.append($studentItem)
  })
}

let qrReaderActive = false
let qrScanner = null

// QR Reader Toggle
const toggleQRBtn = document.getElementById('toggleQR')
const qrSection = document.getElementById('qrSection')
const closeQRBtn = document.getElementById('closeQRReader')

toggleQRBtn.addEventListener('click', ()=>{
  if(!qrReaderActive){
    startQRReader()
  } else {
    stopQRReader()
  }
})

closeQRBtn.addEventListener('click', ()=>{
  stopQRReader()
})

function startQRReader(){
  qrReaderActive = true
  qrSection.classList.remove('hidden')
  closeQRBtn.style.display = 'block'
  toggleQRBtn.textContent = 'Cerrar lector QR'

  const config = {
    fps: 10,
    qrbox: {width: 250, height: 250},
    rememberLastUsedCamera: true
  }

  Html5Qrcode.getCameras().then(devices => {
    if(devices && devices.length){
      const cameraId = devices[0].id
      qrScanner = new Html5Qrcode("qr-reader")

      qrScanner.start(cameraId, config, onScanSuccess, onScanError).catch(err => {
        document.getElementById('qrStatus').textContent = 'Error: No se pudo acceder a la cámara. ' + err
      })
    } else {
        document.getElementById('qrStatus').textContent = 'Error: No hay cámara disponible'
    }
  }).catch(err => {
      document.getElementById('qrStatus').textContent = 'Error: ' + err
  })
}

function stopQRReader(){
  qrReaderActive = false
  if(qrScanner){
    qrScanner.stop().then(() => {
    qrScanner = null
    qrSection.classList.add('hidden')
    closeQRBtn.style.display = 'none'
    toggleQRBtn.textContent = 'Leer QR'
    document.getElementById('qrStatus').textContent = 'Estado: Escaneando...'
  }).catch(err => {
    console.error('Error stopping QR scanner:', err)
  })
  }
}

function onScanSuccess(decodedText, decodedResult){
  const qrData = window.SCREENS.parseQRData(decodedText)
      
  if(!qrData || qrData.type !== 'attendance_qr'){
    showNotification('Código QR inválido', 'error')
    return
  }
      
  const checkbox = document.querySelector(`.student-checkbox[data-student-id="${qrData.studentId}"]`)
      
  if(!checkbox){
    showNotification(`Estudiante no encontrado: ${qrData.studentName}`, 'error')
    return
  }
      
  if(checkbox.checked){
    showNotification(`⚠ ${qrData.studentName} ya marcado`, 'info')
    return
  }
      
  checkbox.checked = true
}

function onScanError(error){
  // Ignoramos errores de lectura (cuando no hay QR visible)
  // Se puede loguear en la consola si es necesario
}

    
function showNotification(message, type){
  const toast = document.createElement('div')
  toast.className = `notification-toast ${type}`
  toast.textContent = message
  document.body.appendChild(toast)
      
  toast.offsetHeight // Trigger reflow for animation
  toast.classList.add('show')
      
  setTimeout(()=>{
  toast.classList.remove('show')
    setTimeout(()=> toast.remove(), 300)
  }, 3000)
}

$('#search-attendance').click( async ()=>{
  await handleAttendanceLoading()
})

$('#saveAttendance').click( ()=>{
    
    showNotification(`Asistencia guardada`, 'success')
})

$('#toReports').click( ()=> {
  stopQRReader()
  window.location.href='reports.html'
})

$('#selectAll').click( ()=>{
  $('.student-checkbox').forEach(cb => cb.checked = true)
})

$('#deselectAll').click( ()=>{
  $('.student-checkbox').forEach(cb => cb.checked = false)
})