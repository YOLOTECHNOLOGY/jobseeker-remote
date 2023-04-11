# Use the docker image node:11-alpine
FROM node:16.16-alpine as builder

# Copy package dependencies 
COPY package.json yarn.lock ./

# Run yarn to install and build the project
RUN yarn install && mkdir /app && mv ./node_modules ./app

# Into which the source will be copied inside the destination container.
WORKDIR /app

COPY . .

# Define Argument variables
ARG ENV="development"
ARG MAINTENANCE="false"
ARG HOST_PATH="https://bossjob.ph"

RUN MAINTENANCE=$MAINTENANCE HOST_PATH=$HOST_PATH yarn build:$ENV

# Expose the port of the app thats running in the container.
EXPOSE 3004

# Start the app.
CMD HOST_PATH=$HOST_PATH yarn start