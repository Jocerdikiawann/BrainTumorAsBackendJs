FROM node:slim
RUN apt-get update || : && apt-get install python -y
RUN apt-get install python3-pip -y || : && pip install -U pip
RUN apt-get install cmake -y
RUN apt install libopencv-dev python3-opencv -y
RUN apt-get install git -y
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm","start" ]