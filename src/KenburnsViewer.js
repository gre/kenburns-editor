import React from "react";
import rectClamp from "rect-clamp";
import rectMix from "rect-mix";
import rectCrop from "rect-crop";
import prefix from 'vendor-prefix';
import objectAssign from "object-assign";

const transformAttr = prefix('transform');
const transformOriginAttr = prefix('transform-origin');

function transformForRect (rect, viewport) {
  const scale = viewport.width / rect[2];
  const translate = [
    (-rect[0])+"px",
    (-rect[1])+"px"
  ];
  return "scale("+scale+") translate("+translate+")";
}

export default class KenburnsViewer extends React.Component {

  fetchImage (props) {
    var img = new window.Image();
    if (!props.image) return;
    this.curImgSrc = img.src = props.image;
    var self = this;
    img.onload = function () {
      self.forceUpdate();
    };
    this.img = img;
  }

  componentWillMount () {
    this.fetchImage(this.props);
  }

  componentWillReceiveProps (props) {
    if (!this.curImgSrc || this.curImgSrc !== props.image) {
      this.fetchImage(props);
    }
  }

  render () {
    const {
      value,
      width,
      height,
      progress,
      image
    } = this.props;
    const style = objectAssign({
      overflow: "hidden",
      width: width+"px",
      height: height+"px",
      background: "#000"
    }, this.props.style);
    const img = this.img;
    if (!img || !img.width) return <div style={style} />;
    const size = { width: width, height: height };
    const imgRect = [ 0, 0, img.width, img.height ];
    const fromCropBound = rectClamp(rectCrop.apply(null, value.from)(size, img), imgRect);
    const toCropBound = rectClamp(rectCrop.apply(null, value.to)(size, img), imgRect);
    const bound = rectClamp(rectMix(fromCropBound, toCropBound, progress), imgRect);
    const imageStyle = {
      [transformOriginAttr]: "0% 0%",
      [transformAttr]: transformForRect(bound, size)
    };
    return <div style={style}>
      <img src={image} style={imageStyle} />
    </div>;
  }
}
