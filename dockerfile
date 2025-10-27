# Utiliza una imagen Node oficial
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el código
COPY . .

# Opcional: crea carpeta de reportes para evitar errores de escritura
RUN mkdir -p reports/unit reports/integration

# Comando por defecto (sobrescrito por docker-compose)
CMD ["npm", "test"]
