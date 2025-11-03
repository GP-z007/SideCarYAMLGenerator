
# Sidecar YAML Generator

This is a simple Node.js application that provides an API to generate Kubernetes Pod YAML configurations with a main container and any number of sidecar containers.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Running the Application

To start the server, run:

```bash
npm start
```

The server will start on port 5000.

## API Usage

To use the API, send a `POST` request to the `/api/deploy/generate-yaml` endpoint. The body of the request should be a JSON object with the following structure:

*   `mainContainer`: An object representing the main container.
    *   `name`: The name of the container (required).
    *   `image`: The image of the container (required).
    *   `ports`: A comma-separated string or an array of port numbers.
    *   `env`: An array of environment variables.
    *   `command`: A comma-separated string or an array of commands.
    *   `args`: A comma-separated string or an array of arguments.
*   `sidecarContainers`: An array of objects, where each object represents a sidecar container. The structure of each object is the same as the `mainContainer` object.

a:\n  name: sidecar-pod\n  labels:\n    app: sidecar-app\nspec:\n  containers:\n    - name: my-app\n      image: nginx:latest\n      ports:\n        - containerPort: 80\n    - name: log-shipper\n      image: fluentd:latest\n      env:\n        - name: FLUENTD_CONF\n          value: fluent.conf\n"
}

