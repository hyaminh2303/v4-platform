#!/usr/bin/env bash
dir=`dirname $0`
cd ..
dir=$(pwd)
rm -rf $dir/sidekiq/app
rm -rf $dir/sidekiq/bin
rm -rf $dir/sidekiq/config
rm -rf $dir/sidekiq/db
rm -rf $dir/sidekiq/docker
rm -rf $dir/sidekiq/lib
rm -rf $dir/sidekiq/public
rm -rf $dir/sidekiq/scripts
rm -rf $dir/sidekiq/vendor
rm -rf $dir/sidekiq/config.ru
rm -rf $dir/sidekiq/Gemfile
rm -rf $dir/sidekiq/Gemfile.lock
rm -rf $dir/sidekiq/newrelic.yml
rm -rf $dir/sidekiq/Rakefile

ln -s $dir/app $dir/sidekiq/app
ln -s $dir/bin $dir/sidekiq/bin
ln -s $dir/config $dir/sidekiq/config
ln -s $dir/db $dir/sidekiq/db
ln -s $dir/docker $dir/sidekiq/docker
ln -s $dir/lib $dir/sidekiq/lib
ln -s $dir/public $dir/sidekiq/public
ln -s $dir/scripts $dir/sidekiq/scripts
ln -s $dir/vendor $dir/sidekiq/vendor
ln -s $dir/config.ru $dir/sidekiq/config.ru
ln -s $dir/Gemfile $dir/sidekiq/Gemfile
ln -s $dir/Gemfile.lock $dir/sidekiq/Gemfile.lock
# ln -s $dir/newrelic.yml $dir/sidekiq/newrelic.yml
ln -s $dir/Rakefile $dir/sidekiq/Rakefile

cd $dir/sidekiq
# zip -r sidekiq.zip * .[^.]*
zip -r sidekiq.zip .
eb deploy
rm sidekiq.zip
