FROM joyzoursky/python-chromedriver:3.7

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -y install locales 
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8 

RUN apt-get -y install python3-lxml python3-pip
RUN apt-get -y install default-libmysqlclient-dev  

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app

ENV PYTHONPATH /app

EXPOSE 5000

CMD ["bash", "./docker-run.sh"] 
