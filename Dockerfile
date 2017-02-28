FROM node:alpine

WORKDIR /src
COPY . /src

RUN npm i

EXPOSE 80
CMD ["./wait-for-it.sh", "--strict", "core:80", "--", "npm", "start"]