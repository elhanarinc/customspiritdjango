FROM ubuntu:latest

RUN apt-get update && apt-get upgrade -y

RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

RUN apt-get install -y python3-pip python3-dev libpq-dev nginx

RUN apt-get install -y gcc g++ musl-dev libreadline-gplv2-dev \
     libncursesw5-dev libssl-dev libsqlite3-dev tk-dev \ 
     libgdbm-dev libc6-dev libbz2-dev libffi-dev 

# create directories
RUN mkdir -p /usr/src
RUN mkdir -p /usr/src/logs
RUN mkdir -p /usr/src/app

# nginx settings
COPY ./django-nginx.conf /etc/nginx/sites-available/
RUN ln -s /etc/nginx/sites-available/django-nginx.conf /etc/nginx/sites-enabled
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip3 install --upgrade pip
COPY ./requirements.txt .
RUN pip3 install -r requirements.txt

# copy project
COPY . .

# Port to expose
EXPOSE 80

# make executable of bash script
RUN chmod +x ./docker-entrypoint.sh

CMD ["bash", "docker-entrypoint.sh"]