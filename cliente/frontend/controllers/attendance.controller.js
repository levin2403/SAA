import ClassSessionService from '../services/classSession.service.js'

const classSession = new ClassSessionService()
const user = JSON.parse(localStorage.getItem('user'))
const selectedClass = JSON.parse(sessionStorage.getItem('selectedClass'))
let currentSessionId = ''
let currentSessionAttendances = []
let currentSessionDate = ""

//initial validation
if(!user) window.location.replace('login.html') // return to login
if(user.rol !== 'PROFESSOR')  window.location.replace('dashboard.html') // return to dashboard
if(!selectedClass)  window.location.replace('dashboard.html') // return to dashboard

$(async ()=>{
  setInitialScreenInfo()
})

/**
 * Sets the initial screen information including today's date, class title, schedule, and hours.
 * Populates the attendance date input with today's date and displays class information.
 */
function setInitialScreenInfo() {
  // Obtener fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const localDate = today.toLocaleDateString('en-CA') // 'en-CA' da el formato: YYYY-MM-DD

  // Colocarla en el input
  $('#attendanceDate').val(localDate);

  $('#attendanceTitle').text(`${selectedClass.name} · ${selectedClass.code}`);

  $('#classScheduleInfo').text(`${selectedClass.days.join(', ')}`);
  
  $('#hours-info').text(`${selectedClass.hours}`);

  $('#classroom-info').text(`${selectedClass.classroom}`);
  
}

/**
 * Handles loading attendance data for the selected class and date.
 * Retrieves the class session from the server and loads the attendance records into the table.
 * Displays error notifications if the session is not found or if an error occurs.
 * @async
 * @throws {Error} If the session is empty or if an error occurs during retrieval
 */
async function handleAttendanceLoading(){
  try{
    const classId = selectedClass._id
    const professorId = user.id

    const strDate = document.getElementById('attendanceDate').value.replace('/', '-')
    console.log('fecha seleccionada: ', strDate)
    
    const retrivedSession = await classSession.getClassSession(classId, professorId, strDate)
    await validateIfSessionEmpty(retrivedSession)

    showNotification('Sesion obtenida con exito', 'success')

    currentSessionId = retrivedSession._id // sets the current session with the retrived session.
    currentSessionAttendances = retrivedSession.attendances // set the attendances for validation
    currentSessionDate = retrivedSession.date
    
    await loadAttendanceInTable(retrivedSession.attendances); // load the attendances.
  }
  catch(error){
    emptyStudentsContainer() //empty the container
    showNotification(error.message, 'error')
  }
}

/**
 * Validates if the retrieved session is empty or null.
 * @async
 * @param {Object|null} retrivedSession - The session object retrieved from the server
 * @throws {Error} Throws an error if the session is empty or null
 */
async function validateIfSessionEmpty(retrivedSession){
  if(!retrivedSession) throw new Error('No hay sesion el dia seleccionado');
}

/**
 * Empties the students container element, removing all student items from the DOM.
 */
function emptyStudentsContainer(){
  $('#attendanceStudents').empty()
}

/**
 * Loads attendance records into the table by creating student item elements.
 * Each student item includes their name, ID, and a checkbox indicating their attendance status.
 * @async
 * @param {Array<Object>} attendance - Array of student attendance objects with id, name, and status properties
 */
async function loadAttendanceInTable(attendance){
  const $container = $('#attendanceStudents')
  emptyStudentsContainer() //empty the container
  attendance.forEach(student => {
    const $studentItem = $('<div>', { class: 'student-item', 'data-id': student.id }).html(
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

/**
 * Retrieves all student cards from the attendance table and returns their data.
 * @returns {Array<Object>} Array of objects containing student id, name, and attendance status (PRESENT/ABSENT)
 */
function getAttendancesFromContainer() {
  const result = [];

  $('#attendanceStudents .student-item').each(function () {
    const id = $(this).data('id');
    const name = $(this).find('strong').text();
    const isChecked = $(this).find('.student-checkbox').is(':checked');
    const status = isChecked ? 'PRESENT' : 'ABSENT';

    result.push({
      id,
      name,
      status
    });
  });

  return result.length === 0 ? null : result;
}

function isStudentsContainerEmpty(){
  if ($('#attendanceStudents').children().length === 0) {
    return true
  }
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

/**
 * Starts the QR code reader by initializing the camera and Html5Qrcode scanner.
 * Shows the QR reader section and updates button text accordingly.
 * Handles camera access errors and displays appropriate error messages.
 */
function startQRReader(){
  if(isStudentsContainerEmpty()){
    showNotification('Selecciona una sesion antes de activar el lector', 'error');
    return
  }
  qrReaderActive = true
  qrSection.classList.remove('hidden')
  closeQRBtn.style.display = 'block'
  toggleQRBtn.textContent = 'Cerrar lector QR'

  const config = {
    fps: 2,
    qrbox: {width: 250, height: 250},
    rememberLastUsedCamera: true
  }

  handleStartQrReader()
}

function handleStartQrReader(){

  const config = {
    fps: 1,
    qrbox: {width: 250, height: 250},
    rememberLastUsedCamera: true
  }
  Html5Qrcode.getCameras().then(devices => {
    if(devices && devices.length){
      const cameraId = devices[0].id
      qrScanner = new Html5Qrcode("qr-reader")

      qrScanner.start(cameraId, config, onScanSuccess, onScanError).catch(
        err => {
          document.getElementById('qrStatus').textContent = 'Error: No se pudo acceder a la cámara. ' + err
        }
      )
    } else {
        document.getElementById('qrStatus').textContent = 'Error: No hay cámara disponible'
    }
  }).catch(err => {
      document.getElementById('qrStatus').textContent = 'Error: ' + err
  })
}

/**
 * Stops the QR code reader and hides the QR reader section.
 * Resets the scanner instance and updates the UI to reflect the stopped state.
 */
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

/**
 * Handles QR code scan errors (e.g., when no QR code is visible).
 * Errors are silently ignored as they occur frequently during normal scanning.
 * @param {Error} error - The error object from the QR scanner
 */
function onScanError(error){
  // Ignoramos errores de lectura (cuando no hay QR visible)
  // Se puede loguear en la consola si es necesario
}


let isProcessingQrReadding = false

/**
 * Handles successful QR code scan events.
 * Parses the QR data, validates it, and marks the corresponding student as present.
 * @param {string} decodedText - The decoded text from the QR code
 * @param {Object} decodedResult - The full decoded result object from the QR scanner
 */
function onScanSuccess(decodedText, decodedResult){
  if(!isProcessingQrReadding){
    const qrData = JSON.parse(decodedText)
    handleSuccesfullScannReading(qrData)
  }
}

async function handleSuccesfullScannReading(qrData){
  isProcessingQrReadding = true //set the state of this function as ocuppied

  //make validations
  console.log(qrData)

  //validate if the class is correct
  if(qrData.classId !== selectedClass._id){
    showFailNotification()
    return 
  }

  //validate if the student is on the list
  if(!isStudentIdInList()){
    showFailNotification()
    return 
  }

  //validate if the date is valid
  if(!isDateValid()){
    showFailNotification()
    return 
  }

  switchStudentCardStatusById(qrData.studentId)

  showNotification(`Asistencia registrada con exito`, 'success')   

  setTimeout(() => {
    isProcessingQrReadding = false // set the flag as free
  }, 2000);

  function isStudentIdInList() {
    return currentSessionAttendances.some(student => {
      return student.id === qrData.studentId
    })
  }

  function isDateValid(){
    const qrDate = new Date(qrData.timestamp)
    const date = qrDate.toLocaleDateString('en-CA').split('T')[0]
    const currentDate = currentSessionDate.split('T')[0]
    return date === currentDate
  }

  function showFailNotification(){
    showNotification(`QR invalido`, 'error')
  }
}

/**
 * Retrieves a specific student card by their ID from the attendance table.
 * @param {string} studentId - The ID of the student to retrieve
 * @returns {Object|null} Object containing student id, name, and status, or null if not found
 */
function switchStudentCardStatusById(studentId) {
  const $card = $('#attendanceStudents .student-item[data-id="' + studentId + '"]');
  if ($card.length === 0) return;

  $card.find('.student-checkbox').prop('checked', true);
}

async function handleAttendanceUpdate() {
  try{
    const updatedAttendance = getAttendancesFromContainer()
    if(!updatedAttendance){return}

    console.log(currentSessionId ,updatedAttendance)
    await classSession.updateAttendance(currentSessionId, updatedAttendance)

    showNotification(`Asistencia guardada`, 'success')
  }
  catch(error){
    showNotification(error.message, 'error')  
  }
}

/**
 * Displays a toast notification to the user.
 * Creates a notification element, adds it to the DOM, and automatically removes it after 3 seconds.
 * @param {string} message - The notification message to display
 * @param {string} type - The type of notification ('success', 'error', etc.) used for styling
 */
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
  handleAttendanceUpdate() 
})

$('#toReports').click( ()=> {
  stopQRReader()
  window.location.href='reports.html'
})

$('#selectAll').click( ()=>{
  $('#attendanceStudents .student-checkbox').get().forEach(cb => cb.checked = true)
})

$('#deselectAll').click( ()=>{
  $('#attendanceStudents .student-checkbox').get().forEach(cb => cb.checked = false)
})