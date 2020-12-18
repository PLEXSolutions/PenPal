import React, { useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import ViewListIcon from "@material-ui/icons/ViewList";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Components, registerComponent } from "../../../components.js";

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5)
  }
}));

const TablePaginationActions = ({ count, page, rowsPerPage, onChangePage }) => {
  const classes = useStyles1();

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  }
});

const ProjectsViewTableView = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  pageSizeOptions,
  projectSummaries: { projects, totalCount }
}) => {
  const classes = useStyles2();

  const emptyRows = pageSize - Math.min(pageSize, projects.length);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableBody>
          {projects.map(project => (
            <TableRow key={project.id}>
              <TableCell component="th" scope="row">
                {project.name}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={pageSizeOptions}
              colSpan={3}
              count={totalCount}
              rowsPerPage={pageSize}
              page={page}
              SelectProps={{
                native: true
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export const Icon = <ViewListIcon />;
export const Name = "Table View";

registerComponent("ProjectsViewTableView", ProjectsViewTableView);
