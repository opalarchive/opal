import React, { useState } from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  Checkbox,
  TableSortLabel,
  makeStyles,
} from "@material-ui/core";
import { getDataPoint } from "./constants";
import ProjectToolbar from "./projecttoolbar";
import ProjectRow from "./projectrow";
import Modal from "./modal";
import { camelToTitle } from "../../../Constants";
import { FiArrowDown } from "react-icons/fi";
import {
  Client,
  isProjectActionEditor,
  projectAction,
  ProjectActionEditor,
} from "../../../../../.shared/src";
import {
  ProjectDataPoint,
  ProjectViewSort,
  ProjectViewType,
} from "../../../Constants/types";
import styles from "./index.css";

interface Selected {
  [uuid: string]: boolean;
}

interface ProjectTableProps {
  projects: Client.Publico;
  tryProjectAction: (
    uuid: string,
    type: projectAction,
    data?: string
  ) => Promise<boolean>;
  data: ProjectDataPoint[];
  fixed: boolean;
  defaultSort: ProjectViewSort;
  authUser: firebase.User;
  name: ProjectViewType;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  tryProjectAction,
  data,
  fixed,
  defaultSort,
  authUser,
  name,
}) => {
  const classes = makeStyles(styles)();

  const [selected, setSelected] = useState<Selected>({});
  const [sort, setSort] = useState<ProjectViewSort>(defaultSort);
  const [modal, setModal] = useState<{
    show: boolean;
    type: projectAction;
    input: string;
    activeProjectUUID: string;
  }>({
    show: false,
    type: "SHARE" as projectAction,
    input: "",
    activeProjectUUID: "",
  });

  const onRowClick = (
    event: React.MouseEvent<HTMLTableRowElement>,
    uuid: string
  ) => {
    event.preventDefault();

    selected[uuid] = !selected[uuid];

    setSelected((prevSelected) => {
      prevSelected[uuid] = !prevSelected[uuid];
      return prevSelected;
    });
  };

  const onAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected((prevSelected) => {
        let selected = {} as Selected;
        Object.keys(projects).forEach((uuid) => {
          selected[uuid] = true;
        });
        return selected;
      });
    } else {
      setSelected({});
    }
  };

  const sortProjectKeys = (sort: ProjectViewSort, projectKeys: string[]) => {
    type anchoredData = {
      data: string | number;
      key: string;
    };

    let stabilized: anchoredData[] = projectKeys.map((key) => ({
      data: getDataPoint(projects[key], sort.dataPoint, authUser.displayName!),
      key,
    }));

    // cant just subtract because strings :(
    const comp = (a: string | number, b: string | number) => {
      if (typeof a === "string") a = a.toLowerCase();
      if (typeof b === "string") b = b.toLowerCase();

      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    };

    stabilized.sort((a, b) => {
      let difference =
        comp(a.data, b.data) === 0 ? comp(a.key, b.key) : comp(a.data, b.data);
      return difference * (sort.direction === "asc" ? 1 : -1);
    });

    return stabilized.map((arr) => arr.key);
  };

  const onSortClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    dataPoint: ProjectDataPoint
  ) => {
    let sort: ProjectViewSort = { dataPoint: dataPoint, direction: "asc" };
    if (dataPoint === sort.dataPoint) {
      sort = {
        dataPoint,
        direction: sort.direction === "asc" ? "desc" : "asc",
      };
    }
    setSort(sort);
  };

  const showModal = (type: projectAction, activeProjectUUID: string) => {
    if (isProjectActionEditor(type)) {
      if (ProjectActionEditor[type] === ProjectActionEditor.STAR) {
        tryModalAction(activeProjectUUID, type);
        return;
      }
    }
    setModal({ show: true, type, input: "", activeProjectUUID });
  };

  const updateModalInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const input = event.target.value;

    setModal((prevModal) => ({ ...prevModal, input }));
  };

  const closeModal = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!!event) event.preventDefault();

    setModal((prevModal) => ({ ...prevModal, show: false }));
  };

  const tryModalAction = async (
    uuid: string,
    type: projectAction,
    data?: string
  ) => {
    if (await tryProjectAction(uuid, type, data)) {
      closeModal();
    }
  };

  const modalSuccess = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!!event) event.preventDefault();
    if (!modal.show) return;

    await tryModalAction(modal.activeProjectUUID, modal.type, modal.input);
  };

  const selectedList = Object.keys(selected).filter((proj) => selected[proj]);

  const sortedProjectKeys = sortProjectKeys(defaultSort, Object.keys(projects));

  return (
    <div className={classes.root}>
      <Paper elevation={2}>
        <Modal
          show={modal.show}
          type={modal.type}
          closeModal={closeModal}
          input={modal.input}
          inputChange={updateModalInput}
          modalSuccess={modalSuccess}
        />
        <ProjectToolbar
          selected={selectedList}
          name={camelToTitle(name)}
          showModal={(type: projectAction) =>
            setModal((prevModal) => ({
              show: !prevModal.show,
              type,
              input: "",
              activeProjectUUID: "",
            }))
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedList.length > 0 &&
                      selectedList.length < Object.values(projects).length
                    }
                    checked={
                      Object.values(projects).length > 0 &&
                      selectedList.length === Object.values(projects).length
                    }
                    onChange={onAllClick}
                    inputProps={{ "aria-label": "select all projects" }}
                  />
                </TableCell>
                {data.map((dataPoint, index) => (
                  <TableCell
                    component="th"
                    scope="col"
                    padding={index === 0 ? "none" : "default"}
                    align={index === 0 ? "left" : "right"}
                    key={dataPoint}
                  >
                    {fixed ? (
                      camelToTitle(dataPoint)
                    ) : (
                      <TableSortLabel
                        active={sort.dataPoint === dataPoint}
                        direction={
                          sort.dataPoint === dataPoint ? sort.direction : "asc"
                        }
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                          onSortClick(event, dataPoint)
                        }
                        IconComponent={FiArrowDown}
                      >
                        {camelToTitle(dataPoint)}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProjectKeys.map((uuid, index) => (
                <ProjectRow
                  uuid={uuid}
                  index={index}
                  data={data}
                  proj={projects[uuid]}
                  selected={!!selected[uuid]}
                  onRowClick={onRowClick}
                  username={authUser.displayName!}
                  showModal={showModal}
                  name={name}
                  key={`project-row-${uuid}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default ProjectTable;
