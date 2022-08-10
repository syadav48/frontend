import React from "react";
import MUIDataTable from "mui-datatables";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { LabelContainer } from "../../ui-containers-local";
import { getLocaleLabels, isPublicSearch } from "../../ui-utils/commons";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import VisibilityIcon from '@material-ui/icons/Visibility';
import FilterListIcon from "@material-ui/icons/FilterList";

import "./index.css";

class WnsReportTable extends React.Component {
  state = {
    data: [],
    columns: [],
    customSortOrder: "asc",
    showMenu: false,
  };

  getExtraTableStyle = () => {
    const tableStyle = {
      MUIDataTableToolbar: {
        titleRoot: {
          fontSize: "18px",
          fontWeight: 600,
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
      MUIDataTableHeadCell: {
        data: {
          fontSize: "14px !important",
          fontWeight: "600 !important",
          color: "rgba(0, 0, 0, 0.87) !important",
        },
      },
    };
    return isPublicSearch() ? tableStyle : {};
  };
  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            // "&:nth-child(2)": {
            //   color: isPublicSearch() ? "rgba(0, 0, 0, 0.87)" : "#2196F3",
            //   cursor: isPublicSearch() ? "auto" : "pointer",
            //   border: "2px solid red"
            // },
          },
        },
        MuiTableRow: {
          root: {
            "&:nth-child(odd)": {
              backgroundColor: "#f9f9f9",
            },
            "&:nth-child(even)": {
              backgroundColor: "#fff",
            },
            border: "1px sold #ddd",
          },
        },
        MuiTypography: {
          caption: {
            fontSize: "14px",
          },
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px",
          },
        },
        MuiTableCell: {
          body: {
            fontSize: 14,
          },
        },
        MuiInput: {
          root: {
            fontSize: "16px",
            paddingTop: "5px",
          },
        },
        ...this.getExtraTableStyle(),
      },
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach((column) => {
          // Handling the case where column name is an object with options
          column =
            typeof column === "object" ? get(column, "labelKey") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  componentWillReceiveProps(nextProps) {
    const { data, columns } = nextProps;
    this.updateTable(data, columns);
  }

  componentDidMount() {
    const { data, columns } = this.props;
    this.updateTable(data, columns);
  }

  getTranslatedHeader = (columns) => {
    if (columns) {
      columns.map((item, key) => {
        columns[key].name = (
          <LabelContainer labelKey={item.labelKey} labelName={item.labelKey} />
        );
      });
      return columns;
    }
  };

  updateTable = (data, columns) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: this.getTranslatedHeader(fixedColumns),
    });
  };

  onColumnSortChange = (columnName, i) => {
    let { customSortOrder, data } = this.state;
    const { customSortColumn } = this.props;
    const { column, sortingFn } = customSortColumn;
    if (columnName === column) {
      const updatedData = sortingFn(cloneDeep(data), "", customSortOrder);
      this.setState({
        data: updatedData.data,
        customSortOrder: updatedData.currentOrder,
      });
    }
  };

  getLabelContainer = (labelKey, labelName) => {
    return <LabelContainer labelKey={labelKey} labelName={labelName} />;
  };

  getTableTextLabel = () => {
    const textLabels = {
      body: {
        noMatch: this.getLabelContainer(
          "COMMON_TABLE_NO_RECORD_FOUND",
          "Sorry, no matching records found"
        ),
        toolTip: this.getLabelContainer("COMMON_TABLE_SORT", "Sort"),
      },
      pagination: {
        next: this.getLabelContainer("COMMON_TABLE_NEXT_PAGE", "Next Page"),
        previous: this.getLabelContainer(
          "COMMON_TABLE_PREVIOUS_PAGE",
          "Previous Page"
        ),
        rowsPerPage: this.getLabelContainer(
          "COMMON_TABLE_ROWS_PER_PAGE",
          "Rows per page:"
        ),
        // displayRows: this.getLabelContainer("COMMON_TABLE_OF", "of")
      },
      toolbar: {
        search: this.getLabelContainer("COMMON_TABLE_SEARCH", "Search"),
        downloadCsv: this.getLabelContainer(
          "COMMON_TABLE_DOWNLOAD_CSV",
          "Download CSV"
        ),
        print: this.getLabelContainer("COMMON_TABLE_PRINT", "Print"),
        viewColumns: this.getLabelContainer(
          "COMMON_TABLE_VIEW_COLUMNS",
          "View Columns"
        ),
        filterTable: this.getLabelContainer(
          "COMMON_TABLE_FILTER",
          "Filter Table"
        ),
      },
      filter: {
        all: this.getLabelContainer("COMMON_TABLE_ALL", "All"),
        title: this.getLabelContainer("COMMON_TABLE_FILTERS", "FILTERS"),
        reset: this.getLabelContainer("COMMON_TABLE_RESET", "RESET"),
      },
      viewColumns: {
        title: this.getLabelContainer(
          "COMMON_TABLE_SHOW_COLUMNS",
          "Show Columns"
        ),
        titleAria: this.getLabelContainer(
          "COMMON_TABLE_SHOW_HIDE_TABLE",
          "Show/Hide Table Columns"
        ),
      },
    };
    return textLabels;
  };

  getTabelTitle = (title) => {
    return getLocaleLabels(title.labelName, title.labelKey);
  };

  downloadAsExcel = () => {
    const state = this.props.state;
    const tableData = get(
      state.screenConfiguration.preparedFinalObject,
      "tableData",
      []
    );
    console.log("excel download");
    // excelDownloadAction(tableData, "Sujog Jal Saathi Incentive Report")
  };

  showMenuItem = () => {
    this.setState({
      ...this.state,
      showMenu: true,
    })
  }

  getColumnVisibilityMenu = () => {
    let { columns } = this.state;
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    // return (
    //   <Menu
    //     anchorEl={true}
    //     id="account-menu"
    //     // open={this.isMenuOpen}
    //     open={true}
    //     onClose={this.handleMenuClose}
    //     // onClick={this.handleMenuClose}
    //     // PaperProps={{
    //     //   elevation: 0,
    //     //   sx: {
    //     //     overflow: "visible",
    //     //     filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    //     //     mt: 1.5,
    //     //     "& .MuiAvatar-root": {
    //     //       width: 32,
    //     //       height: 32,
    //     //       ml: -0.5,
    //     //       mr: 1,
    //     //     },
    //     //     "&:before": {
    //     //       content: '""',
    //     //       display: "block",
    //     //       position: "absolute",
    //     //       top: 0,
    //     //       right: 14,
    //     //       width: 10,
    //     //       height: 10,
    //     //       bgcolor: "background.paper",
    //     //       transform: "translateY(-50%) rotate(45deg)",
    //     //       zIndex: 0,
    //     //     },
    //     //   },
    //     // }}
    //     transformOrigin={{ horizontal: "right", vertical: "top" }}
    //     anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    //   >
    //     {fixedColumns.map((eachCol) => {
    //       return (
    //         <MenuItem
    //           value={eachCol}
    //           onClick={(e) => this.handleMenuIconClick(e)}
    //         >
    //           eachCol
    //         </MenuItem>
    //       );
    //     })}
    //     <MenuItem value={"item1"} onClick={(e) => this.handleMenuIconClick(e)}>
    //       item1
    //     </MenuItem>
    //     <MenuItem value={"item2"} onClick={(e) => handleMenuIconClick(e)}>
    //       item2
    //     </MenuItem>
    //     <Divider />
    //     <MenuItem>
    //       <Button>Apply</Button>
    //       <Button onClick={this.handleMenuClose}>Close</Button>
    //     </MenuItem>
    //   </Menu>
    // );

    return null;
  };

  getCustomToolbar = () => {
    return (
      <React.Fragment>
        <button onClick={() => this.downloadAsExcel()}>Export to Excel</button>
        <button onClick={() => this.showMenuItem()}><FilterListIcon /></button>
      </React.Fragment>
    );
  };

  render() {
    const { data, columns } = this.state;
    const { options, title, rows, customSortDate } = this.props;
    options.textLabels = this.getTableTextLabel();
    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable
          title={this.getTabelTitle(title) + " (" + rows + ")"}
          data={data}
          columns={columns}
          options={{
            ...options,
            // customToolbar: () => this.getCustomToolbar(),
            onColumnSortChange: (columnName, order) =>
              this.onColumnSortChange(columnName, order),
          }}
        />
      </MuiThemeProvider>
    );
  }
}

WnsReportTable.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return { state };
};

export default connect(mapStateToProps, null)(WnsReportTable);
