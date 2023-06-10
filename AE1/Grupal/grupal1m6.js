// Importamos los módulos necesarios
const https = require('https');
const fs = require('fs');
const { exec } = require('child_process');

// Obtenemos los argumentos por línea de comando y los asignamos a variables
const [grupal1, txt, economicIndicator, amountToConvert] = process.argv.slice(2);

// Realizamos una consulta a la API de mindicador para obtener el valor del indicador económico especificado
https.get(`https://mindicador.cl/api/${economicIndicator}`, (res) => {
  let data = '';

  // Concatenamos los chunks de datos recibidos
  res.on('data', (chunk) => {
    data += chunk;
  });

  // Al finalizar la respuesta, procesamos los datos
  res.on('end', () => {
    // Parseamos la respuesta en formato JSON
    const response = JSON.parse(data);
    console.log(response); // Agregamos un console.log para ver qué datos estamos recibiendo de la API
    // Obtenemos el valor del indicador económico
    const value = response.serie[0].valor;
    // Calculamos el monto convertido
    const convertedAmount = (amountToConvert / value).toFixed(2);
    // Obtenemos la fecha actual
    const date = new Date().toString();
    // Generamos el contenido del archivo usando el template proporcionado
    const fileContent = `A la fecha: ${date}\nFue realizada cotización con los siguientes datos:\nCantidad de pesos a convertir: ${amountToConvert} pesos\nConvertido a "${economicIndicator}" da un total de:\n$${convertedAmount}`;

    // Creamos el archivo con el módulo fs
    fs.writeFile(`${grupal1}.${txt}`, fileContent, (err) => {
      if (err) throw err;
      // Enviamos el contenido del archivo por consola
      console.log(fileContent);
    });
  });
});

// Ejemplo de cómo ejecutar la aplicación desde un archivo externo con el módulo child_process
exec(`node ${grupal1}.${txt}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(stdout);
});