#
# Dockerfile for DMP-Wizard
# Uses docker image from PHPEarth with Alpine Linux
# 

FROM phpearth/php:7.2-apache
RUN rm /var/www/localhost/htdocs/index.html
COPY src/ /var/www/localhost/htdocs/
