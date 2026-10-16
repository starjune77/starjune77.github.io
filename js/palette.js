// Rain District palette shared by the Canvas renderers. style.css mirrors these tokens.
export const colors = {
  night:'#07080f', ink:'#0a0b12', asphalt:'#131622', steel:'#262b42', edge:'#3a4062',
  text:'#eef0fa', muted:'#a9afc8',
  cyan:'#3fe3ee', magenta:'#ff5fa8', amber:'#ffb547', violet:'#a98bff',
  azure:'#6aa8ff', mint:'#4ff0a8', ice:'#d6e4ff', coral:'#ff7a59', red:'#ff4d5e'
};
export const fonts = {
  sans:'"Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Roboto,Arial,sans-serif',
  mono:'ui-monospace,"Cascadia Mono","SF Mono",Consolas,Menlo,"Liberation Mono",monospace'
};
// Each district has its own accent so travelling through the world reads as moving across the city.
export const districtAccent = {
  start:colors.cyan, about:colors.azure, projects:colors.magenta, ai:colors.violet,
  experience:colors.amber, skills:colors.mint, resume:colors.ice, contact:colors.coral
};
export const accentFor = id => districtAccent[id] || colors.cyan;
