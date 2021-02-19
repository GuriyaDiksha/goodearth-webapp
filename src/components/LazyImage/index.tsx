import React from "react";
import cs from "classnames";

import { Props, State } from "./typings.d";
import styles from "./styles.scss";

export default class LazyImage extends React.Component<Props, State> {
  observer?: IntersectionObserver;
  container: HTMLDivElement | null = null;
  constructor(props: Props) {
    super(props);
    let imgHeight: number,
      style: any = {};
    if (this.props.aspectRatio) {
      const [width, height] = this.props.aspectRatio.split(":");
      imgHeight = (Number(height) * 100) / Number(width);
      style = {
        paddingTop: `${imgHeight}%`
      };
    }

    this.state = {
      isVisible: props.isVisible === undefined ? false : props.isVisible,
      style
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

  onLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (this.props.shouldUpdateAspectRatio) {
      const img = e.currentTarget;
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imgHeight = (Number(height) * 100) / Number(width);
      this.setState({
        style: {
          paddingTop: `${imgHeight}%`
        }
      });
    }
    this.props.onLoad?.(e);
  };

  render() {
    const { src, alt, className, aspectRatio, containerClassName } = this.props;
    const { isVisible, style } = this.state;
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
            alt={alt || "image"}
            className={cs(styles.lazyImage, className)}
            onClick={this.props.onClick}
            onLoad={this.onLoad}
            onError={this.props.onError}
          />
        )}
      </div>
    );
  }
}
