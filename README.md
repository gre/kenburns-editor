kenburns-editor
===============

[![](https://nodei.co/npm/kenburns-editor.png)](https://www.npmjs.com/package/kenburns-editor)

Usages
-----

```jsx
// ES6
import { KenburnsEditor } from "kenburns-editor";
// CommonJS
var KenburnsEditor = require("kenburns-editor").KenburnsEditor;
```

`kenburns-editor` allows to be **Controlled**:
you have to provide `values` and an `onChange` handler
to enable the edition.
```jsx
<KenburnsEditor
  image="1.jpg"
  value={this.state.value}
  onChange={value => this.setState({ value })} />
```

`kenburns-editor` allows to be **Uncontrolled**:
just define a `defaultValues`:
```jsx
<KenburnsEditor
  image="1.jpg"
  defaultValue={{ from: [0.5, [0.5, 0.5]], to: [1, [0.5, 0.5]] }}
  onChange={console.log.bind(console)} />
```


## Example

[(click to open)
![](https://cloud.githubusercontent.com/assets/211411/6972965/7b4fdf54-d987-11e4-9752-cbe0466a099e.jpg)
](http://gre.github.io/kenburns-editor/example/)

Used by...
----------

- [Diaporama Maker](https://github.com/gre/diaporama-maker)
