const { exec } = require('child_process');

// Obtenemos los argumentos por línea de comando y los asignamos a variables
const fileName = process.argv[2];
const fileExtension = process.argv[3];
const economicIndicator = process.argv[4];
const amountToConvert = process.argv[5];
const date = process.argv[6];

console.log('Datos recibidos:', fileName, fileExtension, economicIndicator, amountToConvert, date);

// Ejecutar el archivo cotizacion.js con los argumentos proporcionados
exec(`node cotizacion.js ${fileName} ${fileExtension} ${economicIndicator} ${amountToConvert} ${date}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar cotizacion.js: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error al ejecutar cotizacion.js: ${stderr}`);
    return;
  }

  // Mostrar el contenido del archivo generado por cotizacion.js
  console.log('Contenido del archivo generado:');
  console.log(stdout);
});


// ejecutar en consola: node childcotizacion.js cotizacion txt  dolar 250000 08-05-2023
// podemos cambiar el monto y la fecha que queremos consultar.
//si no encuentra datos child, no genera el txt
