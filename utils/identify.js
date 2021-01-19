function identify(data) {
  if (data === null) return null;
  if (typeof data === 'object' && !Array.isArray(data)) return data.id;
  return data;
}

function identifyAll(data) {
  if (Array.isArray(data)) {
    return data.map(i => identify(i));
  }
  const nd = {};
  Object.keys(data).forEach(key => {
    nd[key] = identify(data[key]);
  });
  return nd;
}

async function deidentify(id, model) {
  if (typeof model === 'string')
    model = strapi.query(model);
  if (typeof id === 'object')
    return id;
  return await model.findOne({ id });
}

module.exports = { identify, identifyAll, deidentify };