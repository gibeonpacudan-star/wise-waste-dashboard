FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy app
COPY . .

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
