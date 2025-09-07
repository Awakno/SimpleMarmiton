
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Étape 2 : image de prod
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copie uniquement ce qui est nécessaire
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3002
CMD ["npm", "start"]
