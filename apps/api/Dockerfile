FROM node:24-alpine
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start:dev"]
