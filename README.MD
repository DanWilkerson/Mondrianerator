# Mondrianerator

Deterministically generated SVGs in the style of [Piet Mondrian](https://en.wikipedia.org/wiki/Piet_Mondrian).

[Live demo](https://danwilkerson.github.io/Mondrianerator/)

## Usage

```javascript
const Mondrianerate = require('Mondrianerator');
// OR
import Mondrianerate from 'Mondrianerator';
// etc

const mount = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
const seed = +new Date;

Mondrianerate({mount, seed});
```

Licensed under the MIT license (see LICENSE.MD for full text).
