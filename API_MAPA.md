# API de mapa y datos

Esta carpeta deja la misma información del tótem lista para reutilizar en otra aplicación.

## Archivos publicados

Base pública:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/
```

Datos principales:

```text
puntos-actualizados.csv
puntos.csv
api/puntos.json
api/refugios.json
api/comedores.json
api/mapa.geojson
api/refugios.geojson
api/comedores.geojson
```

## URLs para otra aplicación

Todos los puntos:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/api/puntos.json
```

Solo refugios:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/api/refugios.json
```

Solo comedores:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/api/comedores.json
```

Mapa en formato GeoJSON:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/api/mapa.geojson
```

CSV actualizado:

```text
https://ingridspenner.github.io/red-de-ayuda-totem/puntos-actualizados.csv
```

## Estructura JSON

```json
{
  "id": "refugio-1",
  "tipo": "refugio",
  "nombre": "Un hogar para todas las noches",
  "lat": -31.396339349162,
  "lng": -64.1993814643417,
  "direccion": "Obispo Ceballos 44, barrio San Martín",
  "horario": "Ingreso a partir de las 20hs",
  "servicios": ["Alojamiento", "cena"],
  "imagen": "assets/manos-abiertas.png",
  "telefono": "",
  "descripcion": "Texto descriptivo"
}
```

## API local con servidor

Si se ejecuta el proyecto con:

```bash
node server.js
```

También quedan disponibles estos endpoints:

```text
GET /api/puntos
GET /api/puntos?tipo=refugio
GET /api/puntos?tipo=comida
GET /api/puntos/:id
GET /api/mapa
GET /api/mapa?tipo=refugio
GET /api/mapa?tipo=comida
GET /api/csv
```

## Actualizar datos

1. Editar `puntos-actualizados.csv`.
2. Ejecutar:

```bash
node tools/generar-api.js
```

3. Subir los cambios a GitHub.
