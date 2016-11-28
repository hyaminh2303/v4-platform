set :branch, :develop

server '52.77.126.39', user: 'ec2-user', roles: %w{app}

set :ssh_options, {
 forward_agent: true,
 user: 'ec2-user'
}
