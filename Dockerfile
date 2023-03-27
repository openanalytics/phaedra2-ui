FROM registry.openanalytics.eu/library/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist /www/data/phaedra/ui