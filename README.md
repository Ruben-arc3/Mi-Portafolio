# Mi Portafolio

Portafolio personal de **Rubén Mora Martínez**, ingeniero de sistemas y desarrollador de software. Es un sitio estático con tema oscuro, fondo animado de estilo tecnológico y datos en vivo desde GitHub.

## Qué incluye

- **Inicio** con titular dinámico y una terminal con mis datos.
- **Proyectos** destacados con sus tecnologías y enlaces.
- **GitHub en vivo:** los repositorios más recientes se cargan desde la API pública de GitHub.
- **Experiencia y formación** en líneas de tiempo.
- **Sobre mí** con el stack tecnológico.
- **Contacto** con correo (botón para copiarlo), LinkedIn, GitHub y descarga del CV en PDF.
- Tema claro y oscuro, que recuerda la elección y respeta la del sistema.
- Fondo de lluvia de código, cinta de tecnologías y barra de progreso de lectura.
- Accesible: navegación por teclado, enlace para saltar al contenido y respeto a "reducir movimiento".

## Tecnologías

HTML, CSS y JavaScript puros, sin frameworks ni pasos de compilación. Fuentes de Google Fonts (Bricolage Grotesque y Public Sans) e íconos de [Devicon](https://devicon.dev/).

## Estructura

```
Mi-Portafolio/
├── index.html                    # Contenido y estructura
├── styles.css                    # Estilos y animaciones
├── app.js                        # Interacciones, fondo animado y GitHub en vivo
├── favicon.svg                   # Ícono de la pestaña
├── CV-Ruben-Mora-Martinez.pdf    # Hoja de vida descargable
└── README.md
```

## Ejecutarlo en local

No necesita instalación. Clona el repositorio y abre `index.html` en el navegador:

```bash
git clone https://github.com/Ruben-arc3/Mi-Portafolio.git
cd Mi-Portafolio
```

Si prefieres un servidor local:

```bash
python -m http.server 8000
```

y entra a `http://localhost:8000`.

## Publicarlo

Al ser un sitio estático funciona en Cloudflare Pages, GitHub Pages o Netlify. En Cloudflare Pages basta con conectar este repositorio, dejar el comando de compilación vacío y usar la raíz (`/`) como carpeta de salida.

## Personalizarlo

- **Colores:** variables al inicio de `styles.css` (`--bg`, `--accent`, etc.).
- **Frases del titular:** lista `phrases` en `app.js`.
- **Usuario de GitHub:** variable `user` en `app.js`.
- **CV:** reemplaza `CV-Ruben-Mora-Martinez.pdf` conservando el nombre.

## Contacto

- Correo: ingrubenmora76@gmail.com
- LinkedIn: [ruben-mora](https://www.linkedin.com/in/ruben-mora-9427a6398/)
- GitHub: [@Ruben-arc3](https://github.com/Ruben-arc3)

© Rubén Mora Martínez · Montería, Colombia
