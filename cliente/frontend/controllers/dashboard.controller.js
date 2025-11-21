import UsersService from '../services/users.service.js';
import SessionService from '../services/session.service.js'

const api = new UsersService();
const sessionApi = new SessionService();
const user = JSON.parse(localStorage.getItem('user'));
const tokens = JSON.parse(localStorage.getItem('tokens'));

// initial validation if user is loged
if(!user){ window.location.replace('login.html') }

$(async function(){
    setHeaderInfo();
    await loadClasses();

})

function setHeaderInfo(){
    $('#welcomeTitle').text(`Bienvenido, ${user.name}`)
    $('#welcomeMsg').text('Panel de control - ' + new Date().toLocaleString().split(',')[0])
}

async function loadClasses(){
    if(user.rol === 'STUDENT'){
        const classes = await api.getStudentClasses(user.id);
        await loadClassCards(classes);    
    }
    else{
        const classes = await api.getProfessorClasses(user.id);
        await loadClassCards(classes);
    }

    async function loadClassCards(classes){
        if(!classes) return //if there is no classes to load
    
        const $container = $('#cardsContainer')
        const gradientClasses = ['gradient-blue','gradient-purple','gradient-pink']

        classes.forEach((c, idx)=>{
            const finalDays = c.days.join(', ');
    
            const headClass = gradientClasses[idx % gradientClasses.length]
            const $card = $('<div>', { class: 'card' }).html(`
                <div class="card-head ${headClass}">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="code-pill">${c.code}</span></div>
                    <h4 style="color:#fff;font-weight:700;margin-top:8px">${c.name}</h4>
                </div>
                <div class="card-body">
                    <div style="margin-bottom:8px;color:#6b7280">${finalDays}</div>
                    <div style="margin-bottom:8px;color:#6b7280">${c.hours}</div>
                    <div style="margin-bottom:12px;color:#6b7280">${user.rol === 'STUDENT' ? (c.teacher.name||'') : ((c.studentCount) + ' estudiantes')}</div>
                    <button class="action-btn">${user.rol === 'STUDENT' ? 'Ver Código QR' : 'Tomar Lista'}</button>
                </div>
            `)

            $('.action-btn').click( async()=>{
                if(user.rol === 'STUDENT'){
                    console.log(c._id)
                    // await generateQr(c._id)
                } 
                else {
                    navigateToAttendance()
                }
            })
            $container.append($card)
        })
    }
}

async function generateQr(classId){
    //generate the data
    const qrData = window.SCREENS.generateQRData(user.id, user.name, c.id, c.code)

    //show the modal
    $('qrTitle').textContent = `Código QR - ${c.code}`
    $('qrBody').innerHTML = ''
    $('qrModal').classList.remove('hidden')
                    
    // Generar QR como imagen usando API
    const encodedData = encodeURIComponent(qrData)
    const img = document.createElement('img')
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`
    img.style.borderRadius = '8px'
    img.alt = 'Código QR'
    document.getElementById('qrBody').appendChild(img)
}

function navigateToAttendance(){
    //save the globals

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
        console.log(error)
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