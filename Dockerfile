FROM node:10-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ENV SESSION_SECRET "SESSION_SECRET"
ENV SPRING_HOST "course-server"
ENV SPRING_PORT "8080"

COPY package*.json ./

RUN npm install

COPY . .

# In the /bin/www folder, there's a reference to process.env.PORT. Defaults to 3000
ENV PORT 8089

EXPOSE 8089

CMD [ "npm", "start" ]
