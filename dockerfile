FROM node:17-alpine

RUN mkdir /app

WORKDIR /app

COPY . /app

EXPOSE 3000

CMD ["yarn", "start"]