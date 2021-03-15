# devsmtpd

A minimal mock SMTP server that receives any messages sent to it, stores them in memory and displays them on a web interface for convenient debugging.

By default the service listens for:
* SMTP packets on port 1025
* HTTP traffic on port 3000


## Usage with docker

```sh
docker run -p 3000:3000 -p 1025:1025 devsmtpd:latest
```

The following environment variables are available for customization:

```
BIND_ADDRESS=0.0.0.0
HTTP_PORT=3000
SMTP_PORT=1025
```


## Usage with docker-compose

```yml
devsmtpd:
  image: lammas/devsmtpd:latest
  ports:
    - 3000:3000
```

The above example only proxies the HTTP port to host and assumes the services using the SMTP would be inside the docker network.


## Usage behind nginx reverse proxy

```nginx
# the trailing slashes are required if you host it on a path other than the root
location /mails/ {
	proxy_pass http://devsmtpd:3000/;
}
```
