FROM node:lts-alpine

WORKDIR /app

COPY server/package.json ./

COPY server/package.json server/
RUN npm install --only=production

USER node

COPY server/ server/

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 3000

