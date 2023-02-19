import { crop } from './fastcrop.js'

export default async function ({ src, dest, width, height }) {
  console.log(`[fastcrop] cropping ${JSON.stringify(src)}`);
  await crop(src, dest, width, height);
  console.log(`[fastcrop] saved ${JSON.stringify(src)}`);
}