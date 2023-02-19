# fastcrop

Smart crop large amount of photos and take advantage of Node.js worker threads.

## Installation

```sh
# install globally
npm install -g fastcrop

# npx
npx fastcrop@latest photo.jpg -s 512x512 --output ./my-dir/
```

### Help

```

  Fast and smart image cropper

  Usage
    $ fastcrop <input>

  Options
    --dry-run, -d Dry run.
    --size, -s Specify output size.
    --output, -o  Output directory.
    --concurrency, -c Number of concurrency. (default: Infinity)

  Examples
    $ fastcrop photo.jpg -s 512x512 --output ./my-dir/
```

## API

```js
import { cropMultiple, crop } from "fastcrop";
```
