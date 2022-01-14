# Use the docker image node:11-alpine
FROM node:14.17.0-alpine as builder

# Copy package dependencies 
COPY package.json yarn.lock ./

# Run yarn to install and build the project
RUN yarn install && mkdir /app && mv ./node_modules ./app

# Into which the source will be copied inside the destination container.
WORKDIR /app

COPY . .

# Define Argument variables
ARG ENV="development"

RUN yarn build:$ENV

# Expose the port of the app thats running in the container.
EXPOSE 3000

# Start the app.
CMD yarn start