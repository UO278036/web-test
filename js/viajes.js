"use strict";
class Viajes {
    curSlide = 3;

    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.obtenerMapa();
        this.obtenerMapaDinamico();
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización";
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible";
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado";
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido";
                break;
        }
    }

    carruselSiguiente() {
        const slides = document.querySelectorAll("img");
        let maxSlide = slides.length - 1;

        if (this.curSlide === maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    }

    carruselAnterior() {
        const slides = document.querySelectorAll("img");
        let maxSlide = slides.length - 1;

        if (this.curSlide === 0) {
            this.curSlide = maxSlide;
        } else {
            this.curSlide--;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    }

    obtenerMapa() {
        var accessToken = 'pk.eyJ1IjoiY2hhY2FsMjgwNCIsImEiOiJjbGJiOWFheHMwMmVlM29wZXNtN282MHVmIn0.Eeb4dIDC8qYD2U5UBlnAZg';
        var staticMapURL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/` +
            `static/pin-s+0000FF(${this.longitud},${this.latitud})/${this.longitud},${this.latitud},` +
            `15,0,0/800x400?access_token=${accessToken}`;

        var map = document.createElement('img');
        map.src = staticMapURL;
        map.alt = 'Mapa estático';

        var section = document.createElement('section');
        var title = document.createElement('h4');
        title.textContent = "Mapa ";
    
        section.append(title);
        $('main').append(section);
        $('section').append(map);
    }

    obtenerMapaDinamico() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhY2FsMjgwNCIsImEiOiJjbGJiOWFheHMwMmVlM29wZXNtN282MHVmIn0.Eeb4dIDC8qYD2U5UBlnAZg';
    
        var centro = [this.longitud, this.latitud];
    
        var section = document.createElement('section');
        var title = document.createElement('h4');
        title.textContent = "Mapa dinámico";
        section.append(title);
        $('main').append(section);
    
        var mapaGeoposicionado = new mapboxgl.Map({
            container: section,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: centro,
            zoom: 8
        });
    
        var marker = new mapboxgl.Marker({ "ariaLabel": null })  // Puedes probar con null o ""
            .setLngLat(centro)
            .addTo(mapaGeoposicionado);
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = [position.coords.longitude, position.coords.latitude];
    
                marker.setLngLat(pos);
                mapaGeoposicionado.setCenter(pos);
            }, function () {
                handleLocationError(true, marker, mapaGeoposicionado.getCenter());
            });
        } else {
            handleLocationError(false, marker, mapaGeoposicionado.getCenter());
        }
    }
    
    handleLocationError(browserHasGeolocation, marker, pos) {
        marker.setLngLat(pos);
        marker.setPopup(new mapboxgl.Popup().setHTML(browserHasGeolocation ?
            'Error: Ha fallado la geolocalización' :
            'Error: Su navegador no soporta geolocalización'));
        marker.addTo(mapaGeoposicionado);
    }

    cargaXML(files) { 

      var archivo = files[0];
      
      var article= $('<article></article>');
      var titulo=$('<h3>Rutas:</h3>');
      article.append(titulo);

      if (archivo.type === "application/xml" || archivo.type === "text/xml")
        {
          var lector = new FileReader();
          lector.onload = function (evento) {

                var contenido = lector.result;
                
                this.representaXML(contenido, article);
            }.bind(this);
                 
          lector.readAsText(archivo);
          }
      else {
          errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
          }  
          $('main').append(article);     
    }

    representaXML(contenido, article) {
        
        var rutas = $('ruta', contenido);

        rutas.each(function () {
            var section = $('<section></section>');

            var titulo = $(this).attr('nombre');
            var fechainicio = $(this).find('fechaDeinicio').text();
            var horainicio = $(this).find('horaDeinicio').text();
            var tipo = $(this).find('tipoRuta').text();
            var transporte = $(this).find('medioDetransporte').text();
            var duracion = $(this).find('duracion').text();
            var agencia = $(this).find('agencia').text();
            var descripcion = $(this).find('descripcion').text();
            var persadecuadas = $(this).find('personasAdecuadas').text();
            var lugar = $(this).find('InicioRutaLugar').text();
            var direccion = $(this).find('InicioRutaDireccion').text();
            var coords = $(this).find('coordenadas').find('longitud').text() + ', ' + $(this).find('coordenadas').find('latitud').text();
            var referencias = $(this).find('referenciasYBibliografias referenciasYBibliografia');
            var recomendacion = $(this).find('recomendacioRuta').text();
            var hitos = $(this).find('hitos hito');
        
            var title = $('<h4></h4>').html(titulo);
            section.append(title);
    
            var fechahora = $('<p></p>').html("Fecha y hora de inicio: " + fechainicio + " " + horainicio);
            section.append(fechahora);
    
            var tiporuta = $('<p></p>').html("Tipo de ruta: " + tipo);
            section.append(tiporuta);
    
            var transporteruta = $('<p></p>').html("Medio de transporte: " + transporte);
            section.append(transporteruta);
    
            var duracionruta = $('<p></p>').html("Duración de la ruta: " + duracion);
            section.append(duracionruta);
    
            var agenciaruta = $('<p></p>').html("Agencia a cargo de la ruta: " + agencia);
            section.append(agenciaruta);
    
            var descrrruta = $('<p></p>').html("Descripción: " + descripcion);
            section.append(descrrruta);
    
            var persruta = $('<p></p>').html("Recomendación de asistencia: " + persadecuadas);
            section.append(persruta);
    
            var lugdirruta = $('<p></p>').html("Lugar y dirección de inicio: " + lugar + " " + direccion);
            section.append(lugdirruta);
    
            var coord = $('<p></p>').html("Coordenadas de inicio: " + coords);
            section.append(coord);
    
            var refs = $('<p>Referencias: </p>');
            var listarefs = $('<ul></ul>');
            referencias.each(function () {
                listarefs.append('<li><a href="' + $(this).text() + '">' + $(this).text() + '</a></li>');
            });
            refs.append(listarefs);
            section.append(refs);
            section.append(listarefs);
    
            var rec = $('<p></p>').html("Recomendación nota sobre 10: " + recomendacion);
            section.append(rec);

            var hitosruta = $('<p>Hitos de la ruta: </p>');
            section.append(hitosruta);
            hitos.each(function () {
                var hito = $(this);
                var nombreHito = hito.find('nombreDehito').text();
        
                var parrafoHito = $('<p><strong>' + nombreHito + '</strong></p>');
                var listaDetalles = $('<ul></ul>');
                

                var descripcionDehito = hito.find('descripcionDehito').text()
                listaDetalles.append('<li>Descripción: ' + descripcionDehito + '</li>');
            
                var coordenadas = hito.find('coordenadas');
                var longitud = coordenadas.find('longitud').text()
                var latitud = coordenadas.find('latitud').text()
                var altitud = coordenadas.find('altitud').text()
                listaDetalles.append('<li>Coordenadas: Longitud ' + longitud +
                    ', Latitud ' + latitud +
                    ', Altitud ' + altitud + '</li>');
                
                listaDetalles.append('<li>Distancia al anterior:' + hito.find('distancia').text() +'m'+'</li>');
                
                var galeriaFotografia = hito.find('galeriaFotografia');

                galeriaFotografia.each(function() {
                    var foto = $(this).find('fotografia');
                    var refFoto = foto.attr('ref_foto');
                    var nombreFoto = foto.attr('nombre_foto');

                    var rutaFoto =  refFoto;

                    listaDetalles.append('<li><img src="' + rutaFoto + '" alt="Foto de ' + nombreHito + ' - ' + nombreFoto + '"></li>');
                });

                var video = hito.find('video').text();
                if (video) {
                    listaDetalles.append('<li><video src="xml/multimediaXML' + video + '" controls></video></li>');
                }
            
                section.append(parrafoHito);
                section.append(listaDetalles);
            });
            
            article.append(section);
        });
    }

    

    representaRutas(files){
        var section = document.createElement('section');
        var title=document.createElement('h4');
        title.textContent="Mapa de rutas";
        section.append(title);
        $('main').append(section);

        var map = new mapboxgl.Map({
            container: section,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [27.7,53.9],
            zoom: 8
            });


        var filesArray=Array.from(files);
        filesArray.forEach(file => {
            var lector = new FileReader();
            lector.onload = function (evento) {

                var contenidoKML = lector.result;
                
                this.agregarRuta(contenidoKML,map);
            }.bind(this);

            lector.readAsText(file);
        });

    }

    agregarRuta(contenido,map){
        var geojson = new DOMParser().parseFromString(contenido, 'application/xml');

        var coords = geojson.querySelector('coordinates').textContent;

        var coordsArray=coords.split('\n');
        coordsArray=coordsArray.slice(1,-1);


        var coordenadas=[];
        for(let i=0;i<coordsArray.length;i++){
            var array=coordsArray[i].split(',');
            var lonlat=[array[0],array[1]];
            coordenadas.push(lonlat);
        }

        
        var name = geojson.querySelector('name').textContent;
            map.on('load', () => {
            map.addSource(name, {
            'type': 'geojson',
            'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
            'type': 'LineString',
            'coordinates': coordenadas
            }
            }
            });

            map.addLayer({
            'id': name,
            'type': 'line',
            'source': name,
            'layout': {
            'line-join': 'round',
            'line-cap': 'round'
            },
            'paint': {
            'line-color': '#888',
            'line-width': 8
            }
            });
            });
    }

    representaSVG(svgContenido, canvas) {
        var ctx = canvas.getContext('2d');
    
        var tempSection = document.createElement('section');
        tempSection.innerHTML = svgContenido;
    
        var polyline = tempSection.querySelector('polyline');
        var puntos = polyline.getAttribute('points');
        var pts = puntos.split('\n');
        var puntosArray = pts.map(function (p) {
            return p.split(',').map(function (coord) {
                return parseFloat(coord);
            });
        });

        var textos = tempSection.querySelectorAll('text');
    
        var canvasWidth = canvas.width;
        var canvasHeight = canvas.height;

        var escalaX = canvasWidth / window.innerWidth;
        var escalaY = canvasHeight / window.innerHeight;

        ctx.beginPath();
        ctx.moveTo(puntosArray[0][0] * escalaX, puntosArray[0][1] * escalaY);
        for (var i = 1; i < puntosArray.length; i++) {
            ctx.lineTo(puntosArray[i][0] * escalaX, puntosArray[i][1] * escalaY);
        }
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.stroke();
    

        textos.forEach(function (texto, index) {
            var x = parseFloat(texto.getAttribute('x')) * escalaX;
            var y = parseFloat(texto.getAttribute('y')) * escalaY + 2;
    
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 2);
            ctx.fillStyle = 'black';
            ctx.fillText(texto.textContent, 0, 0);
            ctx.restore();
        });
    }

    cargaSVG(files){
        var article = document.createElement('article');
        var title=document.createElement('h3');
        title.innerHTML='Altimetrías';
        article.append(title);
        

        var filesArray=Array.from(files);
        var i=1;
        filesArray.forEach(file => {
            var lector = new FileReader();
            lector.onload = function (evento) {

                var contenidoSVG = lector.result;
                var canvas= document.createElement('canvas');
                this.representaSVG(contenidoSVG,canvas);
                var title=document.createElement('h4');
                title.innerHTML+=('Ruta '+i);
                article.appendChild(title);
                i++;
                article.append(canvas);
            }.bind(this);
            lector.readAsText(file);

        });

        $('main').append(article);
    }



}