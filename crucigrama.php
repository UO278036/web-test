<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico"/>
    <title>Escritorio Virtual - Crucigrama</title>

    <meta name ="author" content ="Raúl Fernández España" />

    <meta name ="description" content ="Crucigrama" />

    <meta name ="keywords" content ="Crucigrama, Matematico" />

    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/multimedia/imagenes/favicon.ico">
    <!-- añadir el elemento link de enlace a la hoja de estilo dentro del <head> del documento html -->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo_botonera.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />

    <script src="js/crucigrama.js"></script>
    <script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"></script>

</head>
<?php
class Record{

    protected $server;
    protected $user;
    protected $pass;
    protected $dbname;

    public function __construct(){
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "records";

        $this->conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if($this->conn->connect_error){
            die("Fallo de conexión" . $this->conn->connect_error);
        }
    }

    public function guardaDatos($nombre,$apellidos,$nivel,$tiempo){
        $stmt = $this->conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)"); 
        $stmt->bind_param("sssi", $nombre, $apellidos, $nivel, $tiempo);

        $stmt->execute();

        $stmt->close();
    }

    public function obtenerRanking($nivel){
        $sql = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();
        $records = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        return $records;
    }

    public function closeConn(){
        $this->conn->close();
    }
}
?>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
            <h1>Escritorio Virtual</h1>
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
        <section>
            <h2>Juegos</h2>
            <ul>
                <li><a tabindex="8" accesskey="E" href="memoria.html" title="Memoria">Memoria</a></li>
                <li><a tabindex="9" accesskey="U" href="sudoku.html" title="Sudoku">Sudoku</a></li>
                <li><a tabindex="10" accesskey="C" href="crucigrama.php" title="Crucigrama">Crucigrama</a></li>
                <li><a tabindex="11" accesskey="P" href="api.html" title="Reproductor">Reproductor</a></li>    
                <li><a tabindex="12" accesskey="D" href="php/videoclub.php" title="Videoclub">Videoclub</a></li>   
            </ul>
        </section>
    <h2>Crucigrama matemático</h2>
    
    

    <script>
        var crucigrama= new Crucigrama("4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-"+
        ",.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-"+
        ",#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16");
        crucigrama.paintMathword();
        document.addEventListener('keydown', function (event) {

            var symbols=['+','-','/','*'];
            if ((event.key >= '1' && event.key <= '9') || symbols.includes(event.key)) {
                if (crucigrama.selectedCell===null) {
                    alert('Seleccione una celda antes de introducir un número.');
                }else {
                    crucigrama.introduceElement(event.key);
                }

            }
        });
    </script>

<section data-type="botonera">
        <h2>Botonera</h2>
        <button onclick="crucigrama.introduceElement(1)">1</button>
        <button onclick="crucigrama.introduceElement(2)">2</button>
        <button onclick="crucigrama.introduceElement(3)">3</button>
        <button onclick="crucigrama.introduceElement(4)">4</button>
        <button onclick="crucigrama.introduceElement(5)">5</button>
        <button onclick="crucigrama.introduceElement(6)">6</button>
        <button onclick="crucigrama.introduceElement(7)">7</button>
        <button onclick="crucigrama.introduceElement(8)">8</button>
        <button onclick="crucigrama.introduceElement(9)">9</button>
        <button onclick="crucigrama.introduceElement('*')">*</button>
        <button onclick="crucigrama.introduceElement('+')">+</button>
        <button onclick="crucigrama.introduceElement('-')">-</button>
        <button onclick="crucigrama.introduceElement('/')">/</button>
    </section>
    
<?php
    $record = new Record();

    if (count($_POST)>0) {  

        $nombre = $_POST['nombre'];
        $apellidos = $_POST['apellidos'];
        $nivel = $_POST['nivel'];
        $tiempo = (int)$_POST['tiempo'];

        $record->guardaDatos($nombre,$apellidos,$nivel,$tiempo);

        $mejoresRecords = $record->obtenerRanking($nivel);

        echo '<section name="ranking">';
        echo '<h4>Ránking de tiempos</h4>';
        echo '<ol>';
        foreach ($mejoresRecords as $recordRanking) {
            $tiempoFormateado = gmdate("H:i:s", $recordRanking['tiempo']);
            echo "<li>{$recordRanking['nombre']} {$recordRanking['apellidos']} - {$tiempoFormateado}</li>";
        }
        echo '</ol>';
        echo '</section>';

        $record->closeConn();

        
    }    
?>
</body>
</html>