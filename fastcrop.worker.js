import { crop } from './fastcrop.js'

export default async function ({ src, dest, width, height, dryRun }) {
  console.log(`[fastcrop] cropping ${JSON.stringify(src)}`);
  await crop(src, dest, width, height, dryRun);
  if (dryRun) {
    console.log(`[fastcrop] dry run finished ${JSON.stringify(src)}`);
  } else {
    console.log(`[fastcrop] saved ${JSON.stringify(src)}`);
  }
}