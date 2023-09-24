FROM node:20-alpine

WORKDIR /frontend
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 3000

RUN npm run build
CMD node .output/server/index.mjs