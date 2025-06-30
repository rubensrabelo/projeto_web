FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g nodemon

EXPOSE 3000

CMD ["npm", "run", "dev"]
