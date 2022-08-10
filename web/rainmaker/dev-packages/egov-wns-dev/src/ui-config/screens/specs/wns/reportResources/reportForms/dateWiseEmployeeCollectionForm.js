export const dateWiseEmployeeCollectionForm = [
  {
    key: "tenantId",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    // className: "applicant-details-error autocomplete-dropdown",
    jsonPath: "reportForm.tenantId",
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    required: true,
    labelKey: "ULB Name",
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
    // onChange: onChangeTest,
  },
  {
    key: "collectionDate",
    type: "date",
    jsonPath: "reportForm.collectionDate",
    // sourceJsonPath,
    labelKey: "Collection Date",
    placeholderLabelKey: "Select Collection Date",
    // localePrefix,
    gridSm: 4,
    // className,
    required: true,
    // isDisabled: false,
  },
  {
    key: "paymentMode",
    type: "select",
    placeholderLabelKey: "Select Payment Mode",
    gridSm: 4,
    // className: "applicant-details-error autocomplete-dropdown",
    jsonPath: "reportForm.paymentMode",
    sourceJsonPath: "reportDropdownOpts.paymentMode",
    required: false,
    labelKey: "Payment Mode",
    optionValue: "value",
    optionLabel: "code",
  },
]