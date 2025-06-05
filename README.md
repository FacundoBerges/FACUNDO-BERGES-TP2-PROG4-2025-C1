# Programación 4 - Trabajo Practico #02 - **_Red social_**

## Enunciado/s:

- Se debe realizar la aplicación _"Red social"_.
- La forma de corrección será por sprint de una semana.
- La aplicación debe permitir a nuestros usuarios hacer publicaciones, reaccionar y comentar las mismas.
- Cada usuario debe poder ver y editar su perfil.
- Solo se puede acceder a la aplicación estando registrado o logueado.
- La aplicación debe tener un diseño trabajado, no HTML plano. No utilizar alert(), si no modales.

## Contenido de la aplicación:

La _"Red social"_ será una aplicación dividida en dos proyectos, uno frontend y otro backend.
Deberá contar con los siguientes puntos:

1. Aplicación frontend en _Angular_.
2. Servidor (backend) en _NestJS_.
3. Base de datos en _MongoDB_.
4. Login y registro de usuarios contra el servidor en NestJS propio. Se utilizará JWT.
5. Respuestas de la api con status correctos. 400 bad request, 401 Unauthorized, 201 created, etc. _No debe haber status 200 en errores ni 400 en respuestas correctas_.
6. Publicaciones:
   - Deben contener título, mensaje e imagen (opcional).
   - Deben permitir que los usuarios den "Me gusta".
   - Debe permitir que los usuarios dejen comentarios.
7. Experiencia de usuario:
   - Las pantallas deben contar con diseño trabajado y uniforme a lo largo de la aplicación.
   - Navegación entre pantallas.
   - Información clara y completa al mostrar mensajes o realizar acciones.

## Entregas por sprint:

### Sprint #1 ❌

#### Backend:

- ✅ Creación del proyecto back - NestJS.
- ✅ Creación de módulos:
  - ✅ Publicaciones
  - ✅ Autenticación
  - ✅ Usuarios
- ❌ Módulo Autenticación:
  - ❌ Ruta registro:
    - ❌ Por POST: debe recibir todos los datos de un usuario, validarlos y guardarlo en la base de datos.
    - ❌ La contraseña debe quedar encriptada.
    - ❌ Debe recibir la imagen de perfil, guardarla apropiadamente y guardar la URL en la base de datos.
  - ❌ Ruta login:
    - ❌ Por POST: debe recibir el usuario / correo y contraseña sin encriptar.
    - ❌ Debe encriptar la contraseña recibida para confirmar el login.
    - ❌ Debe devolver todos los datos del usuario.

---

### Sprint #2 ❌

#### Backend:

- ❌ Módulo publicaciones - publicaciones controller:
  - ❌ Debe permitir dar de alta, listar y dar de baja publicaciones (baja lógica).
  - ❌ Por POST: debe guardar una publicación relacionada a un usuario. Título, descripción, url de la imagen si es que tiene. La imagen debe ser guardada.
  - ❌ Por DELETE: baja lógica, solo realizada por el usuario que la creó o un administrador.
  - ❌ Por GET: debe permitir listar las últimas publicaciones. Debe poder recibir un parámetro para cambiar el ordenamiento: por fecha/ por cantidad de me gusta. Debe poder filtrar los posteos de un usuario particular. Debe poder recibir un parámetro offset y limit para paginar los resultados.
  - ❌ Por POST: debe permitir que un usuario le dé me gusta a la publicación que elija. Un usuario puede darle un solo me gusta a cada publicación.
  - ❌ Por DELETE: debe permitir eliminar un me gusta de una publicación, solo si el usuario previamente lo había realizado.

---

### Sprint #3 ❌

#### Backend:

- ❌ Módulo publicaciones - comentarios controller:
  - ❌ Debe permitir traer los comentarios de una publicación, agregar nuevos y modificarlos.
  - ❌ Por POST: agrega un comentario a una publicación junto con el usuario que lo realizó.
  - ❌ Por PUT: modifica cualquier dato del comentario. La imagen anterior no se borra ni se modifica. Agrega el campo modificado: true para marcar que el comentario se modificó.
  - ❌ Por GET: trae los comentarios de una publicación específica. Debe permitir paginar los resultados. Debe ordenar los resultados, los más recientes primero.
- ❌ Módulo autenticación:
  - ❌ Rutas Login y registro: debe generar un token JWT que valide quien es el usuario (uuid/correo/nombre de usuario) y su rol (usuario o administrador).
  - ❌ El token debe ser devuelto en la respuesta.
  - ❌ El token debe vencer a los 15 minutos.
  - ❌ Ruta autorizar por POST: debe validar si un token es válido y no está vencido. Devuelve el status 401 si hubo algún error con el token. En caso de que el token sea válido, devolver los datos del usuario en la respuesta.
  - ❌ Ruta refrescar por POST: debe validar si un token es válido y no está vencido. Devuelve un nuevo token con la misma payload y un vencimiento de 15 minutos.

---

### Sprint #4 ❌

#### Backend:

- ❌ Módulo usuarios - usuarios controller:
  - ❌ Debe poseer la lógica para que un administrador pueda listar a los usuarios, dar de alta uno nuevo y realizar bajas y altas lógicas.
  - ❌ Se debe validar que el token pertenezca a un administrador.
  - ❌ Por GET: listado de usuarios
  - ❌ Por POST: alta de un nuevo usuario. Se puede definir si su perfil es administrador o usuario.
  - ❌ Por DELETE: permite deshabilitar a un usuario. Cuando dicho usuario quiera ingresar, deberá ser notificado que no está autorizado.
  - ❌ Por POST: alta lógica, rehabilita a un usuario previamente deshabilitado, permitiéndole utilizar la aplicación.
- ❌ Módulo publicaciones - Estadísticas controller.
  - ❌ Realizar todas las rutas necesarias por GET para que los gráficos funcionen.
  - ❌ Se debe validar que el token pertenezca a un administrador.
