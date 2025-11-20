import UsersService from '../services/session.service.js';

const api = new UsersService();
const $form = $('#loginForm')
const $err = $('#loginError')


$(".btn").click( async(e) => {
    
    // Prevent form submission
    e.preventDefault()
    
    $err.text('')

    // CHANGED: Using jQuery .val() method instead of .value property
    // jQuery equivalent: .val() replaces .value
    const id = ($('#loginId').val() || '').trim().replace(/\D/g,'')
    const pass = $('#loginPass').val() || ''

    //validate if all fields are filled
    if(!id || !pass){
        $err.text('Complete todos los canpos antes de continuar')
        $err.show()
        return 
    }

    //validate if id is the required length
    if(id.length !== 11){ 
        $err.text('El ID debe tener 10 dígitos')    
        $err.show()
        return 
    }  

    // log in user
    try{
        const userInfo = await api.login(id, pass);
        console.log(userInfo);
    }
    catch(error){
        $err.text(error.message)
        $err.show()
    }

    //const user = { id, name: u.name, type: u.type }
    //window.SCREENS.saveUserToStorage(user)
    //window.location.href = '../views/dashboard.html' // redirect the user
})