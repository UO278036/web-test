CREATE TABLE IF NOT EXISTS director (
    ID_Director VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS productora (
    ID_Productora VARCHAR(50) PRIMARY KEY,
    Nombre_Productora VARCHAR(100),
    Direccion VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS pelicula (
    ID_Pelicula VARCHAR(50) PRIMARY KEY,
    Titulo VARCHAR(100),
    ID_Director VARCHAR(50),
    ID_Productora VARCHAR(50),
    Stock VARCHAR(50),
    FOREIGN KEY (ID_Director) REFERENCES director(ID_Director),
    FOREIGN KEY (ID_Productora) REFERENCES productora(ID_Productora)
);


CREATE TABLE IF NOT EXISTS cliente (
    ID_Cliente VARCHAR(50) PRIMARY KEY,
    Nombre VARCHAR(50),
    Apellido VARCHAR(50),
    Direccion VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS alquileres (
    ID_Alquiler VARCHAR(50) PRIMARY KEY,
    ID_Cliente VARCHAR(50),
    ID_Pelicula VARCHAR(50),
    Fecha_Alquiler VARCHAR(50),
    Fecha_Devolucion VARCHAR(50),
    FOREIGN KEY (ID_Cliente) REFERENCES cliente(ID_Cliente),
    FOREIGN KEY (ID_Pelicula) REFERENCES pelicula(ID_Pelicula)
);
