export interface InnerSetting {
  dots: boolean;
  arrows: boolean;
}

export interface Responses {
  breakpoint?: number;
  settings: InnerSetting;
}

export interface Settings {
  dots: boolean;
  infinite: boolean;
  speed: number;
  responsive: Responses[];
  slidesToShow: number;
  slidesToScroll: number;
  initialSlide: number;
}
