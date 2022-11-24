FROM node:16

# Working Directory
WORKDIR app/index.js

# Copy Package Json Files
COPY package.json .

# Installing Files
RUN npm install

# Copy Source Files
COPY . .

CMD ["node","index.js"]