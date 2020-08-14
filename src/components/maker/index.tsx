import React from "react";

export type Props = {
  user: string;
  index?: string;
  href: string;
};

export type State = {
  url: string;
};

export default class MakerEnhance extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      url: props.href
    };
  }

  componentDidMount() {
    this.addScript();
  }

  componentDidUpdate(prevProps: Props) {
    let urlUpdated = false;

    if (this.props.href !== this.state.url) {
      this.updateUrl();
      urlUpdated = true;
    }

    if (this.props.index !== prevProps.index || urlUpdated) {
      this.run();
    }
  }

  updateUrl() {
    this.setState({
      url: this.props.href
    });
  }

  addScript() {
    let script: HTMLScriptElement | null = document.querySelector(
      "#maker-enhance-script"
    );

    if (script || !this.props.user) {
      return this.run();
    }

    script = document.createElement("script");
    script.id = "maker-enhance-script";
    script.src = `https://app.maker.co/enhance/${this.props.user}.js`;
    document.head.appendChild(script);
  }

  run() {
    if (typeof (window.MakerEmbeds || {}).run !== "function") {
      return;
    }

    window.MakerEmbeds.run();
  }

  render() {
    const index = this.props.index || 0;

    return (
      <div className="js-maker-enhance-wrapper">
        <div
          id={`js-maker-static-enhance-v1-218c2d7d-62da-499e-9e74-93201e1b3d56-${index}`}
          className="js-maker-enhance-static-mount"
          style={{ height: "auto", width: "100%" }}
        />
      </div>
    );
  }
}
