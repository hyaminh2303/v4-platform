set :branch, :master

server '52.77.126.39', user: 'ubuntu', roles: %w{app}

set :ssh_options, {
 forward_agent: true,
 user: 'ubuntu'
}
