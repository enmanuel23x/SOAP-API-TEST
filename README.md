# Prueba API SOAP

#### v-1.0.0

## Configuración y Despliegue.

Aspectos a considerar:

- Se describe el proceso de instalación y despliegue para la aplicación.
- Seguirlo paso a paso debería garantizar la correcta instalación y posterior despliegue o puesta en funcionamiento de los servicios. 

### 1. Prerrequisitos.

**Se deben tener configurados los siguientes entornos:**

- NodeJS
- MySQL

### 2.Instalación y configuración.

#### Instalación/ejecución
- Si el contenedor tiene acceso a git:
  1. Clonar el repositorio con `git`.
  2. Acceder a la carpeta donde se haya descargado todo el código fuente del servicio desde la consola de comando.
  4. Ejecutar `npm install` para instalar todas las dependencias necesarias del servicio.
  5. Ejecutar `npm start` esto levantar la aplicacion.

#### Configuraciones
**Imporante: la base de datos debe ser creada manualmente antes de configurar e iniciar el proyecto (las tablas son generadas al iniciar el mismo)**.

Editar el archivo `config.js` que se encuentran en la ruta `<<root>>/src/config`.

**`config.js`**

```bash
module.exports = {
    "development": {
        "username": "root",
        "password": "",
        "database": "prueba_stack_ssr",
        "host": "127.0.0.1",
        "port": 3306,
        "dialect": 'mysql',
        "logging": false,
        "email_user": "pruebaStackSSR@gmail.com",
        "email_pass": "Prueba12345678" 

    },
    "qa": {
        "username": "root",
        "password": "",
        "database": "prueba_stack_ssr",
        "host": "127.0.0.1",
        "port": 3306,
        "dialect": 'mysql',
        "logging": false,
        "email_user": "pruebaStackSSR@gmail.com",
        "email_pass": "Prueba12345678"
    },
    "production": {
        "username": "root",
        "password": "",
        "database": "prueba_stack_ssr",
        "host": "127.0.0.1",
        "port": 3306,
        "dialect": 'mysql',
        "logging": false,
        "email_user": "pruebaStackSSR@gmail.com",
        "email_pass": "Prueba12345678"
    }
};

```
**Importante: Solo alterar estos valores de ser necesario**
  - `development`, `qa` o `production` indica el modo de ejecucion y la configuracion para cada uno de ellos **(el modo de ejecución es configurado a travez de variables de entoro, default: 'development')**.
  - `username` nombre de usuario de la base de datos.
  - `password` contraseña del usuario de la base de datos.
  - `host` endpoint de la base de datos.
  - `port` puerto de la base de datos.
  - `dialect` gestor de base de datos **(default: 'mysql', no alterar este campo)**.
  - `logging` indica si se debe imprimir los registros proporcionados por sequelize **(default: 'false', no alterar este campo)**.
  - `email_user` usuario del correo para el envio del token de confirmación **(no alterar este campo)**.
  - `email_pass` contraseña del correo **(no alterar este campo)**.
 
#### Recomendaciones
 - *(Se recomienda leer mas en EL README.md en el repositorio **[front-end](https://github.com/enmanuel23x/FRONT-END-TEST)**.)*.
 - *(Se recomienda leer mas en EL README.md en el repositorio **[servicio REST](https://github.com/enmanuel23x/REST-API_TEST)**.)*.

