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
    const id = ($('#loginId').val() || '').trim()
    const pass = $('#loginPass').val() || ''

    //validate if its doesnt contain caracters o letters
    if(!/^\d+$/.test(id)) {
        $err.text('El ID solo debe contener números')
        $err.show()
        return
    }

    //validate if id is the required length
    if(id.length !== 11){ 
        $err.text('El ID debe tener 11 dígitos')    
        $err.show()
        return 
    }  

    //validate if all fields are filled
    if(!id || !pass){
        $err.text('Complete todos los campos antes de continuar')
        $err.show()
        return 
    }

    // log in user
    try {
        $(".btn").prop('disabled', true); //disabling login button

        const userInfo = await api.login(id, pass);
    
        // Guardar objeto en localStorage
        localStorage.setItem("user", JSON.stringify(userInfo.user));
        localStorage.setItem("tokens", JSON.stringify(userInfo.tokens));
    
        window.location.replace('dashboard.html');
    } catch (error) {
        $(".btn").prop('disabled', false); // reactivate the button
        $err.text(error.message);
        $err.show();
    }    
})