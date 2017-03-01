FROM node:alpine

WORKDIR /src
COPY . /src

RUN chmod 775 wait-for-it.sh && \
  npm i --only=production

EXPOSE 80
CMD ["./wait-for-it.sh", "--strict", "core:80", "--", "npm", "start"]