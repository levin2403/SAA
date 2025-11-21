import UsersService from '../services/session.service.js';

const api = new UsersService();
const $err = $('#loginError')

// initial validation if user is loged
const user = JSON.parse(localStorage.getItem('user'));
if(user){ window.location.replace('dashboard.html') }


$(".btn").click( async (e) => {
    
    // Prevent form submission
    e.preventDefault()
    
    $err.text('') // hide the error text


    // retrives login and validate content (11 digits and no letters)
    const id = ($('#loginId').val() || '').trim().replace(/\D/g,'')
    const pass = $('#loginPass').val() || ''

    //validate if all fields are filled
    if(!id || !pass){
        $err.text('Complete todos los campos antes de continuar')
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
    try {
        const userInfo = await api.login(id, pass);
    
        // Guardar objeto en localStorage
        localStorage.setItem("user", JSON.stringify(userInfo.user));
        localStorage.setItem("tokens", JSON.stringify(userInfo.tokens));
    
        window.location.replace('dashboard.html');
    } catch (error) {
        $err.text(error.message);
        $err.show();
    }    
})