import React from "react/addons";
import raf from "raf";
import {KenburnsViewer, KenburnsEditor} from "..";
import libPackage from "../package.json";

window.Perf = React.addons.Perf;

const linkStyle = {
  color: "#49F",
  textDecoration: "none"
};

const image = "1.jpg";

class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      value: {
        from: [0.8, [0.5, 0.5]],
        to: [1, [0.5, 0.5]]
      },
      progress: 0
    };
    this.onChange = this.onChange.bind(this);
    const loop = (t) => {
      raf(loop);
      const progress = (t % 1500) / 1500;
      this.setState({ progress });
    };
    raf(loop);
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      this.setState({ width });
    });
  }

  onChange (value) {
    this.setState({ value });
  }

  render() {
    const {
      value,
      progress,
      width
    } = this.state;
    const w = Math.floor((width-40)/2);
    return <div>
      <h1><a href={libPackage.homepage} style={linkStyle}>{libPackage.name}</a></h1>
      <h2 style={{ color: "#aaa", fontWeight: "normal" }}>{libPackage.description}</h2>
      <blockquote>
      <strong>value</strong>{" = "}<code>{JSON.stringify(value)}</code>
      </blockquote>

      <KenburnsEditor
        image={image}
        onChange={this.onChange}
        value={value}
        width={w}
        height={400}
        progress={progress}
        style={{display: "inline-block"}}
      />

      <KenburnsViewer
        image={image}
        value={value}
        width={w}
        height={400}
        progress={progress}
        style={{display: "inline-block"}}
      />

      <p>
        <a style={linkStyle} target="_blank" href={libPackage.homepage+"/blob/master/example/index.js"}>Source code of these examples.</a>
      </p>
    </div>;
  }
}

document.body.style.margin = "0px";
document.body.style.padding = "0px 20px";
document.body.style.color = "#333";
document.body.style.background = "#fff";
document.body.style.fontFamily = "sans-serif";
React.render(<Example />, document.body);
