set :branch, :develop

server 'git.yoose.com', user: 'ubuntu', roles: %w{app}

server 'git.yoose.com',
       user: 'ubuntu',
       roles: %w{app},
       ssh_options: {
           forward_agent: true,
           port: 2222
       }
