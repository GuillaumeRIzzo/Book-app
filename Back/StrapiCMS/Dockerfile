FROM node:22-alpine

RUN apk update && apk add --no-cache build-base python3 py3-pip git

WORKDIR /opt

COPY package*.json ./
RUN npm install

WORKDIR /opt/app
COPY . .

EXPOSE 1337
CMD ["npm", "run", "develop"]
