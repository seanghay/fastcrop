import fs from 'node:fs'
import { crop, cropMultiple } from './fastcrop.js';

if (fs.existsSync("./photos/image-result.jpg"))
  fs.unlinkSync('./photos/image-result.jpg');

await crop("./photos/image.jpg", "./photos/image-result.jpg", 512, 512);
await cropMultiple("./photos-multiple/*.jpg", "./photos-multiple/result", 224, 224)