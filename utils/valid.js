/*checkParams tendrá que verificar si los parámetros del esquema son válidos.
checkPassword tendrá que verificar si el password contiene números y
caracteres. que sea mínimamente de 6 caracteres y que siempre comience con
una letra mayúscula.
mayu ^[A-Z]+[0-9a-zA-Z]+$
^[A-Z]+[a-zA-Z0-9]+$
checkEmail que verifique que sea un email válido.*/
var USER = require('../database/users');
var valid = {
    checkParams: async function(obj) {
        var {name,email,password,sex,address} = obj;
        if(!name || !email || !password || !sex || !address){
            return('uno o mas campos estan vacios');
            
        }else{
            const useremail= await USER.findOne({email: email}) 
            if (useremail)
            return ('el email ya esta en uso, ingrese otro diferente')
        }
    },
    checkPassword: async function (password) {
        var us= new USER();
        us.password=password
        if(await us.password.length<6)
            return('El password demasiado corto')
        if(!/^[A-Z]\S+\S/.test(us.password))
            return ('El password debe empezar por mayúscula')
    },
    checkEmail: function(email) {
        if(!/\S+@\S+\.\S{3}/.test(email))
            return ('No es un email valido')
    }

    };
module.exports = valid;