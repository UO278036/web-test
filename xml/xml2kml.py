import xml.etree.ElementTree as ET

def getCoordenadasHitosRutas(nRuta):

    try:
        arbol = ET.parse("rutasEsquema.xml")

    except IOError:
        print ('No se encuentra el archivo ', "rutasEsquema.xml")
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

             for hito in ruta.findall(".//{http://www.uniovi.es}hito"):
                 
                 for l in hito.findall(".//{http://www.uniovi.es}latitud"):
                     latitud = l.text

                 for lo in hito.findall(".//{http://www.uniovi.es}longitud"):
                     longitud = lo.text

                 for a in hito.findall(".//{http://www.uniovi.es}altitud"):
                     altura  = a.text
                     
                 resultado = longitud  + "," + latitud + ","+ altura +'\n'
                 resultados = resultados + resultado
                 
    return resultados   

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo 
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")
             
def main():
     
    for nRuta in range(1,4,1):
         nombreSalida  = input("Introduzca el nombre del archivo generado (*.kml) = ")
         try:
            salida = open(nombreSalida + ".kml",'w')

         except IOError:
            print ('No se puede crear el archivo ', nombreSalida + ".kml")
            exit()

         prologoKML(salida, nombreSalida)

         salida.write(getCoordenadasHitosRutas(nRuta))

         epilogoKML(salida)
         salida.close()
   
if __name__ == "__main__":
    main()          

   