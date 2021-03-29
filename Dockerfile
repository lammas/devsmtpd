FROM python:3.8-slim

ENV BIND_ADDRESS=0.0.0.0
ENV HTTP_PORT=3000
ENV SMTP_PORT=1025

RUN useradd -ms /bin/bash devsmtpd
RUN mkdir -p /opt/app
RUN chown devsmtpd:devsmtpd /opt/app
WORKDIR /opt/app

COPY ./requirements.txt /opt/requirements.txt
RUN pip install -r /opt/requirements.txt

COPY ./src /opt/app/src

USER devsmtpd
EXPOSE 3000
ENTRYPOINT python src/main.py --host $BIND_ADDRESS --port $HTTP_PORT --smtp-port $SMTP_PORT
