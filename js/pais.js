"use strict";

class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    setOtherInfo(gobierno, coordenadas, religion) {
        this.gobierno = gobierno;
        this.coordenadas = coordenadas;
        this.religion = religion;
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getOtherInfo() {
        return `<ul>
                    <li>Población: ${this.poblacion}</li>
                    <li>Forma de gobierno: ${this.gobierno}</li>
                    <li>Religión mayoritaria: ${this.religion}</li>
                </ul>`;
    }

    getCoordenadas() {
        document.write(`<p>Coordenadas de la capital del pais: ${this.coordenadas}</p>`);
    }

    cargaPrevision() {
        const apikey = 'd100878c0f46d2422aa60c1379f6eee7';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.capital},CF&units=metric&lang=es&APPID=${apikey}`;

        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            success: (datos) => {
                let fechaAnterior = null;
                datos.list.forEach((pronostico) => {
                    let fechaActual = new Date(pronostico.dt * 1000).toLocaleDateString();
                    if (fechaAnterior !== fechaActual) {
                        let stringDatos = `<h4>${fechaActual}</h4>
                                           <p><img src='http://openweathermap.org/img/w/${pronostico.weather[0].icon}.png' alt='Weather Icon'></p>
                                           <p> Temperatura: ${pronostico.main.temp_min} ºC / ${pronostico.main.temp_max}ºC</p>
                                           <p>Lluvia: ${(pronostico.rain ? pronostico.rain['3h'] : 0)} mm</p>
                                           <p>Humedad: ${pronostico.main.humidity}%</p>`;
                                           

                        let elemento = document.createElement("section");
                        elemento.innerHTML = stringDatos;
                        $("main[data-type='meteo']").append(elemento);
                        elemento.dataset.type = "meteo";

                        fechaAnterior = fechaActual;
                    }
                });
            },
            error: () => {
                $("h3").html("No puedo obtener JSON de <a href='http://openweathermap.org'>OpenWeatherMap</a>");
            }
        });
    }

    crearElemento(tipo, contenido, en) {
        let elemento = document.createElement(tipo);
        elemento.innerHTML = contenido;

        $(en).append(elemento);
        $(en).find(tipo).last().attr("data-type", "meteo");
    }
    creaData() {
        this.crearElemento("main", "", "body");
        this.crearElemento("h4", "Datos meteorológicos de los próximos 5 días", "main");

        this.cargaPrevision();
    }
}
