FROM node:8-slim

WORKDIR /opt
ENV NODE_ENV development

COPY package.json /opt/package.json

RUN npm install --production

COPY .env.example /opt/.env.example
COPY . /opt

CMD ["npm","start"]

EXPOSE 8080
