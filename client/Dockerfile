# مرحله build
FROM node:18-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# مرحله نهایی با Nginx
FROM nginx:alpine

# کپی فایل‌های build‌شده از مرحله قبل
COPY --from=build /app/build /usr/share/nginx/html

# کپی فایل تنظیمات Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# کپی فایل‌های سرتیفیکت (certificate و private key)
COPY certs/certificate.crt /etc/nginx/certs/certificate.crt
COPY certs/private.key /etc/nginx/certs/private.key

# باز کردن پورت 80 و 443 (برای HTTPS)
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]