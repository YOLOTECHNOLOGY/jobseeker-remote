# Use the docker image node:11-alpine
FROM node:16-alpine as builder

# Copy package dependencies 
# COPY . .

# Run yarn to install and build the project
# RUN yarn install && mkdir /app && mv ./node_modules ./app

# Into which the source will be copied inside the destination container.
WORKDIR /app

COPY .next ./.next

# Define Argument variables
# ARG ENV="development"
# ARG MAINTENANCE="false"

# RUN MAINTENANCE=$MAINTENANCE yarn build:$ENV

# # Expose the port of the app thats running in the container.
# EXPOSE 3000

# # Start the app.
# CMD yarn start

# Install a simple http server to serve the SPA
RUN yarn global add serve

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Start the app
CMD ["serve", "-s", ".next", "-p", "3000"]