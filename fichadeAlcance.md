# 📝 Ficha de alcance

**Para qué sirve:** antes de programar, hay que decidir **qué se va a construir y qué NO**. Esta ficha cabe en una hoja y es lo primero que se entrega para el proyecto final. Se completa **antes** de escribir código y se ajusta durante las Clases 12 y 13.

> **Regla de oro:** un alcance chico y terminado vale más que uno enorme a medias. Si dudás si algo entra, **no entra** (queda en "para después").

---

## ✍️ La plantilla

| # | Pregunta | Tu respuesta |
| :-: | :--- | :--- |
| 1 | **Nombre de la app** y **una frase** que la explique | Art Gallery - explorar distintas obras de arte |
| 2 | **¿Para quién es?** (público objetivo) |  Personas curiosas o aficionadas al arte, estudiantes y docentes|
| 3 | **¿Qué problema resuelve?** | Encontrar obras de arte suele implicar buscar en muchos sitios distintos. La app reúne en un solo lugar una búsqueda simple. |
| 4 | **Funciones clave** (máximo 5 — lo que SÍ o SÍ tiene que andar) |1. Pedir el nombre al entrar y personalizar la app.<br>2. Descubrir una obra aleatoria en Inicio.<br>3. Buscar y filtrar obras con paginación en Explorar.<br>4. Ver el detalle completo de una obra.<br>5. Guardar obras favoritas que persisten al cerrar la app. |
| 5 | **Lo que NO hace** (por ahora) | No tiene registro con email y contraseña ni servidor propio.<br>No permite crear colecciones.<br>No abre el detalle desde Favoritos.<br>No hace zoom con dos dedos en la imagen.<br>No recuerda el modo claro/oscuro al cerrar la app.<br>No funciona sin conexión para ver imágenes nuevas.|
| 6 | **Pantallas** (lista) |1. Bienvenida (pide el nombre)<br>2. Inicio (obra aleatoria)<br>3. Explorar (búsqueda, chips y grilla)<br>4. Detalle de obra<br>5. Favoritos<br>6. Perfil<br>7. Menú lateral (Drawer)  |
| 7 | **Mapa de navegación** (dibujo o esquema, ver abajo) | Stack raíz con Bienvenida, Drawer y Detalle. El Drawer contiene las Tabs (Inicio, Explorar, Favoritos) y Mi perfil. El Detalle se abre solo desde Explorar. Ver esquema debajo de la tabla. |
| 8 | **Datos:** ¿de dónde vienen y dónde se guardan? |Vienen de la Art Search API (artsearch.io) mediante `fetch`, con hooks personalizados. Se guardan en el celular con AsyncStorage: el nombre del usuario y las obras favoritas. No hay base de datos propia. |
| 9 | **¿Hay usuarios / inicio de sesión?** ¿Para qué? |Sí, una sesión local simple: solo se pide un nombre, sin contraseña ni servidor. Sirve para personalizar el saludo y el perfil, y para proteger las rutas: sin nombre guardado solo se ve la bienvenida. Se cierra desde Perfil. |
| 10 | **¿Funciona sin internet?** ¿Qué se guarda en el celular? | No: para cargar obras y búsquedas necesita internet. En el celular se guardan el nombre y la lista de favoritos (id, título e imagen), por lo que la lista de Favoritos se arma sin llamar a la API. Las imágenes se descargan desde su URL, así que sin conexión pueden no verse.  |
| 11 | **3 animaciones clave** (¿en qué momentos y por qué?) | 1. Entrada escalonada en Perfil (FadeInDown de Reanimated): cada bloque aparece después del anterior para guiar la lectura.<br>2. Visor de imagen a pantalla completa (fundido): suaviza el paso de la imagen chica a la ampliada.<br>3. Apertura del menú lateral y transición al detalle de la obra: dan sensación de continuidad al navegar |
| 12 | **Riesgos** (¿qué podría salir mal?) y **plan B** |1. Límite de 50 requests por día de la API gratuita: se busca solo al presionar Enter, se pagina de a 10 y se muestra un error con botón de reintento. Plan B: usar otra API key o datos de ejemplo.<br>2. API lenta o caída: estados de carga y error en cada pantalla.<br>3. La API key viaja en la app: al ser un proyecto académico se acepta; plan B, un servidor intermedio.<br>4. Fallas al generar el APK (variables de entorno sin cargar en EAS): probar antes con Expo Go y cargar las variables en EAS.<br>5. Incompatibilidades de librerías con SDK 54 (Drawer y Reanimated): instalar con `npx expo install`. |
| 13 | **Hitos:** qué estará listo en la Clase 12 / 13 / 14 |**Clase 12:** navegación completa (Stack, Drawer y Tabs), tema claro/oscuro, bienvenida con sesión e Inicio con obra aleatoria.<br>**Clase 13:** Explorar con búsqueda, chips y paginación, detalle de obra y favoritos con AsyncStorage.<br>**Clase 14:** animaciones, manejo de errores, README con capturas, APK y entrega final. |

### Cómo dibujar el mapa de navegación (pregunta 7)
Usá el mismo esquema que en la Clase 10:

```
Stack raíz
├── welcome                     (solo sin sesión)
├── (drawer)                    (solo con sesión)
│   ├── Tabs
│   │   ├── Inicio
│   │   ├── Explorar ──────┐
│   │   └── Favoritos      │ tocar una obra
│   └── Mi perfil          │
└── artwork/[id]  ◄────────┘    (Detalle, se abre solo desde Explorar)
```

### ¿Dónde guardo cada dato? (pregunta 8) — guía rápida

| Tipo de dato | Dónde | Ejemplo |
| :--- | :--- | :--- |
| Preferencias de **ese** celular | `AsyncStorage` | Modo oscuro, la sesión, favoritos|
| Datos que **ven varias personas** en tiempo real | `Firestore` (Firebase) | **No se usa**: la app no tiene datos compartidos entre personas. |
| Datos de **un servidor propio** o una API pública | `fetch` a una API |**Las obras de arte**, desde la API pública Art Search (`/artworks`, `/artworks/{id}` y `/artworks/random`), mediante hooks personalizados. |
| Datos solo mientras la pantalla está abierta | `useState` | El texto del buscador, los chips de filtro elegidos, el nombre que se escribe en Bienvenida y Perfil, y si la descripción o la imagen están expandidas. |

### ¿Dónde van las animaciones? (pregunta 11) — guía rápida
| Momento | Idea | En Art Gallery |
| :--- | :--- | :--- |
| Entra una lista | Cascada (`FadeInDown` con `delay`) | **Implementada** en Perfil: cada bloque entra con `FadeInDown.delay(index * 80)`. *Mejora posible:* aplicarla a las tarjetas de Explorar y Favoritos. |
| Algo sale bien | Un rebote (`BounceIn`) | *Mejora posible:* el corazón rebota (`BounceIn`) al guardar una obra como favorita. |
| Algo sale mal | Una sacudida | *Mejora posible:* el campo del nombre se sacude cuando la validación falla (menos de 2 caracteres) en Bienvenida y Perfil. |
| Se borra algo | Sale animado (`exiting`) y los demás se reacomodan | *Mejora posible:* al quitar una obra de Favoritos, la tarjeta sale con `exiting` y las demás se reacomodan con `layout`. |
| Se cambia de sección | Fade entre pestañas / pantallas | **Implementada:** el visor de imagen a pantalla completa usa un fundido (`animationType="fade"`), y el Drawer y el Stack del detalle tienen transiciones propias. *Mejora posible:* fade entre las pestañas. |

---

## 🧭 Chequeo final de un buen alcance

- [x] Cabe en **5 funciones clave** como máximo. — Bienvenida con nombre, obra aleatoria en Inicio, búsqueda y filtros con paginación, detalle de obra y favoritos guardados.
- [x] Cada pantalla tiene **un propósito claro** (si una pantalla "hace de todo", hay que dividirla). — Bienvenida pide el nombre, Inicio muestra una obra, Explorar busca, Detalle informa, Favoritos lista lo guardado y Perfil gestiona la cuenta.
- [x] Sé **de dónde viene cada dato** y **dónde se guarda**. — Las obras vienen de la API Art Search mediante `fetch`; el nombre y los favoritos se guardan en `AsyncStorage`.
- [x] Tengo escrito **lo que NO hace**. — Sin colecciones, sin registro con contraseña, sin zoom con dos dedos, sin modo offline para ver obras nuevas.
- [x] Es algo que puedo **terminar y probar** antes de la Clase 14. — Las pantallas principales ya funcionan; falta el README con capturas y generar el APK.
- [x] Tengo un **plan B** si falla una parte (internet, API, Firebase). — Si falla internet o se agota el límite de 50 requests, cada pantalla muestra un error con botón de reintento; los favoritos se ven igual porque están en el celular. Firebase no se usa.