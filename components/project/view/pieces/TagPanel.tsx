import { Tag } from "@chakra-ui/tag";
import { CSSProperties } from "react";

interface TagProps {
  style?: CSSProperties;
}

const TagPanel: React.FC<TagProps> = ({ style, children }) => {
  return (
    <Tag
      borderRadius="full"
      variant="solid"
      fontWeight="normal"
      fontSize="sm"
      bgColor="blue.100"
      color="blue.700"
      mr={2}
      mb={2}
      style={style}
    >
      {children}
    </Tag>
  );
};
export default TagPanel;
