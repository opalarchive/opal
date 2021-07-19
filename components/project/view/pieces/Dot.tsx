import { BsCircleFill } from "react-icons/bs";
import styles from "../../../../styles/dot.module.css";
import { ColorToString } from "../../../../utils/pretty";
import { Color } from "../../../../utils/types";

interface DotProps {
  color?: Color;
}

const Dot: React.FC<DotProps> = ({ color }) => {
  return (
    <BsCircleFill
      size="0.6rem"
      className={styles.dot}
      style={{ color: !!color ? ColorToString(color) : "black" }}
    />
  );
};

export default Dot;
