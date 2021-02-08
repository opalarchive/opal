import React from "react";
import Tag from "../Tag";
import { data, problemAction } from "../../../../../../../.shared";
import { Autocomplete } from "@material-ui/lab";
import { Button, TextField } from "@material-ui/core";
import { FaCheck } from "react-icons/fa";

interface TagGroupProps {
  text: string[];
  clickedTags?: {
    [tag: string]: boolean;
  };
  onClickTag?: (tagText: string) => void;
  style?: React.CSSProperties[];
  tryProblemAction?: (data: data, type: problemAction) => Promise<void>;
  filterTag?: boolean;
  canAddTag?: boolean;
  availableTags?: string[];
}

interface TagGroupState {
  editAddTag: boolean;
  inputAddTag: string[];
}

class TagGroup extends React.PureComponent<TagGroupProps, TagGroupState> {
  state = {
    editAddTag: false,
    inputAddTag: [],
  };

  constructor(props: TagGroupProps) {
    super(props);

    this.handleChangeAddTag = this.handleChangeAddTag.bind(this);
    this.addTag = this.addTag.bind(this);
  }

  handleChangeAddTag(e: React.ChangeEvent<{}>, value: string[]) {
    this.setState({ inputAddTag: value });
  }

  async addTag() {
    if (this.props.tryProblemAction) {
      await this.props.tryProblemAction(this.state.inputAddTag, "addTag");
      this.setState({ editAddTag: false, inputAddTag: [] });
    }
  }

  render() {
    const {
      text,
      clickedTags,
      onClickTag,
      tryProblemAction,
      filterTag,
      style,
      canAddTag,
      availableTags,
    } = this.props;

    return (
      <>
        {text.map((tag, ind) => (
          <Tag
            key={tag}
            text={tag}
            style={!!style ? style[ind] : undefined}
            clicked={!!clickedTags && clickedTags[tag]}
            onClickTag={onClickTag}
            tryProblemAction={tryProblemAction}
            filterTag={filterTag}
          />
        ))}
        {!!canAddTag &&
          !!availableTags &&
          (this.state.editAddTag ? (
            <>
              <Autocomplete
                multiple
                freeSolo
                id="tags-autocomplete"
                options={availableTags}
                value={this.state.inputAddTag}
                onChange={this.handleChangeAddTag}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Tags"
                    margin="normal"
                    InputProps={{ ...params.InputProps }}
                  />
                )}
              />
              <Button variant="contained" color="primary" onClick={this.addTag}>
                <FaCheck />
              </Button>
            </>
          ) : (
            <Tag
              text={""}
              clicked={false}
              onClickAddTag={() => this.setState({ editAddTag: true })}
              tryProblemAction={tryProblemAction}
              addTag
            />
          ))}
      </>
    );
  }
}

export default TagGroup;
