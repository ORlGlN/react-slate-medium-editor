import React from "react";
import urlParser from "js-video-url-parser";

export default class Embed extends React.Component {
  state = {
    value: ""
  };

  onClick = e => {
    e.stopPropagation();
  };

  onChange = e => {
    const { value } = e.target;
    this.setState({ value });
  };

  selfDestroy = () => {
    const { nodeKey, editor } = this.props;
    editor.removeNodeByKey(nodeKey);
  };

  handleBlur = e => {
    e.stopPropagation();
    const video = e.target.value;
    if (video === "") this.selfDestroy();
  };

  handleKeyPress = e => {
    const video = e.target.value;
    const { nodeKey, editor } = this.props;

    if (e.key === "Enter") {
      e.preventDefault();
      video !== ""
        ? editor.setNodeByKey(nodeKey, { data: { video } })
        : this.selfDestroy();
    }
  };

  getEmbedUrl = () => {
    const { data } = this.props;
    const video = data.get("video");
    const videoInfo = video && urlParser.parse(video);

    return videoInfo
      ? urlParser.create({
          videoInfo,
          format: "embed"
        })
      : null;
  };

  render() {
    const { value } = this.state;
    const embedUrl = this.getEmbedUrl();

    return embedUrl ? (
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%" /* 16:9 */,
          paddingTop: "25px",
          height: 0
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
          }}
          src={embedUrl}
          allowFullScreen
        />
      </div>
    ) : (
      <p>
        <input
          autoFocus
          style={{
            padding: "10px",
            border: "none",
            width: "100%",
            fontSize: "16px",
            placeholderColor: "#e3e3e3",
            outline: "none"
          }}
          type="text"
          value={value}
          placeholder="Paste or type a Youtube or Vimeo Link and press ENTER"
          onChange={this.onChange}
          onClick={this.onClick}
          onKeyDown={this.handleKeyPress}
          onBlur={this.handleBlur}
        />
      </p>
    );
  }
}
