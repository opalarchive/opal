import React from "react";
import Tag from "../Tag";
import { actionData, problemAction } from "../../../../../../../.shared";
import { Autocomplete } from "@material-ui/lab";
import { IconButton, TextField } from "@material-ui/core";
import { FiCheck } from "react-icons/fi";

interface TagGroupProps {
  text: string[];
  clickedTags?: {
    [tag: string]: boolean;
  };
  onClickTag?: (tagText: string) => void;
  style?: React.CSSProperties[];
  tryProblemAction?: (data: actionData, type: problemAction) => Promise<void>;
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
            <div style={{ display: "flex" }}>
              <Autocomplete
                multiple
                freeSolo
                id="tags-autocomplete"
                fullWidth
                style={{ flexGrow: 1 }}
                options={availableTags}
                value={this.state.inputAddTag}
                onChange={this.handleChangeAddTag}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{ ...params.InputProps }}
                  />
                )}
              />
              &nbsp;
              <IconButton size="small" onClick={this.addTag}>
                <FiCheck />
              </IconButton>
            </div>
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
