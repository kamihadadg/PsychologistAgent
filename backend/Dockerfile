FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --production
RUN npm uninstall bcrypt && npm install bcrypt  # نصب دوباره bcrypt

COPY . .

EXPOSE 3000

CMD ["npm", "start"]