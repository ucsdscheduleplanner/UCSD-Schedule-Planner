FROM python:3

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get -y install locales && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8 

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH /app

EXPOSE 5000

CMD ["bash", "./docker-run.sh"] 