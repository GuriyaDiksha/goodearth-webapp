module.exports = {
<<<<<<< HEAD
    apps : [{
      name: 'Goodearth Live',
      script: 'dist/static/server/server.js',
  
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      args: 'one two',
      instances: 32,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }],
  
    deploy : {
      production : {
        user : 'node',
        host : '212.83.163.1',
        ref  : 'origin/master',
        repo : 'git@github.com:repo.git',
        path : '/var/www/production',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
      }
    }
  };
=======
  apps : [{
    name: 'Goodearth Dev',
    script: 'dist/static/server/server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 3,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
>>>>>>> 1d863d588e131b19b8a231ae2396c1f514f634e8
