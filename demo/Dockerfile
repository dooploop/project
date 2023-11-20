FROM node:16-alpine

ENV NODE_ENV=production

RUN mkdir /mortgage
WORKDIR /demo

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD ["npm", "start"]
