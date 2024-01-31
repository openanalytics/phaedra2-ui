FROM registry.openanalytics.eu/proxy/library/node:21
WORKDIR /opt/phaedra

# Install modules first, this takes a long time and will get cached in a layer
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM registry.openanalytics.eu/proxy/library/nginx
COPY --from=0 /opt/phaedra/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /opt/phaedra/dist /www/data/phaedra/ui
