// app.js - lógica mínima para prototipo estático (login demo, roles, QR modal)
(function(){
  const users = {
    '1234567890': { password: 'alumno123', type: 'student', name: 'Ana García' },
    '0987654321': { password: 'maestro123', type: 'teacher', name: 'Prof. Carlos Méndez' }
  }

  const studentClasses = [
    { id: 1, name: 'Matemáticas Avanzadas', code: 'MAT-301', teacher: 'Dr. Roberto Silva', schedule: 'Lun-Mié 8:00-10:00', color: '' },
    { id: 2, name: 'Programación Web', code: 'CS-201', teacher: 'Ing. Laura Torres', schedule: 'Mar-Jue 10:00-12:00', color: '' },
    { id: 3, name: 'Base de Datos', code: 'CS-305', teacher: 'M.C. Pedro Ramírez', schedule: 'Vie 14:00-18:00', color: '' },
  ]

  const teacherClasses = [
    { id: 1, name: 'Cálculo Diferencial', code: 'MAT-101', students: 32, schedule: 'Lun-Mié-Vie 7:00-9:00', color: '', studentsList: ['Ana Pérez','Luis Gómez','María Ruiz','Jorge Díaz'] },
    { id: 2, name: 'Álgebra Lineal', code: 'MAT-205', students: 28, schedule: 'Mar-Jue 9:00-11:00', color: '', studentsList: ['Pedro Morales','Lucía Salas','Raúl Ortega'] },
    { id: 3, name: 'Estadística', code: 'MAT-310', students: 25, schedule: 'Lun-Mié 14:00-16:00', color: '', studentsList: ['Sofía Castro','Miguel Peña','Carla Ríos'] },
  ]

  // Elements
  const loginScreen = document.getElementById('loginScreen')
  const loginForm = document.getElementById('loginForm')
  const loginId = document.getElementById('loginId')
  const loginPass = document.getElementById('loginPass')
  const loginError = document.getElementById('loginError')
  const sidebar = document.getElementById('sidebar')
  const qrModal = document.getElementById('qrModal')
  const qrTitle = document.getElementById('qrTitle')
  const qrBody = document.getElementById('qrBody')
  const closeQr = document.getElementById('closeQr')

  let currentUser = null

  function showLoginError(msg){
    loginError.textContent = msg
    loginError.style.display = msg ? 'block' : 'none'
  }

  loginForm.addEventListener('submit', function(e){
    e.preventDefault()
    showLoginError('')
    const id = (loginId.value || '').trim().replace(/\D/g, '')
    const pass = loginPass.value || ''
    if(id.length !== 10){ showLoginError('El ID debe tener 10 dígitos'); return }
    const user = users[id]
    if(!user || user.password !== pass){ showLoginError('Credenciales incorrectas'); return }
    currentUser = { id, ...user }
    mountDashboard()
  })

  function mountDashboard(){
    // esconder login
    loginScreen.style.display = 'none'
    // mostrar elementos de la app (sidebar is already in DOM)
    document.body.classList.add('logged')
    // actualizar profile info
    const avatar = document.querySelector('.profile-card .avatar')
    const profileName = document.querySelector('.profile-card h3')
    const profileRole = document.querySelector('.profile-card small')
    if(avatar) avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4f46e5&color=fff&size=80`
    if(profileName) profileName.textContent = currentUser.name
    if(profileRole) profileRole.textContent = currentUser.type === 'student' ? 'Estudiante' : 'Profesor'

    // render classes
    const grid = document.querySelector('.grid.grid-cols-1') || document.querySelector('.cards')
  const container = document.createElement('div')
  container.className = 'dynamic-cards'
    const classes = currentUser.type === 'student' ? studentClasses : teacherClasses
    classes.forEach(c => {
      const card = document.createElement('div')
      card.className = 'card'
      card.innerHTML = `
        <div class="gradient" style="padding:18px;min-height:120px;display:flex;flex-direction:column;justify-content:space-between">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <span style="background:rgba(255,255,255,0.12);color:#fff;padding:6px 10px;border-radius:8px;font-weight:600">${c.code}</span>
          </div>
          <h4 style="color:#fff;font-weight:700;margin-top:8px">${c.name}</h4>
        </div>
        <div style="padding:16px">
          <div style="margin-bottom:8px;color:#6b7280">${c.schedule}</div>
          <div style="margin-bottom:12px;color:#6b7280">${currentUser.type === 'student' ? (c.teacher || '') : (c.students + ' estudiantes')}</div>
          <button class="action-btn">${currentUser.type === 'student' ? 'Ver Código QR' : 'Tomar Lista'}</button>
        </div>
      `
      // button handler
      card.querySelector('.action-btn').addEventListener('click', function(){
        if(currentUser.type === 'student'){
          openQr(c)
        } else {
          showAttendancePage(c)
        }
      })
      container.appendChild(card)
    })

    // replace existing cards section if present
    const cardsSection = document.querySelector('section.cards')
    if(cardsSection && cardsSection.parentNode){
      cardsSection.parentNode.replaceChild(container, cardsSection)
    } else {
      // append to main
      const main = document.querySelector('main.main')
      if(main) main.appendChild(container)
    }

    // show/hide teacher specific nav
    const teacherButtons = Array.from(document.querySelectorAll('.sidebar .teacher-only'))
    teacherButtons.forEach(btn => btn.style.display = currentUser.type === 'teacher' ? 'block' : 'none')

  // attach nav handlers
  const navToma = document.getElementById('nav-toma')
  const navReportes = document.getElementById('nav-reportes')
  if(navToma) navToma.onclick = () => showAttendancePage()
  if(navReportes) navReportes.onclick = () => showReportsPage()

    // show sidebar/profile etc
    document.getElementById('sidebar').style.display = 'block'
  }

  // Attendance and Reports (static app)
  function getStoredRecords(){
    try{ return JSON.parse(localStorage.getItem('attendanceRecords')||'[]') }catch(e){return[]}
  }

  function persistStoredRecords(arr){
    try{ localStorage.setItem('attendanceRecords', JSON.stringify(arr)) }catch(e){}
  }

  function showAttendancePage(initialClass){
    const main = document.querySelector('main.main')
    if(!main) return
    // create container
    const container = document.createElement('div')
    container.className = 'attendance-page'
    const classes = teacherClasses
    const sel = initialClass || classes[0]
    // select options
    const selectHtml = `<select id="attendance-class-select">${classes.map(c=>`<option value="${c.id}">${c.name} — ${c.code}</option>`).join('')}</select>`
    container.innerHTML = `
      <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3>Toma de lista</h3>
        ${selectHtml}
      </div>
      <div id="attendance-students" class="bg-white p-4 rounded-xl shadow"></div>
      <div style="margin-top:12px"><button id="saveAttendance" class="btn">Guardar asistencia</button> <button id="backDashboard" class="btn outline">Volver</button></div>
    `
    // replace existing dynamic cards or append
    const existing = document.querySelector('.dynamic-cards')
    if(existing && existing.parentNode) existing.parentNode.replaceChild(container, existing)
    else main.appendChild(container)

    const classSelect = document.getElementById('attendance-class-select')
    function renderStudentsForClass(classId){
      const c = classes.find(x=>x.id==classId)
      const list = c && c.studentsList ? c.studentsList : []
      const container = document.getElementById('attendance-students')
      container.innerHTML = list.map((s,i)=>`<div style="display:flex;justify-content:space-between;padding:6px 0"><span>${s}</span><label><input type="checkbox" data-idx="${i}" checked /> Presente</label></div>`).join('')
    }
    renderStudentsForClass(sel.id)
    classSelect.addEventListener('change', (e)=> renderStudentsForClass(e.target.value))

    document.getElementById('saveAttendance').addEventListener('click', function(){
      const selId = Number(classSelect.value)
      const c = classes.find(x=>x.id===selId)
      const checkboxes = Array.from(document.querySelectorAll('#attendance-students input[type=checkbox]'))
      const records = checkboxes.map((cb,i)=>({ student: c.studentsList[i], present: !!cb.checked }))
      const rec = { id: Date.now(), classId: c.id, className: c.name, date: new Date().toLocaleString(), records }
      const arr = getStoredRecords(); arr.unshift(rec); persistStoredRecords(arr); showNotice('Asistencia guardada')
    })

    document.getElementById('backDashboard').addEventListener('click', function(){ location.reload() })
  }

  function showReportsPage(){
    const main = document.querySelector('main.main')
    if(!main) return
    const container = document.createElement('div')
    container.className = 'reports-page'
    const recs = getStoredRecords()
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center"><h3>Reportes de asistencia</h3><div><button id="exportCSV" class="btn">Exportar CSV</button> <button id="backD" class="btn outline">Volver</button></div></div>
      <div class="bg-white p-4 rounded-xl shadow" style="margin-top:12px">
        <table style="width:100%"><thead><tr><th>Fecha</th><th>Clase</th><th>Presente</th><th>Total</th></tr></thead><tbody>
        ${recs.map(r=>`<tr><td style="padding:6px">${r.date}</td><td>${r.className}</td><td>${r.records.filter(x=>x.present).length}</td><td>${r.records.length}</td></tr>`).join('')}
        ${recs.length===0?'<tr><td colspan="4" style="padding:12px;color:#6b7280">No hay registros</td></tr>':''}
        </tbody></table>
      </div>
    `
    const existing = document.querySelector('.dynamic-cards')
    if(existing && existing.parentNode) existing.parentNode.replaceChild(container, existing)
    else main.appendChild(container)

    document.getElementById('exportCSV').addEventListener('click', function(){
      const rows = [['Fecha','Clase','Presente','Total']]
      recs.forEach(r=> rows.push([r.date,r.className,String(r.records.filter(x=>x.present).length),String(r.records.length)]))
      const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='reportes.csv'; a.click(); URL.revokeObjectURL(url)
    })
    document.getElementById('backD').addEventListener('click', function(){ location.reload() })
  }

  function openQr(c){
    qrTitle.textContent = `Código QR - ${c.code}`
    qrBody.innerHTML = `<div class="qr-placeholder">QR generado para <strong>${c.code}</strong></div>`
    qrModal.classList.remove('hidden')
  }

  closeQr.addEventListener('click', function(){ qrModal.classList.add('hidden') })

  function showNotice(msg){
    let n = document.querySelector('.notice-box')
    if(!n){
      n = document.createElement('div')
      n.className = 'notice-box'
      document.body.appendChild(n)
    }
    n.textContent = msg
    n.style.display = 'block'
    setTimeout(()=> n.style.display = 'none', 3000)
  }

  // logout (button exists in sidebar)
  const logoutBtn = document.querySelector('.sidebar button[aria-label="logout"]')
  if(logoutBtn){
    logoutBtn.addEventListener('click', function(){
      location.reload()
    })
  }

  // init: hide sidebar on load
  document.getElementById('sidebar').style.display = 'none'
})()
