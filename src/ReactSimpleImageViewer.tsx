import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";

interface IProps {
  src: string[];
  currentIndex?: number;
  backgroundStyle?: CSSProperties;
  disableScroll?: boolean;
  closeOnClickOutside?: boolean;
  onClose?: () => void;
  closeComponent?: JSX.Element;
  leftArrowComponent?: JSX.Element;
  rightArrowComponent?: JSX.Element;
}

const ReactSimpleImageViewer = (props: IProps) => {
  const [currentIndex, setCurrentIndex] = useState(props.currentIndex ?? 0);

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  const changeImage = useCallback(
    (delta: number) => {
      let nextIndex = (currentIndex + delta) % props.src.length;
      if (nextIndex < 0) nextIndex = props.src.length - 1;
      setCurrentIndex(nextIndex);
    },
    [currentIndex]
  );

  const handleClick = useCallback(
    (event: any) => {
      if (!event.target || !props.closeOnClickOutside) {
        return;
      }

      const checkId = event.target.id === "ReactSimpleImageViewer";
      const checkClass = event.target.classList.contains("react-simple-image-viewer__slide");

      if (checkId || checkClass) {
        event.stopPropagation();
        props.onClose?.();
      }
    },
    [props.onClose]
  );

  const handleKeyDown = useCallback(
    (event: any) => {
      if (event.key === "Escape") {
        props.onClose?.();
      }

      if (["ArrowLeft", "h"].includes(event.key)) {
        changeImage(-1);
      }

      if (["ArrowRight", "l"].includes(event.key)) {
        console.log(1231321);
        changeImage(1);
      }
    },
    [props.onClose, changeImage]
  );

  const handleWheel = useCallback(
    (event: any) => {
      if (event.wheelDeltaY > 0) {
        changeImage(-1);
      } else {
        console.log("scroll");
        changeImage(1);
      }
    },
    [changeImage]
  );

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      startX = event.changedTouches[0].pageX;
      startY = event.changedTouches[0].pageY;
    },
    [changeImage]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      event.preventDefault();
      endX = event.changedTouches[0].pageX;
      endY = event.changedTouches[0].pageY;

      const x = startX - endX;
      const Y = startY - endY;
      if (Math.abs(x) > Math.abs(Y) && x > 0) {
        // move to left
        changeImage(1);
      } else if (Math.abs(x) > Math.abs(Y) && x < 0) {
        // move to right
        changeImage(-1);
      } else if (Math.abs(Y) > Math.abs(x) && Y > 0) {
        // move to up
        props.onClose?.();
      } else if (Math.abs(Y) > Math.abs(x) && Y < 0) {
        // move to bottom
        props.onClose?.();
      }
    },
    [props.onClose, changeImage]
  );

  useEffect(() => {
    let box = document.querySelector("#ReactSimpleImageViewer") as Element;
    document.addEventListener("keydown", handleKeyDown);
    box.addEventListener("touchstart", handleTouchStart);
    box.addEventListener("touchend", handleTouchEnd);

    if (!props.disableScroll) {
      document.addEventListener("wheel", handleWheel);
    }

    return () => {
      box.removeEventListener("keydown", handleKeyDown);
      box.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);

      if (!props.disableScroll) {
        document.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleKeyDown, handleWheel]);

  return (
    <div
      id="ReactSimpleImageViewer"
      className={`${styles.wrapper} react-simple-image-viewer__modal`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      style={props.backgroundStyle}
    >
      <span className={`${styles.close} react-simple-image-viewer__close`} onClick={() => props.onClose?.()}>
        {props.closeComponent || "×"}
      </span>

      {props.src.length > 1 && (
        <span className={`${styles.navigation} ${styles.prev} react-simple-image-viewer__previous`} onClick={() => changeImage(-1)}>
          {props.leftArrowComponent || "❮"}
        </span>
      )}

      {props.src.length > 1 && (
        <span className={`${styles.navigation} ${styles.next} react-simple-image-viewer__next`} onClick={() => changeImage(1)}>
          {props.rightArrowComponent || "❯"}
        </span>
      )}

      <div className={`${styles.content} react-simple-image-viewer__modal-content`} onClick={handleClick}>
        <div className={`${styles.slide} react-simple-image-viewer__slide`}>
          <img className={styles.image} src={props.src[currentIndex]} alt="" />
        </div>
      </div>
    </div>
  );
};

export default ReactSimpleImageViewer;
