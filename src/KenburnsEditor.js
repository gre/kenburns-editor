/**
 * IDEA: directional line with arrow steps between the 2 centers to also visualize the easing ?
 */

import React from "react";
import rectClamp from "rect-clamp";
import rectMix from "rect-mix";
import rectCrop from "rect-crop";
import objectAssign from "object-assign";

import KenburnsEditorOverlay from "./KenburnsEditorOverlay";
import KenburnsEditorRect from "./KenburnsEditorRect";

import scaleTranslateStyle from "./scaleTranslateStyle";
import ImageHolderMixin from "./ImageHolderMixin";

import {
  rectGrow,
  rectContains,
  distance,
  manhattan,
  cloneValue,
  dot,
  rectRound,
  rectGrow
} from "./core";


const EDIT_TOPLEFT = 1,
    EDIT_TOPRIGHT = 2,
    EDIT_BOTTOMLEFT = 3,
    EDIT_BOTTOMRIGHT = 4,
    EDIT_MOVE = 5;

function cursorForEdit (s) {
  if (!s) return "pointer";
  if (s === EDIT_MOVE) return "move";
  if (s === EDIT_TOPLEFT || s === EDIT_BOTTOMRIGHT) return "nwse-resize";
  if (s === EDIT_TOPRIGHT || s === EDIT_BOTTOMLEFT) return "nesw-resize";
}

function centerText (p) {
  return Math.round(100*p[0])+"% "+Math.round(100*p[0])+"%";
}

const KenburnsEditor = React.createClass({

  mixins: [ ImageHolderMixin ],

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    image: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    progress: React.PropTypes.number,
    value: React.PropTypes.shape({
      from: React.PropTypes.array,
      to: React.PropTypes.array
    }),
    progressColor: React.PropTypes.array,
    fromColor: React.PropTypes.array,
    toColor: React.PropTypes.array,
    cornerMaxDist: React.PropTypes.number,
    fontSize: React.PropTypes.number,
    overlayFill: React.PropTypes.string,
    centerTextStyle: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      width: 300,
      height: 200,
      value: {
        from: [0.8, [0.5, 0.5]],
        to: [1, [0.5, 0.5]]
      },
      progressColor: [200,220,180],
      fromColor: [180,230,255],
      toColor: [255,200,120],
      cornerMaxDist: 0.4,
      fontSize: 12,
      background: "#fff",
      overlayFill: "rgba(0,0,0,0.5)",
      centerTextStyle: {}
    };
  },

  getInitialState: function () {
    return {
      editFrom: true,
      edit: null,
      downEditFrom: null,
      downAt: null,
      downValue: null,
      downTime: null
    };
  },

  pos: function (e) {
    const bound = this.getDOMNode().getBoundingClientRect();
    const pos = [
      e.clientX - bound.left,
      e.clientY - bound.top
    ];
    if (this.innerRect) {
      pos[0] -= this.innerRect[0];
      pos[1] -= this.innerRect[1];
    }
    return pos;
  },

  onMouseDown: function (e) {
    const pos = this.pos(e);
    var editFrom = this.state.editFrom;
    const {
      value,
      cornerMaxDist
    } = this.props;
    const newState = {
      downAt: pos,
      downTime: Date.now(),
      downEditFrom: editFrom
    };
    const w = this.innerRect[2];
    const h = this.innerRect[3];
    const r = { width: w, height: h };
    const viewport = [0,0,w,h];
    var selected = this.state.editFrom ? value.from : value.to;
    var rect = rectGrow(
      rectClamp(
        rectCrop.apply(null, selected)(r,r),
        viewport
      ),
      [5, 5]
    );

    if (!rectContains(rect, pos)) {
      editFrom = !editFrom;
      selected = editFrom ? value.from : value.to;
      rect = rectGrow(
        rectClamp(
          rectCrop.apply(null, selected)(r,r),
          viewport
        ),
        [5, 5]
      );
    }

    if (rectContains(rect, pos)) {
      newState.editFrom = editFrom;
      const mix = [
        (pos[0]-rect[0])/rect[2],
        (pos[1]-rect[1])/rect[3]
      ];
      if (manhattan(mix, [0,0]) < cornerMaxDist) {
        newState.edit = EDIT_TOPLEFT;
      }
      else if (manhattan(mix, [1,0]) < cornerMaxDist) {
        newState.edit = EDIT_TOPRIGHT;
      }
      else if (manhattan(mix, [0,1]) < cornerMaxDist) {
        newState.edit = EDIT_BOTTOMLEFT;
      }
      else if (manhattan(mix, [1,1]) < cornerMaxDist) {
        newState.edit = EDIT_BOTTOMRIGHT;
      }
      else {
        newState.edit = EDIT_MOVE;
      }
      newState.downValue = cloneValue(value);
    }
    this.setState(newState);
  },

  onMouseMove: function (e) {
    if (!this.state.downAt) return;
    const clone = cloneValue(this.state.downValue);
    const el = this.state.editFrom ? clone.from : clone.to;

    const w = this.innerRect[2];
    const h = this.innerRect[3];
    const c = [ el[1][0] * w, el[1][1] * h ];

    const pos = this.pos(e);
    const delta = [
      pos[0] - this.state.downAt[0],
      pos[1] - this.state.downAt[1]
    ];

    switch (this.state.edit) {
      case EDIT_TOPLEFT:
      case EDIT_TOPRIGHT:
      case EDIT_BOTTOMLEFT:
      case EDIT_BOTTOMRIGHT:
        el[0] = Math.min(Math.max(0.1, el[0] * distance(c, pos) / distance(c, this.state.downAt)), 1);
        this.props.onChange(clone);
        break;
      case EDIT_MOVE:
        const center = el[1];
        center[0] = Math.min(Math.max(0, center[0] + delta[0] / w), 1);
        center[1] = Math.min(Math.max(0, center[1] + delta[1] / h), 1);
        this.props.onChange(clone);
        break;
    }
  },

  resetMouse: function () {
    this.setState({
      downAt: null,
      edit: null,
      downValue: null,
      downTime: null,
      downEditFrom: null
    });
  },

  onMouseUp: function (e) {
    if(!this.state.downAt) return;
    const pos = this.pos(e);
    if( this.state.downEditFrom === this.state.editFrom &&
        Date.now() - this.state.downTime < 300 &&
        distance(this.state.downAt, pos) < 10 ) {
      this.setState({
        editFrom: !this.state.editFrom
      });
    }
    this.resetMouse();
  },

  onMouseLeave: function () {
    if (!this.state.downAt) return;
    this.resetMouse();
  },

  onMouseEnter: function () {
  },

  componentWillReceiveProps: function (props) {
    if (this.props.width !== props.width || this.props.height !== props.height)
      this.recomputeImageSizes(this.img, props.width, props.height);
  },

  onImageLoaded: function (img) {
    this.recomputeImageSizes(img, this.props.width, this.props.height);
  },

  recomputeImageSizes: function (img, fullWidth, fullHeight) {
    if (!img) {
      this.imgStyle = this.innerRect = null;
      return;
    }
    const imgWidth = this.img.width;
    const imgHeight = this.img.height;

    const scale = 0.95 * Math.min(fullWidth / imgWidth, fullHeight / imgHeight);
    const translate = [ (fullWidth-scale*imgWidth)/2, (fullHeight-scale*imgHeight)/2 ];
    const translateImage = [translate[0] / scale, translate[1] / scale];
    const imgStyle = scaleTranslateStyle(scale, translateImage);

    const w = Math.round(imgWidth * scale);
    const h = Math.round(imgHeight * scale);

    this.imgStyle = imgStyle;
    this.innerRect = [ Math.round(translate[0]), Math.round(translate[1]), w, h ];
  },

  render: function () {
    const {
      image,
      width,
      height,
      progress,
      value,
      progressColor,
      fromColor,
      toColor,
      style,
      cornerMaxDist,
      fontSize,
      background,
      overlayFill,
      centerTextStyle
    } = this.props;
    const {
      edit,
      editFrom
    } = this.state;
    const {
      imgStyle,
      innerRect,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseMove,
      onMouseUp
    } = this;

    const styles = objectAssign({
      position: "relative",
      overflow: "hidden",
      background: background,
      width: width+"px",
      height: height+"px",
      cursor: cursorForEdit(edit),
      userSelect: "none",
      WebkitUserSelect: "none"
    }, style);

    if (!innerRect) {
      return <div style={styles} />;
    }

    const [x, y, w, h] = innerRect;
    const ratioRect = { width: width, height: height };
    const rect = { width: w, height: h };
    const viewport = [0,0,w,h];

    const fromRect = rectRound(rectClamp(rectCrop.apply(null, value.from)(ratioRect, rect), viewport));
    const toRect = rectRound(rectClamp(rectCrop.apply(null, value.to)(ratioRect, rect), viewport));
    var progressRect;
    if (progress) {
      const pRect = rectRound(rectMix(fromRect, toRect, progress));
      progressRect = <KenburnsEditorRect
        edit={false}
        rect={pRect}
        viewport={viewport}
        progress={true}
        color={progressColor} />;
    }

    const from = <KenburnsEditorRect
      name="from"
      edit={editFrom}
      rect={fromRect}
      viewport={viewport}
      center={dot(value.from[1], [w,h])}
      centerText={centerText(value.from[1])}
      zoomText={value.from[0].toFixed(2)}
      cornerMaxDist={cornerMaxDist}
      color={fromColor}
      fontSize={fontSize}
      centerTextStyle={centerTextStyle} />;

    const to = <KenburnsEditorRect
      name="to"
      edit={!editFrom}
      rect={toRect}
      viewport={viewport}
      center={dot(value.to[1], [w,h])}
      centerText={centerText(value.to[1])}
      zoomText={value.to[0].toFixed(2)}
      cornerMaxDist={cornerMaxDist}
      color={toColor}
      fontSize={fontSize}
      centerTextStyle={centerTextStyle} />;

    const before = !editFrom ? from : to;
    const after = editFrom ? from : to;

    return <div style={styles}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave} >

      <img src={image} style={imgStyle} />
      <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={"translate("+x+","+y+")"} width={w} height={h}>
          <KenburnsEditorOverlay
            rect={rectGrow(editFrom ? fromRect : toRect, [1,1])}
            viewport={viewport}
            fill={overlayFill} />
          {progressRect}
          {before}
          {after}
        </g>
      </svg>
    </div>;
  }
});

export default KenburnsEditor;
