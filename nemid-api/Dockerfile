FROM node:latest

# set working directory
RUN mkdir /usr/src/api
WORKDIR /usr/src/api

# add `/usr/src/node_modules/.bin` to $PATH
#ENV PATH /usr/src/api/node_modules/.bin:$PATH

#ADD nem_id_database.sqlite /usr/src/api/nem_id_database.sqlite
# install and cache app dependencies
ADD package.json /usr/src/api/package.json
RUN npm install

# start app
CMD ["npm", "start"]

