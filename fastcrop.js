import sharp from "sharp";
import smartcrop from 'smartcrop-sharp';
import { globbyStream } from "globby";
import fs from 'node:fs/promises'
import path from 'node:path'
import { Piscina } from "piscina";
import PQueue from "p-queue";

/**
 * Crop a single file
 * @param {string} src 
 * @param {string} dest 
 * @param {number} width 
 * @param {number} height 
 * @returns {Promise<void>}
 */
export async function crop(src, dest, width, height) {
  const { topCrop: crop } = await smartcrop.crop(src, { width, height });
  return sharp(src)
    .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
    .resize(width, height)
    .toFile(dest);
}

/**
 * Crop multiple files using stream and worker threads.
 * @param {string|string[]} srcDir 
 * @param {string} destDir 
 * @param {number} width 
 * @param {number} height 
 * @param {number} concurrency 
 * @returns {Promise<void>}
 */
export async function cropMultiple(
  srcDir,
  destDir,
  width,
  height,
  concurrency = Infinity,
) {

  destDir = path.resolve(destDir);
  await fs.mkdir(destDir, { recursive: true });
  const piscina = new Piscina({ filename: new URL("./fastcrop.worker.js", import.meta.url).href });
  const queue = new PQueue({ concurrency })

  if (Array.isArray(srcDir)) {
    for (const src of srcDir) {
      const dest = path.join(destDir, path.basename(src));
      queue.add(async () => {
        await piscina.run({ src, dest, width, height });
      })
    }

    // clean up
    await queue.onIdle();
    await piscina.destroy();
    return;
  }

  for await (const src of globbyStream(srcDir, { gitignore: false })) {
    const dest = path.join(destDir, path.basename(src));
    queue.add(async () => {
      await piscina.run({ src, dest, width, height });
    })
  }

  // clean up
  await queue.onIdle();
  await piscina.destroy();
}

