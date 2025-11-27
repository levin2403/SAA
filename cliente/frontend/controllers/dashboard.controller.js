import UsersService from '../services/users.service.js'
import SessionService from '../services/session.service.js'

const api = new UsersService()
const sessionApi = new SessionService()
const user = JSON.parse(localStorage.getItem('user'));
const tokens = JSON.parse(localStorage.getItem('tokens'));

// initial validation to know if user is loged
if(!user){ window.location.replace('login.html') }

/**
 * init function.
 */
$(async function(){
    setHeaderInfo()
    setReportsButton()
    
    try {
        const classes = await getClasses()
        // Validación extra: asegurar que classes sea un array antes de cargarlo
        if (Array.isArray(classes)) {
            await loadClasses(classes)
            saveClassesGlobal(classes);
        } else {
            console.error("El formato de clases recibido no es válido:", classes);
        }
    } catch (error) {
        console.error("Error al cargar las clases:", error);
    }
})

function setHeaderInfo(){
    $('#welcomeTitle').text(`Bienvenido, ${user.name}`)
    $('#welcomeMsg').text('Panel de control - ' + new Date().toLocaleString().split(',')[0])
}

function setReportsButton(){
    // Solo mostrar reportes si es profesor
    if(user.rol === 'PROFESSOR'){
        $('.teacher-only').show(); // jQuery para mostrar elementos ocultos
    }
}

function saveClassesGlobal(classes){
    sessionStorage.setItem('classes', JSON.stringify(classes));
}

async function getClasses(){
    if(user.rol === 'STUDENT'){
        return await api.getStudentClasses(user.id);
    }
    else{
        return await api.getProfessorClasses(user.id);
    }
}

async function loadClasses(classes){
    if(!classes || classes.length === 0) {
        $('#cardsContainer').html('<p style="padding:20px; color:#6b7280">No tienes materias asignadas actualmente.</p>');
        return;
    }
    
    const $container = $('#cardsContainer')
    $container.empty() // Limpiar contenedor por si acaso

    const gradientClasses = ['gradient-blue','gradient-purple','gradient-pink']

    classes.forEach((c, idx)=>{
        // Asegurar que days sea un array antes de join
        const finalDays = Array.isArray(c.days) ? c.days.join(', ') : c.days;
    
        const headClass = gradientClasses[idx % gradientClasses.length]
        const $card = $('<div>', { class: 'card' }).html(`
            <div class="card-head ${headClass}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                    <span class="code-pill">${c.code || 'S/C'}</span>
                </div>
                <h4 style="color:#fff;font-weight:700;margin-top:8px">${c.name}</h4>
            </div>
            <div class="card-body">
                <div style="margin-bottom:8px;color:#6b7280">📅 ${finalDays}</div>
                <div style="margin-bottom:8px;color:#6b7280">⏰ ${c.hours}</div>
                <div style="margin-bottom:12px;color:#6b7280">
                    ${user.rol === 'STUDENT' ? (c.teacher?.name || 'Sin profesor') : ((c.studentCount || 0) + ' estudiantes')}
                </div>
                <button class="action-btn">${user.rol === 'STUDENT' ? 'Ver Código QR' : 'Tomar Lista'}</button>
            </div>
        `)

        $card.find('.action-btn').on('click', async()=>{
            if(user.rol === 'STUDENT'){
                await generateQr(c._id || c.id, c.code)  
            } 
            else {
                navigateToAttendance(c)
            }
        })
        $container.append($card)
    })
}

async function generateQr(classId, classCode){

    showQRModal(classCode)

    //generate the data
    const qrData = generateQRData(user.id, user.name, classId, classCode)

    // Generar QR como imagen usando API
    const encodedData = encodeURIComponent(qrData)
    const img = document.createElement('img')
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
    img.style.borderRadius = '8px'
    img.alt = 'Código QR'
    
    const qrBody = document.getElementById('qrBody')
    qrBody.innerHTML = '' // Limpiar QR anterior
    qrBody.appendChild(img)

    function showQRModal(classCode){
        document.getElementById('qrTitle').textContent = `Código QR - ${classCode}`
        document.getElementById('qrModal').classList.remove('hidden')
    }
    
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
}

function navigateToAttendance(theClass){
    sessionStorage.removeItem('selectedClass');
    sessionStorage.setItem('selectedClass', JSON.stringify(theClass));
    window.location.href = 'attendance.html'
}

async function handleLogout() {
    try{
        const id = user.id
        // Validación simple por si tokens es null
        const refreshToken = tokens ? tokens.refresh : null;
        
        if(refreshToken) {
            await sessionApi.singleDeviceLogout(id, refreshToken);
        }

        localStorage.removeItem('user')
        localStorage.removeItem('tokens')
        window.location.replace('login.html')
    }
    catch(error){
        console.error("Error al cerrar sesión:", error);
        // Forzar logout local en caso de error de red
        localStorage.removeItem('user')
        localStorage.removeItem('tokens')
        window.location.replace('login.html')
    }
}

// ========= MODALS SECTION ==============

const $logoutBtnTop = $('#logoutBtn-top')
const $logoutConfirmModal = $('#logoutConfirmModal')
const $confirmLogout = $('#confirmLogout')
const $cancelLogout = $('#cancelLogout')

function openLogoutConfirm(){
    $logoutConfirmModal.removeClass('hidden')
}

$logoutBtnTop.on('click', openLogoutConfirm)

$confirmLogout.on('click', async ()=> {
    await handleLogout()
})

$cancelLogout.on('click', ()=> {
    $logoutConfirmModal.addClass('hidden')
})

$logoutConfirmModal.on('click', (e)=>{
    if($(e.target).is($logoutConfirmModal)){
        $logoutConfirmModal.addClass('hidden')
    }
})

$('#closeQr').on('click', ()=> $('#qrModal').addClass('hidden'))
$('#nav-reportes-top').on('click', ()=> window.location.href='reports.html')