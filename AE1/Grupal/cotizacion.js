// Importamos los módulos necesarios
const https = require('https');
const fs = require('fs');

// Obtenemos los argumentos por línea de comando y los asignamos a variables
const fileName = process.argv[2];
const fileExtension = process.argv[3];
const economicIndicator = process.argv[4];
const amountToConvert = process.argv[5];
const date = process.argv[6];

// Construimos la URL de la consulta a la API de mindicador utilizando los argumentos proporcionados
const apiUrl = `https://mindicador.cl/api/${economicIndicator}/${date}`;

// Realizamos una consulta a la API de mindicador utilizando el módulo https
https.get(apiUrl, (res) => {
  let data = '';

  // Concatenamos los chunks de datos recibidos
  res.on('data', (chunk) => {
    data += chunk;
  });

  // Al finalizar la respuesta, procesamos los datos
  res.on('end', () => {
    // Parseamos la respuesta en formato JSON
    const response = JSON.parse(data);
    // Obtenemos el primer elemento de la serie de datos
    const serie = response.serie[0];

    // Verificamos si se encontraron datos para el indicador económico y la fecha especificados
    if (serie) {
      // Obtenemos el valor del indicador económico
      const value = serie.valor;
      // Calculamos el monto convertido
      const convertedAmount = (amountToConvert / value).toFixed(2);
      // Generamos el contenido del archivo utilizando el template proporcionado y los datos obtenidos
      const fileContent = `A la fecha: ${date}\nFue realizada cotización con los siguientes datos:\nCantidad de pesos a convertir: ${amountToConvert} pesos\nConvertido a "${economicIndicator}" da un total de:\n$${convertedAmount}`;

      // Creamos el archivo con el módulo fs utilizando el nombre y extensión especificados
      fs.writeFile(`${fileName}.${fileExtension}`, fileContent, (err) => {
        if (err) throw err;
        // Enviamos el contenido del archivo por consola
        console.log(fileContent);
      });
    } else {
      // Si no se encontraron datos para el indicador económico y la fecha especificados, enviamos un mensaje por consola
      console.log('No se encontraron datos para el indicador económico y la fecha especificados.');
    }
  });
});