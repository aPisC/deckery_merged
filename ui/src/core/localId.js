const ids = {};

export default function (key = 'default') {
  ids[key] = (ids[key] || 0) + 1;
  return ids[key];
}
