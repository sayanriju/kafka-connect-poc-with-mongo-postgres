
# Dockerfile
FROM node:18-alpine

# WORKDIR /usr/src/app 

# Copy package.json and package-lock.json
COPY NodeJSClient/package*.json ./
# COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# COPY . .

COPY NodeJSClient/commonProducerRoute.js ./

# Adjust this based on your application's entry point
CMD [ "node", "commonProducerRoute.js" ] 