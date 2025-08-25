FROM node:20

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

COPY package*.json ./

RUN npm install --production --verbose

COPY . .

EXPOSE 1337

CMD ["npm", "start"]
