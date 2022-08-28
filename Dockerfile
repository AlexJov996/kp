# Docker image for FollowUP API
# ==============================================
FROM 436598850111.dkr.ecr.us-east-1.amazonaws.com/h10-alpine-node:14.16

ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    udev \
    ttf-freefont \
    chromium unzip curl

# Bundle app source
WORKDIR /app
COPY . .

# Install modules
RUN npm install --production

# Start server
EXPOSE 9090
CMD [ "npm", "start" ]
