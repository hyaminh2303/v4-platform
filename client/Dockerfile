FROM nginx
MAINTAINER Tien Pham <tien.pham@yoose.com>

RUN mkdir -p /app
WORKDIR /app

ADD build .

ADD scripts/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

