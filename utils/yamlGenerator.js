const yaml = require('js-yaml');

// createPodYaml generates a Kubernetes Pod manifest with a main container and optional sidecars.
// Basic validation and deterministic output formatting are applied.
function createPodYaml(mainContainer, sidecars = []) {
  // Input validation
  if (!mainContainer || typeof mainContainer !== 'object') {
    throw new Error('mainContainer must be a non-null object');
  }
  const { name: mainName, image: mainImage } = mainContainer;
  if (!mainName || !mainImage) {
    throw new Error('mainContainer must include name and image');
  }

  if (!Array.isArray(sidecars)) {
    throw new Error('sidecars must be an array');
  }

  const processContainer = (container, idx = null) => {
    if (!container || typeof container !== 'object') {
      throw new Error(idx !== null ? `sidecars[${idx}] must be an object` : 'Container must be an object');
    }
    if (!container.image) {
      throw new Error(idx !== null ? `sidecars[${idx}].image is required` : 'Container image is required');
    }

    const containerSpec = {
      name: container.name && String(container.name).trim() 
        ? String(container.name) 
        : idx !== null ? `sidecar-${idx + 1}` : 'main-container',
      image: String(container.image),
    };

    // Add optional fields if they exist
    if (container.command && Array.isArray(container.command)) {
      containerSpec.command = container.command.map(String);
    }
    if (container.args && Array.isArray(container.args)) {
      containerSpec.args = container.args.map(String);
    }
    if (container.ports && Array.isArray(container.ports)) {
      containerSpec.ports = container.ports.map(port => ({
        containerPort: parseInt(port, 10)
      }));
    }
    if (container.env && Array.isArray(container.env)) {
      containerSpec.env = container.env.map(({ name, value }) => ({
        name: String(name),
        value: String(value)
      }));
    }

    return containerSpec;
  };

  const normalizedSidecars = sidecars.map((sc, idx) => processContainer(sc, idx));

  const podSpec = {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name: 'sidecar-pod',
      labels: { app: 'sidecar-app' },
    },
    spec: {
      containers: [
        processContainer(mainContainer),
        ...normalizedSidecars,
      ],
    },
  };

  // Use yaml.dump with stable options
  return yaml.dump(podSpec, {
    indent: 2,
    lineWidth: 120,
    noRefs: true, // prevent anchors/aliases for stable output
    sortKeys: true, // deterministic key ordering
  });
}

module.exports = { createPodYaml };
