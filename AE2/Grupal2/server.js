const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;

  if (method === 'GET' && url === '/leer') {
    const archivo = obtenerParametroConsulta(url, 'archivo');
    leerArchivo(archivo, res);
  } else if (method === 'POST' && url === '/crear') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const archivo = obtenerParametroConsulta(url, 'archivo');
      const contenido = obtenerParametroConsulta(url, 'contenido');
      crearArchivo(archivo, contenido, res);
    });
  } else if (method === 'PUT' && url === '/renombrar') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const nombre = obtenerParametroConsulta(url, 'nombre');
      const nuevoNombre = obtenerParametroConsulta(url, 'nuevoNombre');
      renombrarArchivo(nombre, nuevoNombre, res);
    });
  } else if (method === 'DELETE' && url === '/eliminar') {
    const archivo = obtenerParametroConsulta(url, 'archivo');
    eliminarArchivo(archivo, res);
  } else {
    res.statusCode = 404;
    res.end('Ruta no encontrada');
  }
});

const port = 8080;
server.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});

function obtenerParametroConsulta(url, parametro) {
  const urlObj = new URL(url, 'http://localhost');
  return urlObj.searchParams.get(parametro);
}

function leerArchivo(archivo, res) {
  fs.readFile(archivo, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Archivo no encontrado');
    } else {
      res.end(data);
    }
  });
}

function crearArchivo(archivo, contenido, res) {
  const fechaActual = obtenerFechaActual();
  const contenidoConFecha = `${fechaActual} - ${contenido}`;

  fs.writeFile(archivo, contenidoConFecha, err => {
    if (err) {
      res.statusCode = 500;
      res.end('Error al crear el archivo');
    } else {
      res.end('Archivo creado exitosamente');
    }
  });
}

function renombrarArchivo(nombre, nuevoNombre, res) {
  fs.rename(nombre, nuevoNombre, err => {
    if (err) {
      res.statusCode = 500;
      res.end('Error al renombrar el archivo');
    } else {
      res.end(`Archivo "${nombre}" renombrado a "${nuevoNombre}"`);
    }
  });
}

function eliminarArchivo(archivo, res) {
  res.write(`Tu solicitud para eliminar el archivo "${archivo}" se está procesando`);
  setTimeout(() => {
    fs.unlink(archivo, err => {
      if (err) {
        res.statusCode = 500;
        res.end('Error al eliminar el archivo');
      } else {
        res.end(`Archivo "${archivo}" eliminado`);
      }
    });
  }, 3000);
}

function obtenerFechaActual() {
  const fecha = new Date();
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}