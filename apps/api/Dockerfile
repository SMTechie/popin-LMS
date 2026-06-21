FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared ./packages/shared
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN rm -rf apps/api/node_modules/@nestjs/common \
  apps/api/node_modules/@nestjs/core \
  apps/api/node_modules/@nestjs/platform-express \
  apps/api/node_modules/@nestjs/swagger \
  apps/api/node_modules/@nestjs/testing \
  apps/api/node_modules/rxjs

FROM deps AS seed
COPY . .
RUN npm --workspace apps/api run prisma:generate

FROM seed AS build
RUN npm --workspace apps/api run build

FROM build AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
