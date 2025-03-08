# Etapa 1: Construcción de la aplicación
FROM node:20-alpine as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar y configurar dependencias
COPY package*.json ./
RUN npm ci --only=production 

# Copiar el código fuente y construir la aplicación
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Eliminar archivos innecesarios antes de copiar
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos de la build desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (si existe)
COPY ./nginx/frontend.conf /etc/nginx/conf.d/default.conf 

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
