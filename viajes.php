<?php
    class Carrusel {
        public string $capital = "";
        public string $pais = "";

        public function __construct($nombreCapital, $nombrePais) {
            $this->capital = $nombreCapital;
            $this->pais = $nombrePais;
        }

        function getPhotos() {
            $api_key = 'dca15d938afdb21cf3b1f68082de9201';
            $tag = $this->capital;
            $perPage = 10;
            // Fotos públicas recientes
            $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
            $url.= '&api_key='.$api_key;
            $url.= '&tags='.$tag;
            $url.= '&per_page='.$perPage;
            $url.= '&format=json';
            $url.= '&nojsoncallback=1';

            $respuesta = file_get_contents($url);
            $json = json_decode($respuesta);

            $carrusel = "<article data-element='carrusel'><h3>Carrusel de imágenes</h3>";
            for($i=0;$i<$perPage;$i++) {
                $titulo = $json->items[$i]->title;
                $URLfoto = str_replace("_m.jpg", "_b.jpg", $json->items[$i]->media->m);
                $img = "<img data-element='carruselImg' alt='".$titulo."' src='".$URLfoto."' />";
                $carrusel .= $img;
            }
            $carrusel .=  "<button data-action='next' onclick='viajes.carruselSiguiente()'> > </button>
            <button data-action='prev'  onclick='viajes.carruselAnterior()'> < </button></article>";
            return $carrusel;
        }
    }

class Moneda{
    public $local;
    public $cambio;

    public function __construct($local, $cambio){
        $this->local = $local;
        $this->cambio = $cambio;
    }

    function obtenerCambio() {
        $api_key = "8a2ceb613dba326b0b0b9e76";
        $url = "https://open.er-api.com/v6/latest/".$this->cambio."?app_id=" . $api_key;
    
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
    
        $data = json_decode($response, true);
    
        if(isset($data['rates'])) {
            $cotizacion = $data['rates'][$this->local];
            echo "<p>1€ son: ".$cotizacion." Franco CFA de África Central (XAF)</p>";
        } else {
            echo "No se pudo obtener el tipo de cambio.";
        }
    }
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name ="author" content ="Raúl Fernánez España" />
    <meta name ="description" content ="Plantilla html para el escritorio virtual" />
    <meta name ="keywords" content ="Escritorio Virtual Plantilla" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <title>Escritorio virtual</title>
    <link rel="icon" href="/multimedia/imagenes/favicon.ico">
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />
    <script src='https://api.mapbox.com/mapbox-gl-js/v2.7.0/mapbox-gl.js'></script>
    <script src="js/viajes.js"></script>

    <script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>
        
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>Escritorio virtual viajes</h1>
        <nav>
            <a title = "Acceda a la página de Inicio" accesskey="I" tabindex="1" href="index.html">Inicio</a>
            <a title = "Acceda a la página de Sobre Mi" accesskey="S" tabindex="2" href="sobremi.html">Sobre Mi</a>
            <a title = "Acceda a la página de Noticias" accesskey="N" tabindex="3" href="noticias.html">Noticias</a>
            <a title = "Acceda a la página de Agenda" accesskey="A" tabindex="4" href="agenda.html">Agenda</a>
            <a title = "Acceda a la página de Meteorología" accesskey="M" tabindex="5" href="meteorologia.html">Meteorología</a>
            <a title = "Acceda a la página de Viajes" accesskey="V" tabindex="6" href="viajes.php">Viajes</a>
            <a title = "Acceda al formulario de Juegos" accesskey="J" tabindex="7" href="juegos.html">Juegos</a>
        </nav>
    </header>
    <h2>Viajes</h2>
    <?php 
            $carrusel = new Carrusel('Bangui', 'Central African Republic');
            echo $carrusel->getPhotos();
			      $moneda = new Moneda("XAF","EUR");
                $moneda->obtenerCambio();
        ?>

    <p>
        <label for="archivoTexto">Carga un archivo XML:</label>
        <input type="file" id="archivoTexto" name="Archivo XML" onchange="viajes.cargaXML(this.files);" accept="application/xml">
    </p>
    
    <p>
        <label for="archivosKML">Carga uno o varios archivos KML:</label>
        <input type="file" id="archivosKML" name="Archivos KML" onchange="viajes.representaRutas(this.files)" accept=".kml" multiple>
    </p>
    
    <p>
        <label for="archivosSVG">Carga uno o varios archivos SVG:</label>
        <input type="file" id="archivosSVG" name="Archivos SVG" onchange="viajes.cargaSVG(this.files)" accept=".svg" multiple>
    </p>

    <script>
        let viajes = new Viajes();
        

        $("button[data-action='next']").on("click", viajes.carruselSiguiente());
        $("button[data-action='prev']").on("click", viajes.carruselAnterior());

    </script>

    <main>
        <h3>Mapas</h3>
    </main>


</body>
</html>