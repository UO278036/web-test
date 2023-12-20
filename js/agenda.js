class Agenda {
    constructor() {
        this.url = "https://ergast.com/api/f1/2023";
        this.lastApiCall = null;
        this.lastApiResult = null;
    }

    pintarDatos(datos) {
        let section = $("<section>").attr("data-element", "carreras");
        section.append($("<h3>").text("Carreras F1"));

        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        $(datos).find('Race').each((index, carrera) => {
            let article = $("<article>");
            article.append($("<p>").text("#" + (index + 1)).attr("data-element", "numero"));
            article.append($("<h4>").text($(carrera).find("RaceName").text()).attr({"data-element": "nombreCarrera", "lang": "en"}));
            article.append($("<p>").text($(carrera).find("CircuitName").text()).attr({"data-element": "nombreCircuito", "lang": "en"}));

            let location = $(carrera).find("Location");
            article.append($("<p>").text(location.attr("lat") + ", " + location.attr("long")).attr("data-element", "coordenadasCircuito"));

            let date = new Date($(carrera).find("Date").first().text());
            article.append($("<p>").text(diasSemana[date.getDay()] + " " + date.toLocaleDateString() + "\n" + $(carrera).find("Time").first().text()).attr("data-element", "fecha"));

            let locality = $(carrera).find("Locality").text() + ", " + $(carrera).find("Country").text();
            article.append($("<p>").text(locality).attr({"data-element": "lugar", "lang": "en"}));

            section.append(article);
        });

        $("body").append(section);
    }

    callAjax() {
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: datos => {
                this.lastApiResult = datos;
                this.pintarDatos(datos);
            },
            error: () => {
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://ergast.com'>Ergast</a>");
            }
        });
    }

    borrarCarreras() {
        $("section[data-element='carreras']").remove();
    }

    cargarDatos() {
        const ahora = new Date().getTime();
        const dif = this.lastApiCall ? (ahora - this.lastApiCall) / (1000 * 60) : Infinity;

        if (dif >= 5 || !this.lastApiCall) {
            this.borrarCarreras();
            this.callAjax();
            this.lastApiCall = ahora;
        } else if (this.lastApiResult) {
            this.borrarCarreras();
            this.pintarDatos(this.lastApiResult);
        }
    }
}
