FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 8545

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"] 
