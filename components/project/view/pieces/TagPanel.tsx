import { Tag } from "@chakra-ui/tag";
import { CSSProperties, MouseEventHandler } from "react";

interface TagProps {
  active?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const TagPanel: React.FC<TagProps> = ({ active, style, onClick, children }) => {
  return (
    <Tag
      borderRadius="full"
      variant="solid"
      fontWeight="normal"
      fontSize="sm"
      bgColor={!!active ? "blue.500" : "cyan.100"}
      color={!!active ? "white" : "blue.800"}
      mr={2}
      mb={2}
      style={style}
      onClick={onClick}
      _hover={{ cursor: "pointer" }}
    >
      {children}
    </Tag>
  );
};
export default TagPanel;
