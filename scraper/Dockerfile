FROM python:3

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get -y update && apt-get -y install locales && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && locale-gen

ENV LANG en_US.UTF-8  
ENV LANGUAGE en_US:en  
ENV LC_ALL en_US.UTF-8 

# Installing chromium, should put a version on this 
RUN apt install -y chromium
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt-get -y install ./google-chrome-stable_current_amd64.deb

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH /app

CMD ["bash", "./docker-run.sh"] 
