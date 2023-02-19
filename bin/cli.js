#!/usr/bin/env node
import { cropMultiple, crop } from '../fastcrop.js';
import isGlob from 'is-glob';
import { globby } from 'globby';
import meow from 'meow';

const cli = meow(`

Usage
  $ fastcrop <input>

Options
  --dry-run, -d Dry run.
  --size, -s Specify output size.
  --output, -o  Output directory.
  --concurrency, -c Number of concurrency. (default: Infinity)

Examples
  $ fastcrop photo.jpg -s 512x512 --output ./my-dir/

  `, {
  importMeta: import.meta,
  flags: {
    dryRun: {
      type: 'boolean',
      default: false,
    },
    concurrency: {
      type: 'number',
      default: Infinity,
    },
    size: {
      type: 'string',
      alias: 's',
      isRequired: true,
    },
    output: {
      type: 'string',
      alias: 'o',
      isRequired: true,
    }
  }
});

function parseSize(size) {
  if (typeof size !== 'string') return;
  size = size.trim();
  const regex = /(^\d+)x(\d+$)/i
  if (regex.test(size)) {
    const [, w, h] = regex.exec(size);
    return [parseInt(w), parseInt(h)]
  }
  const value = parseInt(size);
  if (isNaN(value)) return;
  return [value, value];
}

const size = parseSize(cli.flags.size)

if (!size) {
  console.error('size is invalid')
  process.exit(1);
}

if (cli.input.length === 0) {
  console.error('No file(s) specify!');
  process.exit(1);
}


if (cli.input.length === 1) {

  // stream files
  if (isGlob(cli.input[0])) {
    await cropMultiple(
      cli.input[0],
      cli.flags.output,
      size[0],
      size[1],
      cli.flags.concurrency,
      cli.flags.dryRun,
    )
  } else {
    // single file
    const src = cli.input[0];
    console.log(`[fastcrop] cropping ${JSON.stringify(src)}`);
    await crop(cli.input[0], cli.flags.output, size[0], size[1], cli.flags.dryRun);
    console.log(`[fastcrop] saved ${JSON.stringify(src)}`);
  }

  process.exit(0);
}

const files = cli.input.map(input => {
  if (isGlob(input)) return globby(input, { gitignore: false })
  return [input];
}).flat();


await cropMultiple(
  files,
  cli.flags.output,
  size[0],
  size[1],
  cli.flags.concurrency,
  cli.flags.dryRun
)