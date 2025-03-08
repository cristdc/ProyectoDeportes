# 🏗 Fase 1: Construcción de React
FROM node:18 AS builder
WORKDIR /app

# Copiar archivos necesarios
COPY Frontend_SPA/package.json Frontend_SPA/package-lock.json ./
RUN npm install --frozen-lockfile

# Copiar el código fuente y construir la aplicación
COPY Frontend_SPA .
RUN npm run build

# Copiar Running (si aplica)
COPY Running/package.json Running/package-lock.json ./
RUN npm install --frozen-lockfile
COPY Running .
RUN npm run build

# 🏗 Fase 2: Servir con Nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html

# Limpiar archivos por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar las aplicaciones compiladas al directorio de Nginx
COPY --from=builder /app/dist spa/
COPY --from=builder /app/dist running/

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ajustar permisos para evitar errores 403
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
