# 🏗 Fase 1: Construcción de React
FROM node:18 AS builder
WORKDIR /app

# Copiar archivos y dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# 🏗 Fase 2: Servir con Nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html

# Copiar los archivos compilados de React a la carpeta pública de Nginx
COPY --from=builder /app/dist .

# Copiar configuración de Nginx
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Configurar permisos para evitar errores de acceso
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
