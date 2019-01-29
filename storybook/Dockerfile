FROM node:8



RUN npm install -g yarn 

WORKDIR /app


COPY ./yarn.lock /app
COPY ./package.json /app
RUN yarn install

COPY . /app

EXPOSE 9001

CMD ["yarn", "run", "storybook", "--ci"]
