var url = 'http://45.82.73.198:5000/api/';
var ip = "http://45.82.73.198:1935/live/smil:";
var ending = ".smil/playlist.m3u8";
var user;
var password;

function Load() {
    $('#tabla-drones').empty();
    console.log('Vaciamos tabla');
    
    //get drones
    var settings = {
      "url": url + "dron",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    };

    $.ajax(settings).done(function (response) {
      console.log('Imprimimos respuesta al load');
      console.log(response);
        for (let i=0; i<response.length; i++) {
            //add to the table
            var tabla = $("#tabla-drones");
            var fila = $('<tr></tr>');
            var name = $('<td></td>');
            $('<input>').attr({
            type: 'text',
            id: response[i].id + "-name",
            value: response[i].model
                }).appendTo(name);
            var description = $('<td></td>');
            var dron_description= $('<textarea></textarea>').attr({
            id: response[i].id + "-description",
            cols: 60,
            rows: 3,
                });
            dron_description.html(response[i].description);
            description.append(dron_description);
            var matricula = $('<td></td>');
            var dron_matricula = $('<p></p>').attr('id', response[i].id + "-matricula").html(response[i].matricula);
            matricula.append(dron_matricula);
            var height = $('<td></td>');
            $('<input>').attr({
            type: 'number',
            id: response[i].id + "-height",
            value: response[i].height
                }).appendTo(height);
            var longitud = $('<td></td>');
            $('<input>').attr({
            type: 'text',
            id: response[i].id + "-longitud",
            value: response[i].long
                }).appendTo(longitud);
            var latitud = $('<td></td>');
            $('<input>').attr({
            type: 'text',
            id: response[i].id + "-latitud",
            value: response[i].lat
                }).appendTo(latitud);
            var stream = $('<td></td>');
            var dron_stream = $('<p></p>').attr('id', response[i].id + "-stream").html(ip + response[i].matricula + ending);
            stream.append(dron_stream);
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
            /*button.className="btn btn-secondary";
            button.innerHTML=response[i].name;
            button.addEventListener("click", function(){
                changeDron(response[i].name, response[i].urlStream, response[i].longitud, response[i].latitud);
            });*/
            //stream.append(button);
            fila.append(name);
            fila.append(matricula);
            fila.append(height);
            fila.append(description);
            fila.append(longitud);
            fila.append(latitud);
            fila.append(stream);
            fila.append(buttons);
            tabla.append(fila);
            
        }
        
});
    
}

function Put(id){
    console.log(user);
    console.log(password);
    var settings = {
  "url": url  + "dron/" + id,
  "method": "PUT",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"id":id,
                          "model":$('#' + id + '-name').val(),
                          "matricula":$('#' + id + '-matricula').html(),
                          "height":$('#' + id + '-height').val(),
                          "description":$('#' + id + '-description').val(),
                          "long":$('#' + id + '-longitud').val(),
                          "lat":$('#' + id + '-latitud').val(),
                          "email" : user,
                          "password" : password,
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
  "url": url + "dron/" + id,
  "method": "DELETE",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
"data": JSON.stringify({  "Email" : user,
                          "Password" : password,
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
    var settings = {
  "url": url + "dron",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"model" : $('#name').val(),
                          "matricula" : $('#matricula').val(),
                          "height" : $('#height').val(),
                          "description"  :$('#description').val(),
                          "long" : $('#longitud').val(),
                          "lat" : $('#latitud').val(),
                          "email" : user,
                          "password" : password,
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
    return ($('#name').val()=== '' || $('#height').val()=== '' || $('#description').val()=== '' || $('#matricula').val()=== '' || $('#longitud').val()=== '' || $('#latitud').val()=== '' || $('#stream').val() === '');
}

function VaciarValores(){
    $('#name').val('');
    $('#description').val('');
    $('#longitud').val('');
    $('#latitud').val('');
    $('#stream').val('');
}


function Login(){
    if (CredencialesVacias()){
        alert('Rellena todos los campos');
        return;
    }
    var settings = {
        "url": url + "users",
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