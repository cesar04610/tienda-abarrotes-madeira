# SRS — Software de Gestión para Tienda de Abarrotes

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Estado:** En construcción (Módulo 1 completado)

---

## 1. Introducción

### 1.1 Propósito
Este documento describe los requisitos del software de gestión complementario para una tienda de abarrotes. El sistema busca apoyar al dueño en el control interno del negocio en áreas que su punto de venta actual no cubre.

### 1.2 Alcance general del sistema
El software se divide en los siguientes módulos principales:

- **Módulo 1:** Control de Gastos y Proveedores *(detallado en este documento)*
- **Módulo 2:** Control de Actividades de Empleados *(por desarrollar)*

### 1.3 Plataforma objetivo
- **Tipo de aplicación:** Aplicación web (accesible desde navegador)
- **Dispositivos compatibles:** Computadora, celular, tablet — cualquier dispositivo con navegador
- **Acceso:** Desde cualquier lugar con conexión a internet

### 1.4 Especificaciones Técnicas
| Componente | Tecnología |
|---|---|
| Frontend | Aplicación web (navegador) |
| Base de datos | Supabase |
| Infraestructura | 100% en la nube |
| Acceso | URL accesible desde cualquier dispositivo y ubicación |

> **Nota:** Al correr en la nube, toda la información queda centralizada y disponible en tiempo real desde cualquier dispositivo (computadora, celular o tablet) sin necesidad de instalar nada.

---

## 2. Módulo 1 — Control de Gastos y Proveedores

### 2.1 Descripción general
Este módulo permite registrar y consultar todas las compras realizadas a proveedores de la tienda. Cualquier empleado autorizado puede registrar una compra al momento en que el proveedor visita el establecimiento. El dueño puede consultar reportes de gasto por proveedor y por período de tiempo.

---

### 2.2 Gestión de Proveedores

#### 2.2.1 Catálogo de proveedores
El sistema debe mantener un catálogo de proveedores con la siguiente información por cada uno:

| Campo | Descripción |
|---|---|
| Nombre del proveedor | Nombre completo o apodo |
| Teléfono | Número de contacto |
| Empresa | Nombre de la empresa o distribuidora |
| Productos que normalmente trae | Lista de productos o categorías que suele surtir |

#### 2.2.2 Operaciones sobre el catálogo
- Agregar nuevo proveedor
- Editar datos de un proveedor existente
- Consultar el perfil de un proveedor
- Desactivar un proveedor (sin eliminarlo del historial)

---

### 2.3 Registro de Compras

#### 2.3.1 Datos de cada compra
Cuando un proveedor llega a la tienda, cualquier empleado podrá registrar la compra con los siguientes datos:

| Campo | Obligatorio | Descripción |
|---|---|---|
| Proveedor | Sí | Seleccionado desde el catálogo |
| Fecha | Sí | Se registra automáticamente (fecha actual) |
| Monto total pagado | Sí | Cantidad total de la compra en pesos |

#### 2.3.2 Flujo de registro
1. El empleado abre el módulo de compras.
2. Selecciona el proveedor de la lista del catálogo.
3. El sistema registra automáticamente la fecha y hora actual.
4. El empleado ingresa el monto total pagado.
5. El empleado confirma el registro.
6. El sistema guarda la compra y muestra un mensaje de confirmación.

#### 2.3.3 Quién puede registrar
Cualquier empleado con acceso a la aplicación puede registrar una compra. No se requiere un perfil de administrador para esta acción.

---

### 2.4 Reportes y Consultas

El sistema debe generar los siguientes reportes:

#### 2.4.1 Gasto por período
- Filtro por semana o mes
- Muestra el total gastado en el período seleccionado
- Desglose por proveedor dentro del período

#### 2.4.2 Gasto por proveedor
- Seleccionar un proveedor específico
- Ver el total acumulado comprado a ese proveedor
- Filtrable por rango de fechas

#### 2.4.3 Historial de visitas de un proveedor
- Lista cronológica de todas las visitas (compras registradas) de un proveedor
- Muestra: fecha, monto pagado en cada visita

#### 2.4.4 Exportación de reportes
- Todos los reportes pueden exportarse en formato **Excel (.xlsx)**
- El archivo exportado debe incluir los mismos datos que se muestran en pantalla

---

### 2.5 Restricciones y consideraciones

- El sistema debe ser sencillo y rápido de usar, ya que el registro se hace mientras el proveedor está presente.
- No es necesario registrar productos individuales por compra, solo el monto total.
- Los proveedores no se eliminan permanentemente para conservar el historial.

---

## 3. Módulo 2 — Control de Actividades de Empleados

### 3.1 Descripción general
Este módulo permite al dueño asignar actividades a cada caja por día y turno. Cada empleado accede con su propio usuario, ve las tareas que le corresponden y puede marcarlas como completadas, opcionalmente subiendo una imagen como evidencia. El dueño puede monitorear el avance en tiempo real y recibe alertas por correo si alguna tarea queda pendiente al final del turno.

---

### 3.2 Estructura de turnos y cajas

| Elemento | Detalle |
|---|---|
| Turnos | Turno mañana / Turno tarde |
| Cajas | Caja 1, Caja 2, Caja 3 |
| Empleados por turno | 3 (uno por caja) |

Cada caja en cada turno tiene su propio listado de actividades para el día.

---

### 3.3 Gestión de actividades

#### 3.3.1 Tipos de actividades
- **Actividades fijas:** Se repiten regularmente (ej. barrer, atender caja). El dueño las configura una vez y quedan disponibles como plantilla.
- **Actividades adicionales:** El dueño las agrega manualmente según la semana o el día.

#### 3.3.2 Catálogo de actividades
El sistema contará con un catálogo de actividades predefinidas que el dueño puede administrar:

- Agregar nueva actividad al catálogo
- Editar o desactivar una actividad existente

Ejemplos de actividades: atender caja, llenar refrigeradores, barrer, trapear, llenar anaqueles, limpiar vidrios, limpiar exterior, recoger basura.

#### 3.3.3 Asignación de actividades
- **Solo el dueño** puede asignar actividades.
- La asignación se hace por: **Caja + Turno + Día**.
- El dueño puede seleccionar actividades del catálogo o escribir una nueva directamente.
- Se pueden asignar varias actividades a la misma caja en el mismo día/turno.

---

### 3.4 Vista del empleado

#### 3.4.1 Acceso
Cada empleado tiene su propio **usuario y contraseña**. Al iniciar sesión, el sistema le muestra automáticamente las actividades asignadas a su caja en el turno y día actual.

#### 3.4.2 Completar una actividad
El empleado puede realizar las siguientes acciones sobre cada tarea asignada:

1. Marcar la actividad como **completada** (check).
2. Opcionalmente, **subir una imagen** como evidencia de que la tarea fue realizada.
3. El sistema registra automáticamente la **hora en que se marcó como completada** y el **nombre del empleado**.

#### 3.4.3 Estados de una actividad
| Estado | Descripción |
|---|---|
| Pendiente | No ha sido marcada aún |
| Completada | Marcada con check por el empleado |
| Completada con evidencia | Marcada con check e imagen adjunta |

---

### 3.5 Vista del dueño

El dueño tiene acceso a un panel de seguimiento con las siguientes consultas:

#### 3.5.1 Tareas pendientes del día
- Ver en tiempo real qué tareas aún no han sido completadas, filtradas por caja, turno o día.

#### 3.5.2 Tareas completadas
- Ver qué tareas ya fueron completadas, quién las completó y a qué hora.
- Ver las imágenes de evidencia si fueron subidas.

#### 3.5.3 Historial de actividades
- Consultar actividades por caja, por día o por rango de fechas.
- Ver el registro completo de cumplimiento a lo largo del tiempo.

---

### 3.6 Alertas por correo

- Al **final de cada turno**, el sistema revisa automáticamente si quedaron tareas sin completar.
- Si existen tareas pendientes, se envía un **correo de alerta al dueño** con el detalle de:
  - Qué tareas quedaron pendientes
  - En qué caja y turno
  - Nombre del empleado responsable
- El horario de fin de turno (para disparar la alerta) será configurable por el dueño.

---

### 3.7 Roles y permisos

| Acción | Dueño | Empleado |
|---|---|---|
| Asignar actividades | ✅ | ❌ |
| Ver actividades propias | ✅ | ✅ |
| Marcar actividad como completada | ✅ | ✅ |
| Subir imagen de evidencia | ✅ | ✅ |
| Ver historial general | ✅ | ❌ |
| Recibir alertas por correo | ✅ | ❌ |
| Administrar catálogo de actividades | ✅ | ❌ |

---

## 4. Consideraciones Generales del Sistema

### 4.1 Autenticación
- Todos los usuarios (dueño y empleados) acceden con usuario y contraseña.
- El dueño tiene rol de **administrador**.
- Los empleados tienen rol de **usuario estándar**.

### 4.2 Acceso y disponibilidad
- La aplicación corre 100% en la nube.
- Accesible desde cualquier dispositivo con navegador y conexión a internet.
- Base de datos: **Supabase**.

---

*Documento elaborado de forma colaborativa entre el dueño del negocio y Claude (Anthropic).*  
*Versión 1.1 — Módulos 1 y 2 completados.*
