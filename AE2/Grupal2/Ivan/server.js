// Importamos los módulos necesarios
const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require('path');

// Creamos un servidor HTTP
http.createServer(function (req, res) {
  // Obtenemos los parámetros de la URL
  const params = url.parse(req.url, true).query;
  const nombre = params.archivo;
  let contenido = params.contenido;

  // Obtenemos la fecha actual y la formateamos
  const fecha = new Date();
  const dia = fecha.getDate() < 10 ? `0${fecha.getDate()}` : fecha.getDate();
  const mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  const fechaFormateada = `${dia}/${mes}/${anio}`;

  // Agregamos la fecha al comienzo del contenido
  contenido = `${fechaFormateada}\n\n${contenido}`;

  // Si la ruta es /crear
  if (req.url.includes("/crear")) {
    // Creamos un archivo con el nombre y contenido especificados
    fs.writeFile(nombre, contenido, (err) => {
      if (err) {
        // Si hay un error al crear el archivo, enviamos un mensaje de error
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Error al crear el archivo");
        res.end();
      } else {
        // Si el archivo se creó con éxito, enviamos un mensaje de éxito
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Archivo creado con éxito");
        res.end();
      }
    });
  } else if (req.url.includes("/leer")) {
    // Si la ruta es /leer
    // Leemos el contenido del archivo especificado
    fs.readFile(nombre, "utf8", (err, data) => {
      if (err) {
        // Si hay un error al leer el archivo, enviamos un mensaje de error
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Error al leer el archivo");
        res.end();
      } else {
        // Si el archivo se leyó con éxito, enviamos su contenido
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write(`Contenido del archivo:\n\n${data}`);
        res.end();
      }
    });
  } else if (req.url.includes("/renombrar")) {
    // Si la ruta es /renombrar
    const nuevoNombre = params.nuevoNombre;
    // Renombramos el archivo especificado con el nuevo nombre proporcionado
    fs.rename(params.nombre, nuevoNombre, (err) => {
      if (err) {
        // Si hay un error al renombrar el archivo, enviamos un mensaje de error
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write("Error al renombrar el archivo");
        res.end();
      } else {
        // Si el archivo se renombró con éxito, enviamos un mensaje de éxito
        const mensaje = `Archivo "${params.nombre}" renombrado a "${nuevoNombre}" con éxito`;
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.write(mensaje);
        res.end();
      }
    });
  } else if (req.url.includes("/eliminar")) {
    // Si la ruta es /eliminar
    // Enviamos el mensaje de que la solicitud se está procesando
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write(`Tu solicitud para eliminar el archivo ${nombre} se está procesando`);
    // Esperamos 3 segundos antes de eliminar el archivo
    setTimeout(() => {
      fs.unlink(nombre, (err) => {
        if (err) {
          // Si hay un error al eliminar el archivo, enviamos un mensaje de error
          res.write("\nError al eliminar el archivo");
          res.end();
        } else {
          // Enviamos el mensaje de éxito mencionando el nombre del archivo eliminado
          res.write(`\nArchivo ${nombre} eliminado con éxito`);
          res.end();
        }
      });
    }, 3000);
  } else {
    // Si la ruta no es válida, enviamos un mensaje de error
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Ruta no válida");
    res.end();
  }
}).listen(8080, () => console.log("Escuchando en el puerto 8080"));
