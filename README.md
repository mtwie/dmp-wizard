# DMP - Wizard
[![DOI](https://zenodo.org/badge/130723036.svg)](https://zenodo.org/badge/latestdoi/130723036)

Simple data management plan creation (digital-prevervation exercise)

## Docker instructions

1. clone the project with `git clone https://github.com/mtwie/dmp-wizard.git`
2. cd into the dmp-wizard directory
3. build the docker image with `docker build -t dmp-wizard .`
4. run the image with `docker run -d -p 8080:80 --name dmp-wizard-1 dmp-wizard`
5. open your browser and got to `http://localhost:8080` (`http://192.168.99.100:8080` if on Docker Toolbox)

## Dependencies
* jquery 2
* lodash
* boostrap 4
* bootstrap-select [github.com/silviomoreto/bootstrap-select](https://github.com/silviomoreto/bootstrap-select)
* countrypicker [github.com/Saganic/country-picker](https://github.com/Saganic/country-picker)
* license-selector [github.com/ufal/public-license-selector](https://github.com/ufal/public-license-selector)
