var arc = 0;
class Reproductor {
  constructor() {
    this.playState = false;
  }

  leerArchivo(archivos) {
      arc = archivos;
      this.audio = new window.AudioContext();

      var fileReader = new FileReader();
      fileReader.onload = (e) =>{
          this.playMusic(e.target.result);
      };
      fileReader.readAsArrayBuffer(archivos[0]);
  }

  playMusic(audioFile) {
      this.audio.decodeAudioData(audioFile, (buffer) => {
          this.audioBuffer = buffer;
      })
  }

  play() {
      this.audio.close()
      this.audio = null;
      this.leerArchivo(arc)

      if(this.audio != null){
        this.stop();
        this.source = this.audio.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.loop = true;
        this.source.connect(this.audio.destination);
        this.source.start(0);
        this.audio.resume();
      } else{
        alert("Introduce un archivo de audio");
      }
  }
  eliminarCancion() {
    if (this.source) {
        this.source.stop(); // Detiene la fuente actual
        this.source = null; // Elimina la referencia a la fuente
    }
    if (this.audioBuffer) {
        this.audioBuffer = null; // Elimina el buffer actual
    }
    this.playState = false; // Actualiza el estado de reproducción

    // Opcional: resetea el input de archivo para seleccionar otra canción
    const input = document.getElementById("musi");
    if (input) {
        input.value = "";
    }
}
  reanudar() {
    if (this.source) {
      this.audio.resume();
    }
}
  stop() {
      if (this.source) {
          this.playState = true;
          this.audio.suspend();
      }
  }
    dropHandler(ev) {  
        ev.preventDefault();
    
        if (ev.dataTransfer.items) {
          if (ev.dataTransfer.items[0].kind === 'file') {
              var file = ev.dataTransfer.items[0].getAsFile();
              var archivos = new Array();
              archivos.push(file);
              arc = archivos;
              this.leerArchivo(arc);
          }
        } else {
          var file = ev.dataTransfer.items[0].getAsFile();
          this.leerArchivo(file);
        }
        this.removeDragData(ev);
        this.play();
    }
  
    removeDragData(ev) {
      console.log('Removing drag data')
    
      if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
      } else {
        ev.dataTransfer.clearData();
      }
    }
    dragOverHandler(ev) {
      console.log('File(s) in drop zone');
      ev.preventDefault();
    }
  }

  document.addEventListener('keydown', function(event) {
    // Tecla sencilla
        if (event.key === "Tab")
            document.querySelector('input[type=file').click();
        else if (event.key === "Enter"){
            if (!document.fullscreenElement){
                document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen){
                document.exitFullscreen();
            }
        }
})
  
  var reproductor = new Reproductor();

