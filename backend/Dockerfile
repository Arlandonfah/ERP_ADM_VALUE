
FROM eclipse-temurin:8-jdk


WORKDIR /app


COPY . .


ENV JAVA_HOME=/opt/java/openjdk

RUN ./gradlew build


EXPOSE 8080


CMD ["java", "-jar", "build/libs/app.jar"]