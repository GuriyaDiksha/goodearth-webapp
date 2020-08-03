import React from "react";
import cs from "classnames";

import { Props, State } from "./typings.d";
import styles from "./styles.scss";

export default class LazyImage extends React.Component<Props, State> {
  observer?: IntersectionObserver;
  container: HTMLDivElement | null = null;
  constructor(props: Props) {
    super(props);

    this.state = {
      isVisible: props.isVisible === undefined ? false : props.isVisible
    };
  }

  componentDidMount() {
    if (this.props.isVisible) {
      return;
    }
    if (!window.IntersectionObserver) {
      this.setState({
        isVisible: true
      });
    } else {
      if (this.container) {
        this.observer = new IntersectionObserver(this.onVisible);
        this.observer.observe(this.container);
      }
    }
  }

  onVisible: IntersectionObserverCallback = entries => {
    if (entries.length) {
      if (entries[0].isIntersecting) {
        this.setState({
          isVisible: true
        });

        this.observer && this.observer.disconnect();
      }
    }
  };

  render() {
    const { src, className, aspectRatio, containerClassName } = this.props;
    let imgHeight: number,
      style: any = {};
    if (aspectRatio) {
      const [width, height] = aspectRatio.split(":");
      imgHeight = (Number(height) * 100) / Number(width);

      style = {
        paddingTop: `${imgHeight}%`
      };
    }
    const { isVisible } = this.state;

    return (
      <div
        className={cs(styles.container, containerClassName, {
          [styles.aspect]: aspectRatio
        })}
        style={style}
        ref={ele => (this.container = ele)}
      >
        {isVisible && (
          <img
            src={src}
            className={cs(styles.lazyImage, className)}
            onClick={this.props.onClick}
            onLoad={this.props.onLoad}
            onError={this.props.onError}
          />
        )}
      </div>
    );
  }
}
