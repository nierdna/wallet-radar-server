FROM node:18.15.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:18.15.0 AS runner
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install -g pnpm
RUN pnpm install --prod
USER node
EXPOSE 8080
COPY --from=builder --chown=node:node /app/dist  .
# RUN pnpm run migration:run
CMD ["pnpm", "run", "start:prod"]
