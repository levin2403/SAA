import UsersService from '../services/users.service.js'
import SessionService from '../services/session.service.js'

const api = new UsersService()
const sessionApi = new SessionService()
const user = JSON.parse(localStorage.getItem('user'));
const tokens = JSON.parse(localStorage.getItem('tokens'));
let lastGeneratedQR;

// initial validation to know if user is loged
if(!user){ window.location.replace('login.html') }

/**
 * init function.
 */
$(async function(){
    setHeaderInfo()
    setReportsButton()
    const classes = await getClasses()
    await loadClasses(classes)
    saveClassesGlobal(classes);
})

function setHeaderInfo(){
    const today = new Date()
    $('#welcomeTitle').text(`Bienvenido, ${user.name}`)
    $('#welcomeMsg').text(`Vistado de las clases ${today.toLocaleString().split(',')[0]} · ${today.toLocaleTimeString()}`)
}

function setReportsButton(){
    if(user.rol === 'PROFESSOR'){
        Array.from(document.querySelectorAll('.teacher-only')).forEach(el=>el.style.display='flex')
    }
}

function saveClassesGlobal(classes){
    sessionStorage.setItem('classes', JSON.stringify(classes));
}

async function getClasses(){
    if(user.rol === 'STUDENT'){
        const classes = await api.getStudentClasses(user.id);
        return classes
    }
    else{
        const classes = await api.getProfessorClasses(user.id);
        return classes
    }
}

async function loadClasses(classes){
    if(!classes) return //if there is no classes to load
    
    const $container = $('#cardsContainer')
    const gradientClasses = ['gradient-blue','gradient-purple','gradient-pink']
    const pickGradient = () => gradientClasses[Math.floor(Math.random() * gradientClasses.length)]

    classes.forEach((c)=>{
        const finalDays = c.days.join(', ');
    
        const headClass = pickGradient()
        const $card = $('<div>', { class: 'card' }).html(`
            <div class="card-head ${headClass}">
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                    <span class="code-pill">${c.code}</span>
                    <span class="code-pill">
                        <span class="material-symbols-outlined">
                            location_on
                        </span>
                        ${c.classroom}
                    </span>
                </div>
                <h4 style="color:#fff;font-weight:700;margin-top:8px; font-size: 1.2rem">${c.name}</h4>
            </div>
            <div class="card-body">
                <div styles="display: flex; justify-content: space-between;">

                </div>
                <div style="margin-bottom:8px; color:#6b7280; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">
                        calendar_today
                    </span>
                    ${finalDays}
                </div>
                <div style="margin-bottom:8px; color:#6b7280; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">
                        schedule
                    </span>
                    ${c.hours}
                </div>
                <div style="margin-bottom:12px; color:#6b7280; display: flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-outlined">
                        group
                    </span>
                    ${user.rol === 'STUDENT' ? (c.teacher.name||'') : ((c.studentCount) + ' estudiantes')}
                </div>
                <button class="action-btn">${user.rol === 'STUDENT' ? 'Ver Código QR' : 'Tomar Lista'}</button>
            </div>
        `)

        $card.find('.action-btn').on('click', async()=>{
        if(user.rol === 'STUDENT'){
                await generateQr(c._id, c.code, c.name)  
            } 
            else {
                navigateToAttendance(c)
            }
        })
        $container.append($card)
    })
}

async function generateQr(classId, classCode, className){

    showQRModal(classCode, className)

    //generate the data
    const qrData = generateQRData(user.id, user.name, classId, classCode)
    lastGeneratedQR = qrData;

    // Generar QR como imagen usando API
    const encodedData = encodeURIComponent(qrData)
    const img = document.createElement('img')
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
    img.style.borderRadius = '8px'
    img.alt = 'Código QR'
    document.getElementById('qrBody').appendChild(img)

    function showQRModal(classCode, className){
        //show the modal
        document.getElementById('qrTitle').textContent = `${classCode} - ${className}`
        document.getElementById('qrBody').innerHTML = ''
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
    //delete last selected class if exist
    const lastSelectedClass = sessionStorage.getItem('selectedClass')
    if(lastSelectedClass) sessionStorage.removeItem('selectedClass');

    //save the global
    sessionStorage.setItem('selectedClass', JSON.stringify(theClass));
    //navigate to the attendences screen-
    window.location.href = 'attendance.html'
}

async function handleLogout() {
    try{
        const id = user.id
        const refreshToken = tokens.refresh
        await sessionApi.singleDeviceLogout(id, refreshToken);

        window.location.replace('login.html')

        localStorage.removeItem('user')
        localStorage.removeItem('tokens')
    }
    catch(error){
        showNotification(error.message, 'error')
    }
}

async function handleSendQR() {
    const email = $('#email-input').val();
    
    if (!email) {
        showNotification('Ingresa un correo antes de enviarlo', 'error');
        return;
    }

    try{
        
    }
    catch(error){
        showNotification(error.message, 'error');
    }
}



$('#send-email').on('click', async ()=> {
    await handleSendQR();
});


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
    console.log('si me aplastaron we')
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