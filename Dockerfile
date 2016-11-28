FROM phusion/passenger-ruby22:latest
MAINTAINER Tien Pham <tien.pham@yoose.com>
ENV HOME /root
ENV APP_HOME /home/app/dashboard-api
# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

EXPOSE 80
EXPOSE 8888

RUN rm -f /etc/service/nginx/down

# Configure Nginx
RUN rm /etc/nginx/sites-enabled/default
ADD docker/configs/dashboard-api.conf /etc/nginx/sites-enabled/app.conf
ADD docker/configs/nginx-rails-env.conf /etc/nginx/main.d/rails-env.conf

# Install the app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME

RUN chown -R app:app $APP_HOME

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN apt-get update && apt-get install -y libicu-dev && apt-get install -y libmagickwand-dev
RUN apt-get install -y mongodb-org-tools=3.2.7 --allow-unauthenticated

RUN gem install bundler
RUN gem install rmagick -v '2.15.4'
RUN bundle install --binstubs --deployment --without test development

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
