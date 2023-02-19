import { crop } from './fastcrop.js'

export default async function ({ src, dest, width, height }) {
  console.log(`[fastcrop]: ${src} -> ${dest}`);
  await crop(src, dest, width, height);
  console.log(`[fastcrop]: ${src} -> ${dest}`);
}