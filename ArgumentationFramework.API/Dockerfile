#
# Build stage
#
FROM amazoncorretto:17 AS build
VOLUME /tmp
ARG JAR_FILE
COPY ${JAR_FILE} af.jar
ENTRYPOINT ["java","-jar","/af.jar"]