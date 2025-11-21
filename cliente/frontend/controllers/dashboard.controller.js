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
}

async function loadClassCards(classes){
    if(!classes) return //if there is no classes to load

    const $container = $('#cardsContainer')
    const gradientClasses = ['gradient-blue','gradient-purple','gradient-pink']

    classes.forEach((c, idx)=>{
        const headClass = gradientClasses[idx % gradientClasses.length]
        const $card = $('<div>', { class: 'card' }).html(`
            <div class="card-head ${headClass}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="code-pill">${c.code}</span></div>
                <h4 style="color:#fff;font-weight:700;margin-top:8px">${c.name}</h4>
            </div>
            <div class="card-body">
                <div style="margin-bottom:8px;color:#6b7280">${c.schedule}</div>
                <div style="margin-bottom:12px;color:#6b7280">${user.type === 'STUDENT' ? (c.teacher.name||'') : ((c.students||c.studentCount) + ' estudiantes')}</div>
                <button class="action-btn">${user.rol === 'STUDENT' ? 'Ver Código QR' : 'Tomar Lista'}</button>
            </div>
        `)

        $card.find('.action-btn').on('click', ()=>{
            if(user.rol === 'STUDENT'){
                $('#qrTitle').text(`Código QR - ${c.code}`)
                $('#qrBody').html(`<div class="qr-placeholder">QR generado para <strong>${c.code}</strong></div>`)
                $('#qrModal').removeClass('hidden')
            } else {
                window.location.href = `attendance.html?classId=${c.id}`
            }
        })

        $container.append($card)
    })
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