# Portafolio web de Rubén Mora

Sitio estático independiente, listo para Cloudflare Pages. No modifica el sitio Decido Cuidarme que se publica desde `outputs/`.

## Publicar en Cloudflare Pages

### Con GitHub

1. Crea un proyecto de Pages conectado a este repositorio.
2. En la configuración del proyecto establece `portfolio-site` como directorio raíz.
3. Deja vacío el comando de compilación y establece `public` como directorio de salida.
4. Despliega la rama principal.

### Con Wrangler

Desde esta carpeta ejecuta:

```bash
npx wrangler pages deploy public --project-name ruben-mora-portfolio
```

No requiere instalación de dependencias ni compilación. Bootstrap y GSAP se cargan desde jsDelivr; la imagen abstracta de portada y las tipografías se cargan desde Unsplash y Google Fonts.

## Personalización

- Edita los proyectos, enlaces y textos en `public/index.html`.
- Cambia colores, diseño y ajustes responsive en `public/styles.css`.
- Las animaciones, el filtro de proyectos y el menú móvil están en `public/app.js`.
- El background de portada es una imagen de Conny Schneider en Unsplash; el enlace de crédito está en el pie de página.
