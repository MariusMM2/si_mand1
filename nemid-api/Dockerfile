FROM node:latest

# set working directory
RUN mkdir /usr/src/api
WORKDIR /usr/src/api

# copy files
COPY ./ ./

# install and cache app dependencies
RUN npm install

# start app
CMD ["npm", "start"]

