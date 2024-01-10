## Building and Running the Dockerfile

To build and run the Dockerfile, follow these steps:

1. Make sure you have Docker installed on your machine. If not, you can download and install it from the official Docker website: [https://www.docker.com/get-started](https://www.docker.com/get-started).

2. Open a terminal or command prompt and navigate to the root directory of your project.

3. Build the Docker image by running the following command:

    ```bash
    docker build -t ui .
    ```

    This command will build the Docker image using the instructions specified in the Dockerfile and tag it with the name "my-app".

4. Once the image is built, you can run a container based on the image using the following command:

    ```bash
    docker run -p 1234:3000 --name ui -e "NODE_ENV=production" --init -m "300M" --memory-swap "1G" ui
    ```

    This command will start a container based on the "my-app" image and map port 3000 of the container to port 1234 of your local machine.

5. Open your web browser and navigate to [http://localhost:1234](http://localhost:1234) to access your application.

That's it! You have successfully built and run your Dockerfile. Feel free to customize the Dockerfile and the instructions according to your project's requirements.

6. Pushing this

```bash
docker tag ui w3b3/web-app-001
docker push w3b3/web-app-001
```

7. References

Following https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md