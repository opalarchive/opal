import { CSSProperties } from "react";
import { BsCircleFill } from "react-icons/bs";
import styles from "../../../../styles/dot.module.css";
import { hexColor } from "../../../../utils/types";

interface DotProps {
  // unfilled?: boolean;
  color?: hexColor;
  style?: CSSProperties;
}

const Dot: React.FC<DotProps> = ({ /*unfilled,*/ color, style }) => {
  // if (!!unfilled) {
  //   return (
  //     <BsCircle
  //       size="0.6rem"
  //       className={styles.dot}
  //       style={{
  //         color: !!color ? ColorToString(color) : "black",
  //         ...(!!style ? style : {}),
  //       }}
  //     />
  //   );
  // }
  return (
    <BsCircleFill
      size="0.6rem"
      className={styles.dot}
      style={{
        color: !!color ? color : "black",
        ...(!!style ? style : {}),
      }}
    />
  );
};

export default Dot;
