import React from "react";
import {
  Button,
  Divider,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { Problem } from "../../../../../../../../.shared/src";
import { BsBoxArrowUpRight } from "react-icons/bs";
import styles from "./index.css";
import {
  exportBody,
  JSONTemplate,
  Template,
  YAMLTemplate,
} from "../../../../../../Constants/exportTemplates";
import { camelToTitle } from "../../../../../../Constants";

interface ExportProps extends WithStyles<typeof styles> {
  problemList: Problem[];
}

interface ExportState {
  templateType: "JSON" | "YAML" | "Custom";
  customTemplate: Template;
}

class Export extends React.Component<ExportProps, ExportState> {
  state = {
    templateType: "JSON" as "JSON" | "YAML" | "Custom",
    customTemplate: {
      body: "",
      problem: "",
      reply: "",
      tag: "",
    },
  };

  constructor(props: ExportProps) {
    super(props);

    this.onChangeTemplateType = this.onChangeTemplateType.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.getExport = this.getExport.bind(this);
  }

  onChangeTemplateType(event: React.ChangeEvent<HTMLInputElement>) {
    if (["JSON", "YAML", "Custom"].includes(event.target.value)) {
      this.setState({
        templateType: event.target.value as "JSON" | "YAML" | "Custom",
      });
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    this.setState({
      customTemplate: {
        ...this.state.customTemplate,
        [event.target.name]: event.target.value,
      },
    });
  }

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();

      const target = event.target as HTMLInputElement;

      const st = target.selectionStart!,
        en = target.selectionEnd!;

      const value = target.value.substr(0, st) + "\t" + target.value.substr(en);

      this.setState(
        {
          customTemplate: {
            ...this.state.customTemplate,
            [target.name]: value,
          },
        },
        () => {
          target.selectionStart = st + 1;
          target.selectionEnd = st + 1;
        }
      );
    }
  }

  getExport() {
    const { problemList } = this.props;
    const { templateType } = this.state;

    if (templateType === "JSON") return exportBody(JSONTemplate, problemList);
    if (templateType === "YAML") return exportBody(YAMLTemplate, problemList);
    return exportBody(this.state.customTemplate, problemList);
  }

  render() {
    const { classes } = this.props;
    const { templateType } = this.state;

    const template: Template =
      templateType === "JSON" ? JSONTemplate : YAMLTemplate; // replace with yaml later

    return (
      <Paper elevation={3} className={classes.root}>
        <div className={classes.title}>
          Export
          <BsBoxArrowUpRight
            style={{
              position: "relative",
              top: "0.15rem",
              marginLeft: "0.4rem",
            }}
          />
        </div>
        <div className={classes.body}>
          <RadioGroup
            aria-label="template type"
            name="templateType"
            value={this.state.templateType}
            onChange={this.onChangeTemplateType}
          >
            <FormControlLabel value="JSON" control={<Radio />} label="JSON" />
            <FormControlLabel value="YAML" control={<Radio />} label="YAML" />
            <FormControlLabel
              value="Custom"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>
          <Divider flexItem orientation="vertical" />
          <div className={classes.templateWrapper}>
            {Object.entries(template).map(([part, text], ind) => (
              <React.Fragment key={`${part}-template`}>
                <div className={classes.subtitle}>{camelToTitle(part)}</div>
                <TextField
                  className={classes.templateEdit}
                  hiddenLabel
                  multiline
                  fullWidth
                  size="small"
                  variant="filled"
                  inputProps={{ spellCheck: "false" }}
                  name={part}
                  value={
                    templateType !== "Custom"
                      ? text
                      : this.state.customTemplate[part as keyof Template]
                  }
                  onChange={this.onChange}
                  onKeyDown={this.onKeyDown}
                  disabled={templateType !== "Custom"}
                />
                {ind + 1 !== Object.keys(template).length && (
                  <div className={classes.filler} />
                )}
              </React.Fragment>
            ))}
            <div className={classes.buttonContainer}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(this.getExport());
                }}
              >
                Copy Export &nbsp; <BsBoxArrowUpRight />
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(Export);
