# Imagem de DESENVOLVIMENTO (servidor do Vite com hot reload).
# Usada pelo serviço "web" do docker-compose.yml.
FROM node:22-alpine

WORKDIR /app

# Instala as dependências primeiro (aproveita o cache do Docker)
COPY package.json package-lock.json ./
RUN npm ci

# O código é montado como volume pelo compose; esta cópia serve para
# a imagem também funcionar sozinha.
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
