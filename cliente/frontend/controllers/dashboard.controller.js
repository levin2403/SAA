const user = window.SCREENS.getUserFromStorage()
if(!user){ window.location.href='login.html' }

$(function(){
    $('#welcomeTitle').text(`Bienvenido, ${user.name}`)
    $('#todayDate').text(new Date().toLocaleString())

    const classes = user.type === 'student' ? window.SCREENS.studentClasses : window.SCREENS.teacherClasses
    const $container = $('#cardsContainer')
    const gradientClasses = ['gradient-blue','gradient-purple','gradient-pink']

    // Mobile menu toggle (nota: sidebar fue removido)
    // $('#menuToggle').on('click', ()=> sidebar.toggleClass('open'))

    // Navegación mejorada
    function navigateTo(page){
        if(page !== '#'){
            setTimeout(() => window.location.href = page, 100)
        }
    }

    classes.forEach((c, idx)=>{
        const headClass = gradientClasses[idx % gradientClasses.length]
        const $card = $('<div>', { class: 'card' }).html(`
            <div class="card-head ${headClass}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="code-pill">${c.code}</span></div>
                <h4 style="color:#fff;font-weight:700;margin-top:8px">${c.name}</h4>
            </div>
            <div class="card-body">
                <div style="margin-bottom:8px;color:#6b7280">${c.schedule}</div>
                <div style="margin-bottom:12px;color:#6b7280">${user.type === 'student' ? (c.teacher||'') : ((c.students||c.studentsList.length) + ' estudiantes')}</div>
                <button class="action-btn">${user.type === 'student' ? 'Ver Código QR' : 'Tomar Lista'}</button>
            </div>
        `)

        $card.find('.action-btn').on('click', ()=>{
            if(user.type === 'student'){
                $('#qrTitle').text(`Código QR - ${c.code}`)
                $('#qrBody').html(`<div class="qr-placeholder">QR generado para <strong>${c.code}</strong></div>`)
                $('#qrModal').removeClass('hidden')
            } else {
                window.location.href = `attendance.html?classId=${c.id}`
            }
        })

        $container.append($card)
    })

    // teacher-only nav
    if(user.type === 'teacher'){
        $('.teacher-only').css('display', 'block')
    }

})



// ========= MODALS SECTION ==============

const $logoutBtnTop = $('#logoutBtn-top')
const $logoutConfirmModal = $('#logoutConfirmModal')
const $confirmLogout = $('#confirmLogout')
const $cancelLogout = $('#cancelLogout')

function openLogoutConfirm(){
    $logoutConfirmModal.removeClass('hidden')
}

$logoutBtnTop.on('click', openLogoutConfirm)

$confirmLogout.on('click', ()=> {
    window.SCREENS.logout()
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