# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'dashboard'
set :repo_url, 'git@git.yoose.com:v4-platform/dashboard.git'
set :user, 'ec2-user'

set :deploy_to, "/home/#{fetch(:user)}/#{fetch(:application)}"
set :scm, :git

set :format, :pretty
set :pty, true

set :keep_releases, 5

# set :docker_repo_url, 'git.yoose.com:5000'

