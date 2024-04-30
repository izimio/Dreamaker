FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 8545

CMD ["npx", "hardhat", "node"]
