FROM alpine:3.15.0

RUN apk add thttpd

RUN adduser -D static
USER static
WORKDIR /home/static

COPY ./dist ./phaedra/ui

USER root
RUN chmod -R -x+X *
USER static

CMD ["thttpd", "-D", "-h", "0.0.0.0", "-p", "8080", "-d", "/home/static", "-u", "static", "-l", "-", "-M", "60"]