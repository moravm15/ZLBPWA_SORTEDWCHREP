sap.ui.controller("zlbpwa.zlbpwa_sortedwchrep2.ext.controller.ListReportExtension", {
	onAfterRendering: function () {
		//this._setAnalyticalTableAutoResizeColumns();
		this._prepareCustomFilters();
		this._setFiscalPeriodFormatTemplate();
	},
	
	onBeforeRebindTableExtension: function (oEvent) {
		//this._setAnalyticalTableAutoResizeColumns();

		var oSmartTable = oEvent.getSource();
		var oTable = oSmartTable.getTable();

		//Read $fiter params to pass selected value in custom filter
		var oBindingParams = oEvent.getParameter("bindingParams");
		oBindingParams.parameters = oBindingParams.parameters || {};

		var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
		var vCategory;
		if (oSmartFilterBar instanceof sap.ui.comp.smartfilterbar.SmartFilterBar) {
			//Custom Indicator1042 filter
			var oCustomControl2 = oSmartFilterBar.getControlByKey("atroLutro");
			oBindingParams.filters.push(new sap.ui.model.Filter("Atro", "EQ", oCustomControl2.getState()));
		}
	},


	_setAnalyticalTableAutoResizeColumns: function () {
		let oTable = sap.ui.getCore().byId(
			"zlbpwa.zlbpwa_sortedwchrep2::sap.suite.ui.generic.template.ListReport.view.ListReport::SortedWchRepSet--analyticalTable");
		let aColumns = oTable.getColumns();
		let fColumn = function (sIdPart) { 
			let aFound = aColumns.filter(function (oColumn) {
                return (oColumn.getId() === "zlbpwa.zlbpwa_sortedwchrep2::sap.suite.ui.generic.template.ListReport.view.ListReport::SortedWchRepSet--listReport-" + sIdPart);
            });
            return (aFound.length > 0 ? aFound[0] : {
                setWidth: function () {}
            });
        }

		aColumns.forEach(function (_oColumn, iIndex) {
			oTable.autoResizeColumn(iIndex);
		});
	},
	
	_setFiscalPeriodFormatTemplate: function () {
		let oText = new sap.m.Text();
		const oCol = sap.ui.getCore().byId(
			"zlbpwa.zlbpwa_sortedwchrep2::sap.suite.ui.generic.template.ListReport.view.ListReport::SortedWchRepSet--listReport-FiscalPeriod");
		oText.bindText({
			parts: [{
				path: "FiscalPeriod",
				type: new sap.ui.model.odata.type.Date({
					UTC: true,
					pattern: "MM.yyyy",
					style: "medium"
				}, {
					isDateOnly: true
				})
			}],
			type: new sap.ui.model.odata.type.Date({
				UTC: true,
				pattern: "MM.yyyy",
				style: "medium"
			}, {
				isDateOnly: true
			})
		});
		oCol.setTemplate(oText);
	},
	
    _prepareCustomFilters: function () {
        let oDecadeFilter = this.byId("decadeFilter");
 
        let iCurrentYear = (new Date()).getFullYear();
 
        this.refreshDecadeList(iCurrentYear);

        let sDateRangeString = this.byId("decadeFilter").getSelectedItem().getAdditionalText();
        let aDateRange = sDateRangeString.split(" – ");
        let aDateFrom = aDateRange[0].split(". ");
        let aDateTo = aDateRange[1].split(". ");
        let iDayFrom = parseInt(aDateFrom[0], 10);
        let iMonthFrom = parseInt(aDateFrom[1], 10) - 1;
        let iYearFrom = parseInt(aDateFrom[2], 10);
        let iDayTo = parseInt(aDateTo[0], 10);
        let iMonthTo = parseInt(aDateTo[1], 10) - 1;
        let iYearTo = parseInt(aDateTo[2], 10);
        let oDateFrom = new Date(iYearFrom, iMonthFrom, iDayFrom, 0, 0, 0);
        let oDateTo = new Date(iYearTo, iMonthTo, iDayTo, 23, 59, 59);
    },

    refreshDecadeList: function (iYear) {
        let oDecadeFilter = this.byId("decadeFilter");
        let oDate = new Date();
        let iDec = 1;
        let aDec = [];
 
        for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= 3; d++) {
                let oDateStart = new Date(iYear, m - 1, 1 + ((d - 1) * 10));
                let oDateEnd = d === 3 ? new Date(iYear, m, 0) : new Date(iYear, m - 1, 10 + ((d - 1) * 10));
                aDec.push({
                    id: iDec++,
                    from: oDateStart,
                    to: oDateEnd
                });
            }
        }
 
        aDec.reverse();
        aDec = aDec.filter(function (oDec) {
            return (oDec.from <= oDate);
        });
 
        oDecadeFilter.removeAllItems();
        for (let i = 0; i < aDec.length; i++) {
            oDecadeFilter.addItem(new sap.ui.core.ListItem({
                key: aDec[i].id,
                text: aDec[i].id,
                additionalText: aDec[i].from.getDate() + ". " + (aDec[i].from.getMonth() + 1) + ". " + aDec[i].from.getFullYear() + " – " + aDec[
                    i].to.getDate() + ". " + (aDec[i].to.getMonth() + 1) + ". " + aDec[i].to.getFullYear()
            }));
        }
        oDecadeFilter.setSelectedKey(aDec[0].id);
    },
 
    onDecadeChange: function (oEvent) {
        let sDateRangeString = oEvent.getSource().getSelectedItem().getAdditionalText();
        let aDateRange = sDateRangeString.split(" – ");
        let aDateFrom = aDateRange[0].split(". ");
        let aDateTo = aDateRange[1].split(". ");
        let iDayFrom = parseInt(aDateFrom[0], 10);
        let iMonthFrom = parseInt(aDateFrom[1], 10) - 1;
        let iYearFrom = parseInt(aDateFrom[2], 10);
        let iDayTo = parseInt(aDateTo[0], 10);
        let iMonthTo = parseInt(aDateTo[1], 10) - 1;
        let iYearTo = parseInt(aDateTo[2], 10);
        let oDateFrom = new Date(iYearFrom, iMonthFrom, iDayFrom, 0, 0, 0);
        let oDateTo = new Date(iYearTo, iMonthTo, iDayTo, 23, 59, 59);

        let oDateRangeControl = sap.ui.getCore().byId(
            "zlbpwa.zlbpwa_sortedwchrep2::sap.suite.ui.generic.template.ListReport.view.ListReport::SortedWchRepSet--listReportFilter-filterItemControl_BASIC-Date");
        oDateRangeControl.setDateValue(oDateFrom);
        oDateRangeControl.setSecondDateValue(oDateTo);
    },
});