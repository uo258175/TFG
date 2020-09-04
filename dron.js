//streets-v11
//bright-v8
//satellite-v9
var url = 'http://45.82.73.198:5000/api/dron';
var map;
var markers=[];
var longitud_Spain = -3.74922;
var latitud_Spain = 40.463667;
var ip = "http://45.82.73.198:1935/live/smil:";
var ending = ".smil/playlist.m3u8";


///SIGNALR///
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://45.82.73.198:5000/notifications")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("connected");
    } catch (err) {
        console.log(err);
        setTimeout(() => start(), 5000);
    }
};

connection.onclose(async () => {
    await start();
});

connection.on("ReceiveMessage", (message) => {
    console.log(message);
    Load();
});

///SIGNALR///

function Load() {
    
    if (markers!=null){
        for (let i=0; i< markers.length; i++){
            markers[i].remove();
            console.log("Marker eliminado");
        }
    }
    
    $('#tabla-drones').empty();
    
    //get drones
    var settings = {
      "url": url,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
        for (let i=0; i<response.length; i++) {
            //add to the dropdown
            /*var dropdown = $("#ciudades");
            var ciudad = document.createElement('button');
            ciudad.className="dropdown-item rotador";
            ciudad.innerHTML=response[i].modelo;
            ciudad.addEventListener("click", function(){
                changeDron(response[i].modelo, ip + response[i].matricula + ending, response[i].longitud, response[i].latitud);
            });
            dropdown.append(ciudad);*/
            //add to the table
            var tabla = $("#tabla-drones");
            var fila = $('<tr></tr>');
            var model = $('<td></td>');
            model.html(response[i].model);
            var matricula = $('<td></td>');
            matricula.html(response[i].matricula);
            var height = $('<td></td>');
            height.html(response[i].height);
            var description = $('<td></td>');
            description.html(response[i].description);
            var stream = $('<td></td>');
            var button = document.createElement('button');
            button.className="btn btn-secondary";
            button.innerHTML=response[i].model;
            button.addEventListener("click", function(){
                changeDron(response[i].model, ip + response[i].matricula + ending, response[i].long, response[i].lat);
            });
            stream.append(button);
            fila.append(model);
            fila.append(matricula);
            fila.append(height);
            fila.append(description);
            fila.append(stream);
            tabla.append(fila);
            PushMarker(response[i].long, response[i].lat, response[i].model, button.cloneNode(true), ip + response[i].matricula + ending, response[i].height);
            
        }
        
});
    
        

}

function changeDron(ciudad, streaming, longitud, latitud){
    var player = videojs ('my-video');
                player.src({
                src: streaming, type: 'application/x-mpegURL' })
            player.load();
            player.play();
    map.flyTo({center: [longitud, latitud], zoom: 15});

}

function LoadPlayer(){
            var player = videojs('my-video');
        player.hlsQualitySelector({
            displayCurrentQuality: true,
        });
}

function LoadMap(){
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yNTgxNzUiLCJhIjoiY2thd2FkeHBsMDJ6YzJ6cGk5ZmIxYWY4bSJ9.a51WRdCwn8HPGi05uaCkRw';
        map = new mapboxgl.Map({
        container: 'mapa',
        style: 'mapbox://styles/mapbox/satellite-v9'
        });
        map.flyTo({center: [longitud_Spain, latitud_Spain], zoom: 5});
}

function PushMarker(longitud, latitud, name, button, streaming, height){
    button.addEventListener("click", function(){
        changeDron(name, streaming, longitud, latitud);
    });
    var marker = new mapboxgl.Marker()
    .setLngLat([longitud, latitud])
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setDOMContent(button)).addTo(map);
    markers.push(marker);
    
}

function HideTableShowVideo(){
    $('#tabla').hide();
    $('#seleccion-detalle').show();
    $('#my-video').show();
}

function Volver(){
    map.flyTo({center: [longitud_Spain, latitud_Spain], zoom: 5});
}

function AddMarkers(){
    for (let i=0; i<markers.length; i++){
        markers[i].addTo(map);
    }
}


function Connect(){
    start();
}

Connect();
LoadMap();
LoadPlayer();
Load();
