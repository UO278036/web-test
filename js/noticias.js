"use strict";
class Noticias {

    constructor(){
        if (window.File && window.FileReader && window.FileList && window.Blob) 
        {  
            document.write("<p>Este navegador soporta el API File </p>");
        }
        else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !</p>");
    }

    readInputFile(files){

        var archivo = files[0];
        
        var errorArchivo = document.getElementById("errorLectura");
      
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) 
        {
            var lector = new FileReader();
            lector.onload = function (evento) {

                this.procesaNoticia(lector.result);
            }.bind(this);
                
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡Archivo no válido!";
        }       
    }

    procesaNoticia(result){
        var lines=result.split('\n');
        lines.forEach(line => {
            var parts=line.split('_');
            var title=parts[0];
            var subtitle=parts[1];
            var text=parts[2];
            var autor=parts[3];

            var section= $(`<section></section>`);
            section.append(`<h2>${title}</h2>`);
            section.append(`<h3>${subtitle}</h3>`);
            section.append(`<p>${text}</p>`);
            section.append(`<p>${autor}</p>`);

            
            var existingSection = $('main section:last-child');


            existingSection.before(section);
            
        });
    }

    creaNoticia() {
        var titulo = $('input[type="text"]:eq(0)').val();
        var subtitulo = $('input[type="text"]:eq(1)').val();
        var contenido = $('input[type="text"]:eq(2)').val();
        var autor = $('input[type="text"]:eq(3)').val();

        if(titulo==='' || subtitulo==='' || contenido==='' || autor===''){
            alert('Alguno de los campos está vacío');
        }else{
            var section = $('<section></section>');
            section.append(`<h2>${titulo}</h2>`);
            section.append(`<h3>${subtitulo}</h3>`);
            section.append(`<p>${contenido}</p>`);
            section.append(`<p>${autor}</p>`);

            var existingSection = $('main section:last-child');


            existingSection.before(section);

            $('input[type="text"]').val('');
        }
    }

    
}