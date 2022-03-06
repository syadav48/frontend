import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCall, resetFieldsForConnection } from "./functions";


export const wnsApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_SEARCH_CONNECTION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_HOME_SEARCH_CONN_RESULTS_DESC"
  }),
  wnsApplicationContainer: getCommonContainer({
    city: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        suggestions: [],
        label: {
          labelName: "City",
          labelKey: "WS_PROP_DETAIL_CITY"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "WS_PROP_DETAIL_CITY_PLACEHOLDER"
        },
        data: [],
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        jsonPath: "searchConnection.tenantId",
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        labelsFromLocalisation: true,
        required: true,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      },
      data: [],
      required: true,
      jsonPath: "searchConnection.tenantId",
      sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
      gridDefination: {
        xs: 12,
        sm: 4
      }
    },
    
    
    consumerid: getTextField({
        label: {
            labelKey: "WS_MYCONNECTIONS_CONSUMER_NO"
        },
        placeholder: {
            labelKey: "WS_SEARCH_CONNNECTION_CONSUMER_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: false,
        pattern: getPattern("consumerNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "searchConnection.connectionNumber"
    }),
    
  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "rgba(0, 0, 0, 0.6000000238418579)",
            borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFieldsForConnection
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      },
    })
  })
});