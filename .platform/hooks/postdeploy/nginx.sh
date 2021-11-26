#!/bin/bash

cat << 'EOF' > /etc/nginx/conf.d/elasticbeanstalk/99_application.conf
location / {
    set $redirect 0;

    if ($http_x_forwarded_proto != "https") {
        set $redirect 1;
    }

    if ($http_user_agent ~* "ELB-HealthChecker") {
        access_log off;
        set $redirect 0;
    }

    if ($redirect = 1) {
        return 301 https://$host$request_uri;
    }

    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Origin, X-Requested-With, Content-Type, Accept, Authorization' always;

    proxy_pass          http://127.0.0.1:3000;
    proxy_http_version  1.1;

    proxy_set_header    Connection          $connection_upgrade;
    proxy_set_header    Upgrade             $http_upgrade;
    proxy_set_header    Host                $host;
    proxy_set_header    X-Real-IP           $remote_addr;
    proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
}
EOF

rm /etc/nginx/conf.d/elasticbeanstalk/00_application.conf

service nginx restart || service nginx start
