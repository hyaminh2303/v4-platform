lock '3.4.0'

set :application, 'dashboard_api'
set :repo_url, 'git@git.yoose.com:v4-platform/dashboard.git'
set :user, 'ec2-user'

set :deploy_to, "/home/#{fetch(:user)}/#{fetch(:application)}"
set :scm, :git

set :format, :pretty
set :pty, true

set :keep_releases, 5
# set :docker_repo_url, 'git.yoose.com:5000'

namespace :deploy do
  # before :check, :install_packages do
  #   on roles(:app), in: :groups do
  #     execute 'sudo apt-get update'
  #     execute 'sudo apt-get install -y linux-image-extra-$(uname -r)'
  #     execute 'sudo apt-get install -y apt-transport-https ca-certificates git make'
  #     execute 'sudo apt-get install -y supervisor'
  #     execute 'sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D'
  #     execute "sudo sh -c 'echo deb https://apt.dockerproject.org/repo ubuntu-trusty main > /etc/apt/sources.list.d/docker.list'"
  #     execute 'sudo apt-get update'
  #     execute 'sudo apt-get install -y docker-engine'
  #   end
  # end

  # after :published, :copy_env do
  #   on roles(:app), in: :groups do
  #     execute "cp /home/#{fetch(:user)}/config/.env #{release_path}"
  #   end
  # end

  after :deploy, :build_docker_image do
    on roles(:app), in: :groups do
      within release_path do
        execute :make
        execute "/home/#{fetch(:user)}/scripts/start_dashboard_api.sh"
        execute "/home/#{fetch(:user)}/scripts/start_sidekiq.sh"
      end
    end
  end
end
