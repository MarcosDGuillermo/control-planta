# Control de planta · Cereales Lobería

App web instalable (PWA) para controlar cubicaje de silos, pasadas por la secadora y consumo de gas.
Guarda los datos en una Google Sheet a través de un Apps Script protegido con clave.

## Archivos (todos en la raíz del repositorio)
- `index.html` — la app
- `manifest.webmanifest` — datos para instalarla (nombre, colores, íconos)
- `sw.js` — permite abrirla sin señal
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` — íconos

## Acceso
La app pide una clave la primera vez que se abre en cada equipo. La clave no está en este repositorio: la valida el Apps Script.

## Instalar
- **Android (Chrome):** menú ⋮ → "Instalar app" (o "Agregar a la pantalla principal").
- **iPhone (Safari):** botón Compartir → "Agregar a inicio".
- **Compu (Chrome o Edge):** ícono de instalar en la barra de direcciones, o menú → "Instalar Control de planta".

## Actualizar
Reemplazar `index.html` en GitHub. La app instalada toma la versión nueva la próxima vez que se abre con señal.
Solo si se agregan o renombran archivos hay que cambiar `VERSION` en `sw.js`.

## No subir al repositorio
La clave de acceso, remitos, facturas ni exportaciones de la Sheet.
