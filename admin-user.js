var url = 'http://45.82.73.198:5000/api/users/';
var user;
var password;


function Load(){
    $('#tabla-users').empty();
    console.log('Vaciamos tabla');
  var settings = {
  "url": url,
  "method": "GET",
  "processData": "false",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
};


$.ajax(settings).done(function (response) {
  console.log(response);
  for (let i=0; i<response.length; i++){
            var tabla = $("#tabla-users");
            var fila = $('<tr></tr>');
            ///////
            var name = $('<td></td>');
            $('<input>').attr({
            type: 'text',
            id: response[i].id + "-name",
            value: response[i].name
                }).appendTo(name);
            ///////
            var surname = $('<td></td>');
            $('<input>').attr({
            type: 'text',
            id: response[i].id + "-surname",
            value: response[i].surname
                }).appendTo(surname);
            ///////
            var e_mail = $('<td></td>');
            var email = $('<p></p>').attr('id', response[i].id + "-email").html(response[i].email);
            e_mail.append(email);
            ///////
            var password = $('<td></td>');
                        $('<input>').attr({
            type: 'password',
            id: response[i].id + "-password",
            value: ''
                }).appendTo(password);
            ////////
            var rep_password = $('<td></td>');
                        $('<input>').attr({
            type: 'password',
            id: response[i].id + "-rep-password",
            value: ''
                }).appendTo(rep_password);
            ///////
            var buttons = $('<td></td>');
            var edit = $('<button></button>');
            edit.addClass('btn btn-success');
            edit.html('Editar');
            edit.click(function() {
                Put(response[i].id);
                });
            
            var delet = $('<button></button>');
            delet.addClass('btn btn-danger');
            delet.html('Borrar');
            delet.click(function() {
                Delete(response[i].id);
                });
            buttons.append(edit);
            buttons.append(delet);
            fila.append(name);
            fila.append(surname);
            fila.append(e_mail);
            fila.append(password);
            fila.append(rep_password);
            fila.append(buttons);
            tabla.append(fila);
    }
});
}

function Put(id){
    if (!ComprobarContras($('#' + id + '-password').val(), $('#' + id + '-rep-password').val())){
        alert ('Contraseñas no coinciden');
        return;
    }
    var settings = {
  "url": url + id,
  "method": "PUT",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"id":id,
                          "Name":$('#' + id + '-name').val(),
                          "SurName":$('#' + id + '-surname').val(),
                          "NewPassword":$('#' + id + '-password').val(),
                          "Email":$('#' + id + '-email').html(),
                          "CheckEmail" : user,
                          "CheckPassword" : password,
                         }),
};

$.ajax(settings).done(function (response) {
  console.log(response);
  console.log('Put realizado con exito');
  Load();
});
}

function Delete(id){
    console.log(id);
    var settings = {
  "url": url + id,
  "method": "DELETE",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
"data": JSON.stringify({"email" : user,
                          "password" : password,
                         }),
};

$.ajax(settings).done(function (response) {
  console.log(response);
  console.log('Delete realizado con exito');
  Load();
});
}

function Post(){
    if (ComprobarValores()){
        alert('Faltan campos');
        return; 
    }
    if (!ComprobarContras($('#newpassword').val(), $('#rep-password').val())){
        alert ('Contraseñas no coinciden');
        return;
    }
    var settings = {
  "url": url,
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"Name" : $('#name').val(),
                          "Surname" : $('#surname').val(),
                          "Email" : $('#newemail').val(),
                          "Password"  :$('#newpassword').val(),
                          "CheckEmail" : user,
                          "CheckPassword" : password,
                         }),
};

$.ajax(settings).done(function (response) {
  console.log(response);
  console.log('Post realizado con exito');
  VaciarValores();
  Load();
});
}

function ComprobarValores(){
    return ($('#name').val()=== '' || $('#surname').val()=== '' || $('#email').val()=== '' || $('#newpassword').val()=== '' || $('#rep-password').val()=== '');
}

function ComprobarContras(pass1, pass2){
    return (pass1 == pass2);
}

function VaciarValores(){
    $('#name').val('');
    $('#surname').val('');
    $('#email').val('');
    $('#password').val('');
    $('#rep-password').val('');
}


async function Login(){
    if (CredencialesVacias()){
        alert('Rellena todos los campos');
        return;
    }
    var settings = {
        "url": url,
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
  "data": JSON.stringify({
                        "email":$('#email').val(),
                        "password":$('#password').val()
                        }),
};

$.ajax(settings).done(function (response) {
  console.log(response);
    if (response == "Credenciales incorrectas"){
        alert(response);
        return;
    }
    else{
        user = $('#email').val();
        password = $('#password').val();
        Load();
        $('#username').html(response.name);
        $('#not-logged').hide();
        $('.zig-zag').height('auto');
        $('#logged').show();
    }
});
}

function CredencialesVacias(){
    return ($('#user').val()=== '' || $('#password').val()=== '');
}

function Salir(){
    $('#logged').hide();
    $('.zig-zag').height('100%');
    $('#not-logged').show();
}