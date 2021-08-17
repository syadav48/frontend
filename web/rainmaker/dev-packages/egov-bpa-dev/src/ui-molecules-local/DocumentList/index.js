import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  handleFileUpload,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { UploadSingleFile } from "../../ui-molecules-local";
import Typography from "@material-ui/core/Typography";
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";

const themeStyles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px"
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none"
  },
  iconDiv: {
    display: "flex",
    alignItems: "center"
  },
  descriptionDiv: {
    alignItems: "center",
    display: "block",
    marginTop: "20px",
  },
  formControl: {
    minWidth: 250,
    padding: "0px"
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: "5px"
  }
});

const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  documentName: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  },
  dropdownLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px"
  }
};

const requiredIcon = (
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>*</sup>
);

class DocumentList extends Component {
  state = {
    uploadedDocIndex: 0
  };

  componentDidMount = () => {
    const {
      documentsList,
      nocDocumentsDetailsRedux = {},
      prepareFinalObject
    } = this.props;
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
            if (oldDocType != docType.code || oldDocCode != card.name) {
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
    prepareFinalObject("nocDocumentsDetailsRedux", nocDocumentsDetailsRedux);
    prepareFinalObject("payloadDocumentFormat", []);
  };

  onUploadClick = uploadedDocIndex => {
    this.setState({ uploadedDocIndex });
  };

  //to prepare documents for NOC create API payload
  prepareDocumentsForPayload = async (appDocumentList, documentsFormat, wfState) => {
    let documnts = [];
    if (appDocumentList) {
      Object.keys(appDocumentList).forEach(function (key) {
        if (appDocumentList && appDocumentList[key]) {
          documnts.push(appDocumentList[key]);
        }
      });
    }

    // prepareFinalObject("nocDocumentsDetailsRedux", {});
    let requiredDocuments = [], uploadingDocuments = [];
    if (documnts && documnts.length > 0) {
      documnts.forEach(documents => {
        if (documents && documents.documents) {
          documents.documents.map(docs => {
            let doc = {};
            doc.documentType = documents.documentCode;
            doc.fileStoreId = docs.fileStoreId;
            doc.fileStore = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
            doc.isClickable = true;
            doc.additionalDetails = {
              uploadedBy: getLoggedinUserRole(wfState),
              uploadedTime: new Date().getTime()
            }
            if (doc.id) {
              doc.id = docs.id;
            }
            uploadingDocuments.push(doc);
          })
        }
      });

      let diffDocs = [];
      // documentsFormat && documentsFormat.length > 0 && documentsFormat.forEach(nocDocs => {
      //   if (nocDocs) {
      //     diffDocs.push(nocDocs);
      //   }
      // });

      // if (uploadingDocuments && uploadingDocuments.length > 0) {
      //   uploadingDocuments.forEach(tDoc => {
      //     diffDocs.push(tDoc);
      //   })
      // };
      this.props.prepareFinalObject("payloadDocumentFormat",uploadingDocuments);

      // if (documentsFormat && documentsFormat.length > 0) {
      //   documentsFormat = diffDocs;
      //   prepareFinalObject("payloadDocumentFormat",documentsFormat);
      // }
    }
  }

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const { prepareFinalObject, nocDocumentsDetailsRedux, preparedFinalObject } = this.props;
    const { payloadDocumentFormat } = preparedFinalObject
    const fileUrl = await getFileUrlFromAPI(fileStoreId);

    let appDocumentList = {
      ...nocDocumentsDetailsRedux,
      [uploadedDocIndex]: {
        ...nocDocumentsDetailsRedux[uploadedDocIndex],
        documents: [
          {
            fileName: file.name,
            fileStoreId,
            fileUrl: Object.values(fileUrl)[0]
          }
        ]
      }
    }
    prepareFinalObject("nocDocumentsDetailsRedux", appDocumentList );
  };

  removeDocument = remDocIndex => {
    const { prepareFinalObject, preparedFinalObject } = this.props;
    const { payloadDocumentFormat } = preparedFinalObject;
    // let updatedDocuments = []
    // updatedDocuments = payloadDocumentFormat && payloadDocumentFormat.length > 0 && payloadDocumentFormat.map( (doc,index) => {
    //   if(index != remDocIndex){
    //     return doc
    //   }
    // })
    let updatedDocuments = payloadDocumentFormat
    updatedDocuments.splice(remDocIndex)
    prepareFinalObject(
      `payloadDocumentFormat`,
      updatedDocuments
    );

    prepareFinalObject(
      `nocDocumentsDetailsRedux.${remDocIndex}.documents`,
      undefined
    );
    this.forceUpdate();
  };

  handleChange = (key, event) => {

    const { nocDocumentsDetailsRedux, prepareFinalObject } = this.props;
    let appDocumentList = {
      ...nocDocumentsDetailsRedux,
      [key]: {
        ...nocDocumentsDetailsRedux[key],
        dropDownValues: { value: event.target.value }
      }
    }
    prepareFinalObject(`nocDocumentsDetailsRedux`, appDocumentList);
  };

  getUploadCard = (card, key) => {
    const { classes, nocDocumentsDetailsRedux } = this.props;
    let jsonPath = `nocDocumentsDetailsRedux[${key}].dropDownValues.value`;
    return (
      <Grid container={true}>
        <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
          {nocDocumentsDetailsRedux[key] && nocDocumentsDetailsRedux[key].documents ? (
            <div className={classes.documentSuccess}>
              <Icon>
                <i class="material-icons">done</i>
              </Icon>
            </div>
          ) : (
            <div className={classes.documentIcon}>
              <span>{key + 1}</span>
            </div>
          )}
        </Grid>
        <Grid
          item={true}
          xs={10}
          sm={5}
          md={4}
          align="left"
          className={classes.descriptionDiv}
        >
          <LabelContainer
            labelKey={getTransformedLocale(card.name)}
            style={styles.documentName}
          />
          {card.required && requiredIcon}
          <Typography variant="caption">
            <LabelContainer
              labelKey={getTransformedLocale("BPA_UPLOAD_FILE_RESTRICTIONS")}
            />
          </Typography>
        </Grid>
        <Grid item={true} xs={12} sm={6} md={4}>
          {card.dropDownValues && (
            <TextFieldContainer
              select={true}
              label={{ labelKey: getTransformedLocale(card.dropDownValues.label) }}
              placeholder={{ labelKey: card.dropDownValues.label }}
              data={card.dropDownValues.menu}
              optionValue="code"
              optionLabel="label"
              autoSelect={true}
              required={card.required}
              onChange={event => this.handleChange(key, event)}
              jsonPath={jsonPath}
            />
          )}
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={3}
          className={classes.fileUploadDiv}
        >
          <UploadSingleFile
            classes={this.props.classes}
            handleFileUpload={e =>
              handleFileUpload(e, this.handleDocument, this.props)
            }
            uploaded={
              nocDocumentsDetailsRedux[key] && nocDocumentsDetailsRedux[key].documents
                ? true
                : false
            }
            removeDocument={() => this.removeDocument(key)}
            documents={
              nocDocumentsDetailsRedux[key] && nocDocumentsDetailsRedux[key].documents
            }
            onButtonClick={() => this.onUploadClick(key)}
            inputProps={this.props.inputProps}
            buttonLabel={this.props.buttonLabel}
            id={`doc-${key+1}`}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, documentsList } = this.props;
    let index = 0;
    return (
      <div>
        {documentsList &&
          documentsList.map(container => {
            return (
              <div>
                {/* <LabelContainer
                  labelKey={getTransformedLocale(container.title)}
                  style={styles.documentTitle}
                /> */}
                {container.cards.map(card => {
                  return (
                    <div className={classes.documentContainer}>
                      {card.hasSubCards && (
                        <LabelContainer
                          labelKey={card.name}
                          style={styles.documentTitle}
                        />
                      )}
                      {card.hasSubCards &&
                        card.subCards.map(subCard => {
                          return (
                            <div className={classes.documentSubCard}>
                              {this.getUploadCard(subCard, index++)}
                            </div>
                          );
                        })}
                      {!card.hasSubCards && (
                        <div>{this.getUploadCard(card, index++)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    );
  }
}

DocumentList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName,preparedFinalObject } = screenConfiguration;
  const nocDocumentsDetailsRedux = get(
    screenConfiguration.preparedFinalObject,
    "nocDocumentsDetailsRedux",
    {}
  );
  return {preparedFinalObject, nocDocumentsDetailsRedux, moduleName };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(themeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocumentList)
);
