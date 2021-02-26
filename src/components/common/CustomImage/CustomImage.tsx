import React, { useState } from "react";
import Fallback from "../../../assets/img/fallback.jpg";

function CustomImage({
  className,
  src,
  onClick,
}: {
  className: string;
  src: string;
  onClick?: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <img
      className={className}
      src={imageLoaded ? src : Fallback}
      onLoad={() => setImageLoaded(true)}
      onClick={onClick}
    ></img>
  );
}

export default CustomImage;
