# Start with the official Maven image which includes Java
FROM maven:3.8.5-openjdk-17 as builder

# Set the working directory in docker
WORKDIR /app

# Copy the pom.xml file to download dependencies
COPY pom.xml .

# Download all required dependencies. This step will only be re-run if your POM file changes.
RUN mvn dependency:go-offline -B

# Copy the source code into the container
COPY src src/

# Build the project inside the Docker container
RUN mvn clean package

# Now, use a smaller JDK image to run the application
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=builder /app/target/*.jar app.jar

# Command to run the application
CMD ["java", "-jar", "app.jar"]