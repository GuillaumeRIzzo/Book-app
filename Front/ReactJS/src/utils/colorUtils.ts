import chroma from "chroma-js";

const generateColorVariants = (hex: string) => {
  const main = chroma(hex).hex();
  const light = chroma(hex).brighten(1.2).hex();
  const dark = chroma(hex).darken(1.2).hex();
  const contrast = chroma.contrast(hex, 'white') > 4.5 ? '#fff' : '#000';

  return {
    light,
    main,
    dark,
    contrast: contrast,
  };
}

export default generateColorVariants;