# Productos Financieros - Frontend

Aplicación web para la gestión de productos financieros de un banco. Permite consultar, buscar, registrar, editar y eliminar productos consumiendo un API REST local.

El proyecto fue desarrollado con Angular, utilizando una arquitectura por capas y componentes standalone. La interfaz fue construida completamente con HTML y CSS propio, sin librerías externas de estilos o componentes.

## Requisitos

Antes de iniciar, asegúrate de tener instalado:

* Node.js 18 o superior
* npm 9 o superior

Tecnologías principales utilizadas:

* Angular 18
* TypeScript 5.5
* Jest para pruebas unitarias

---

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar la aplicación

```bash
npm start
```

Luego abre el navegador en:

```text
http://localhost:4200
```

La aplicación requiere que el backend esté ejecutándose en el puerto `3002`.

---

## Backend

El backend se entrega como un proyecto separado en Node.js.

Para levantarlo:

```bash
npm install
npm run start:dev
```

El servicio estará disponible en:

```text
http://localhost:3002
```

El frontend utiliza un proxy de desarrollo para redirigir las solicitudes realizadas a `/bp` hacia el backend. No se requiere configuración adicional.

La URL base del API se encuentra en:

```text
src/environments/environment.ts
```

---

## Endpoints utilizados

| Operación           | Método | Ruta                            |
| ------------------- | ------ | ------------------------------- |
| Listar productos    | GET    | `/bp/products`                  |
| Verificar ID        | GET    | `/bp/products/verification/:id` |
| Crear producto      | POST   | `/bp/products`                  |
| Actualizar producto | PUT    | `/bp/products/:id`              |
| Eliminar producto   | DELETE | `/bp/products/:id`              |

---

## Funcionalidades

* Listado de productos financieros.
* Búsqueda por ID, nombre o descripción.
* Paginación y selección de cantidad de registros por página.
* Registro de nuevos productos.
* Edición de productos existentes.
* Eliminación de productos mediante modal de confirmación.
* Validación de campos obligatorios.
* Validación de ID único mediante consulta al API.
* Cálculo automático de la fecha de revisión.
* Manejo de errores visibles para el usuario.
* Pantallas de carga mientras se obtienen los datos.
* Diseño responsive.

---

## Validaciones del formulario

| Campo               | Validación                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| ID                  | Obligatorio, entre 3 y 10 caracteres y único                                 |
| Nombre              | Obligatorio, entre 6 y 100 caracteres                                        |
| Descripción         | Obligatoria, entre 10 y 200 caracteres                                       |
| Logo                | Obligatorio                                                                  |
| Fecha de liberación | Obligatoria y no puede ser menor a la fecha actual al registrar              |
| Fecha de revisión   | Obligatoria y debe ser exactamente un año posterior a la fecha de liberación |

Durante la edición, el ID no puede modificarse. Además, se permite conservar una fecha de liberación anterior a la fecha actual, ya que se trata de un producto existente.

---

## Pruebas unitarias

El proyecto utiliza Jest para las pruebas unitarias.

Ejecutar todas las pruebas:

```bash
npm test
```

Ejecutar pruebas con cobertura:

```bash
npm run test:coverage
```

Ejecutar pruebas en modo interactivo:

```bash
npm run test:watch
```

Las pruebas cubren principalmente:

* Casos de uso.
* Repositorio HTTP.
* Mapeo entre DTOs y modelos de dominio.
* Manejo de errores HTTP.
* Validadores del formulario.
* Lógica de filtrado y paginación.
* Componentes y páginas principales.

---

## Arquitectura

El proyecto está organizado por capas para mantener separadas las responsabilidades de la aplicación.

```text
Presentación  ->  Dominio  <-  Datos  ->  Infraestructura
```

### Dominio

Contiene los modelos, contratos de repositorio y casos de uso. Esta capa no depende de Angular ni de HTTP.

### Datos

Incluye la implementación del repositorio que consume el API, los DTOs y los mappers.

### Infraestructura

Contiene utilidades compartidas, como la traducción de errores HTTP a mensajes entendibles para el usuario.

### Presentación

Incluye componentes, páginas, formularios y la lógica de interacción con el usuario.

El contrato `ProductRepository` se utiliza como abstracción para desacoplar el dominio de la implementación HTTP.

---

## Decisiones técnicas

* Uso de componentes standalone, sin `NgModules`.
* Lazy loading en las rutas de productos.
* Estrategia `OnPush` para mejorar el rendimiento de renderizado.
* Manejo de fechas en formato `YYYY-MM-DD`.
* Fecha de revisión calculada automáticamente a partir de la fecha de liberación.
* Validación asíncrona del ID con debounce.
* Manejo centralizado de errores mediante el tipo `AppError`.
* Estilos desarrollados manualmente con CSS, sin librerías externas.

---

## Estructura del proyecto

```text
src/
  app/
    core/
      domain/
        models/
        repositories/
        use-cases/
      data/
        mappers/
        repositories/
      infrastructure/
        http/
    features/
      products/
        components/
        pages/
    shared/
      pipes/
      validators/
    app.component.ts
    app.config.ts
    app.routes.ts
  environments/
  styles.css

proxy.conf.json
```

---

## Scripts disponibles

| Comando                 | Descripción                           |
| ----------------------- | ------------------------------------- |
| `npm start`             | Levanta el servidor de desarrollo     |
| `npm run build`         | Genera la compilación para producción |
| `npm test`              | Ejecuta las pruebas unitarias         |
| `npm run test:coverage` | Ejecuta pruebas con cobertura         |
| `npm run test:watch`    | Ejecuta pruebas en modo interactivo   |
