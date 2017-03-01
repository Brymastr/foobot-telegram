FROM node:alpine

WORKDIR /src
COPY . /src

RUN npm i --only=production && \
  chmod 775 wait-for-it.sh

EXPOSE 80
CMD ["./wait-for-it.sh", "--strict", "core:80", "--", "npm", "start"]