FROM node:18

# Install LibreOffice properly
RUN apt-get update && apt-get install -y libreoffice \
    && apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 optional (not critical, but cleaner)
EXPOSE 10000

CMD ["node", "server.js"]