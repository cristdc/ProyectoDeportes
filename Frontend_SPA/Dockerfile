# Etapa 1: Construcción del frontend SPA
FROM node:20 as build-spa
WORKDIR /app/spa
COPY Frontend_SPA/package*.json ./
RUN npm install
COPY Frontend_SPA ./
RUN npm run build

# Etapa 2: Construcción del frontend Running
FROM node:20 as build-running
WORKDIR /app/running
COPY Running/web/package*.json ./
RUN npm install
COPY Running/web ./
RUN npm run build

# Etapa 3: Servir ambos frontends con Nginx
FROM nginx:latest
COPY --from=build-spa /app/spa/dist /usr/share/nginx/html/spa
COPY --from=build-running /app/running/dist /usr/share/nginx/html/running
COPY ./nginx/frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
