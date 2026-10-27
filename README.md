📦 S y S - Sistema de Gestión de Ventas y Natillera

Una aplicación de escritorio optimizada para entornos Linux, diseñada con un enfoque extremo en la accesibilidad (a11y) para usuarios con dificultades visuales y nula experiencia tecnológica. Integra la venta de mercancía (Lociones AAA y Ropa) con la gestión transversal de una Natillera.

📑 Tabla de Contenidos

Restricciones y UX/UI

Épica 1: Interfaz Base y Ventas Físicas

Épica 2: Módulo de Natillera

Épica 3: Control y Prevención de Errores

🎯 Restricciones y UX/UI

Entorno de ejecución: SO Linux.

Accesibilidad visual: Alto contraste obligatorio (mínimo 7:1), tipografía XL (base de 24px-32px).

Usabilidad: Interfaz completamente plana. Cero menús desplegables. Elementos clickeables deben ocupar al menos un 30% de la pantalla. Minimizar el uso del teclado físico mediante un teclado numérico en pantalla.

🛒 Épica 1: Interfaz Base y Ventas Físicas

- [ ] HU-01: Menú principal de alto contraste y fácil acceso (Jorge Avila)

Como usuario con dificultades visuales y poca experiencia tecnológica...
Quiero ver una pantalla principal con solo tres botones gigantes (Lociones, Ropa, Natillera) que abarquen toda la pantalla...
Para poder ingresar al módulo que necesito sin confundirme ni tener que leer textos pequeños.

Criterios de Aceptación:

[ ] Pantalla sin barras de navegación complejas.

[ ] Botones ocupan al menos el 30% de la pantalla cada uno.

[ ] Contraste mínimo de 7:1 (ej. texto blanco sobre fondo negro/azul oscuro).

[ ] Feedback visual o sonoro al pasar el mouse (hover).

- [ ] HU-02: Registro rápido de venta de Lociones AAA y Ropa (Cristian Osorio)

Como vendedor de S y S...
Quiero una pantalla unificada donde pueda seleccionar el tipo de producto, ingresar el precio con un teclado numérico en pantalla y darle a "Vender"...
Para registrar mis ventas rápidamente sin menús complicados ni usar el teclado físico.

Criterios de Aceptación:

[ ] Botón gigante de "Volver al inicio" siempre visible (esquina superior izquierda).

[ ] Teclado numérico en pantalla integrado (estilo cajero automático).

[ ] Mensaje de confirmación gigante ("VENTA REGISTRADA") que desaparece a los 3 segundos.

- [ ] HU-03: Visualización del total de ventas del día (Deerly Hernandez)

Como administrador del negocio...
Quiero ver un número grande en la pantalla de ventas que me indique cuánto dinero he hecho hoy...
Para llevar el control diario sin generar reportes complejos.

Criterios de Aceptación:

[ ] Total mostrado en la esquina superior derecha (tipografía de al menos 40px).

[ ] El acumulador suma solo las ventas del día en curso (reinicio a las 00:00).

💰 Épica 2: Módulo de Natillera (Ahorros y Préstamos)

- [ ] HU-04: Lista de participantes de fácil lectura (Maiky Vergara)

Como administrador de S y S...
Quiero ver la lista de personas de la natillera como botones gigantes a lo ancho de la pantalla...
Para encontrar personas rápidamente sin forzar la vista ni usar barras de scroll.

Criterios de Aceptación:

[ ] Máximo 4 nombres por página (letra XL).

[ ] Botones inmensos de "ANTERIOR" y "SIGUIENTE" en la parte inferior.

[ ] Botón superior "Agregar Persona" que pida exclusivamente el nombre.

- [ ] HU-05: Registrar un abono (entrada de dinero) (Daniel Acevedo)

Como administrador de S y S...
Quiero que al seleccionar a una persona, aparezca un botón verde gigante de "ABONAR" y el teclado numérico en pantalla...
Para sumar dinero a su ahorro de forma rápida y sin equivocarme.

Criterios de Aceptación:

[ ] Flujo: Seleccionar Nombre -> "Abonar" -> Digitar monto en pantalla -> Confirmar.

[ ] Botón de abono y confirmación en color Verde.

[ ] El saldo actual en pantalla se actualiza instantáneamente con un destello sutil.

- [ ] HU-06: Registrar un préstamo (salida de dinero) (Felipe Hincapie)

Como administrador de S y S...
Quiero tener un botón rojo gigante de "PRESTAR" al lado del botón de abonar...
Para restar dinero del fondo diferenciándolo visualmente de los abonos.

Criterios de Aceptación:

[ ] Botón en color Rojo/Oscuro.

[ ] Confirmación en pantalla completa: "¿SEGURO QUE PRESTA [Monto]?" con un botón gigante de "SÍ".

- [ ] HU-07: Consulta rápida de saldo por participante (Felipe Isaza)

Como administrador de S y S...
Quiero que al tocar un nombre, la mitad de la pantalla muestre su saldo total en números gigantes...
Para informar al cliente su estado de cuenta con un solo vistazo.

Criterios de Aceptación:

[ ] El número es el elemento más grande de la UI (ej. 80px).

[ ] Saldo positivo = Verde/Blanco. Saldo negativo = Naranja/Rojo.

⚙️ Épica 3: Control Simplificado y Prevención de Errores

- [ ] HU-08: Alerta de inventario estilo "Semáforo" (Jorge Chavez)

Como vendedor de S y S...
Quiero ver un indicador de color llamativo si me quedan pocos artículos...
Para saber cuándo hacer pedido sin revisar tablas ni listas de bases de datos.

Criterios de Aceptación:

[ ] Cero tablas visibles para el usuario.

[ ] Alerta visual simple (ej. borde amarillo) en el botón principal al alcanzar el límite configurado.

- [ ] HU-09: Cierre del día con números gigantes (Andres Velez)

Como dueño del negocio...
Quiero un botón de "RESUMEN DEL DÍA" en inicio que muestre Ventas Totales, Abonos Totales y Préstamos Totales en 3 cuadros grandes...
Para cuadrar mi caja física antes de apagar el equipo.

Criterios de Aceptación:

[ ] Pantalla de solo lectura, sin opciones complejas.

[ ] Botón gigante "CERRAR DÍA Y REINICIAR" (con confirmación) que reinicie las métricas diarias.

- [ ] HU-10: Búsqueda numérica de clientes (Sin teclado físico) (Catalina Lombana)

Como administrador con dificultades visuales...
Quiero buscar participantes digitando su número/teléfono en el teclado en pantalla...
Para evitar buscar letras en el teclado físico del computador.

Criterios de Aceptación:

[ ] La pantalla de búsqueda activa de inmediato el teclado en pantalla.

[ ] Filtrado en tiempo real al digitar.

[ ] Mensaje gigante "NO ENCONTRADO" + botón "Limpiar" si no hay coincidencias.

- [ ] HU-11: Botón gigante de "Deshacer" (Luis Loaiza)

Como usuario con poca experiencia tecnológica...
Quiero un botón visible que diga "BORRAR ÚLTIMO MOVIMIENTO"...
Para cancelar un registro erróneo sin entrar a menús de edición.

Criterios de Aceptación:

[ ] Botón siempre presente en la esquina inferior izquierda.

[ ] Al presionar, muestra el detalle del movimiento en letra gigante para confirmar.

[ ] Solo permite deshacer la transacción inmediatamente anterior.

- [ ] HU-12: Historial visual simplificado (Diogenes Zambrano)

Como dueño del negocio S y S...
Quiero ver una lista estática con mis últimos 5 movimientos...
Para confirmar que una acción quedó registrada si tengo dudas.

Criterios de Aceptación:

[ ] Lista de solo 5 elementos (sin scroll), tamaño XL.

[ ] Código de colores (Verde = Entrada, Rojo = Salida).

[ ] Único botón de "VOLVER AL INICIO" disponible en esa vista.