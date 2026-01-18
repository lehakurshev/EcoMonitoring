FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_ADMIN_PASSWORD_HASH
ENV VITE_ADMIN_PASSWORD_HASH=${VITE_ADMIN_PASSWORD_HASH}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
