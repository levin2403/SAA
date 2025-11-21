const user = window.SCREENS.getUserFromStorage()
    if(!user || user.type !== 'teacher') window.location.href='login.html'

    const params = new URLSearchParams(location.search)
    const classId = Number(params.get('classId') || '')
    const classes = window.SCREENS.teacherClasses
    const cls = classes.find(x=>x.id===classId) || classes[0]

    // Set initial date
    const today = new Date()
    document.getElementById('attendanceDate').value = window.SCREENS.formatDateForInput(today)

    document.getElementById('attendanceTitle').textContent = `Toma de lista — ${cls.name} - ${cls.code}`
    document.getElementById('classScheduleInfo').textContent = cls.schedule

    let qrReaderActive = false
    let qrScanner = null

    function render(){
      const container = document.getElementById('attendanceStudents')
      container.innerHTML = (cls.studentsList||[]).map((s,i)=>`
        <div class="student-item">
          <div>
            <strong>${s.name || s}</strong>
            <div style="color:#6b7280;font-size:12px">ID: ${s.id || '200'+(i+1)}</div>
          </div>
          <label>
            <input type="checkbox" data-idx="${i}" data-student-id="${s.id || '200'+(i+1)}" class="student-checkbox" checked /> 
            Presente
          </label>
        </div>
      `).join('')
    }
    render()

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
        showNotification('✗ Código QR inválido', 'error')
        return
      }
      
      const checkbox = document.querySelector(`.student-checkbox[data-student-id="${qrData.studentId}"]`)
      
      if(!checkbox){
        showNotification(`✗ Estudiante no encontrado: ${qrData.studentName}`, 'error')
        return
      }
      
      if(checkbox.checked){
        showNotification(`⚠ ${qrData.studentName} ya marcado`, 'info')
        return
      }
      
      checkbox.checked = true
      showNotification(`✓ Asistencia tomada: ${qrData.studentName}`, 'success')
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

    function onScanError(error){
      // Ignoramos errores de lectura (cuando no hay QR visible)
      // Se puede loguear en la consola si es necesario
    }

    document.getElementById('saveAttendance').addEventListener('click', ()=>{
      const checkboxes = Array.from(document.querySelectorAll('#attendanceStudents input[type=checkbox]'))
      const date = document.getElementById('attendanceDate').value
      const records = checkboxes.map((cb,i)=>({ student: cls.studentsList[i], present: !!cb.checked }))
      const rec = { id: Date.now(), classId: cls.id, className: cls.name, date: new Date(date).toLocaleString(), records }
      const arr = window.SCREENS.getStoredRecords(); arr.unshift(rec); window.SCREENS.persistStoredRecords(arr)
      
      stopQRReader()
      alert('Asistencia guardada')
      window.location.href = 'attendance.html?classId=' + classId
    })

    document.getElementById('toReports').addEventListener('click', ()=> {
      stopQRReader()
      window.location.href='reports.html'
    })

    document.getElementById('selectAll').addEventListener('click', ()=>{
      document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = true)
    })

    document.getElementById('deselectAll').addEventListener('click', ()=>{
      document.querySelectorAll('.student-checkbox').forEach(cb => cb.checked = false)
    })