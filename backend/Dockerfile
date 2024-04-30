FROM node:18 as builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18 as runner

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/build build/
CMD [ "node", "build/server.js" ]