/**
 * Double slider component built off of chakra ui slider
 */

import { Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { FC, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

interface RangeSliderProps {
  bottom: number;
  top: number;
  onChange?: (lower: number, upper: number) => void;
  onChangeEnd?: (lower: number, upper: number) => void;
}

const RangeSlider: FC<RangeSliderProps> = ({
  bottom,
  top,
  onChange,
  onChangeEnd,
}) => {
  const [lower, setLower] = useState(bottom);
  const [upper, setUpper] = useState(top);

  const handleLowerChange = (val: number) => {
    if (val > upper) {
      setUpper(val);
      if (!!onChange) onChange(lower, val);
    } else {
      setLower(val);
      if (!!onChange) onChange(val, upper);
    }
  };

  const handleUpperChange = (val: number) => {
    if (val < lower) {
      setLower(val);
      if (!!onChange) onChange(val, upper);
    } else {
      setUpper(val);
      if (!!onChange) onChange(lower, val);
    }
  };

  return (
    <Box mb={-6}>
      <Slider
        value={upper}
        onChange={handleUpperChange}
        onChangeEnd={() => !!onChangeEnd && onChangeEnd(lower, upper)}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb>
          <Box width="80%" color="blue.500" as={BsCaretDownFill} />
        </SliderThumb>
      </Slider>
      <Box
        className="sliderWrapper"
        position="relative"
        __css={{ top: "-1.5rem" }}
      >
        <Slider
          value={lower}
          onChange={handleLowerChange}
          onChangeEnd={() => !!onChangeEnd && onChangeEnd(lower, upper)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb>
            <Box width="80%" color="blue.500" as={BsCaretUpFill} />
          </SliderThumb>
        </Slider>
      </Box>
    </Box>
  );
};

export default RangeSlider;
