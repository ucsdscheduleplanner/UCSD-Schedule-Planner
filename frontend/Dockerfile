FROM node:8 

ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g yarn 

WORKDIR /app

COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install 

COPY . /app

RUN chmod u+x run.sh

EXPOSE 3000

CMD ["./run.sh"]
