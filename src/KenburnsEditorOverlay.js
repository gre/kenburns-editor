import React from "react";
import {rectEquals} from "./core";

const KenburnsEditorOverlay = React.createClass({
  shouldComponentUpdate: function (props) {
    const {
      rect,
      viewport
    } = this.props;
    return !(
      rectEquals(rect, props.rect) &&
      rectEquals(viewport, props.viewport)
    );
  },
  render: function () {
    const {
      rect,
      viewport
    } = this.props;
    const style = {
      fill: "rgba(0,0,0,0.5)"
    };
    return <g>
      <rect style={style} key="1" x={0} y={0} width={Math.max(0, rect[0])} height={viewport[3]} />
      <rect style={style} key="2" x={rect[0]+rect[2]} y={0} width={Math.max(0, viewport[2]-rect[0]-rect[2])} height={viewport[3]} />
      <rect style={style} key="3" x={rect[0]} y={0} width={Math.max(0, rect[2])} height={Math.max(0, rect[1])} />
      <rect style={style} key="4" x={rect[0]} y={rect[1]+rect[3]} width={Math.max(0, rect[2])} height={Math.max(0, viewport[3]-rect[1]-rect[3])} />
    </g>;
  }
});

export default KenburnsEditorOverlay;
