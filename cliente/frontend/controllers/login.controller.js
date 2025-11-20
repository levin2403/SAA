import UsersService from '../services/session.service.js';

const api = new UsersService();
const $err = $('#loginError')


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
    try{
        const userInfo = await api.login(id, pass);
        console.log(userInfo);

        localStorage.setItem("user", userInfo.user); //set the user
        localStorage.setItem("tokens", userInfo.tokens); //set the tokens

        window.location.replace('dashboard.html') // redirect the user
    }
    catch(error){
        $err.text(error.message)
        $err.show()
    }

})