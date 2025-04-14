FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .


RUN mkdir -p /root/.gradle/wrapper/dists/gradle-8.6-bin/ && \
    curl -SL https://services.gradle.org/distributions/gradle-8.6-bin.zip \
    -o /root/.gradle/wrapper/dists/gradle-8.6-bin/gradle-8.6-bin.zip



ENV JAVA_HOME=/opt/java/openjdk

RUN ./gradlew build

EXPOSE 8080

CMD ["java", "-jar", "build/libs/app.jar"]