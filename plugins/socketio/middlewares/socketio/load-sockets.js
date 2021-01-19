/* Based on internal strapi middleware loading (core/load-middlewares.js) */

// require('strapi/lib/load/package-path')
const path = require('path');
const fs = require('fs-extra');

module.exports = async function () {
  const { appPath } = strapi.config;

  const sockets = {};

  const loaders = createLoaders();

  await loaders.loadLocalPluginsSockets(appPath, sockets);
  await loaders.loadLocalApiSockets(appPath, sockets);

  return sockets;
};

const createLoaders = () => {
  // loading all sockets from a directory
  const loadSocketsInDir = async (dir, sockets, defaultns) => {
    if (!fs.existsSync(dir)) return;
    // Load socket configuration
    let config = {
      namespace: defaultns || '/',
      eventPrefix: '',

    };
    if (fs.existsSync(path.resolve(dir, 'config.js')))
      config = { ...config, ...require(path.resolve(dir, 'config.js')) };
    else if (fs.existsSync(path.resolve(dir, 'config.json')))
      config = { ...config, ...require(path.resolve(dir, 'config.json')) };

    if (!sockets[config.namespace])
      sockets[config.namespace] = {};
    // load socket handler files from directory
    const socketFiles = await fs.readdir(dir);
    for (const socFile of socketFiles) {
      if (socFile.startsWith('config.js')) continue;
      if (!socFile.endsWith('.js')) continue;

      const stat = await fs.stat(path.resolve(dir, socFile));
      if (stat.isDirectory()) continue;


      const soc = require(path.resolve(dir, socFile));

      if (typeof soc === 'function') {
        // Loaded handler is a function
        const functionPrefix = socFile.substr(0, socFile.length - 3);
        const functionName = config.eventPrefix + (config.eventPrefix && '_') + functionPrefix;
        sockets[config.namespace][functionName] = soc;
      }
      else {
        // Loaded handler is an object
        const functionPrefix = socFile == 'index.js'
          ? ''
          : `${socFile.substr(0, socFile.length - 3)}_`;
        for (const funName of Object.keys(soc)) {
          if (typeof soc[funName] !== 'function') continue;
          const functionName = config.eventPrefix +
            (config.eventPrefix && '_') +
            functionPrefix + funName;
          sockets[config.namespace][functionName] = soc[funName];
        }
      }
    }

    for (const socFile of socketFiles) {
      const stat = await fs.stat(path.resolve(dir, socFile));
      if (!stat.isDirectory()) continue;

      await loadSocketsInDir(
        path.resolve(dir, socFile),
        sockets,
        config.namespace + (config.namespace !== '/' ? '_' : '') + socFile
      );
    }
  };

  const loadLocalPluginsSockets = async (appPath, sockets) => {
    const pluginsDir = path.resolve(appPath, 'plugins');
    if (!(await fs.exists(pluginsDir))) return;

    const pluginsNames = await fs.readdir(pluginsDir);

    for (const pluginFolder of pluginsNames) {
      // ignore files
      const stat = await fs.stat(path.resolve(pluginsDir, pluginFolder));
      if (!stat.isDirectory()) continue;

      const dir = path.resolve(pluginsDir, pluginFolder, 'sockets');
      await loadSocketsInDir(dir, sockets, `/${pluginFolder}`);
    }
  };

  const loadLocalApiSockets = async (appPath, sockets) => {
    const apiDir = path.resolve(appPath, 'api');
    if (!(await fs.exists(apiDir))) return;

    const apiNames = await fs.readdir(apiDir);

    for (const apiFolder of apiNames) {
      // ignore files
      const stat = await fs.stat(path.resolve(apiDir, apiFolder));
      if (!stat.isDirectory()) continue;

      const dir = path.resolve(apiDir, apiFolder, 'sockets');
      await loadSocketsInDir(dir, sockets, `/${apiFolder}`);
    }
  };

  return {
    loadLocalPluginsSockets,
    loadLocalApiSockets,
  };
};