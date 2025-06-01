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

#### Frontend:

- ✅ Creación del proyecto front - Angular.
- ❌ Pantallas:
  - ✅ Registro
  - ✅ Login
  - ❌ Publicaciones
  - ❌ MiPerfil
- ❌ Deploy en hosting
- ❌ Navegación entre componentes. Sin límites de accesibilidad.
- ✅ Implementar un favicon propio.
- ❌ Componente login:
  - ❌ Debe poseer un formulario con validaciones y mensajes acordes.
  - ✅ Puede ser por correo o por nombre de usuario, pero cualquiera que sea elegido debe ser único en la base de datos.
  - ❌ La contraseña debe poseer al menos 8 caracteres, una mayúscula y un número.
- ❌ Componente Registro:
  - ❌ Debe poseer un formulario con validaciones y mensajes acordes.
  - ✅ Debe poseer los campos: nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve.
  - ❌ Debe poseer un campo de tipo file para la imagen de perfil.
  - ❌ Los usuarios deben poseer un atributo perfil. Por defecto poseen el perfil “usuario” pero se puede modificar para que su perfil sea “administrador”.

---

### Sprint #2 ❌

#### Frontend:

- ❌ Página publicaciones.
  - ❌ Debe mostrar el listado de publicaciones, ordenado por fecha por defecto.
  - ❌ Debe permitir cambiar el ordenamiento a por cantidad de me gusta
  - ❌ Debe traer una cantidad limitada de publicaciones, permitiendo paginarlas.
  - ❌ Cada publicación debe ser un componente.
  - ❌ Se debe poder dar y quitar me gusta de una publicación siempre que sea el caso .
- ❌ Componente Mi Perfil:
  - ❌ Debe mostrar todos los datos del usuario, así como su foto de perfil.
  - ❌ Debe mostrar mis últimas 3 publicaciones y sus comentarios.

---

### Sprint #3 ❌

#### Frontend:

- ❌ Página publicación.
  - ❌ Debe permitir ver grande en la pantalla la publicación realizada, junto con sus respectivos comentarios.
  - ❌ Los comentarios deben mostrarse ordenados, uno debajo del otro. En la primera carga debe llegar una cantidad de comentarios limitados, dónde sólo si el usuario presiona un botón “cargar más” se seguirán trayendo, sin dejar de mostrar los anteriores.
- ❌ Pantalla login y registro:
  - ❌ Debe tomar el token que devuelve la petición indicada y guardarlo localmente en el navegador.
- ❌ Página cargando:
  - ❌ Al iniciar la aplicación, debe mostrarse una pantalla de cargando y un spinner.
  - ❌ En este tiempo, debe validarse frente a la ruta autorizar si el token es válido. En caso de que lo sea, se redirige a la pantalla de publicaciones. En caso de que no lo sea, redirige al login.
- ❌ A nivel aplicación:
  - ❌ Al iniciar sesión, iniciar un contador de 10 minutos. Al finalizar, deberá aparecer un modal avisando que quedan 5 minutos de sesión y preguntando al usuario si desea extender su sesión (ya que el token vence a los 15 minutos). En caso de que la respuesta sea afirmativa, refrescar el token.
  - ❌ Si una petición devuelve un error 401, redirigir al login para rehacer el token.

---

### Sprint #4 ❌

#### Frontend:

- ❌ Página publicación y página publicaciones:
  - ❌ Si un usuario con perfil de administrador se logueó, se deben habilitar los botones para dar de baja cualquier publicación. Esto hará que dejen de estar disponibles, tanto la publicación como sus comentarios.
- ❌ Página dashboard/usuarios:
  - ❌ Solo disponible para usuarios con perfil administrador.
  - ❌ Debe permitir ver el listado de los usuarios.
  - ❌ Debe permitir realizar las acciones de alta y baja lógica como corresponda.
  - ❌ Debe poseer un formulario de registro para nuevos usuarios.
- ❌ Página dashboard/estadísticas:
  - ❌ Se deben crear gráficos que representen las siguientes estadísticas:
    - ❌ Cantidad de publicaciones realizadas por cada usuario en un lapso de tiempo. El lapso de tiempo debe poder ser elegido.
    - ❌ Cantidad de comentarios realizados en un lapso de tiempo. El lapso de tiempo debe poder ser elegido.
    - ❌ Cantidad de comentarios en cada publicación en un lapso de tiempo. El lapso de tiempo debe poder ser elegido.
- ❌ A nivel aplicación:
  - ❌ Implementar PWA.
