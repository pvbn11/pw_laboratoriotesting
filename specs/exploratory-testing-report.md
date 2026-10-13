# 🔍 Informe de Pruebas Exploratorias (Session-Based Test Management)

**Aplicación:** Laboratorio de Testing (TestSports by JD)  
**URL:** [https://www.laboratoriodetesting.com/](https://www.laboratoriodetesting.com/)  
**Credenciales de Prueba:** `pvalladaresbazalarqa@gmail.com` / `Pablito2027$$`  
**Tester / Rol:** Senior QA Automation Engineer  
**Fecha de Ejecución:** Octubre 2026  
**Estrategia:** SBTM (Session-Based Test Management) con heurísticas SFDPO (Structure, Function, Data, Platform, Operations).

---

## 1. Misión de la Sesión (Charter)
> *Explorar en profundidad los flujos críticos de usuario (Autenticación, Navegación de Catálogo, Detalle de Producto, Manejo de Carrito, Favoritos, Mi Cuenta y Checkout) evaluando la estabilidad de la interfaz, el comportamiento de las APIs, los mecanismos de validación y la idoneidad para la automatización con Playwright.*

---

## 2. Bitácora de Exploración en Tiempo Real

### Sesión 1: Autenticación y Seguridad
* **Punto de Entrada:** `https://www.laboratoriodetesting.com/auth/login`
* **Acciones:**
  * Inspección de campos: `input[placeholder="Ingresa tu email"]` y `input[placeholder="Ingresa tu contraseña"]`.
  * Verificación reactiva: El botón `Iniciar Sesión` permanece en estado `disabled` hasta que ambos campos contienen texto válido.
  * Inserción de credenciales: `pvalladaresbazalarqa@gmail.com` y `Pablito2027$$`.
  * Clic en "Iniciar Sesión" -> Autenticación exitosa en < 1 segundo. Redirección automática a Home (`/`).
  * Análisis de Sesión: La aplicación genera una cookie con JWT y sincroniza el estado de autenticación a través del endpoint interno `/api/auth-cookie`.
  * Verificación de Modal de Recuperación: Clic en "¿Olvidaste tu contraseña?" dispara un modal interactivo de SweetAlert2 solicitando correo electrónico.
  * *Hallazgo:* La navegación directa por URL a `/auth/forgot-password` retorna un error HTTP 404. El flujo es exclusivamente modal.

### Sesión 2: Catálogo y Navegación de Productos
* **Punto de Entrada:** `https://www.laboratoriodetesting.com/`
* **Acciones:**
  * Al estar autenticado, el menú de navegación cambia dinámicamente de "Acceder/Registrarse" a:
    * `Inicio` (`/`)
    * `Favoritos` (`/whishlist`)
    * `Mi Cuenta` (`/my-account`)
    * `Cerrar Sesión` (`/auth/logout`)
  * Exploración de secciones: Hero de bienvenida, categorías "Deportivos", "Marcas Seleccionadas", "Musculación", "Aire Libre".
  * Selección de producto: Clic en "Bandas Elásticas de Resistencia" (`/products/bandas-elasticas-de-resistencia`).
  * En la vista de detalle:
    * Se verifica visualización de precio ($350.00), reviews, descripción y badges de confianza.
    * Se interactúa con los controles de cantidad: Botón `+` incrementa a 2, botón `-` decrementa.
    * Clic en "Añadir al carrito": El contador global en el navbar se actualiza dinámicamente mostrando "1" producto en el carrito (2 unidades).

### Sesión 3: Carrito de Compras (Cart Drawer)
* **Punto de Entrada:** Panel lateral desplegable (`complementary`)
* **Acciones:**
  * Al hacer clic en el ícono de carrito en Desktop (`button[data-at="cart-opener"]`), se despliega el drawer lateral.
  * Verificación de cálculos:
    * Producto: Bandas Elásticas de Resistencia (Precio unitario $350.00).
    * Cantidad: 2 unidades.
    * Total calculado: $700.00 (350 × 2 = 700). Exactitud matemática confirmada.
  * *Hallazgo Técnico Crítico para Automatización:* Existen dos botones de apertura en el DOM con clases responsive de Tailwind:
    * `button[data-at="cart-opener"]` (`hidden xl:flex` -> visible solo en viewport >= 1280px).
    * `button[data-at="cart-opener-mobile"]` (`xl:hidden` -> visible en viewport < 1280px).
    * Si la suite de Playwright no define explícitamente un viewport desktop, intentar hacer clic en el primer botón provocará timeout o elemento fuera de pantalla.

### Sesión 4: Lista de Favoritos (Wishlist)
* **Punto de Entrada:** Detalle de producto y enlace de navegación
* **Acciones:**
  * En `/products/bandas-elasticas-de-resistencia`, se pulsa el botón "Agregar a favorito".
  * La aplicación realiza una petición `POST https://api.laboratoriodetesting.com/api/v1/favorites` con `productId: "1"`.
  * Navegación a la página de favoritos (`/whishlist`):
    * Se muestra `Total agregados (1)`.
    * La tarjeta del producto aparece correctamente listada con su imagen, título y precio.
  * *Hallazgo de Usabilidad/Ruta:* La URL contiene un typo: `/whishlist` (con 'h' intercalada) en lugar de `/wishlist`.

### Sesión 5: Mi Cuenta (`/my-account`)
* **Punto de Entrada:** `https://www.laboratoriodetesting.com/my-account`
* **Acciones:**
  * Se renderiza la tarjeta del perfil de usuario:
    * Avatar: Inicial "P".
    * Nombre: "Paolo".
    * Rol: "Estudiante".
    * Insignias: "Usuario Verificado", "Email Verificado".
    * Información: "Miembro desde: octubre 2026".
  * Historial de órdenes: Muestra mensaje "Aún no has registrado una orden".

### Sesión 6: Proceso de Checkout y Pagos
* **Punto de Entrada:** `https://www.laboratoriodetesting.com/checkout`
* **Acciones:**
  * Desde el carrito desplegado, se hace clic en "Ir al checkout".
  * La página presenta dos columnas: Formulario del Comprador + Formulario de Pago a la izquierda, y Resumen de Orden a la derecha.
  * Resumen de Orden:
    * Subtotal: $700.00
    * Envío: Gratis
    * Total: $700.00
  * Validación del botón "Completar Pago": Nace en estado `disabled`.
  * Se llenan los datos del comprador: Nombre, Apellido, Email, Dirección, Selección de País en dropdown (`select[name="country"]`).
  * Se llenan los datos de la tarjeta: Nombre titular, Número de tarjeta, Fecha de vencimiento (`type="month"`, formato YYYY-MM), CVV.
  * Una vez válidos los campos, el botón "Completar Pago" se habilita.
  * Clic en "Completar Pago": La app envía `POST https://api.laboratoriodetesting.com/api/v1/orders`.
  * **Comportamiento del Backend:** Al enviar una tarjeta de prueba genérica, la API devuelve `400 Bad Request` con `{"message": "Tarjeta inválida"}`.
  * **Comportamiento de la UI:** Se despliega un diálogo SweetAlert2 con encabezado *"Error al procesar el pago"*, cuerpo *"Tarjeta inválida"* y botón de acción *"Reintentar"*.
  * **Comportamiento Exitoso:** Al interceptar o recibir `200 OK`, la app dispara modal *"Orden creada"*, vacía `store-cart` de `localStorage` y navega a `/my-account`.

---

## 3. Matriz de Hallazgos, Defectos y Oportunidades de Mejora

| ID | Tipo | Severidad | Descripción del Hallazgo | Impacto en Automatización |
|---|---|---|---|---|
| **BUG-01** | UI / Routing | Menor | La URL de favoritos tiene un error ortográfico: `/whishlist` en vez de `/wishlist`. | Las rutas de navegación en los Page Objects deben usar `/whishlist`. |
| **BUG-02** | UX / Responsive | Media | El botón de carrito tiene dos variantes (`data-at="cart-opener"` y `cart-opener-mobile`). Si el viewport es menor a 1280px, el primero está oculto. | Se debe configurar un viewport estándar en `playwright.config.ts` (ej: 1280x720 o 1920x1080) para evitar timeouts. |
| **BUG-03** | Routing | Menor | Navegar directamente a `/auth/forgot-password` retorna 404 Not Found. | El test de recuperación debe automatizarse mediante el botón del modal en `/auth/login`. |
| **BUG-04** | Backend / Seguridad | Media | Navegar a `/admin` con un usuario estándar genera HTTP 500 no controlado antes de redirigir a 404. | Debe manejarse adecuadamente en el backend con HTTP 403 Forbidden y pantalla amigable. |
| **OBS-01** | Backend / Sandbox | Informativa | La API `/api/v1/orders` rechaza números de tarjeta estándar con error 400. | Para garantizar que la prueba de compra completa sea 100% determinística y no falle en CI/CD, se debe emplear `page.route()` simulando la respuesta 200 OK del backend, además de tener el test negativo para la validación 400. |

---

## 4. Conclusión de la Exploración
La aplicación `laboratoriodetesting.com` es un entorno excelente y moderno (Next.js, React, Tailwind, JWT) diseñado para practicar testing integral. Posee atributos testeables muy claros (`data-at`, labels, placeholders semánticos) ideales para automatizar con Playwright siguiendo las mejores prácticas de la industria.
