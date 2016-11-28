FROM ruby:latest
MAINTAINER Tien Pham <dieu.truong@yoose.com>
ENV APP_HOME /home/app/dashboard-api

EXPOSE 80

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

RUN apt-get update && apt-get install -y libicu-dev && apt-get install -y libmagickwand-dev

RUN apt-get install -y mongodb-org-tools=3.2.7 --force-yes

RUN gem install bundler
RUN gem install rmagick -v '2.15.4'
RUN bundle install --binstubs --deployment --without test development

RUN mkdir -p $APP_HOME/log

CMD ["bundle", "exec", "sidekiq", "-q", "default", "-q", "mailers"]

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*