# DMP - Wizard

Simple data management plan creation (digital-prevervation exercise)

## Docker instructions

1. clone the project with `git clone https://github.com/mtwie/dmp-wizard.git`
2. cd into the dmp-wizard directory
3. build the docker image with `docker build -t dmp-wizard .`
4. run the image with `docker run -d -p 8080:80 --name dmp-wizard-1 dmp-wizard`
5. open your browser and got to `http://localhost:8080` (`http://192.168.99.100:8080` if on Docker Toolbox)
