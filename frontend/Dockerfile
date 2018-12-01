FROM node:8 

ENV DEBIAN_FRONTEND noninteractive

RUN npm install -g yarn 

WORKDIR /app
COPY . /app

RUN yarn install 

EXPOSE 3000

CMD ["npm", "start"]
