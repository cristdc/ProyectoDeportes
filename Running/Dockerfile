# Usa una imagen de Nginx para servir los archivos estáticos
FROM nginx:latest

# Copiar la configuración personalizada de Nginx
COPY nginx/running.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de cada frontend a sus respectivas rutas
COPY web /usr/share/nginx/html/web
COPY mobile /usr/share/nginx/html/mobile
COPY desktop /usr/share/nginx/html/desktop

# Exponer el puerto 80 para servir la aplicación
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
