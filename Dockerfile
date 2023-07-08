# Use the docker image node:18-alpine
FROM node:18.9-alpine

RUN apk add --no-cache git openssh

# Copy package dependencies 
COPY package*.json yarn.lock ./

# Run yarn to install and build the project
RUN yarn install --frozen-lockfile

# Into which the source will be copied inside the destination container.
WORKDIR /app

COPY . .

# Define Argument variables
ARG ENV="development"
ARG MAINTENANCE="false"

RUN MAINTENANCE=$MAINTENANCE yarn build:$ENV

# Expose the port of the app thats running in the container.
EXPOSE 3000

# Start the app.
CMD yarn start