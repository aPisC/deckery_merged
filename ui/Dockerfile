FROM node:lts-stretch

ENV NODE_ENV=production
ENV NODE_PORT=80

WORKDIR /app 
COPY . .

RUN yarn install
RUN yarn global add serve
RUN chmod u+x start.sh

EXPOSE 80
CMD ./start.sh
