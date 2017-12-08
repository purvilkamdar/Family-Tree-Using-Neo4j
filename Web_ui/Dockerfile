FROM node:alpine
RUN mkdir -p app
WORKDIR /app
COPY package.json /app
COPY . /app
RUN npm install
RUN npm build
EXPOSE 3000
