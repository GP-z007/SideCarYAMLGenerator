const yamlGenerator = require('../utils/yamlGenerator');

const generateYaml = (req, res) => {
  const { mainContainer, sidecarContainers } = req.body;

  if (!mainContainer || !mainContainer.name || !mainContainer.image) {
    return res.status(400).json({ error: 'Main container name and image are required' });
  }

  // Validate mainContainer fields
  if (mainContainer.ports && !Array.isArray(mainContainer.ports)) {
    return res.status(400).json({ error: 'Main container ports must be an array' });
  }
  if (mainContainer.env && !Array.isArray(mainContainer.env)) {
    return res.status(400).json({ error: 'Main container environment variables must be an array' });
  }
  if (mainContainer.command && !Array.isArray(mainContainer.command)) {
    return res.status(400).json({ error: 'Main container command must be an array' });
  }
  if (mainContainer.args && !Array.isArray(mainContainer.args)) {
    return res.status(400).json({ error: 'Main container arguments must be an array' });
  }

  if (!Array.isArray(sidecarContainers)) {
    return res.status(400).json({ error: 'Sidecar containers must be an array' });
  }

  try {
    // Convert string fields to arrays if they're not already
    const processContainer = (container) => {
      const processed = { ...container };
      if (typeof processed.ports === 'string') {
        processed.ports = processed.ports.split(',').map(port => port.trim());
      }
      if (typeof processed.command === 'string') {
        processed.command = processed.command.split(',').map(cmd => cmd.trim());
      }
      if (typeof processed.args === 'string') {
        processed.args = processed.args.split(',').map(arg => arg.trim());
      }
      return processed;
    };

    const processedMain = processContainer(mainContainer);
    const processedSidecars = sidecarContainers.map(processContainer);

    const yamlStr = yamlGenerator.createPodYaml(processedMain, processedSidecars);
    return res.json({ yaml: yamlStr });
  } catch (error) {
    console.error('Error generating YAML:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { generateYaml };
