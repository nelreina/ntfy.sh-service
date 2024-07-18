FROM node:lts-bullseye-slim
ENV NODE_ENV=production
ENV REDIS_URL=redis://172.17.0.1:6379
RUN apt-get install tzdata
ENV TZ America/Curacao
EXPOSE 5050

RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package.json package-lock*.json ./
RUN npm ci && npm cache clean --force
COPY --chown=node:node . .
CMD ["node", "src/index.js"]
