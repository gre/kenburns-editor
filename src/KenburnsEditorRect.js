import React from "react";
import {rectEquals, centerEquals} from "./core";

function cornerPath (p, d) {
  return [
    "M", p[0], p[1],
    "L", p[0]+d[0], p[1],
    "L", p[0], p[1]+d[1],
    "z"];
}

const KenburnsEditorRect = React.createClass({

  shouldComponentUpdate: function (props) {
    const {
      center,
      centerText,
      edit,
      rect,
      name,
      viewport,
      progress,
      color,
      cornerMaxDist,
      fontSize
    } = this.props;
    return !(
      centerEquals(center, props.center) &&
      centerText===props.centerText &&
      edit===props.edit &&
      rectEquals(rect, props.rect) &&
      name===props.name &&
      rectEquals(viewport, props.viewport) &&
      color===props.color &&
      progress===props.progress &&
      cornerMaxDist===props.cornerMaxDist &&
      fontSize===props.fontSize
    );
  },

  render: function () {
    const {
      center,
      centerText,
      edit,
      rect,
      name,
      viewport,
      progress,
      color,
      cornerMaxDist,
      fontSize
    } = this.props;

    const clr = progress ? "rgba("+color+",0.8)" :
    "rgba("+color+","+(edit ? 1.0 : 0.6)+")";

    const rectStyle = {
      fill: "none",
      stroke: clr,
      strokeWidth: edit ? 2 : 1,
      strokeDasharray: progress ? "1,2" : ""
    };

    var size, arrow, corners, title;

    // Center Arrow
    if (center) {
      size = edit ? 5 : 3;
      const arrowStyle = {
        stroke: clr,
        strokeWidth: edit ? 2 : 1
      };
      const arrowTextStyle = {
        fill: clr,
        fontSize: fontSize,
        alignmentBaseline: "text-before-edge",
        textShadow: "0px 0px 1px #000"
      };
      arrow = <g>
        <line key="a1" style={arrowStyle} x1={center[0]-size} x2={center[0]+size} y1={center[1]} y2={center[1]} />
        <line key="a2" style={arrowStyle} y1={center[1]-size} y2={center[1]+size} x1={center[0]} x2={center[0]} />
        <text x={center[0]+fontSize/2} y={center[1]+fontSize/4} style={arrowTextStyle}>{ centerText }</text>
      </g>;
    }

    if (edit) {
      // Corners
      size = Math.min(rect[2], rect[3]) * cornerMaxDist / 2;
      const cornerStyle = {
        fill: clr,
        stroke: clr,
        strokeWidth: 2
      };
      const zoomTextStyle = {
        fill: "#000",
        fontSize: fontSize,
        textAnchor: "end",
        alignmentBaseline: "text-after-edge"
      };
      const topleftCorner = cornerPath([rect[0],rect[1]], [size, size]);
      const toprightCorner = cornerPath([rect[0]+rect[2],rect[1]], [-size, size]);
      const bottomleftCorner = cornerPath([rect[0],rect[1]+rect[3]], [size, -size]);
      const bottomrightCorner = cornerPath([rect[0]+rect[2],rect[1]+rect[3]], [-size, -size]);
      corners = <g>
        <path key="c1" style={cornerStyle} d={topleftCorner.join(" ")} />
        <path key="c2" style={cornerStyle} d={toprightCorner.join(" ")} />
        <path key="c3" style={cornerStyle} d={bottomleftCorner.join(" ")} />
        <path key="c4" style={cornerStyle} d={bottomrightCorner.join(" ")} />
        <text x={rect[0]+rect[2]} y={rect[1]+rect[3]} style={zoomTextStyle}>{this.props.zoomText}</text>
      </g>;
    }

    if (name) {
      // Title
      const inner = rect[1]+rect[3]+20 > viewport[3];
      const titleStyle = {
        fill: inner ? "#000" : clr,
        fontSize: fontSize,
        textAnchor: "start",
        alignmentBaseline: inner ? "text-after-edge" : "text-before-edge",
        textShadow: inner ? "" : "0px 0px 1px #000"
      };
      title = <text style={titleStyle} x={rect[0]} y={rect[1]+rect[3]+(inner ? 0 : 2)}>{name}</text>;
    }

    return <g>
      <rect key="r" style={rectStyle} x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]} />
      {arrow}
      {corners}
      {title}
    </g>;
  }

});

export default KenburnsEditorRect;
