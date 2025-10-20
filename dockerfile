# Imagen base oficial de Node
FROM node:18

# Crear directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de configuración primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto (debe coincidir con el de Express)
EXPOSE 80

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
