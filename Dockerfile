FROM ghcr.io/puppeteer/puppeteer:21.3.8

ENV PUPPETEER_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN  npm ci
COPY . .
CMD [ "node","./src/app.js" ]