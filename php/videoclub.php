<?php
class Videoclub {

    public string $server;
    public string $user;
    public string $pass;
    public string $dbname;
    public string $mensaje = "";
    public string $peliculasAlquiladas = "";
    public string $peliculasDisponibles = "";
    public string $peliculasDeDirector = "";

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "videoclub";
    }

    public function crearVideoclub() {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        if ($conn) {
            $sql = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
            if ($conn->multi_query($sql) === TRUE) {
                $this->mensaje .= "Base de datos creada exitosamente.";
            } else {
                $this->mensaje .= "Error al crear la base de datos: " . $conn->error;
            }
            mysqli_select_db($conn, $this->dbname);
            $sqlFile = file_get_contents('creacion.sql');
            if ($conn->multi_query($sqlFile)) {
                $this->mensaje .= "Tablas creadas exitosamente.";
            } else {
                $this->mensaje .= "Error al crear las tablas: " . $conn->error;
            }
            $this->cerrarConexion($conn);
        }
    }

    public function crearConexion() {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_errno) {
            $this->mensaje .= "Error de conexión: " . $conn->connect_error;
        }
        return $conn;
    }

    public function cerrarConexion($conn) {
        $conn->close();
    }

    public function importarCSV($archivo) {
        $db = $this->crearConexion();
        $selectedTabla = "";
        ini_set("auto_detect_line_endings", true);
        if (($handle = fopen($archivo, 'r')) !== false) {
            while (($fila = fgetcsv($handle, 2000, ",")) !== false) {
                $tabla = $fila[0];
                if ($tabla == 'ID_Director') {
                    $selectedTabla = "director";
                } else if ($tabla == 'ID_Productora') {
                    $selectedTabla = "productora";
                } else if ($tabla == 'ID_Pelicula') {
                    $selectedTabla = "pelicula";
                } else if ($tabla == 'ID_Cliente') {
                    $selectedTabla = "cliente";
                } else if ($tabla == 'ID_Alquiler') {
                    $selectedTabla = "alquiler";
                } else {
                    switch ($selectedTabla) {
                        case "director":
                            $stmt = $db->prepare('INSERT INTO director (ID_Director, Nombre, Apellido) VALUES (?, ?, ?)');
                            $stmt->bind_param('sss', $fila[0], $fila[1], $fila[2]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "productora":
                            $stmt = $db->prepare('INSERT INTO productora (ID_Productora, Nombre_Productora, Direccion) VALUES (?, ?, ?)');
                            $stmt->bind_param('sss', $fila[0], $fila[1], $fila[2]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "pelicula":
                            $stmt = $db->prepare('INSERT INTO pelicula (ID_Pelicula, Titulo, ID_Director, ID_Productora, Stock) VALUES (?, ?, ?, ?, ?)');
                            $stmt->bind_param('sssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "cliente":
                            $stmt = $db->prepare('INSERT INTO cliente (ID_Cliente, Nombre, Apellido, Direccion) VALUES (?, ?, ?, ?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                        case "alquiler":
                            $stmt = $db->prepare('INSERT INTO alquileres (ID_Alquiler, ID_Cliente, ID_Pelicula, Fecha_Alquiler, Fecha_Devolucion) VALUES (?, ?, ?, ?, ?)');
                            $stmt->bind_param('sssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                    }
                }
            }
            $db->close();
            fclose($handle);
        } else {
            $this->mensaje .= "Error al abrir el archivo CSV";
        }
    }

    public function exportarCSV() {
        $conn = $this->crearConexion();

        $csvFile = 'videoclubExportado.csv';

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $csvFile . '"');
  
        $file = fopen('php://output', 'w');
    

        $query_director = "SELECT * FROM director";
        $result_director = $conn->query($query_director);
        if ($result_director->num_rows > 0) {
          
            fputcsv($file, array('ID_Director', 'Nombre', 'Apellido'));
   
            while ($row = $result_director->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
    
  
        $query_productora = "SELECT * FROM productora";
        $result_productora = $conn->query($query_productora);
        if ($result_productora->num_rows > 0) {
         
            fputcsv($file, array('ID_Productora', 'Nombre_Productora', 'Direccion'));
    
            while ($row = $result_productora->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
    
      
        $query_pelicula = "SELECT * FROM pelicula";
        $result_pelicula = $conn->query($query_pelicula);
        if ($result_pelicula->num_rows > 0) {
            fputcsv($file, array('ID_Pelicula', 'Titulo', 'ID_Director', 'ID_Productora', 'Stock'));
            while ($row = $result_pelicula->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
    
        $query_cliente = "SELECT * FROM cliente";
        $result_cliente = $conn->query($query_cliente);
        if ($result_cliente->num_rows > 0) {
            fputcsv($file, array('ID_Cliente', 'Nombre', 'Apellido', 'Direccion'));
            while ($row = $result_cliente->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
    
        $query_alquileres = "SELECT * FROM alquileres";
        $result_alquileres = $conn->query($query_alquileres);
        if ($result_alquileres->num_rows > 0) {
            fputcsv($file, array('ID_Alquiler', 'ID_Cliente', 'ID_Pelicula', 'Fecha_Alquiler', 'Fecha_Devolucion'));
            while ($row = $result_alquileres->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }
    
        fclose($file);
        $conn->close();
        exit();
    }
    

    public function consultarPeliculasEnAlquiler() {
        $db = $this->crearConexion();
        $query = "SELECT p.Titulo AS Pelicula, a.Fecha_Devolucion FROM pelicula p JOIN alquileres a ON p.ID_Pelicula = a.ID_Pelicula";
        $result = $db->query($query);
        if ($result->num_rows > 0) {
            $this->peliculasAlquiladas .= "<article><h3>Películas en alquiler</h3><ul>";
            while ($row = $result->fetch_assoc()) {
                $this->peliculasAlquiladas .= "<li>Película: " . $row["Pelicula"] . " - Fecha de Devolución: " . $row["Fecha_Devolucion"] . "</li>";
            }
            $this->peliculasAlquiladas .= "</ul></article>";
        } else {
            $this->peliculasAlquiladas .= "<p>No hay películas en alquiler.</p>";
        }
        $db->close();
        return $this->peliculasAlquiladas;
    }

    public function consultarPeliculasDisponibles() {
        $db = $this->crearConexion();
        $query = "SELECT p.Titulo AS Pelicula FROM pelicula p LEFT JOIN alquileres a ON p.ID_Pelicula = a.ID_Pelicula WHERE a.ID_Alquiler IS NULL OR a.Fecha_Devolucion < CURRENT_DATE";
        $result = $db->query($query);
        if ($result->num_rows > 0) {
            $this->peliculasDisponibles .= "<article><h3>Películas disponibles</h3><ul>";
            while ($row = $result->fetch_assoc()) {
                $this->peliculasDisponibles .= "<li>Película: " . $row["Pelicula"] . "</li>";
            }
            $this->peliculasDisponibles .= "</ul></article>";
        } else {
            $this->peliculasDisponibles .= "<p>No hay películas disponibles.</p>";
        }
        $db->close();
        return $this->peliculasDisponibles;
    }

    public function consultarPorDirector($director) {
        $db = $this->crearConexion();
        $query = "SELECT pelicula.Titulo FROM pelicula JOIN director ON pelicula.ID_Director = director.ID_Director WHERE LOWER(director.Nombre) LIKE LOWER(?) OR LOWER(director.Apellido) LIKE LOWER(?);";
        $stmt = $db->prepare($query);
        $param = "%{$director}%";
        $stmt->bind_param("ss", $param, $param);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $this->peliculasDeDirector .= "<article><h3>Películas del director</h3><ul>";
            while ($row = $result->fetch_assoc()) {
                $this->peliculasDeDirector .= "<li>Película: " . $row["Titulo"] . "</li>";
            }
            $this->peliculasDeDirector .= "</ul></article>";
        } else {
            $this->peliculasDeDirector .= "<p>No hay películas de ese director.</p>";
        }
        $stmt->close();
        $db->close();
        return $this->peliculasDeDirector;
    }

    public function añadirCliente($idCliente, $nombre, $apellido, $direccion) {
        $db = $this->crearConexion();
        $stmt = $db->prepare("INSERT INTO cliente (ID_Cliente, Nombre, Apellido, Direccion) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('ssss', $idCliente, $nombre, $apellido, $direccion);

        if($stmt->execute()) {
            $this->mensaje .= "Cliente añadido exitosamente.";
        } else {
            $this->mensaje .= "Error al añadir cliente: " . $stmt->error;
        }

        $stmt->close();
        $db->close();
    }
}

$videoclub = new Videoclub();
if (isset($_POST['importar_csv'])) {
    $videoclub->crearVideoclub();
    $videoclub->importarCSV($_FILES['importarCSV']['tmp_name']);
    $videoclub->consultarPeliculasEnAlquiler();
    $videoclub->consultarPeliculasDisponibles();
}
if (isset($_POST['exportar_csv'])) {
    $videoclub->exportarCSV();
}
if (isset($_POST['consultar_por_director'])) {
    $videoclub->consultarPorDirector($_POST["director"]);
}
if (isset($_POST['consulta_inicial'])) {
    $videoclub->consultarPeliculasEnAlquiler();
    $videoclub->consultarPeliculasDisponibles();
}
if (isset($_POST['añadir_cliente'])) {
    $videoclub = new Videoclub();
    $videoclub->añadirCliente($_POST['idCliente'], $_POST['nombre'], $_POST['apellido'], $_POST['direccion']);
   
}

?>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="author" content="Raúl Fernández España"/>
        <meta name="description" content="Documento para consultas a un videoclub"/>
        <meta name="keywords" content="Videoclub, Consultas"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Escritorio Virtual - Videoclub</title>
        <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
        <link rel="icon" href="../multimedia/imagenes/favicon.ico" />
    </head>
    <body>
    <header>
            <h1>Escritorio Virtual</h1>
            <nav>
            <a title = "Acceda a la página de Inicio" accesskey="I" tabindex="1" href="../index.html">Inicio</a>
                <a title = "Acceda a la página de Sobre Mi" accesskey="S" tabindex="2" href="../sobremi.html">Sobre Mi</a>
                <a title = "Acceda a la página de Noticias" accesskey="N" tabindex="3" href="../noticias.html">Noticias</a>
                <a title = "Acceda a la página de Agenda" accesskey="A" tabindex="4" href="../agenda.html">Agenda</a>
                <a title = "Acceda a la página de Meteorología" accesskey="M" tabindex="5" href="../meteorologia.html">Meteorología</a>
                <a title = "Acceda a la página de Viajes" accesskey="V" tabindex="6" href="../viajes.php">Viajes</a>
                <a title = "Acceda al formulario de Juegos" accesskey="J" tabindex="7" href="../juegos.html">Juegos</a>
            </nav>
    </header>
        <section>
            <h2>Juegos</h2>
            <ul>
                <li><a tabindex="8" accesskey="E" href="../memoria.html" title="Memoria">Memoria</a></li>
                <li><a tabindex="9" accesskey="U" href="../sudoku.html" title="Sudoku">Sudoku</a></li>
                <li><a tabindex="10" accesskey="C" href="../crucigrama.php" title="Crucigrama">Crucigrama</a></li>
                <li><a tabindex="11" accesskey="P" href="../api.html" title="Reproductor">Reproductor</a></li>    
                <li><a tabindex="12" accesskey="D" href="videoclub.php" title="Videoclub">Videoclub</a></li>    
            </ul>
        </section>
    <main>
        <h2>Consulta de disponibilidad de películas</h2>
        <!-- Formularios para importar, exportar, y consultar películas -->
        <form action="#" method="post" enctype="multipart/form-data">
            <label for="importarCSV">Importar CSV para la carga de datos y descargar datos insertados</label>
            <input id="importarCSV" name="importarCSV" type="file" accept=".csv"/>
            <input type="submit" name="importar_csv" value="Importar">
        </form>
        <form action="#" method="post">
            <label for="exportarCSV">Exportar datos del videoclub</label>
            <input id="exportarCSV" type="submit" name="exportar_csv" value="Exportar"></input>
        </form>
        <form action="#" method="post">
            <label for="director">Consultar películas del director:</label>
            <input id="director" name="director" type="text" placeholder="Ejemplo: Spielberg"/>
            <input id="consultarPorDirector" type="submit" name="consultar_por_director" value="Buscar"></input>
        </form>
        <form action="#" method="post">
            <label for="consultaInicial">Consultar películas</label>
            <input id="consultaInicial" type="submit" name="consulta_inicial" value="Buscar"></input>
        </form>
        <?php echo $videoclub->peliculasDisponibles ?>
        <?php echo $videoclub->peliculasAlquiladas ?>
        <?php echo $videoclub->peliculasDeDirector ?>
        <h2>Añadir Nuevo Cliente</h2>
        <form action="biblioteca.php" method="post">
            <label for="idCliente">ID Cliente:</label>
            <input type="text" id="idCliente" name="idCliente" required>

            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required>

            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" name="apellido" required>

            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" required>

            <input type="submit" name="añadir_cliente" value="Añadir Cliente">
        </form>

    </main>
    </body>
</html>