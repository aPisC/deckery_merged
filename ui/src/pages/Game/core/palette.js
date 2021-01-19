import Color from 'color';

const rellum = (c) => {
  const a = c.rgb().array();
  return (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]) / 255;
};

const normalizeLight = (color, normal = 0.65) => {
  const baseColor = color.lightness(50);
  const lum = rellum(baseColor);
  let nc = baseColor;
  let x = 0.5;
  if (lum > normal) {
    // darkening
    x = normal / (2 * lum);
    nc = baseColor.lightness(0 + x * 100);
  } else if (lum < normal) {
    // lightening
    x = (normal - 2 * lum + 1) / (2 * (1 - lum));
    nc = baseColor.lightness(0 + x * 100);
  }
  console.log(baseColor.rgb(), rellum(nc), lum, normal, x, nc.rgb());
  return nc;
};

const getColors = (count, from = 5, to = 365) => {
  return [
    '#fd3330',
    '#f91e73',
    '#9c27b0',
    // '#673ab7',
    '#3f51c5',
    '#2196f3',
    // '#039be5',
    '#0097a7',
    // '#009688',
    '#43a047',
    // '#788f38',
    '#afb42b',
    '#f9a825',
    // '#ffa000',
    '#fa7700',
    // '#e64a19',
  ];
};

const getLightPalette = (c) => {
  c = new Color(c);
  return {
    color2: c.lighten(-0.3).string(),
    color3: c.lighten(-0.6).string(),
    color: c.string(),
    base: 'white',
    hover: '#ddd',
    back: c.lighten(0.6).saturate(-0.25).string(),
    opposite: 'black',
    shadow: '#00000088',
  };
};
const getDarkPalette = (c) => {
  c = new Color(c);
  return {
    color2: c.string(),
    color3: '#fff',
    color: c.lighten(0.1).string(),
    base: '#303030',
    hover: '#444',
    back: c.lighten(-0.45).saturate(-0.5).string(),
    opposite: 'white',
    shadow: '#88888888',
  };
};

const palette = {
  getColors,
  getLightPalette,
  getDarkPalette,
  normalizeLight,
};
export default palette;
