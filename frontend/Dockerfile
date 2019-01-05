FROM node:8 

ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g yarn 

WORKDIR /app

COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install 

COPY . /app


EXPOSE 3000

CMD ["npm", "start"]
