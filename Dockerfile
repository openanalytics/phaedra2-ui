FROM registry.openanalytics.eu/proxy/library/node:16
WORKDIR /opt/phaedra
COPY . .
RUN npm install
RUN npm run build

FROM registry.openanalytics.eu/proxy/library/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist /www/data/phaedra/ui