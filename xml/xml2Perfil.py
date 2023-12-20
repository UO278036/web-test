import xml.etree.ElementTree as ET


import xml.etree.ElementTree as ET

def getPoints(nRuta):
    try:
        arbol = ET.parse("rutasEsquema.xml")

    except IOError:
        print('No se encuentra el archivo ', "rutasEsquema.xml")
        exit()

    except ET.ParseError:
        print("Error procesando en el archivo XML = ", "rutasEsquema.xml")
        exit()

    raiz = arbol.getroot()

    resultados = ""
    cruta = 0
    # Recorrido de los elementos del árbol
    for ruta in raiz.findall(".//{http://www.uniovi.es}ruta"):

        cruta = cruta + 1
        if cruta == nRuta:
            distanciaAnterior = 0
            alturaInicio = ""
            for coordenada in ruta.findall(".//{http://www.uniovi.es}coordenadas"):
                for ai in coordenada.findall(".//{http://www.uniovi.es}altitud"):
                    alturaInicio = ai.text

                # Ajusta el factor de escala para la altura (aumenta para hacer más marcada la diferencia)
                escala_altura = 10

                resultados = "100" + "," + str(float(alturaInicio) * escala_altura / 100 + 300) + '\n'
                resultados = resultados + "100" + "," + str(float(alturaInicio) * escala_altura / 100 + 200) + '\n'

            puntoInicial = "100" + "," + str(float(alturaInicio) * escala_altura / 100 + 200) + '\n'
            distanciaAnterior = 100

            for hito in ruta.findall(".//{http://www.uniovi.es}hito"):

                for a in hito.findall(".//{http://www.uniovi.es}altitud"):
                    altura = a.text

                for d in hito.findall(".//{http://www.uniovi.es}distancia"):
                    distancia = d.text

                # Ajusta el factor de escala para la altura aquí también
                resultado = str(float(distancia) / 20 + distanciaAnterior) + "," + str(
                    float(alturaInicio) * escala_altura / 100 + 200 - float(altura) * escala_altura / 100) + '\n'
                resultados = resultados + resultado
                distanciaAnterior = float(distancia) / 20 + distanciaAnterior

            resultados = resultados + str(distanciaAnterior) + "," + str(float(alturaInicio) * escala_altura / 100 + 300) + '\n'
            resultados = resultados + "100" + "," + str(
                float(alturaInicio) * escala_altura / 100 + 300) + '\n' + '"\nstyle="fill:white;stroke:red;stroke-width:4" />\n'

    return resultados


# Resto del código permanece sin cambios...




def setText(nRuta):
    try:
        arbol = ET.parse("rutasEsquema.xml")

    except IOError:
        print('No se encuentra el archivo ', "rutasEsquema.xml")
        exit()

    except ET.ParseError:
        print("Error procesando en el archivo XML = ", "rutasEsquema.xml")
        exit()

    raiz = arbol.getroot()

    resultados = ""
    cruta = 0
    # Recorrido de los elementos del árbol
    for ruta in raiz.findall(".//{http://www.uniovi.es}ruta"):

        cruta = cruta + 1
        if cruta == nRuta:

            alturaInicio = ""
            for coordenada in ruta.findall(".//{http://www.uniovi.es}coordenadas"):
                for ai in coordenada.findall(".//{http://www.uniovi.es}altitud"):
                    alturaInicio = ai.text

            distanciaAnterior = 100
            resultados = '<text x="' + str(distanciaAnterior) + '" y="' + str(float(
                alturaInicio) / 100 + 400) + '" style="writing-mode: tb; glyph-orientation-vertical: 0;">' + 'Inicio' + '</text>\n'

            for hito in ruta.findall(".//{http://www.uniovi.es}hito"):

                for d in hito.findall(".//{http://www.uniovi.es}distancia"):
                    distancia = d.text

                for n in hito.findall(".//{http://www.uniovi.es}nombreDehito"):
                    nombre = n.text

                for a in hito.findall(".//{http://www.uniovi.es}altitud"):
                    altura = a.text

                resultado = '<text x="' + str(float(distancia) / 20 + distanciaAnterior) + '" y="' + str(float(
                    alturaInicio) / 100 + 400) + '" style="writing-mode: tb; glyph-orientation-vertical: 0;">' + nombre + '</text>\n'
                distanciaAnterior = float(distancia) / 20 + distanciaAnterior
                resultados = resultados + resultado



    return resultados


def prologoSVG(archivo, nombre):
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write('<polyline points=\n"\n')


def epilogoSVG(archivo):
    archivo.write("</svg>\n")


def main():
    for nRuta in range(1, 4, 1):
        nombreSalida = input("Introduzca el nombre del archivo generado (*.svg) = ")
        try:
            salida = open(nombreSalida + ".svg", 'w', encoding='utf-8')

        except IOError:
            print('No se puede crear el archivo ', nombreSalida + ".svg")
            exit()

        prologoSVG(salida, nombreSalida)

        salida.write(getPoints(nRuta))
        salida.write(setText(nRuta))

        epilogoSVG(salida)
        salida.close()


if __name__ == "__main__":
    main()

