FROM node:16.14-alpine

WORKDIR /app-frontend

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
