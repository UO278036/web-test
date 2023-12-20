"use strict";
class Fondo {

    constructor(nombrePais, nombreCapital, latitud,longitud) {
        this.nombreCapital = nombreCapital;
        this.latitud = latitud;
        this.longitud=longitud;

        this.nombrePais = nombrePais;
        
      }

    getImagen(){
        var datos= {
          method: 'flickr.photos.search',
          api_key:'9639dcade4019df8efcc756a22e02688',
          tags: this.nombrePais+","+this.nombreCapital,
          format:'json',
          extras: 'url_o',
          nojsoncallback: '1'
        }
        var flickrAPI = 'https://api.flickr.com/services/rest/';
        $.getJSON(flickrAPI, datos).done((data) => {
          var photo = data.photos.photo[0];
          var image = photo.url_o;
          this.establecerFondo(image);
        });

    }

    establecerFondo(url) {
        $('body').css('background-image', `url(${url})`)
        .css('background-position','center')
        .css('background-repeat','no-repeat')
        .css('background-attachment','fixed')
        .css('background-size','cover');
      }

}
