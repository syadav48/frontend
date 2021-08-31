import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
// import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {
  getFileUrlFromAPI,
  handleFileUpload,
  getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import Button from '@material-ui/core/Button';
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import MultiDocDetailCard from "../../ui-molecules-local/MultiDocDetailCard";
import NocDocDetailCard from "../../ui-molecules-local/NocDocDetailCard";
import NocData from "../../ui-molecules-local/NocData";
import UploadCard from "../../ui-molecules-local/UploadCard";
import {getLoggedinUserRole} from "../../ui-config/screens/specs/utils/index.js";
import { LabelContainer,TextFieldContainer } from "egov-ui-framework/ui-containers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { httpRequest } from "../../ui-utils/api";
import { LinkAtom } from "../../ui-atoms-local"
import store from "ui-redux/store";
const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    marginBottom: 25,
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    paddingTop: 16,
    paddingLeft: 16,    
    paddingBottom: 10,
  },
  whiteCard: {
    // maxWidth: 250,
    width: "100%",
    backgroundColor: "#FFFFFF",
    // paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 3,
    paddingBottom: 10,
    marginRight: 16,
    marginTop: 8,
    marginBottom:16,
    // marginBottom:4,
    display: "inline-flex",
  },
  fontStyle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    // width:150,
    // overflow: "hidden", 
    // whiteSpace: "nowrap",
    // textOverflow: "ellipsis",
    // marginLeft:"7px",
  },
  labelStyle: {
    position: "relative",
    fontFamily: "Roboto",
    fontSize: 14,
    letterSpacing: 0.6,
    padding: "5px 0px",
    display: "inline-block"
  },  
  underlineStyle: {
    position: "absolute",
    bottom: -1,
    borderBottom: "2px solid #FE7A51",
    width: "100%"
  },
  dividerStyle : {
    borderBottom: "1px solid rgba(5, 5, 5, 0.12)",
    width: "100%"
  },
  documentContainer: {
   backgroundColor: "#FFFFFF",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  nocTitle: {
    color: "rgba(0, 0, 0, 0.87)",
  },
  spanStyle : {
    paddingLeft: "2px"
  }
}

export const fieldConfig = {
  nocType: {
    label: {
      labelName: "NOC Type",
      labelKey: "BPA_NOC_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Select NOC Type",
      labelKey: "BPA_NOC_TYPE_PLACEHOLDER"
    }
  },
  MonumentName: {
      label: {
        labelName: "Monument Name",
        labelKey: "BPA_NMA_NOC_MONUMENT_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Monument Name",
        labelKey: "BPA_NMA_NOC_MONUMENT_NAME_PLACEHOLDER"
      }
    },
    State: {
      label: {
        labelName: "State",
        labelKey: "BPA_NMA_NOC_STATE_LABEL"
      },
      placeholder: {
        labelName: "Enter State",
        labelKey: "BPA_NMA_NOC_STATE_PLACEHOLDER"
      }
  },
  District: {
    label: {
      labelName: "District",
      labelKey: "BPA_NMA_NOC_DISTRICT_LABEL"
    },
    placeholder: {
      labelName: "Enter District Name",
      labelKey: "BPA_NMA_NOC_DISTRICT_PLACEHOLDER"
    }
  },
  Taluka: {
    label: {
      labelName: "Taluka",
      labelKey: "BPA_NMA_NOC_TALUKA_LABEL"
    },
    placeholder: {
      labelName: "Enter Taluka Name",
      labelKey: "BPA_NMA_NOC_TALUKA_PLACEHOLDER"
    }
  },
  Locality: {
    label: {
      labelName: "Locality",
      labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
    },
    placeholder: {
      labelName: "Enter Locality",
      labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
    }
  },
  DistanceFromTheMainMonument: {
    label: {
      labelName: "Distance From Main Monument",
      labelKey: "BPA_NMA_NOC_DISTANCE_FROM_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Enter Distance From Main Monument",
      labelKey: "BPA_NMA_NOC_DISTANCE_FROM_MONUMENT_PLACEHOLDER"
    }
  },
  DistanceFromTheProtectedBoundaryWall: {
    label: {
      labelName: "Distance From Protected Boundary Wall",
      labelKey: "BPA_NMA_NOC_DISTANCE_PROTECTED_WALL_LABEL"
    },
    placeholder: {
      labelName: "Enter Distance From Protected Boundary Wall",
      labelKey: "BPA_NMA_NOC_DISTANCE_PROTECTED_WAL_PLACEHOLDER"
    }
  },
  ApproximateDateOfCommencementOfWorks: {
    label: {
      labelName: "Date of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DATE_LABEL"
    },
    placeholder: {
      labelName: "Select Date of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DATE_PLACEHOLDER"
    }
  },
  ApproximateDurationOfCommencementOfWorks: {
    label: {
      labelName: "Duration of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DURATION_LABEL"
    },
    placeholder: {
      labelName: "Enter Monument Name",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DURATION_PLACEHOLDER"
    }
  },
  NearTheMonument: {
    label: {
      labelName: "Near the Monument",
      labelKey: "BPA_NMA_NOC_NEAR_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Near Monument",
      labelKey: "BPA_NMA_NOC_NEAR_MONUMENT_PLACEHOLDER"
    }
  },
  NearTheSiteConstructionRelatedActivity: {
    label: {
      labelName: "Near the Side Construction Related Activity",
      labelKey: "BPA_NMA_NOC_NEAR_SIDE_CONSTRUCTION_LABEL"
    },
    placeholder: {
      labelName: "Enter Near the Side Construction Related Activity",
      labelKey: "BPA_NMA_NOC_NEAR_SIDE_CONSTRUCTION_PLACEHOLDER"
    }
  },
  WhetherMonumentIsLocatedWithinLimitOf: {
    label: {
      labelName: "Whether the Monument is Located Within Limit of",
      labelKey: "BPA_NMA_NOC_MONUMENT_WITHIN_LIMIT_LABEL"
    },
    placeholder: {
      labelName: "Enter Whether the Monument is Located Within Limit of",
      labelKey: "BPA_NMA_NOC_MONUMENT_WITHIN_LIMIT_PLACEHOLDER"
    }
  },
  DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage: {
    label: {
      labelName: "Does Master Plan Approved By Concerned Authorities Exists For The City/Town/Village",
      labelKey: "BPA_NMA_NOC_MASTER_PLAN_APPROVED_LABEL"
    },
    placeholder: {
      labelName: "Select",
      labelKey: "BPA_NMA_NOC_MASTER_PLAN_APPROVED_PLACEHOLDER"
    }
  },  
  MonumentName: {
    label: {
      labelName: "Monument Name",
      labelKey: "BPA_NMA_NOC_MONUMENT_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Monument Name",
      labelKey: "BPA_NMA_NOC_MONUMENT_NAME_PLACEHOLDER"
    }
  },
  StatusOfModernConstructions: {
    label: {
      labelName: "Status Of Modern Constructions",
      labelKey: "BPA_NMA_NOC_MODERN_CONSTRUCTION_STATUS_LABEL"
    },
    placeholder: {
      labelName: "Enter Status Of Modern Constructions",
      labelKey: "BPA_NMA_NOC_MODERN_CONSTRUCTION_STATUS_PLACEHOLDER"
    }
  },
  OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea: {
    label: {
      labelName: "Open Space Or Park Or Green Area Close To Protected Monument Or Protected Area",
      labelKey: "BPA_NMA_NOC_AREA_CLOSE_TO_PROTECTED_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Enter Open Space Or Park Or Green Area Close To Protected Monument Or Protected Area",
      labelKey: "BPA_NMA_NOC_AREA_CLOSE_TO_PROTECTED_MONUMENT_PLACEHOLDER"
    }
  },
  WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction: {
    label: {
      labelName: "Whether Any Road Exists Between The Monument And The Site Of Construction",
      labelKey: "BPA_NMA_NOC_ROAD_EXISTS_BETWEEN_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Select Whether Any Road Exists Between The Monument And The Site Of Construction ",
      labelKey: "BPA_NMA_NOC_ROAD_EXISTS_BETWEEN_MONUMENT_PLACEHOLDER"
    }
  },
  Remarks: {
    label: {
      labelName: "Remarks",
      labelKey: "BPA_NMA_NOC_REMARKS_LABEL"
    },
    placeholder: {
      labelName: "Enter Remarks",
      labelKey: "BPA_NMA_NOC_REMARKS_PLACEHOLDER"
    }
  },
  TermAndCondition : {
    label: {
      labelName: "Terms and Conditions",
      labelKey: "BPA_NMA_NOC_TERM_CONDITION_LABEL"
    },
    placeholder: {
      labelName: "Enter Terms and Conditions",
      labelKey: "BPA_NMA_NOC_TERM_CONDITIO_PLACEHOLDER"
    }
  }
};
// const LightTooltip = withStyles((theme) => ({
//   tooltip: {
//     fontSize: 12
//   }
// }))(Tooltip);

const onNmaFieldChange = (key,jsonPath) => e => {
    store.dispatch(prepareFinalObject(`Noc[${key}].additionalDetails.thirdPartNOC.${jsonPath}`,e.target.value))
};

export const getNMANOCForm = (key,disabled) => {
  return (
    <React.Fragment>
      <div style={{backgroundColor:"rgb(255,255,255)", paddingRight:"10px", marginTop: "16px" }}>
        <Grid container="true" spacing={12}>
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
                <span>Name of the Nearest Monument or Site</span>
                <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
              }}
              labelName={fieldConfig.MonumentName.label.labelName}
              labelKey={fieldConfig.MonumentName.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.MonumentName.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.MonumentName`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.MonumentName")}
            />
            </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.State.label.labelName}
            labelKey={fieldConfig.State.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.State.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.State`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.State")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
             }}
            labelName={fieldConfig.District.label.labelName}
            labelKey={fieldConfig.District.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.District.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.District`}
            onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.District")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.Taluka.label.labelName}
            labelKey={fieldConfig.Taluka.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.Taluka.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.Taluka`}
              onChange={ onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Taluka")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.Locality.label.labelName}
            labelKey={fieldConfig.Locality.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.Locality.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.Locality`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Locality")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12} style={{marginTop: "10px"}} >
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
              <span>Distance Of The Site Of The Construction From Protected Boundary Of Monument</span>
              <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.DistanceFromTheMainMonument.label.labelName}
            labelKey={fieldConfig.DistanceFromTheMainMonument.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DistanceFromTheMainMonument.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument`}
            onChange={onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument")}
            />
          </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelName}
          labelKey={fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DistanceFromTheProtectedBoundaryWall.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall`}
            onChange={ onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall")}
          />
        </Grid>
        </Grid>
      <Grid container="true" spacing={12} style={{marginTop: "10px"}}>
        <Grid item xs={12}>
          <div style={styles.dividerStyle}>
            <div style={ styles.labelStyle}>
            <span>Date Of Commencement Of Work</span>
            <div style={styles.underlineStyle} />
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelName}
            labelKey={fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              type = "date"
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.ApproximateDateOfCommencementOfWorks.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.ApproximateDateOfCommencementOfWorks`}
              onChange={onNmaFieldChange(key,"ApproximateDateOfCommencementOfWorks")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelName}
            labelKey={fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              type = "date"
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.ApproximateDurationOfCommencementOfWorks.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.ApproximateDurationOfCommencementOfWorks`}
              onChange={onNmaFieldChange(key,"ApproximateDurationOfCommencementOfWorks")}
            />
          </Grid>
        </Grid>

        <Grid container="true" spacing={12} style={{marginTop: "10px"}}>
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
              <span>Maximum Height Of Existing Modern Building In Close Vicinity Of</span>
              <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.NearTheMonument.label.labelName}
            labelKey={fieldConfig.NearTheMonument.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.NearTheMonument.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument`}
              onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.NearTheSiteConstructionRelatedActivity.label.labelName}
            labelKey={fieldConfig.NearTheSiteConstructionRelatedActivity.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              disabled={disabled}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.NearTheSiteConstructionRelatedActivity.placeholder}
              jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity`}
              onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
          }}
          labelName={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelName}
          labelKey={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelName}
          labelKey={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            select ={true}
            data={[{
              "code":'Y',
              "label":"Yes"
            },
            {
              "code":'N',
              "label":"No"
            }]}
            disabled={disabled}
            optionValue="code"
            optionLabel="label"
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.StatusOfModernConstructions.label.labelName}
            labelKey={fieldConfig.StatusOfModernConstructions.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.StatusOfModernConstructions.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
            labelName={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelName}
            labelKey={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer   
            disabled={disabled}       
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
          labelName={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelName}
          labelKey={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            disabled={disabled}
            select ={true}
            data={[{
              "code":'Y',
              "label":"Yes"
            },
            {
              "code":'N',
              "label":"No"
            }]}
            optionValue="code"
            optionLabel="label"
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.Remarks.label.labelName}
          labelKey={fieldConfig.Remarks.label.labelKey} />
          <TextFieldContainer  
            disabled={disabled}        
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.Remarks.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
          }}
          labelName={fieldConfig.TermAndCondition.label.labelName}
          labelKey={fieldConfig.TermAndCondition.label.labelKey} />
          <TextFieldContainer
            disabled={disabled}
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.TermAndCondition.placeholder}
            jsonPath = {`Noc[${key}].additionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition")}
          />
        </Grid>
      </Grid>
    </div>
    </React.Fragment>
  );
}

class NocDetailCard extends Component {
  constructor(props) {
    super(props);
    const { requiredNocToTrigger, ...rest } = this.props;
    this.state = {
      uploadedDocIndex: 0,
      editableDocuments: null,
      nocType : '',
      isUpdate:false
    };
  }
  componentDidMount = () => {
    const {
      documentsList, 
      nocDocumentDetailsUploadRedux = {}, 
      prepareFinalObject
    } = this.props;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
      docType.cards.forEach(card => {
        if (card.subCards) {
          card.subCards.forEach(subCard => {
            let oldDocType = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentCode`
            );
            let oldDocSubCode = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentSubCode`
            );
            if (
              oldDocType != docType.code ||
              oldDocCode != card.name ||
              oldDocSubCode != subCard.name
            ) {
              nocDocumentDetailsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                documentSubCode: subCard.name
              };
            }
            index++;
          });
        } else {
          let oldDocType = get(
            nocDocumentDetailsUploadRedux,
            `[${index}].documentType`
          );
          let oldDocCode = get(
            nocDocumentDetailsUploadRedux,
            `[${index}].documentCode`
          );
          if (oldDocType != docType.code || oldDocCode != card.name) {
            nocDocumentDetailsUploadRedux[index] = {
              documentType: docType.code,
              documentCode: card.name,
              isDocumentRequired: card.required,
              isDocumentTypeRequired: card.dropDownValues
                ? card.dropDownValues.required
                : false
            };
          }
          index++;
        }
      });
    });
    prepareFinalObject("nocDocumentDetailsUploadRedux", nocDocumentDetailsUploadRedux);
  };
  static getDerivedStateFromProps(props, state) {
    if (
      (state.editableDocuments == null &&
      props.requiredNocToTrigger &&
      props.requiredNocToTrigger.length > 0)||
      (state.editableDocuments !=null && state.editableDocuments.length >0 && props.requiredNocToTrigger.length>0 && 
        (state.editableDocuments.length != props.requiredNocToTrigger.length))
    ) {
      state.editableDocuments = Array(props.requiredNocToTrigger.length).fill({
        editable: false,
      });
    }
  }

  getCard = (card, key) => {
    const { classes, requiredNocToTrigger, ...rest } = this.props;
    if (this.state.editableDocuments)
      return (
        <React.Fragment>
          {this.state.editableDocuments &&
            this.state.editableDocuments.length > 0 &&
            (this.state.editableDocuments[key].editable ? 
              ""
              // (
              // <div style={{backgroundColor:"rgb(255,255,255)", paddingRight:"10px", marginTop: "16px" }}><UploadCard
              //   docItem={card}
              //   docIndex={key}
              //   key={key.toString()}
              //   handleDocument={this.handleDocument}
              //   removeDocument={this.removeDocument}
              //   onUploadClick={this.onUploadClick}
              //   handleFileUpload={this.handleFileUpload}
              //   handleChange={this.handleChange}
              //   uploadedDocIndex={this.state.uploadedDocIndex}
              //   toggleEditClick={this.toggleEditClick}
              //   isFromPreview={true}
              //   jsonPath = {`nocDocumentDetailsUploadRedux`}
              //   ids = {"nocDocumentDetailsUploadRedux"}
              //   specificStyles= "preview_upload_btn"
              //   {...rest}
              // /></div>
            // ) 
            : (
              <NocDocDetailCard
                docItem={card}
                docIndex={key}
                key={key.toString()}
                handleDocument={this.handleDocument}
                removeDocument={this.removeDocument}
                onUploadClick={this.onUploadClick}
                handleFileUpload={this.handleFileUpload}
                handleChange={this.handleChange}
                uploadedDocIndex={this.state.uploadedDocIndex}
                toggleEditClick={() => this.toggleEditClick(card.nocType,true)}
                {...rest}
              />
            ))}
        </React.Fragment>
      );
  };

  getDocumentsFromMDMS = async (nocType,isUpdate) => {
    let {BPA} = this.props.preparedFinalObject
    let {applicationType} = BPA
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            "moduleName": "NOC",
            "masterDetails": [
                {
                    "name": "DocumentTypeMapping",
                    "filter": `$.[?(@.nocType=='${nocType}')]`
                }
            ]
        }     
        ]
      }
    };
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    // let payload = {"ResponseInfo":null,"MdmsRes":{"NOC":{"DocumentTypeMapping":[{"applicationType":"PROVISIONAL","nocType":"NOC.AIRPORT","docTypes":[{"documentType":"NOC.AIRPORT","required":true},{"documentType":"NOC.AIRPORTT","required":true}]},{"applicationType":"NEW","nocType":"HBDA_NOC","docTypes":[{"documentType":"NOC.HBDA","required":true}]},{"applicationType":"RENEW","nocType":"HBDA_NOC","docTypes":[{"documentType":"NOC.HBDA","required":false}]}]}}}
    let documents = payload && payload.MdmsRes && payload.MdmsRes.NOC && payload.MdmsRes.NOC.DocumentTypeMapping || []
  
    let requiredDocumentsFormat = documents && documents.length > 0 && documents[0].docTypes.map( doc => {
      return {
        code : doc.documentType,
        documentType : doc.documentType,
        required : doc.required,
        active : doc.active || true
      }
    })

    if(isUpdate){
      let {nocBPADocumentsContract} = this.props.preparedFinalObject
      let certificate = null
      certificate = nocBPADocumentsContract && nocBPADocumentsContract.length > 0 && nocBPADocumentsContract[0].cards && nocBPADocumentsContract[0].cards.length > 0 &&
      nocBPADocumentsContract[0].cards.filter(card => {
        if(card.nocType == nocType){
          return card
        }
      })
  
      if(certificate){
        requiredDocumentsFormat.push({
          active: true,
            code: certificate[0].code,
            documentType: certificate[0].name + '_CERTIFICATE',
            required: true
        })
      }
    }
    this.prepareDocumentsUploadData(requiredDocumentsFormat)
  }

  prepareDocumentsUploadData = (documents) => {
    let documentsContract = [];
    let tempDoc = {};
    documents && documents.length > 0 && documents.forEach(doc => {
        let card = {};
        card["code"] = doc.documentType;
        card["title"] = doc.documentType;
        card["documentType"] = doc.documentType
        card["cards"] = [];
        tempDoc[doc.documentType] = card;
    });
  
    documents && documents.length > 0 && documents.forEach(doc => {
        // Handle the case for multiple muildings
        let card = {};
        card["name"] = doc.code;
        card["code"] = doc.code;
        card["required"] = doc.required ? true : false;
        if (doc.hasDropdown && doc.dropdownData) {
            let dropdown = {};
            dropdown.label = "WS_SELECT_DOC_DD_LABEL";
            dropdown.required = true;
            dropdown.menu = doc.dropdownData.filter(item => {
                return item.active;
            });
            dropdown.menu = dropdown.menu.map(item => {
                return { code: item.code, label: getTransformedLocale(item.code) };
            });
            card["dropdown"] = dropdown;
        }
        tempDoc[doc.documentType].cards.push(card);
    });
  
    Object.keys(tempDoc).forEach(key => {
        documentsContract.push(tempDoc[key]);
    });
  
    store.dispatch(prepareFinalObject("documentsContractNOC", documentsContract));

    this.prepareDocumentForRedux(documentsContract)

  };

  triggerNoc = (nocType,isUpdate) => {
    if(!isUpdate){
      store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "isUpdate",
         false
      ))
    }
    debugger
    this.getDocumentsFromMDMS(nocType,isUpdate)
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "open",
        true
      ))
    store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "open",
        true
    ))  
      store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      )) 
      
      store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      ))

      store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "type",
        "trigger"
      ))
      store.dispatch(prepareFinalObject(`NewNocAdditionalDetails`,{})) 
      
  }

  render() {
    const {
      requiredNocToTrigger,
      documentData,
      Noc,
      disabled,
      ...rest
    } = this.props;
    return (
      <div>
        {requiredNocToTrigger &&
          requiredNocToTrigger.length > 0 &&
          requiredNocToTrigger.map((card, index) => {
            return (
              card.name ? (<div style={styles.documentTitle}>
                <div>
                  <Grid container>
                    <Grid item xs={3}>
                      <LabelContainer
                      labelKey={getTransformedLocale(card.nocType)}
                      style={styles.nocTitle}
                      />
                      {card.required && process.env.REACT_APP_NAME !== "Citizen" ? <span style = {styles.spanStyle}>*</span> : ""}
                    </Grid>
                    <Grid item xs={3}>
                      <LinkAtom 
                      linkDetail = {card.additionalDetails.linkDetails} 
                      />
                    </Grid>
                    {card.additionalDetails.nocNo ? (
                    <Grid item xs={3}>
                      <Typography
                      variant="subtitle1"
                      style={{ fontWeight: "bold", fontSize: "12px" }}
                      >
                      Approval Number
                      </Typography>
                    {card.additionalDetails.nocNo ?
                  <div style={styles.fontStyle}>
                    {card.additionalDetails.nocNo}
                  </div>: "NA" }
                  </Grid> ) : ( "" )}
                </Grid>
                <NocData
                  docItem={card}
                  docIndex={index}
                  key={index.toString()}
                  {...rest}
                />
                </div>
            <div>{this.getCard(card, index)}</div>  
            <div>{card.nocType == 'NMA_NOC' && 
            getNMANOCForm(index,disabled)}</div>
          </div>) : (
             <Grid style={{paddingTop:'18px',paddingRight:'22px',paddingBottom:'18px',paddingLeft:'10px',marginBottom:'10px',width:'100%',backgroundColor: "#FFFFFF"}} container>
                <Grid style={{align:'center'}} item xs={11}>
                  <LabelContainer style={{fontWeight:'bold',fontSize:'12px'}}
                    labelKey={getTransformedLocale(card.nocType)}/>
                </Grid>
             <Grid style={{align: "right"}} item xs={1}>
               <Button 
                 onClick = {() => this.triggerNoc(card.nocType,false)}
                 style = {{
                 color: "white",
                 backgroundColor: "rgb(254, 122, 81)",
                 borderRadius: "2px"}}>
                 Trigger
               </Button>
             </Grid>
           </Grid>
          )
              
            )
          })
        }
      </div>
    )
  }

  onUploadClick = (uploadedDocIndex) => {
    this.setState({ uploadedDocIndex });
  };

  toggleEditClick = (nocType) => {
    // let items = [...this.state.editableDocuments];
    // let item = { ...items[itemIndex] };
    // item.editable = item.editable ? false : true;
    // items[itemIndex] = item;
    // this.setState({ editableDocuments: items });
    store.dispatch(handleField(
      "apply",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       true
    ))
    store.dispatch(handleField(
      "search-preview",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       true
    ))
    this.triggerNoc(nocType)
  };
  
  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const {
      prepareFinalObject,
      nocDocumentDetailsUploadRedux,
      requiredNocToTrigger,
      Noc,
      wfState
    } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    let documentCode = requiredNocToTrigger[uploadedDocIndex].dropDownValues.value;
    if(!documentCode){
      let documentMenu = requiredNocToTrigger[uploadedDocIndex].dropDownValues.menu;
      if(documentMenu && documentMenu.length > 0 && documentMenu.length == 1){
        documentCode = documentMenu[0].code;
      } else {
        documentCode = requiredNocToTrigger[uploadedDocIndex].documentCode
      }
    }
    let appDocumentList = [];

    let fileObj = {
      fileName: file.name,
      name: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      isClickable: true,
      link: Object.values(fileUrl)[0],
      title: documentCode,
      documentType: documentCode,
      additionalDetails:{
        uploadedBy: getLoggedinUserRole(wfState),
        uploadedTime: new Date().getTime()
      }
      
    };
    if (
      requiredNocToTrigger[uploadedDocIndex] &&
      requiredNocToTrigger[uploadedDocIndex].documents
    ) {
      requiredNocToTrigger[uploadedDocIndex].documents.push(fileObj);
      appDocumentList = [...requiredNocToTrigger];
    } else {
      requiredNocToTrigger[uploadedDocIndex]["documents"] = [fileObj];
      appDocumentList = [...requiredNocToTrigger];
    }
    // if (Array.isArray(NOCData)) {
    //   if (NOCData.length > 0) {
    //     if (NOCData[0].documents) {
    //       NOCData[0].documents.push(fileObj);
    //     } else {
    //       NOCData[0].documents = [fileObj];
    //     }
    //   }
    // } else {
    //   if (NOCData.documents) {
    //     NOCData.documents.push(fileObj);
    //   } else {
    //     NOCData.documents = [fileObj];
    //   }
    // }
    // prepareFinalObject("NOCData", NOCData);

    prepareFinalObject("requiredNocToTrigger", appDocumentList);

    prepareFinalObject("nocDocumentDetailsUploadRedux", appDocumentList);
    // if(appDocumentList && appDocumentList.length > 0) {
    //   for(let data = 0; data < Noc.length; data ++) {
    //     Noc[data].documents = appDocumentList[data].documents
    //     let response = httpRequest(
    //       "post",
    //       "/noc-services/v1/noc/_update",
    //       "",
    //       [],
    //       { Noc: Noc[data] }
    //     );
    //   }
      
    // }
    // prepareFinalObject("Noc", Noc);
  };

  prepareDocumentForRedux = async (documentsList) => {
    const {nocDocumentsDetailsRedux} = this.props.preparedFinalObject 
     let index = 0;
     documentsList.forEach(docType => {
       docType.cards &&
         docType.cards.forEach(card => {
           if (card.subCards) {
             card.subCards.forEach(subCard => {
               let oldDocType = get(
                 nocDocumentsDetailsRedux,
                 `[${index}].documentType`
               );
               let oldDocCode = get(
                 nocDocumentsDetailsRedux,
                 `[${index}].documentCode`
               );
               let oldDocSubCode = get(
                 nocDocumentsDetailsRedux,
                 `[${index}].documentSubCode`
               );
               if (
                 oldDocType != docType.code ||
                 oldDocCode != card.name ||
                 oldDocSubCode != subCard.name
               ) {
                 nocDocumentsDetailsRedux[index] = {
                   documentType: docType.code,
                   documentCode: card.name,
                   documentSubCode: subCard.name
                 };
               }
               index++;
             });
           } else {
             let oldDocType = get(
               nocDocumentsDetailsRedux,
               `[${index}].documentType`
             );
             let oldDocCode = get(
               nocDocumentsDetailsRedux,
               `[${index}].documentCode`
             );
             if ((oldDocType != docType.code || oldDocCode != card.name)) {
               nocDocumentsDetailsRedux[index] = {
                 documentType: docType.code,
                 documentCode: card.name,
                 isDocumentRequired: card.required,
                 isDocumentTypeRequired: card.dropDownValues
                   ? card.dropDownValues.required
                   : false
               };
             }
             index++;
           }
         });
     });
     store.dispatch(prepareFinalObject("nocDocumentsDetailsRedux", nocDocumentsDetailsRedux))
 }
  removeDocument = (cardIndex, uploadedDocIndex) => {
    const { prepareFinalObject, requiredNocToTrigger, Noc } = this.props;
    let uploadedDocs = [];
    let fileTobeRemoved =
    requiredNocToTrigger[cardIndex].documents[uploadedDocIndex];

    // if (Array.isArray(Noc)) {
    //   if (Noc.length > 0) {
    //     uploadedDocs = Noc[0].documents;
    //     uploadedDocs = this.getFinalDocsAfterRemovingDocument(uploadedDocs, fileTobeRemoved);
    //     Noc[0].documents = uploadedDocs;
    //   }
    // } else {
    //   uploadedDocs = Noc.documents;
    //   uploadedDocs = this.getFinalDocsAfterRemovingDocument(
    //     uploadedDocs,
    //     fileTobeRemoved
    //   );
    //   Noc.documents = uploadedDocs;
    // }

    requiredNocToTrigger[cardIndex].documents.splice(uploadedDocIndex, 1);
    prepareFinalObject("Noc", Noc);
    //uploadedDocs.map()
    prepareFinalObject("requiredNocToTrigger", requiredNocToTrigger);
    prepareFinalObject("nocDocumentDetailsUploadRedux", requiredNocToTrigger);

    this.forceUpdate();
  };

  getFinalDocsAfterRemovingDocument = (docs, file) => {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].fileStoreId == file.fileStoreId) {
        docs.splice(i, 1);
        break;
      }
    }

    return docs;
  };

  handleChange = (key, event) => {
    const { prepareFinalObject, requiredNocToTrigger } = this.props;
    let appDocumentList = [];

    appDocumentList = [...requiredNocToTrigger];
    appDocumentList[key].dropDownValues.value = event.target.value;
    prepareFinalObject("requiredNocToTrigger", appDocumentList);
    prepareFinalObject("nocDocumentDetailsUploadRedux", appDocumentList);
  };
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const {preparedFinalObject} = screenConfiguration
  const nocDocumentDetailsUploadRedux = get(
    screenConfiguration.preparedFinalObject,
    "nocDocumentDetailsUploadRedux",
    {}
  );
  const documentsList = get(
    screenConfiguration.preparedFinalObject,
    "nocBPADocumentsContract",
    []
  );
  const nocFinalCardsforPreview = get(
    screenConfiguration.preparedFinalObject,
    ownProps.jsonPath,
    []
  );
  const Noc = get(screenConfiguration.preparedFinalObject, "Noc", []);
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );

  const requiredNocToTrigger = get(
    screenConfiguration.preparedFinalObject,
   "requiredNocToTrigger",
    []
  );
  

  return { nocDocumentDetailsUploadRedux,preparedFinalObject, documentsList, nocFinalCardsforPreview, Noc,requiredNocToTrigger, wfState };
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NocDetailCard)
);

