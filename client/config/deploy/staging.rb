set :branch, :develop

server '52.77.126.39', user: 'ec2-user', roles: %w{app}

set :ssh_options, {
    forward_agent: true,
    user: 'ec2-user'
}

set :linked_dirs,  %w{client/node_modules}

namespace :deploy do
  after :deploy, :build_docker_image do
    on roles(:app), in: :groups do
      within "#{release_path}/client" do
        execute "make","staging"
        execute "/home/#{fetch(:user)}/scripts/start_dashboard.sh"
      end
    end
  end
end