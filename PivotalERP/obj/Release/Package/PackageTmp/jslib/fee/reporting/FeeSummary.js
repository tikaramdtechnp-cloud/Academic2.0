//"use strict";

//agGrid.initialiseAgGridWithAngular1(angular);


app.controller('FeeSummaryController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices, $translate, uiGridConstants, uiGridTreeViewConstants) {
	$scope.Title = 'Fee Summary';


	getterAndSetter();

	$rootScope.ConfigFunction = function () {
		$scope.LoadData();
		$('.select2').select2();

		$scope.AllClassList = [];
		GlobalServices.getClassList().then(function (res) {
			$scope.AllClassList = mx(res.data.Data);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.AcademicConfig = {};
		//pahela res1 theyo...eslai res banako at 25 chaitra 2081
		GlobalServices.getAcademicConfig().then(function (res) {
			$scope.AcademicConfig = res.data.Data;

			if ($scope.AcademicConfig.ActiveFaculty == true) {

				$scope.FacultyList = [];
				GlobalServices.getFacultyList().then(function (res) {
					$scope.FacultyList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			} else {
				$scope.gridOptions.columnApi.setColumnsVisible(["Faculty"], false);
				$scope.gridOptionsDW.columnApi.setColumnsVisible(["Faculty"], false);
			}




			if ($scope.AcademicConfig.ActiveLevel == true) {

				$scope.LevelList = [];
				GlobalServices.getClassLevelList().then(function (res) {
					$scope.LevelList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			} else {
				$scope.gridOptions.columnApi.setColumnsVisible(["Level"], false);
				$scope.gridOptionsDW.columnApi.setColumnsVisible(["Level"], false);
			}


			if ($scope.AcademicConfig.ActiveSemester == true) {

				$scope.SelectedClassSemesterList = [];
				$scope.SemesterList = [];
				GlobalServices.getSemesterList().then(function (res) {
					$scope.SemesterList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			} else {
				$scope.gridOptions.columnApi.setColumnsVisible(["Semester"], false);
				$scope.gridOptionsDW.columnApi.setColumnsVisible(["Semester"], false);
			}

			if ($scope.AcademicConfig.ActiveBatch == true) {

				$scope.BatchList = [];
				GlobalServices.getBatchList().then(function (res) {
					$scope.BatchList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			} else {
				$scope.gridOptions.columnApi.setColumnsVisible(["Batch"], false);
				$scope.gridOptionsDW.columnApi.setColumnsVisible(["Batch"], false);
			}

			if ($scope.AcademicConfig.ActiveClassYear == true) {

				$scope.ClassYearList = [];
				$scope.SelectedClassClassYearList = [];
				GlobalServices.getClassYearList().then(function (res) {
					$scope.ClassYearList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			} else {
				$scope.gridOptionsDW.columnApi.setColumnsVisible(["ClassYear"], false);
				$scope.gridOptions.columnApi.setColumnsVisible(["ClassYear"], false);//DONE: Was Missing
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};
	$scope.onBtExportCSV = function () {
		var params = {
			filefield: 'FeeSummaryDateWise.csv',
			sheetfield: 'FeeSummaryDateWise'
		};
		$scope.gridOptionsDW.api.exportDataAsCsv(params);
	}

	$rootScope.ChangeLanguage();

	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}
	$scope.onFilterTextBoxChangedDW = function () {
		$scope.gridOptionsDW.api.setQuickFilter($scope.searchDW);
	}

	$scope.onFilterTextBoxChangedSib = function () {
		$scope.gridOptionsSib.api.setQuickFilter($scope.searchSib);
	}


	function getterAndSetter() {

		$scope.discounts = [];

		$scope.gridColumnDef = [
			{ headerName: "Id", width: 90, field: "AutoNumber", filter: 'agNumberColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Reg.No.", width: 120, field: "RegdNo", filter: 'agTextColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Roll No.", width: 110, field: "RollNo", filter: 'agNumberColumnFilter', pinned: 'left' },
			/*	{ headerName: "Name", width: 180, field: "Name", filter: 'agTextColumnFilter', },*/

			{
				headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 180,
				cellStyle: function (params) {
					if (params.data.IsLeft == true) {
						return { color: 'red' };
					}
					else if (params.data.IsTransport == true)
						return { color: 'green' }
					else if (params.data.IsHostel == true)
						return { color: 'blue' }
					else {
						return null;
					}
				}, pinned: 'left'
			},

			{ headerName: "Class", width: 120, field: "ClassName", filter: 'agTextColumnFilter', pinned: 'left' },
			{ headerName: "Section", width: 100, field: "SectionName", filter: 'agTextColumnFilter', pinned: 'left' },

			{ headerName: "Batch", width: 100, field: "Batch", filter: 'agTextColumnFilter', },
			{ headerName: "Faculty", width: 100, field: "Faculty", filter: 'agTextColumnFilter', },
			{ headerName: "Level", width: 100, field: "Level", filter: 'agTextColumnFilter', },
			{ headerName: "Semester", width: 140, field: "Semester", filter: 'agTextColumnFilter', },
			{ headerName: "ClassYear", width: 140, field: "ClassYear", filter: 'agTextColumnFilter', },

			{ headerName: "Fee Heading", width: 180, field: "FeeItemName", filter: 'agTextColumnFilter', },
			{ headerName: "Previous Dues", width: 170, field: "Opening", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Current Fee", width: 150, field: "DrTotal", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Paid Amount", width: 130, field: "TotalCredit", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Discount Amount", width: 140, field: "CrDiscountAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "> Dues", width: 120, field: "FutureDues", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Balance Amount", width: 150, field: "TotalDues", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },

			{ headerName: "FatherName", width: 190, field: "FatherName", filter: 'agTextColumnFilter', },
			{ headerName: "Father Contact No", width: 190, field: "F_ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Mother Name", width: 180, field: "MotherName", filter: 'agTextColumnFilter', },
			{ headerName: "Mother Contact No", width: 180, field: "M_ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Address", width: 160, field: "Address", filter: 'agTextColumnFilter', },

			{ headerName: "Is New", width: 120, field: "IsNewStudent", filter: 'agTextColumnFilter', },
			{ headerName: "Is Transport", width: 120, field: "IsTransport", filter: 'agTextColumnFilter', },
			{ headerName: "Is Hostel", width: 120, field: "IsHostel", filter: 'agTextColumnFilter', },

			{ headerName: "IsLeft", width: 120, field: "IsLeft", filter: 'agTextColumnFilter', },
			{ headerName: "LeftDate", width: 120, field: "LeftMiti", filter: 'agTextColumnFilter', },
			{ headerName: "LeftReason", width: 150, field: "LeftReason", filter: 'agTextColumnFilter', },
			{ headerName: "PointName", width: 180, field: "PointName", filter: 'agTextColumnFilter', },
			{ headerName: "RouteName", width: 180, field: "RouteName", filter: 'agTextColumnFilter', },
			{ headerName: "BoarderName", width: 180, field: "BoardersName", filter: 'agTextColumnFilter', },
			{ headerName: "CardNo", width: 130, field: "CardNo", filter: 'agNumberColumnFilter', },
			{ headerName: "EnrollNo", width: 130, field: "EnrollNo", filter: 'agNumberColumnFilter', },
			{ headerName: "LedgerPanaNo", width: 150, field: "LedgerPanaNo", filter: 'agTextColumnFilter', },

			{ headerName: "LastReceiptMiti", width: 150, field: "LastReceiptMiti", filter: 'agTextColumnFilter', },
			{ headerName: "LastReceiptNo", width: 150, field: "LastReceiptNo", filter: 'agTextColumnFilter', },
			{ headerName: "LastReceiptAmt", width: 150, field: "LastReceiptAmt", filter: 'agNumberColumnFilter', },

			{ headerName: "> DR", width: 110, field: "FutureDR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "> CR", width: 110, field: "FutureCR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },


			{ headerName: "Email", width: 100, field: "Email", filter: 'agTextColumnFilter', },

			{ headerName: "House Name", width: 150, field: "HouseName", filter: 'agTextColumnFilter', },
			{ headerName: "House Dress", width: 150, field: "HouseDress", filter: 'agTextColumnFilter', },
			{ headerName: "Vehicle Name", width: 150, field: "VehicleName", filter: 'agTextColumnFilter', },
			{ headerName: "Vehicle Number", width: 150, field: "VehicleNumber", filter: 'agTextColumnFilter', },
			{ headerName: "Gender", width: 150, field: "Gender", filter: 'agTextColumnFilter', },
		];

		$scope.gridOptions = {

			// a default column definition with properties that get applied to every column
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true,

				// set every column width
				width: 90
			},
			headerHeight: 31,
			rowHeight: 30,
			columnDefs: $scope.gridColumnDef,
			enableColResize: true,
			rowData: null,
			filter: true,
			enableFilter: true,
			enableSorting: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			rowSelection: 'multiple',
			suppressHorizontalScroll: true,
			alignedGrids: [],
			onFilterChanged: function (e) {
				//console.log('onFilterChanged', e);
				var pDue = 0, cDue = 0, paidAmt = 0, disAmt = 0, balAmt = 0;
				$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
					var tb = node.data;
					pDue += tb.Opening;
					cDue += tb.DrTotal;
					paidAmt += tb.TotalCredit;
					disAmt += tb.CrDiscountAmt;
					balAmt += tb.TotalDues;
				});

				$scope.dataForBottomGrid[0].Opening = pDue;
				$scope.dataForBottomGrid[0].DrTotal = cDue;
				$scope.dataForBottomGrid[0].TotalCredit = paidAmt;
				$scope.dataForBottomGrid[0].CrDiscountAmt = disAmt;
				$scope.dataForBottomGrid[0].TotalDues = balAmt;
				$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
				//console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
			},
		};

		$scope.gridColumnDefDW = [
			{ headerName: "Id", width: 90, field: "AutoNumber", filter: 'agNumberColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Reg.No.", width: 120, field: "RegdNo", filter: 'agTextColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Roll No.", width: 115, field: "RollNo", filter: 'agNumberColumnFilter', },
			/*	{ headerName: "Name", width: 180, field: "Name", filter: 'agTextColumnFilter', },*/

			{
				headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 180,
				cellStyle: function (params) {
					if (params.data.IsLeft == true) {
						return { color: 'red' };
					}
					else if (params.data.IsTransport == true)
						return { color: 'green' }
					else if (params.data.IsHostel == true)
						return { color: 'blue' }
					else {
						return null;
					}
				}, pinned: 'left'
			},

			{ headerName: "Class", width: 100, field: "ClassName", filter: 'agTextColumnFilter', pinned: 'left' },
			{ headerName: "Section", width: 100, field: "SectionName", filter: 'agTextColumnFilter', pinned: 'left' },

			{ headerName: "Batch", width: 100, field: "Batch", filter: 'agTextColumnFilter', },
			{ headerName: "Faculty", width: 100, field: "Faculty", filter: 'agTextColumnFilter', },
			{ headerName: "Level", width: 100, field: "Level", filter: 'agTextColumnFilter', },
			{ headerName: "Semester", width: 100, field: "Semester", filter: 'agTextColumnFilter', },
			{ headerName: "ClassYear", width: 100, field: "ClassYear", filter: 'agTextColumnFilter', },

			{ headerName: "Fee Heading", width: 130, field: "FeeItemName", filter: 'agTextColumnFilter', },
			{ headerName: "Previous Dues", width: 130, field: "Opening", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Current Fee", width: 150, field: "DrAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Paid Amount", width: 130, field: "CrAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Discount Amount", width: 140, field: "CrDiscountAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Bill Discount", width: 140, field: "DrDiscountAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			//{ headerName: "> Dues", width:  110, field: "FutureDues", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Balance Amount", width: 140, field: "Closing", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },

			{ headerName: "FatherName", width: 150, field: "FatherName", filter: 'agTextColumnFilter', },
			{ headerName: "F_ContactNo", width: 120, field: "F_ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Address", width: 160, field: "Address", filter: 'agTextColumnFilter', },

			//{ headerName: "Is New", width: 120, field: "IsNewStudent", filter: 'agTextColumnFilter', },
			//{ headerName: "Is Transport", width: 120, field: "IsTransport", filter: 'agTextColumnFilter', },
			//{ headerName: "Is Hostel", width: 120, field: "IsHostel", filter: 'agTextColumnFilter', },

			//{ headerName: "IsLeft", width: 120, field: "IsLeft", filter: 'agTextColumnFilter', },
			//{ headerName: "LeftDate", width: 120, field: "LeftMiti", filter: 'agTextColumnFilter', },
			//{ headerName: "LeftReason", width: 150, field: "LeftReason", filter: 'agTextColumnFilter', },
			//{ headerName: "PointName", width: 140, field: "PointName", filter: 'agTextColumnFilter', },
			//{ headerName: "RouteName", width: 140, field: "RouteName", filter: 'agTextColumnFilter', },
			//{ headerName: "BoarderName", width: 140, field: "BoardersName", filter: 'agTextColumnFilter', },
			//{ headerName: "CardNo", width: 100, field: "CardNo", filter: 'agNumberColumnFilter', },
			//{ headerName: "EnrollNo", width: 100, field: "EnrollNo", filter: 'agNumberColumnFilter', },
			//{ headerName: "LedgerPanaNo", width: 110, field: "LedgerPanaNo", filter: 'agTextColumnFilter', },

			//{ headerName: "LastReceiptMiti", width: 110, field: "LastReceiptMiti", filter: 'agTextColumnFilter', },
			//{ headerName: "LastReceiptNo", width: 110, field: "LastReceiptNo", filter: 'agTextColumnFilter', },
			//{ headerName: "LastReceiptAmt", width: 110, field: "LastReceiptAmt", filter: 'agNumberColumnFilter', },

			//{ headerName: "> DR", width: 110, field: "FutureDR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			//{ headerName: "> CR", width: 110, field: "FutureCR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },


			//{ headerName: "Email", width: 100, field: "Email", filter: 'agTextColumnFilter', },

			//{ headerName: "House Name", width: 120, field: "HouseName", filter: 'agTextColumnFilter', },
			//{ headerName: "House Dress", width: 120, field: "HouseDress", filter: 'agTextColumnFilter', },
			//{ headerName: "Vehicle Name", width: 120, field: "VehicleName", filter: 'agTextColumnFilter', },
			//{ headerName: "Vehicle Number", width: 120, field: "VehicleNumber", filter: 'agTextColumnFilter', },

		];

		$scope.gridOptionsDW = {

			// a default column definition with properties that get applied to every column
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true,

				// set every column width
				width: 90
			},
			headerHeight: 31,
			rowHeight: 30,
			columnDefs: $scope.gridColumnDefDW,
			enableColResize: true,
			rowData: null,
			filter: true,
			enableSorting: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			rowSelection: 'multiple',
			suppressHorizontalScroll: true,
			alignedGrids: [],
			enableFilter: true,
			onFilterChanged: function (e) {
				var dt = {
					Name: 'TOTAL =>',
					Opening: 0,
					DrAmt: 0,
					CrAmt: 0,
					Closing: 0,
					DrDiscountAmt: 0,
					CrDiscountAmt: 0,

				}
				$scope.gridOptionsDW.api.forEachNodeAfterFilterAndSort(function (node) {
					var tb = node.data;
					dt.Opening += tb.Opening;
					dt.DrAmt += tb.DrAmt;
					dt.CrAmt += tb.CrAmt;
					dt.Closing += tb.Closing;
					dt.DrDiscountAmt += tb.DrDiscountAmt;
					dt.CrDiscountAmt += tb.CrDiscountAmt;
				});
				var filterDataColl = [];
				filterDataColl.push(dt);

				$scope.gridOptionsBottomDW.api.setRowData(filterDataColl);
				//$scope.dataForBottomGridDW[0].Opening = pDue;
				//$scope.dataForBottomGridDW[0].DrTotal = cDue;
				//$scope.dataForBottomGridDW[0].TotalCredit = paidAmt;
				//$scope.dataForBottomGridDW[0].CrDiscountAmt = disAmt;
				//$scope.dataForBottomGridDW[0].TotalDues = balAmt;
				//$scope.gridOptionsBottomDW.api.setRowData($scope.dataForBottomGrid);
				//console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
			},
		};
		$scope.dataForBottomGrid = [
			{
				RegdNo: '',
				RollNo: '',
				Name: 'Total =>',
				ClassName: '',
				SectionName: '',
				Opening: 0,
				DrTotal: 0,
				TotalCredit: 0,
				CrDiscountAmt: '',
				TotalDues: 0,
				FatherName: '',
				F_ContactNo: '',
				Address: '',
				IsLeft: '',
				TransportPoint: '',
				TransportRoute: '',
				BoarderName: '',
				CardNo: '',
				EnrollNo: '',
				LedgerPanaNo: '',


			},
		];

		$scope.gridOptionsBottom = {
			defaultColDef: {
				resizable: true,
				width: 90
			},
			rowHeight: 30,
			columnDefs: $scope.gridColumnDef,
			// we are hard coding the data here, it's just for demo purposes
			rowData: $scope.dataForBottomGrid,
			debug: true,
			rowClass: 'bold-row',
			// hide the header on the bottom grid
			headerHeight: 0,
			alignedGrids: []
		};


		$scope.dataForBottomGridDW = [
			{
				RegdNo: '',
				RollNo: '',
				Name: 'Total =>',
				ClassName: '',
				SectionName: '',
				Opening: 0,
				DrTotal: 0,
				TotalCredit: 0,
				CrDiscountAmt: '',
				TotalDues: 0,
				FatherName: '',
				F_ContactNo: '',
				Address: '',
				IsLeft: '',
				TransportPoint: '',
				TransportRoute: '',
				BoarderName: '',
				CardNo: '',
				EnrollNo: '',
				LedgerPanaNo: '',


			},
		];

		$scope.gridOptionsBottomDW = {
			defaultColDef: {
				resizable: true,
				width: 90
			},
			headerHeight: 31,
			rowHeight: 30,
			columnDefs: $scope.gridColumnDefDW,
			// we are hard coding the data here, it's just for demo purposes
			rowData: $scope.dataForBottomGridDW,
			debug: true,
			rowClass: 'bold-row',
			// hide the header on the bottom grid
			headerHeight: 0,
			alignedGrids: []
		};

		$scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
		$scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

		$scope.gridDivBottom = document.querySelector('#myGridBottom');
		new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);

		$scope.gridOptionsDW.alignedGrids.push($scope.gridOptionsBottomDW);
		$scope.gridOptionsBottomDW.alignedGrids.push($scope.gridOptionsDW);

		$scope.gridDivBottomDW = document.querySelector('#myGridBottomDW');
		new agGrid.Grid($scope.gridDivBottomDW, $scope.gridOptionsBottomDW);

		$scope.gridColumnDef44 = [
			{ headerName: "Id", width: 90, field: "AutoNumber", filter: 'agNumberColumnFilter', sortable: true },
			{ headerName: "Reg.No.", width: 120, field: "RegNo", filter: 'agTextColumnFilter', sortable: true },
			{ headerName: "Roll No.", width: 100, field: "RollNo", filter: 'agNumberColumnFilter', },
			/*	{ headerName: "Name", width: 180, field: "Name", filter: 'agTextColumnFilter', },*/

			{
				headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 180,
			},

			{ headerName: "Class", width: 100, field: "ClassName", filter: 'agTextColumnFilter', },
			{ headerName: "Section", width: 100, field: "SectionName", filter: 'agTextColumnFilter', },
			{ headerName: "Fee Heading", width: 100, field: "FeeItem", filter: 'agTextColumnFilter', },
			{ headerName: "FatherName", width: 150, field: "FatherName", filter: 'agTextColumnFilter', },
			{ headerName: "F_ContactNo", width: 120, field: "ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Address", width: 160, field: "Address", filter: 'agTextColumnFilter', },
			{ headerName: "Nature", width: 140, field: "Nature", filter: 'agTextColumnFilter', },

		];

		$scope.gridOptions44 = {

			// a default column definition with properties that get applied to every column
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true,

				// set every column width
				width: 90
			},
			headerHeight: 31,
			rowHeight: 30,
			columnDefs: $scope.gridColumnDef44,
			enableColResize: true,
			rowData: null,
			filter: true,
			enableFilter: true,
			enableSorting: true,
			rowSelection: 'multiple',


		};



		//Added By Suresh on Magh 22 for Sibling Fee Update

		$scope.gridColumnDefSib = [
			{ headerName: "Id", width: 90, field: "AutoNumber", filter: 'agNumberColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Reg.No.", width: 120, field: "RegdNo", filter: 'agTextColumnFilter', sortable: true, pinned: 'left' },
			{ headerName: "Roll No.", width: 110, field: "RollNo", filter: 'agNumberColumnFilter', pinned: 'left' },
			/*	{ headerName: "Name", width: 180, field: "Name", filter: 'agTextColumnFilter', },*/

			{
				headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 180,
				cellStyle: function (params) {
					if (params.data.IsLeft == true) {
						return { color: 'red' };
					}
					else if (params.data.IsTransport == true)
						return { color: 'green' }
					else if (params.data.IsHostel == true)
						return { color: 'blue' }
					else {
						return null;
					}
				}, pinned: 'left'
			},

			{ headerName: "Class", width: 120, field: "ClassName", filter: 'agTextColumnFilter', pinned: 'left' },
			{ headerName: "Section", width: 100, field: "SectionName", filter: 'agTextColumnFilter', pinned: 'left' },

			//{ headerName: "Batch", width: 100, field: "Batch", filter: 'agTextColumnFilter', },
			//{ headerName: "Faculty", width: 100, field: "Faculty", filter: 'agTextColumnFilter', },
			//{ headerName: "Level", width: 100, field: "Level", filter: 'agTextColumnFilter', },
			//{ headerName: "Semester", width: 150, field: "Semester", filter: 'agTextColumnFilter', },
			//{ headerName: "ClassYear", width: 150, field: "ClassYear", filter: 'agTextColumnFilter', },

			{ headerName: "Fee Heading", width: 140, field: "FeeItemName", filter: 'agTextColumnFilter', },
			{ headerName: "Previous Dues", width: 140, field: "Opening", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Current Fee", width: 150, field: "DrTotal", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Paid Amount", width: 130, field: "TotalCredit", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Discount Amount", width: 140, field: "CrDiscountAmt", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "> Dues", width: 150, field: "FutureDues", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "Balance Amount", width: 140, field: "TotalDues", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },

			{ headerName: "FatherName", width: 210, field: "FatherName", filter: 'agTextColumnFilter', },
			{ headerName: "Father Contact No", width: 180, field: "F_ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Mother Name", width: 180, field: "MotherName", filter: 'agTextColumnFilter', },
			{ headerName: "Mother Contact No", width: 180, field: "M_ContactNo", filter: 'agTextColumnFilter', },
			{ headerName: "Address", width: 160, field: "Address", filter: 'agTextColumnFilter', },

			{ headerName: "Is New", width: 150, field: "IsNewStudent", filter: 'agTextColumnFilter', },
			{ headerName: "Is Transport", width: 150, field: "IsTransport", filter: 'agTextColumnFilter', },
			{ headerName: "Is Hostel", width: 150, field: "IsHostel", filter: 'agTextColumnFilter', },

			{ headerName: "IsLeft", width: 150, field: "IsLeft", filter: 'agTextColumnFilter', },
			{ headerName: "LeftDate", width: 150, field: "LeftMiti", filter: 'agTextColumnFilter', },
			{ headerName: "LeftReason", width: 150, field: "LeftReason", filter: 'agTextColumnFilter', },
			{ headerName: "PointName", width: 200, field: "PointName", filter: 'agTextColumnFilter', },
			{ headerName: "RouteName", width: 200, field: "RouteName", filter: 'agTextColumnFilter', },
			{ headerName: "BoarderName", width: 200, field: "BoardersName", filter: 'agTextColumnFilter', },
			{ headerName: "CardNo", width: 150, field: "CardNo", filter: 'agNumberColumnFilter', },
			{ headerName: "EnrollNo", width: 150, field: "EnrollNo", filter: 'agNumberColumnFilter', },
			{ headerName: "LedgerPanaNo", width: 150, field: "LedgerPanaNo", filter: 'agTextColumnFilter', },

			{ headerName: "LastReceiptMiti", width: 150, field: "LastReceiptMiti", filter: 'agTextColumnFilter', },
			{ headerName: "LastReceiptNo", width: 150, field: "LastReceiptNo", filter: 'agTextColumnFilter', },
			{ headerName: "LastReceiptAmt", width: 150, field: "LastReceiptAmt", filter: 'agNumberColumnFilter', },

			{ headerName: "> DR", width: 110, field: "FutureDR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
			{ headerName: "> CR", width: 110, field: "FutureCR", filter: 'agNumberColumnFilter', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },


			{ headerName: "Email", width: 130, field: "Email", filter: 'agTextColumnFilter', },

			{ headerName: "House Name", width: 150, field: "HouseName", filter: 'agTextColumnFilter', },
			{ headerName: "House Dress", width: 150, field: "HouseDress", filter: 'agTextColumnFilter', },
			{ headerName: "Vehicle Name", width: 150, field: "VehicleName", filter: 'agTextColumnFilter', },
			{ headerName: "Vehicle Number", width: 150, field: "VehicleNumber", filter: 'agTextColumnFilter', },

		];

		$scope.gridOptionsSib = {

			// a default column definition with properties that get applied to every column
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true,

				// set every column width
				width: 90
			},
			headerHeight: 31,
			rowHeight: 30,
			columnDefs: $scope.gridColumnDefSib,
			enableColResize: true,
			rowData: null,
			filter: true,
			enableFilter: true,
			enableSorting: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			rowSelection: 'multiple',
			suppressHorizontalScroll: true,
			alignedGrids: [],
			onFilterChanged: function () {

				var dt = {
					Name: 'TOTAL =>',
					FutureDR: 0,
					FutureCR: 0,
					Opening: 0,
					DrTotal: 0,
					TotalCredit: 0,
					CrDiscountAmt: 0,
					FutureDues: 0,
					TotalDues: 0,
					LastReceiptAmt: 0
				}
				$scope.gridOptionsSib.api.forEachNodeAfterFilterAndSort(function (node) {
					var fData = node.data;
					dt.FutureDR += fData.FutureDR;
					dt.FutureCR += fData.FutureCR;
					dt.Opening += fData.Opening;
					dt.DrTotal += fData.DrTotal;
					dt.TotalCredit += fData.TotalCredit;
					dt.CrDiscountAmt += fData.CrDiscountAmt;
					dt.FutureDues += fData.FutureDues;
					dt.TotalDues += fData.TotalDues;
					dt.LastReceiptAmt += fData.LastReceiptAmt;
				});
				var filterDataColl = [];
				filterDataColl.push(dt);

				$scope.gridOptionsBottomSib.api.setRowData(filterDataColl);
			},
		};

		$scope.dataForBottomGridSib = [
			{
				RegdNo: '',
				RollNo: '',
				Name: 'Total =>',
				ClassName: '',
				SectionName: '',
				Opening: 0,
				DrTotal: 0,
				TotalCredit: 0,
				CrDiscountAmt: '',
				TotalDues: 0,
				FatherName: '',
				F_ContactNo: '',
				Address: '',
				IsLeft: '',
				TransportPoint: '',
				TransportRoute: '',
				BoarderName: '',
				CardNo: '',
				EnrollNo: '',
				LedgerPanaNo: '',


			},
		];

		$scope.gridOptionsBottomSib = {
			defaultColDef: {
				resizable: true,
				width: 90
			},
			rowHeight: 30,
			columnDefs: $scope.gridColumnDefSib,
			// we are hard coding the data here, it's just for demo purposes
			rowData: $scope.dataForBottomGridSib,
			debug: true,
			rowClass: 'bold-row',
			// hide the header on the bottom grid
			headerHeight: 0,
			alignedGrids: []
		};

		$scope.gridOptionsSib.alignedGrids.push($scope.gridOptionsBottomSib);
		$scope.gridOptionsBottomSib.alignedGrids.push($scope.gridOptionsSib);

		$scope.gridDivBottomSib = document.querySelector('#myGridBottomSib');
		new agGrid.Grid($scope.gridDivBottomSib, $scope.gridOptionsBottomSib);
		//Ends

	};

	$scope.LoadData = function () {

		$scope.PeriodColl = [{ id: 1, text: 'Month Wise' }, { id: 2, text: 'Date Wise' }];

		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		//$scope.MonthList = GlobalServices.getMonthList();
		$scope.MonthList = [];
		$scope.MonthList_Display = [];
		GlobalServices.getAcademicMonthList(null, null).then(function (res1) {
			$scope.MonthList = [];
			$scope.MonthList_Display = [];
			angular.forEach(res1.data.Data, function (m) {
				$scope.MonthList.push({ id: m.NM, text: m.MonthYear });
				$scope.MonthList_Display.push({ id: m.NM, text: m.MonthYear });
			});

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newDiscountTypewise = {
			DiscountTypewiseId: null,

			Mode: 'Save'
		};

		$scope.ClassList = [];
		GlobalServices.getClassSectionList().then(function (res) {
			$scope.ClassList = res.data.Data;



		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.feeMappingStudent = {
			ClassIdColl: '',
			FeeItemIdColl: '',
			For: 0
		}

		$scope.feeSummary = {
			FromMonthId: 0,
			ToMonthId: 0,
			ForStudent: 0,
			FeeItemIdColl: '',
			PeriodAs: 1,
			CombinedSummary:false,
		}

		$scope.SibfeeSummary = {
			FromMonthId: 0,
			ToMonthId: 0,
			ForStudent: 0,
			FeeItemIdColl: '',
			PeriodAs: 1,
			CombinedSummary:false,
		}

		$scope.feeSummaryDW = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
		}



		$scope.classWise = {
			SelectedFromMonth: null,
			SelectedToMonth: null,
			FromMonthId: 0,
			ToMonthId: 0,
			ForStudent: 0,
			FromMonth: '',
			ToMonth: '',
			TemplatesColl: []
		};

		$scope.studentWise = {
			SelectClass: null,
			SelectedFromMonth: null,
			SelectedToMonth: null,
			FromMonthId: 0,
			ToMonthId: 0,
			ForStudent: 0,
			FromMonth: '',
			ToMonth: '',
			TemplatesColl: []
		};

		$scope.FeeItemList = [];
		GlobalServices.getFeeItemList().then(function (res1) {
			$scope.FeeItemList = res1.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityFeeSummaryClassWise + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data)
				$scope.classWise.TemplatesColl = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityFeeSummaryStudentWise + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data)
				$scope.studentWise.TemplatesColl = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.LoadTemplates();

		//$scope.GetAllDiscountTypewiseList();

	};

	$scope.LoadTemplates = function () {

		$scope.NotificationTemplates = [];
		var para1 = {
			EntityId: entityFeeSummarySMS,
			ForATS: 3,
			TemplateType: 3
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetSENT",
			dataType: "json",
			data: JSON.stringify(para1)
		}).then(function (res) {
			if (res.data.IsSuccess) {
				$scope.NotificationTemplates = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.ExportFeeSummaryAsCSV = function () {
		var params = {
			fileName: 'feeSummary.csv',
			sheetName: 'feeSummary'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.ExportFeeSummaryAsexcel = function () {
		var params = {
			fileName: 'feeSummary.csv',
			sheetName: 'feeSummary'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}

	//Added By Suresh on 22 Magh starts
	$scope.ExportFeeSummarySibAsCSV = function () {
		var params = {
			fileName: 'siblingFeeSummary.csv',
			sheetName: 'siblingFeeSummary'
		};
		$scope.gridOptionsSib.api.exportDataAsCsv(params);
	}
	$scope.ExportFeeSummarySibAsexcel = function () {
		var params = {
			fileName: 'SiblingFeeSummary.csv',
			sheetName: 'SiblingFeeSummary'
		};
		$scope.gridOptionsSib.api.exportDataAsCsv(params);
	}
	//Ends

	$scope.ChangeClassOfFeeSummary = function () {
		if (!$scope.feeSummary.SelectedClass || $scope.feeSummary.SelectedClass.ClassId==0) {
			GlobalServices.getAcademicMonthList(null, null).then(function (resAM) {
				$scope.MonthList = [];
				angular.forEach(resAM.data.Data, function (m) {
					$scope.MonthList.push({ id: m.NM, text: m.MonthYear });
				});
			});
		} else if ($scope.feeSummary.SelectedClass) {
			GlobalServices.getAcademicMonthList(null, $scope.feeSummary.SelectedClass.ClassId).then(function (resAM) {
				$scope.MonthList = [];
				angular.forEach(resAM.data.Data, function (m) {
					$scope.MonthList.push({ id: m.NM, text: m.MonthYear });
				});
			});
		}

		$scope.getFeeSummary();
	}

	$scope.getFeeSummary = function () {

		$scope.SelectedClassSemesterList = [];
		$scope.SelectedClassClassYearList = [];

		if ($scope.feeSummary.SelectedClass) {
			var findClass = $scope.AllClassList.firstOrDefault(p1 => p1.ClassId == $scope.feeSummary.SelectedClass.ClassId);
			if (findClass) {

				$scope.feeSummary.SelectedClass.ClassType = findClass.ClassType;

				var semQry = mx(findClass.ClassSemesterIdColl);
				var cyQry = mx(findClass.ClassYearIdColl);

				$scope.SelectedClassClassYearList = [];
				$scope.SelectedClassSemesterList = [];

				angular.forEach($scope.SemesterList, function (sem) {
					if (semQry.contains(sem.id)) {
						$scope.SelectedClassSemesterList.push({
							id: sem.id,
							text: sem.text,
							SemesterId: sem.id,
							Name: sem.Name
						});
					}
				});

				angular.forEach($scope.ClassYearList, function (sem) {
					if (cyQry.contains(sem.id)) {
						$scope.SelectedClassClassYearList.push({
							id: sem.id,
							text: sem.text,
							ClassYearId: sem.id,
							Name: sem.Name
						});
					}
				});
			}
		}

		if ($scope.feeSummary.PeriodAs == 1) {
			$scope.feeSummary.DateFrom_TMP = null;
			$scope.feeSummary.DateTo_TMP = null;
			if ($scope.feeSummary.FromMonthId > 0 && $scope.feeSummary.ToMonthId > 0) {

			} else {
				//Swal.fire('Please ! Select Month Period');
				return;
			}
		} else if ($scope.feeSummary.PeriodAs == 2) {
			if (!$scope.feeSummary.DateFromDet || !$scope.feeSummary.DateToDet) {
				//Swal.fire('Please ! Select DateFrom/To');
				return;
			}
		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			fromMonthId: ($scope.feeSummary.PeriodAs == 1 ? $scope.feeSummary.FromMonthId : 0),
			toMonthId: ($scope.feeSummary.PeriodAs == 1 ? $scope.feeSummary.ToMonthId : 0),
			forStudent: $scope.feeSummary.ForStudent,
			feeItemIdColl: $scope.feeSummary.FeeItemIdColl,
			classId: $scope.feeSummary.SelectedClass ? $scope.feeSummary.SelectedClass.ClassId : 0,
			sectionId: $scope.feeSummary.SelectedClass ? $scope.feeSummary.SelectedClass.SectionId : 0,
			batchId: $scope.feeSummary.BatchId,
			semesterId: $scope.feeSummary.SemesterId,
			classYearId: $scope.feeSummary.ClassYearId,
			ForPaymentFollowup: false,
			FollowupType: 0,
			dateFrom: ($scope.feeSummary.PeriodAs == 2 ? $filter('date')(new Date($scope.feeSummary.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			dateTo: ($scope.feeSummary.PeriodAs == 2 ? $filter('date')(new Date($scope.feeSummary.DateToDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "Fee/Report/GetFeeSummary",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				var Opening = 0, DrTotal = 0, TotalCredit = 0, CrDiscountAmt = 0, TotalDues = 0;
				angular.forEach(res.data.Data, function (fs) {
					Opening += fs.Opening;
					DrTotal += fs.DrTotal;
					TotalCredit += fs.TotalCredit;
					CrDiscountAmt += fs.CrDiscountAmt;
					TotalDues += fs.TotalDues;
				});
				$scope.dataForBottomGrid[0].Opening = Opening;
				$scope.dataForBottomGrid[0].DrTotal = DrTotal;
				$scope.dataForBottomGrid[0].TotalCredit = TotalCredit;
				$scope.dataForBottomGrid[0].CrDiscountAmt = CrDiscountAmt;
				$scope.dataForBottomGrid[0].TotalDues = TotalDues;
				$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

				if ($scope.feeSummary.CombinedSummary == true) {

					var DataColl = mx(res.data.Data);
					var newDataColl = [];
					var groupStudent = DataColl.groupBy(p1 => p1.StudentId);
					angular.forEach(groupStudent, function (st) {
						var fst = st.elements[0];
						var groupData = mx(st.elements);
						var newData = angular.copy(fst);
						if (st.elements.length > 1) {
							newData.Opening = groupData.sum(p1 => p1.Opening);
							newData.DrAmt = groupData.sum(p1 => p1.DrAmt);
							newData.DrDiscountAmt = groupData.sum(p1 => p1.DrDiscountAmt);
							newData.DrFineAmt = groupData.sum(p1 => p1.DrFineAmt);
							newData.DrTax = groupData.sum(p1 => p1.DrTax);
							newData.DrTotal = groupData.sum(p1 => p1.DrTotal);
							newData.CrAmt = groupData.sum(p1 => p1.CrAmt);
							newData.CrDiscountAmt = groupData.sum(p1 => p1.CrDiscountAmt);
							newData.CrFineAmt = groupData.sum(p1 => p1.CrFineAmt);
							newData.TotalDebit = groupData.sum(p1 => p1.TotalDebit);
							newData.TotalCredit = groupData.sum(p1 => p1.TotalCredit);
							newData.TotalDues = groupData.sum(p1 => p1.TotalDues);
							newData.FutureDR = groupData.sum(p1 => p1.FutureDR);
							newData.FutureCR = groupData.sum(p1 => p1.FutureCR);
							newData.FutureDues = groupData.sum(p1 => p1.FutureDues);
							newData.Closing = groupData.sum(p1 => p1.Closing);
                        }
						newDataColl.push(newData);
					});

					$scope.gridOptions.api.setRowData(newDataColl);
				}
				else
				{ 
					$scope.gridOptions.api.setRowData(res.data.Data);
                }

				
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.PrintFeeSummary = function () {
		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityFeeSummary + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var templatesColl = res.data.Data;
				if (templatesColl && templatesColl.length > 0) {
					var templatesName = [];
					var sno = 1;
					angular.forEach(templatesColl, function (tc) {
						templatesName.push(sno + '-' + tc.ReportName);
						sno++;
					});

					var print = false;

					var rptTranId = 0;
					if (templatesColl.length == 1)
						rptTranId = templatesColl[0].RptTranId;
					else {
						Swal.fire({
							title: 'Report Templates For Print',
							input: 'select',
							inputOptions: templatesName,
							inputPlaceholder: 'Select a template',
							showCancelButton: true,
							inputValidator: (value) => {
								return new Promise((resolve) => {
									if (value >= 0) {
										resolve()
										rptTranId = templatesColl[value].RptTranId;

										if (rptTranId > 0) {
											var dataColl = [];
											$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
												dataColl.push(node.data);
											});
											print = true;
											$http({
												method: 'POST',
												url: base_url + "Fee/Report/PrintFeeSummary",
												headers: { 'Content-Type': undefined },

												transformRequest: function (data) {

													var formData = new FormData();
													formData.append("jsonData", angular.toJson(data.jsonData));

													return formData;
												},
												data: { jsonData: dataColl }
											}).then(function (res) {

												$scope.loadingstatus = "stop";
												hidePleaseWait();
												if (res.data.IsSuccess && res.data.Data) {


													var rptPara = {
														rpttranid: rptTranId,
														istransaction: false,
														entityid: entityFeeSummary,
														voucherid: 0,
														tranid: 0,
														vouchertype: 0,
														sessionid: res.data.Data.ResponseId,
														ClassSectionName: ($scope.feeSummary.SelectedClass == 0 || $scope.feeSummary.SelectedClass == null || $scope.feeSummary.SelectedClass == undefined ? "All" : $scope.feeSummary.SelectedClass.text),
														FromMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.FromMonthId).text,
														ToMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.ToMonthId).text,
														ForStudent: "",
														FeeItemName: ($scope.feeSummary.FeeItemIdColl == 0 || $scope.feeSummary.FeeItemIdColl == null || $scope.feeSummary.FeeItemIdColl == undefined ? "All" : mx($scope.FeeItemList).firstOrDefault(p1 => p1.FeeItemId == $scope.feeSummary.FeeItemIdColl).Name)
													};
													var paraQuery = param(rptPara);

													document.body.style.cursor = 'wait';
													document.getElementById("frmRpt").src = '';
													document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
													document.body.style.cursor = 'default';
													$('#FrmPrintReport').modal('show');

												} else
													Swal.fire('No Templates found for print');

											}, function (errormessage) {
												hidePleaseWait();
												$scope.loadingstatus = "stop";
												Swal.fire(errormessage);
											});

										}

									} else {
										resolve('You need to select:)')
									}
								})
							}
						})
					}

					if (rptTranId > 0 && print == false) {
						var dataColl = [];
						$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
							dataColl.push(node.data);
						});
						print = true;

						$http({
							method: 'POST',
							url: base_url + "Fee/Report/PrintFeeSummary",
							headers: { 'Content-Type': undefined },

							transformRequest: function (data) {

								var formData = new FormData();
								formData.append("jsonData", angular.toJson(data.jsonData));

								return formData;
							},
							data: { jsonData: dataColl }
						}).then(function (res) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							if (res.data.IsSuccess && res.data.Data) {

								var rptPara = {
									rpttranid: rptTranId,
									istransaction: false,
									entityid: entityFeeSummary,
									voucherid: 0,
									tranid: 0,
									vouchertype: 0,
									sessionid: res.data.Data.ResponseId,
									ClassSectionName: ($scope.feeSummary.SelectedClass == 0 || $scope.feeSummary.SelectedClass == null || $scope.feeSummary.SelectedClass == undefined ? "All" : $scope.feeSummary.SelectedClass.text),
									FromMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.FromMonthId).text,
									ToMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.ToMonthId).text,
									ForStudent: "",
									FeeItemName: ($scope.feeSummary.FeeItemIdColl == 0 || $scope.feeSummary.FeeItemIdColl == null || $scope.feeSummary.FeeItemIdColl == undefined ? "All" : mx($scope.FeeItemList).firstOrDefault(p1 => p1.FeeItemId == $scope.feeSummary.FeeItemIdColl).Name)
								};
								var paraQuery = param(rptPara);

								document.body.style.cursor = 'wait';
								document.getElementById("frmRpt").src = '';
								document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
								document.body.style.cursor = 'default';
								$('#FrmPrintReport').modal('show');

							} else
								Swal.fire('No Templates found for print');

						}, function (errormessage) {
							hidePleaseWait();
							$scope.loadingstatus = "stop";
							Swal.fire(errormessage);
						});

					}

				} else
					Swal.fire('No Templates found for print');
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.getFeeSummaryDW = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			feeItemIdColl: $scope.feeSummaryDW.FeeItemIdColl,
			dateFrom: $filter('date')(new Date($scope.feeSummaryDW.DateFromDet.dateAD), 'yyyy-MM-dd'),
			dateTo: $filter('date')(new Date($scope.feeSummaryDW.DateToDet.dateAD), 'yyyy-MM-dd'),
		};
		$http({
			method: 'POST',
			url: base_url + "Fee/Report/GetFeeDateWise",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {


				var Opening = 0, DrAmt = 0, CrAmt = 0, Closing = 0, DrDiscountAmt = 0, CrDiscountAmt = 0;
				res.data.Data.forEach(function (tb) {
					Opening += tb.Opening;
					DrAmt += tb.DrAmt;
					CrAmt += tb.CrAmt;
					Closing += tb.Closing;
					DrDiscountAmt += tb.DrDiscountAmt;
					CrDiscountAmt += tb.CrDiscountAmt;
				});

				$scope.dataForBottomGridDW[0].Opening = Opening;
				$scope.dataForBottomGridDW[0].DrAmt = DrAmt;
				$scope.dataForBottomGridDW[0].CrAmt = CrAmt;
				$scope.dataForBottomGridDW[0].Closing = Closing;
				$scope.dataForBottomGridDW[0].DrDiscountAmt = DrDiscountAmt;
				$scope.dataForBottomGridDW[0].CrDiscountAmt = CrDiscountAmt;

				$scope.gridOptionsBottomDW.api.setRowData($scope.dataForBottomGridDW);

				$scope.gridOptionsDW.api.setRowData(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.PrintFeeSummaryDW = function () {
		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityFeeSummary + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var templatesColl = res.data.Data;
				if (templatesColl && templatesColl.length > 0) {
					var templatesName = [];
					var sno = 1;
					angular.forEach(templatesColl, function (tc) {
						templatesName.push(sno + '-' + tc.ReportName);
						sno++;
					});

					var print = false;

					var rptTranId = 0;
					if (templatesColl.length == 1)
						rptTranId = templatesColl[0].RptTranId;
					else {
						Swal.fire({
							title: 'Report Templates For Print',
							input: 'select',
							inputOptions: templatesName,
							inputPlaceholder: 'Select a template',
							showCancelButton: true,
							inputValidator: (value) => {
								return new Promise((resolve) => {
									if (value >= 0) {
										resolve()
										rptTranId = templatesColl[value].RptTranId;

										if (rptTranId > 0) {
											var dataColl = [];
											$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
												dataColl.push(node.data);
											});
											print = true;
											$http({
												method: 'POST',
												url: base_url + "Fee/Report/PrintFeeSummary",
												headers: { 'Content-Type': undefined },

												transformRequest: function (data) {

													var formData = new FormData();
													formData.append("jsonData", angular.toJson(data.jsonData));

													return formData;
												},
												data: { jsonData: dataColl }
											}).then(function (res) {

												$scope.loadingstatus = "stop";
												hidePleaseWait();
												if (res.data.IsSuccess && res.data.Data) {


													var rptPara = {
														rpttranid: rptTranId,
														istransaction: false,
														entityid: entityFeeSummary,
														voucherid: 0,
														tranid: 0,
														vouchertype: 0,
														sessionid: res.data.Data.ResponseId,
														ClassSectionName: ($scope.feeSummary.SelectedClass == 0 || $scope.feeSummary.SelectedClass == null || $scope.feeSummary.SelectedClass == undefined ? "All" : $scope.feeSummary.SelectedClass.text),
														FromMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.FromMonthId).text,
														ToMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.ToMonthId).text,
														ForStudent: "",
														FeeItemName: ($scope.feeSummary.FeeItemIdColl == 0 || $scope.feeSummary.FeeItemIdColl == null || $scope.feeSummary.FeeItemIdColl == undefined ? "All" : mx($scope.FeeItemList).firstOrDefault(p1 => p1.FeeItemId == $scope.feeSummary.FeeItemIdColl).Name)
													};
													var paraQuery = param(rptPara);

													document.body.style.cursor = 'wait';
													document.getElementById("frmRpt").src = '';
													document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
													document.body.style.cursor = 'default';
													$('#FrmPrintReport').modal('show');

												} else
													Swal.fire('No Templates found for print');

											}, function (errormessage) {
												hidePleaseWait();
												$scope.loadingstatus = "stop";
												Swal.fire(errormessage);
											});

										}

									} else {
										resolve('You need to select:)')
									}
								})
							}
						})
					}

					if (rptTranId > 0 && print == false) {
						var dataColl = [];
						$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
							dataColl.push(node.data);
						});
						print = true;

						$http({
							method: 'POST',
							url: base_url + "Fee/Report/PrintFeeSummary",
							headers: { 'Content-Type': undefined },

							transformRequest: function (data) {

								var formData = new FormData();
								formData.append("jsonData", angular.toJson(data.jsonData));

								return formData;
							},
							data: { jsonData: dataColl }
						}).then(function (res) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							if (res.data.IsSuccess && res.data.Data) {

								var rptPara = {
									rpttranid: rptTranId,
									istransaction: false,
									entityid: entityFeeSummary,
									voucherid: 0,
									tranid: 0,
									vouchertype: 0,
									sessionid: res.data.Data.ResponseId,
									ClassSectionName: ($scope.feeSummary.SelectedClass == 0 || $scope.feeSummary.SelectedClass == null || $scope.feeSummary.SelectedClass == undefined ? "All" : $scope.feeSummary.SelectedClass.text),
									FromMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.FromMonthId).text,
									ToMonth: mx($scope.MonthList).firstOrDefault(p1 => p1.id == $scope.feeSummary.ToMonthId).text,
									ForStudent: "",
									FeeItemName: ($scope.feeSummary.FeeItemIdColl == 0 || $scope.feeSummary.FeeItemIdColl == null || $scope.feeSummary.FeeItemIdColl == undefined ? "All" : mx($scope.FeeItemList).firstOrDefault(p1 => p1.FeeItemId == $scope.feeSummary.FeeItemIdColl).Name)
								};
								var paraQuery = param(rptPara);

								document.body.style.cursor = 'wait';
								document.getElementById("frmRpt").src = '';
								document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
								document.body.style.cursor = 'default';
								$('#FrmPrintReport').modal('show');

							} else
								Swal.fire('No Templates found for print');

						}, function (errormessage) {
							hidePleaseWait();
							$scope.loadingstatus = "stop";
							Swal.fire(errormessage);
						});

					}

				} else
					Swal.fire('No Templates found for print');
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.getFeeSummaryClassWise = function () {
		if ($scope.classWise.SelectedFromMonth && $scope.classWise.SelectedToMonth && $scope.classWise.RptTranId) {

			var EntityId = entityFeeSummaryClassWise;

			var rptPara = {
				fromMonthId: $scope.classWise.SelectedFromMonth.id,
				toMonthId: $scope.classWise.SelectedToMonth.id,
				fromMonth: $scope.classWise.SelectedFromMonth.text,
				toMonth: $scope.classWise.SelectedToMonth.text,
				forStudent: $scope.classWise.ForStudent,
				rptTranId: $scope.classWise.RptTranId
			};
			var paraQuery = param(rptPara);

			$scope.loadingstatus = 'running';
			document.getElementById("frmRptClassWise").src = '';
			document.getElementById("frmRptClassWise").style.width = '100%';
			document.getElementById("frmRptClassWise").style.height = '1300px';
			document.getElementById("frmRptClassWise").style.visibility = 'visible';
			document.getElementById("frmRptClassWise").src = base_url + "Fee/Report/RptFeeSummaryClassWise?" + paraQuery;

		}
	};

	$scope.getFeeSummaryStudentWise = function () {
		if ($scope.studentWise.SelectedClass && $scope.studentWise.SelectedFromMonth && $scope.studentWise.SelectedToMonth && $scope.studentWise.RptTranId) {

			var EntityId = entityFeeSummaryStudentWise;

			var rptPara = {
				classId: $scope.studentWise.SelectedClass.ClassId,
				sectionId: $scope.studentWise.SelectedClass.SectionId ? $scope.studentWise.SelectedClass.SectionId : 0,
				classSec: $scope.studentWise.SelectedClass.text,
				fromMonthId: $scope.studentWise.SelectedFromMonth.id,
				toMonthId: $scope.studentWise.SelectedToMonth.id,
				fromMonth: $scope.studentWise.SelectedFromMonth.text,
				toMonth: $scope.studentWise.SelectedToMonth.text,
				forStudent: $scope.studentWise.ForStudent,
				rptTranId: $scope.studentWise.RptTranId
			};
			var paraQuery = param(rptPara);

			$scope.loadingstatus = 'running';
			document.getElementById("frmRptStudentWise").src = '';
			document.getElementById("frmRptStudentWise").style.width = '100%';
			document.getElementById("frmRptStudentWise").style.height = '1300px';
			document.getElementById("frmRptStudentWise").style.visibility = 'visible';
			document.getElementById("frmRptStudentWise").src = base_url + "Fee/Report/RptFeeSummaryStudentWise?" + paraQuery;

		}
	};

	$scope.SendSMS = function () {
		Swal.fire({
			title: 'Do you want to Send SMS To the filter data?',
			showCancelButton: true,
			confirmButtonText: 'Send',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				var para1 = {
					EntityId: entityFeeSummarySMS,
					ForATS: 3,
					TemplateType: 1
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/GetSENT",
					dataType: "json",
					data: JSON.stringify(para1)
				}).then(function (res) {
					if (res.data.IsSuccess && res.data.Data) {
						var templatesColl = res.data.Data;
						if (templatesColl && templatesColl.length > 0) {
							var templatesName = [];
							var sno = 1;
							angular.forEach(templatesColl, function (tc) {
								templatesName.push(sno + '-' + tc.Name);
								sno++;
							});

							var print = false;

							var rptTranId = 0;
							var selectedTemplate = null;
							if (templatesColl.length == 1) {
								rptTranId = templatesColl[0].TranId;
								selectedTemplate = templatesColl[0];
							}
							else {
								Swal.fire({
									title: 'Templates For SMS',
									input: 'select',
									inputOptions: templatesName,
									inputPlaceholder: 'Select a template',
									showCancelButton: true,
									inputValidator: (value) => {
										return new Promise((resolve) => {
											if (value >= 0) {
												resolve()
												rptTranId = templatesColl[value].TranId;
												selectedTemplate = templatesColl[value];

												if (rptTranId > 0) {
													var dataColl = [];
													$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
														var objEntity = node.data;
														var msg = selectedTemplate.Description;
														for (let x in objEntity) {
															var variable = '$$' + x.toLowerCase() + '$$';
															if (msg.indexOf(variable) >= 0) {
																var val = objEntity[x];
																msg = msg.replace(variable, val);
															}

															if (msg.indexOf('$$') == -1)
																break;
														}

														var newSMS = {
															EntityId: entityFeeSummarySMS,
															StudentId: objEntity.StudentId,
															UserId: objEntity.UserId,
															Title: selectedTemplate.Title,
															Message: msg,
															ContactNo: objEntity.F_ContactNo,
															StudentName: objEntity.Name
														};

														dataColl.push(newSMS);
													});

													print = true;

													$http({
														method: 'POST',
														url: base_url + "Global/SendSMSToStudent",
														dataType: "json",
														data: JSON.stringify(dataColl)
													}).then(function (sRes) {
														Swal.fire(sRes.data.ResponseMSG);
														if (sRes.data.IsSuccess && sRes.data.Data) {

														}
													});

												}

											} else {
												resolve('You need to select:)')
											}
										})
									}
								})
							}

							if (rptTranId > 0 && print == false) {
								var dataColl = [];

								$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
									var objEntity = node.data;
									var msg = selectedTemplate.Description;
									for (let x in objEntity) {
										var variable = '$$' + x.toLowerCase() + '$$';
										if (msg.indexOf(variable) >= 0) {
											var val = objEntity[x];
											msg = msg.replace(variable, val);
										}

										if (msg.indexOf('$$') == -1)
											break;
									}

									var newSMS = {
										EntityId: entityFeeSummarySMS,
										StudentId: objEntity.StudentId,
										UserId: objEntity.UserId,
										Title: selectedTemplate.Title,
										Message: msg,
										ContactNo: objEntity.F_ContactNo,
										StudentName: objEntity.Name
									};

									dataColl.push(newSMS);
								});
								print = true;

								$http({
									method: 'POST',
									url: base_url + "Global/SendSMSToStudent",
									dataType: "json",
									data: JSON.stringify(dataColl)
								}).then(function (sRes) {
									Swal.fire(sRes.data.ResponseMSG);
									if (sRes.data.IsSuccess && sRes.data.Data) {

									}
								});

							}

						} else
							Swal.fire('No Templates found for SMS');
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};
	$scope.SendSMSFromMobile = function () {

		Swal.fire({
			title: 'Do you want to Send SMS From Mobile To the filter data?',
			showCancelButton: true,
			confirmButtonText: 'Send',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				var para1 = {
					EntityId: entityFeeSummarySMS,
					ForATS: 3,
					TemplateType: 1
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/GetSENT",
					dataType: "json",
					data: JSON.stringify(para1)
				}).then(function (res) {
					if (res.data.IsSuccess && res.data.Data) {
						var templatesColl = res.data.Data;
						if (templatesColl && templatesColl.length > 0) {
							var templatesName = [];
							var sno = 1;
							angular.forEach(templatesColl, function (tc) {
								templatesName.push(sno + '-' + tc.Name);
								sno++;
							});

							var print = false;

							var rptTranId = 0;
							var selectedTemplate = null;
							if (templatesColl.length == 1) {
								rptTranId = templatesColl[0].TranId;
								selectedTemplate = templatesColl[0];
							}
							else {
								Swal.fire({
									title: 'Templates For SMS',
									input: 'select',
									inputOptions: templatesName,
									inputPlaceholder: 'Select a template',
									showCancelButton: true,
									inputValidator: (value) => {
										return new Promise((resolve) => {
											if (value >= 0) {
												resolve()
												rptTranId = templatesColl[value].TranId;
												selectedTemplate = templatesColl[value];

												if (rptTranId > 0) {
													var dataColl = [];
													$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
														var objEntity = node.data;
														var msg = selectedTemplate.Description;
														for (let x in objEntity) {
															var variable = '$$' + x.toLowerCase() + '$$';
															if (msg.indexOf(variable) >= 0) {
																var val = objEntity[x];
																msg = msg.replace(variable, val);
															}

															if (msg.indexOf('$$') == -1)
																break;
														}

														var newSMS = {
															EntityId: entityFeeSummarySMS,
															StudentId: objEntity.StudentId,
															UserId: objEntity.UserId,
															Title: selectedTemplate.Title,
															Message: msg,
															ContactNo: objEntity.F_ContactNo,
															StudentName: objEntity.Name
														};

														dataColl.push(newSMS);
													});
													print = true;

													$http({
														method: 'POST',
														url: base_url + "Global/SendSMSFromMobileToStudent",
														dataType: "json",
														data: JSON.stringify(dataColl)
													}).then(function (sRes) {
														Swal.fire(sRes.data.ResponseMSG);
														if (sRes.data.IsSuccess && sRes.data.Data) {

														}
													});

												}

											} else {
												resolve('You need to select:)')
											}
										})
									}
								})
							}

							if (rptTranId > 0 && print == false) {
								var dataColl = [];

								$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
									var objEntity = node.data;
									var msg = selectedTemplate.Description;
									for (let x in objEntity) {
										var variable = '$$' + x.toLowerCase() + '$$';
										if (msg.indexOf(variable) >= 0) {
											var val = objEntity[x];
											msg = msg.replace(variable, val);
										}

										if (msg.indexOf('$$') == -1)
											break;
									}

									var newSMS = {
										EntityId: entityFeeSummarySMS,
										StudentId: objEntity.StudentId,
										UserId: objEntity.UserId,
										Title: selectedTemplate.Title,
										Message: msg,
										ContactNo: objEntity.F_ContactNo,
										StudentName: objEntity.Name
									};

									dataColl.push(newSMS);
								});
								print = true;

								$http({
									method: 'POST',
									url: base_url + "Global/SendSMSFromMobileToStudent",
									dataType: "json",
									data: JSON.stringify(dataColl)
								}).then(function (sRes) {
									Swal.fire(sRes.data.ResponseMSG);
									if (sRes.data.IsSuccess && sRes.data.Data) {

									}
								});

							}

						} else
							Swal.fire('No Templates found for SMS');
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};
	$scope.SendNotification = function () {
		Swal.fire({
			title: 'Do you want to Send Notification To the filter data?',
			showCancelButton: true,
			confirmButtonText: 'Send',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {

				var para1 = {
					EntityId: entityFeeSummarySMS,
					ForATS: 3,
					TemplateType: 3
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/GetSENT",
					dataType: "json",
					data: JSON.stringify(para1)
				}).then(function (res) {
					if (res.data.IsSuccess && res.data.Data) {
						var templatesColl = res.data.Data;
						if (templatesColl && templatesColl.length > 0) {
							var templatesName = [];
							var sno = 1;
							angular.forEach(templatesColl, function (tc) {
								templatesName.push(sno + '-' + tc.Name);
								sno++;
							});

							var print = false;

							var rptTranId = 0;
							var selectedTemplate = null;
							if (templatesColl.length == 1) {
								rptTranId = templatesColl[0].TranId;
								selectedTemplate = templatesColl[0];
							}
							else {
								Swal.fire({
									title: 'Templates For Notification',
									input: 'select',
									inputOptions: templatesName,
									inputPlaceholder: 'Select a template',
									showCancelButton: true,
									inputValidator: (value) => {
										return new Promise((resolve) => {
											if (value >= 0) {
												resolve()
												rptTranId = templatesColl[value].TranId;
												selectedTemplate = templatesColl[value];

												if (rptTranId > 0) {
													var dataColl = [];
													$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
														var objEntity = node.data;
														var msg = selectedTemplate.Description;
														for (let x in objEntity) {
															var variable = '$$' + x.toLowerCase() + '$$';
															if (msg.indexOf(variable) >= 0) {
																var val = objEntity[x];
																msg = msg.replace(variable, val);
															}

															if (msg.indexOf('$$') == -1)
																break;
														}

														var newSMS = {
															EntityId: entityFeeSummarySMS,
															StudentId: objEntity.StudentId,
															UserId: objEntity.UserId,
															Title: selectedTemplate.Title,
															Message: msg,
															ContactNo: objEntity.F_ContactNo,
															StudentName: objEntity.Name
														};

														dataColl.push(newSMS);
													});
													print = true;

													$http({
														method: 'POST',
														url: base_url + "Global/SendNotificationToStudent",
														dataType: "json",
														data: JSON.stringify(dataColl)
													}).then(function (sRes) {
														Swal.fire(sRes.data.ResponseMSG);
														if (sRes.data.IsSuccess && sRes.data.Data) {

														}
													});

												}

											} else {
												resolve('You need to select:)')
											}
										})
									}
								})
							}

							if (rptTranId > 0 && print == false) {
								var dataColl = [];

								$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
									var objEntity = node.data;
									var msg = selectedTemplate.Description;
									for (let x in objEntity) {
										var variable = '$$' + x.toLowerCase() + '$$';
										if (msg.indexOf(variable) >= 0) {
											var val = objEntity[x];
											msg = msg.replace(variable, val);
										}

										if (msg.indexOf('$$') == -1)
											break;
									}

									var newSMS = {
										EntityId: entityFeeSummarySMS,
										StudentId: objEntity.StudentId,
										UserId: objEntity.UserId,
										Title: selectedTemplate.Title,
										Message: msg,
										ContactNo: objEntity.F_ContactNo,
										StudentName: objEntity.Name
									};

									dataColl.push(newSMS);
								});
								print = true;

								$http({
									method: 'POST',
									url: base_url + "Global/SendNotificationToStudent",
									dataType: "json",
									data: JSON.stringify(dataColl)
								}).then(function (sRes) {
									Swal.fire(sRes.data.ResponseMSG);
									if (sRes.data.IsSuccess && sRes.data.Data) {

									}
								});

							}

						} else
							Swal.fire('No Templates found for Notification');
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}
		});
	};


	$scope.getFeeMappingStudent = function () {

		$scope.loadingstatus = "running";
		var tmpColl = [];
		$scope.gridOptions44.api.setRowData(tmpColl);

		showPleaseWait();
		var para = {
			ClassIdColl: ($scope.feeMappingStudent.ClassIdColl ? $scope.feeMappingStudent.ClassIdColl.toString() : ''),
			FeeItemIdColl: ($scope.feeMappingStudent.FeeItemIdColl ? $scope.feeMappingStudent.FeeItemIdColl.toString() : ''),
			For: ($scope.feeMappingStudent.For ? $scope.feeMappingStudent.For : 0)
		};

		$http({
			method: 'POST',
			url: base_url + "Fee/Report/GetFeeMappingStudent",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				$scope.gridOptions44.api.setRowData(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.PrintFeeMappingStudent = function () {
		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityFeeMappingStudent + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var templatesColl = res.data.Data;
				if (templatesColl && templatesColl.length > 0) {
					var templatesName = [];
					var sno = 1;
					angular.forEach(templatesColl, function (tc) {
						templatesName.push(sno + '-' + tc.ReportName);
						sno++;
					});

					var print = false;

					var rptTranId = 0;
					if (templatesColl.length == 1)
						rptTranId = templatesColl[0].RptTranId;
					else {
						Swal.fire({
							title: 'Report Templates For Print',
							input: 'select',
							inputOptions: templatesName,
							inputPlaceholder: 'Select a template',
							showCancelButton: true,
							inputValidator: (value) => {
								return new Promise((resolve) => {
									if (value >= 0) {
										resolve()
										rptTranId = templatesColl[value].RptTranId;

										if (rptTranId > 0) {
											var dataColl = [];
											$scope.gridOptions44.api.forEachNodeAfterFilterAndSort(function (node) {
												dataColl.push(node.data);
											});
											print = true;
											$http({
												method: 'POST',
												url: base_url + "Fee/Report/PrintFeeMappingStudent",
												headers: { 'Content-Type': undefined },

												transformRequest: function (data) {

													var formData = new FormData();
													formData.append("jsonData", angular.toJson(data.jsonData));

													return formData;
												},
												data: { jsonData: dataColl }
											}).then(function (res) {

												$scope.loadingstatus = "stop";
												hidePleaseWait();
												if (res.data.IsSuccess && res.data.Data) {


													var rptPara = {
														rpttranid: rptTranId,
														istransaction: false,
														entityid: entityFeeMappingStudent,
														voucherid: 0,
														tranid: 0,
														vouchertype: 0,
														sessionid: res.data.Data.ResponseId,
													};
													var paraQuery = param(rptPara);

													document.body.style.cursor = 'wait';
													document.getElementById("frmRpt").src = '';
													document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
													document.body.style.cursor = 'default';
													$('#FrmPrintReport').modal('show');

												} else
													Swal.fire('No Templates found for print');

											}, function (errormessage) {
												hidePleaseWait();
												$scope.loadingstatus = "stop";
												Swal.fire(errormessage);
											});

										}

									} else {
										resolve('You need to select:)')
									}
								})
							}
						})
					}

					if (rptTranId > 0 && print == false) {
						var dataColl = [];
						$scope.gridOptions44.api.forEachNodeAfterFilterAndSort(function (node) {
							dataColl.push(node.data);
						});
						print = true;

						$http({
							method: 'POST',
							url: base_url + "Fee/Report/PrintFeeMappingStudent",
							headers: { 'Content-Type': undefined },

							transformRequest: function (data) {

								var formData = new FormData();
								formData.append("jsonData", angular.toJson(data.jsonData));

								return formData;
							},
							data: { jsonData: dataColl }
						}).then(function (res) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							if (res.data.IsSuccess && res.data.Data) {

								var rptPara = {
									rpttranid: rptTranId,
									istransaction: false,
									entityid: entityFeeMappingStudent,
									voucherid: 0,
									tranid: 0,
									vouchertype: 0,
									sessionid: res.data.Data.ResponseId
								};
								var paraQuery = param(rptPara);

								document.body.style.cursor = 'wait';
								document.getElementById("frmRpt").src = '';
								document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
								document.body.style.cursor = 'default';
								$('#FrmPrintReport').modal('show');

							} else
								Swal.fire('No Templates found for print');

						}, function (errormessage) {
							hidePleaseWait();
							$scope.loadingstatus = "stop";
							Swal.fire(errormessage);
						});

					}

				} else
					Swal.fire('No Templates found for print');
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.onFilterTextBoxChanged44 = function () {
		$scope.gridOptions44.api.setQuickFilter($scope.search44);
	}

	$scope.ExportFeeMappingAsCSV = function () {
		var params = {
			fileName: 'feeSummary.csv',
			sheetName: 'feeSummary'
		};
		$scope.gridOptions44.api.exportDataAsCsv(params);
	}


	//Added By Suresh on Magh 22 Starts from here

	$scope.getSiblingFeeSummary = function () {		
		$scope.dataForBottomGridSib = [];	

		if ($scope.SibfeeSummary.PeriodAs == 1) {
			$scope.SibfeeSummary.DateFrom_TMP = null;
			$scope.SibfeeSummary.DateTo_TMP = null;
			if ($scope.SibfeeSummary.FromMonthId > 0 && $scope.SibfeeSummary.ToMonthId > 0) {

			} else {
				//Swal.fire('Please ! Select Month Period');
				return;
			}
		} else if ($scope.SibfeeSummary.PeriodAs == 2) {
			if (!$scope.SibfeeSummary.DateFromDet || !$scope.SibfeeSummary.DateToDet) {
				//Swal.fire('Please ! Select DateFrom/To');
				return;
			}
		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			fromMonthId: ($scope.SibfeeSummary.PeriodAs == 1 ? $scope.SibfeeSummary.FromMonthId : 0),
			toMonthId: ($scope.SibfeeSummary.PeriodAs == 1 ? $scope.SibfeeSummary.ToMonthId : 0),
			forStudent: $scope.SibfeeSummary.ForStudent,
			feeItemIdColl: $scope.SibfeeSummary.FeeItemIdColl,
			classId: $scope.SibfeeSummary.SelectedClass ? $scope.SibfeeSummary.SelectedClass.ClassId : 0,
			sectionId: $scope.SibfeeSummary.SelectedClass ? $scope.SibfeeSummary.SelectedClass.SectionId : 0,
			batchId: $scope.SibfeeSummary.BatchId,
			semesterId: $scope.SibfeeSummary.SemesterId,
			classYearId: $scope.SibfeeSummary.ClassYearId,
			ForPaymentFollowup: false,
			FollowupType: 0,
			dateFrom: ($scope.SibfeeSummary.PeriodAs == 2 ? $filter('date')(new Date($scope.SibfeeSummary.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			dateTo: ($scope.SibfeeSummary.PeriodAs == 2 ? $filter('date')(new Date($scope.SibfeeSummary.DateToDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "Fee/Report/GetFeeSummary",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				$scope.DataColl = mx(res.data.Data);
				var query = $scope.DataColl.groupBy(t => ({ ParentStudentId: t.ParentStudentId }));
				angular.forEach(query, function (q) {
					/*	var fst = q.elements[0];*/
					var fst = q.elements.find(item => item.StudentId === item.ParentStudentId) || q.elements[0];

					var totalFutureDR = q.elements.reduce((sum, item) => sum + (item.FutureDR || 0), 0);
					var totalFutureCR = q.elements.reduce((sum, item) => sum + (item.FutureCR || 0), 0);
					var totalDues = q.elements.reduce((sum, item) => sum + (item.TotalDues || 0), 0);
					var totalOpening = q.elements.reduce((sum, item) => sum + (item.Opening || 0), 0);
					var totalDrTotal = q.elements.reduce((sum, item) => sum + (item.DrTotal || 0), 0);
					var totalCredit = q.elements.reduce((sum, item) => sum + (item.TotalCredit || 0), 0);
					var crDiscountAmt = q.elements.reduce((sum, item) => sum + (item.CrDiscountAmt || 0), 0);
					var futureDues = q.elements.reduce((sum, item) => sum + (item.FutureDues || 0), 0);
					var lastReceiptAmt = q.elements.reduce((sum, item) => sum + (item.LastReceiptAmt || 0), 0);

					var beData = {
						AutoNumber: fst.AutoNumber,
						UserId: fst.UserId,
						RegdNo: fst.RegdNo,
						RollNo: fst.RollNo,
						ClassName: fst.ClassName,
						SectionName: fst.SectionName,
						Batch: fst.Batch,
						Faculty: fst.Faculty,
						Level: fst.Level,
						Semester: fst.Semester,
						ClassYear: fst.ClassYear,
						Name: fst.Name,
						FeeItemName: fst.FeeItemName,

						FatherName: fst.FatherName,
						F_ContactNo: fst.F_ContactNo,
						MotherName: fst.MotherName,
						M_ContactNo: fst.M_ContactNo,
						Address: fst.Address,
						IsNewStudent: fst.IsNewStudent,
						IsTransport: fst.IsTransport,
						IsHostel: fst.IsHostel,
						IsLeft: fst.IsLeft,
						LeftMiti: fst.LeftMiti,
						LeftReason: fst.LeftReason,
						PointName: fst.PointName,
						RouteName: fst.RouteName,
						BoardersName: fst.BoardersName,
						CardNo: fst.CardNo,
						EnrollNo: fst.EnrollNo,
						LedgerPanaNo: fst.LedgerPanaNo,
						LastReceiptMiti: fst.LastReceiptMiti,
						LastReceiptNo: fst.LastReceiptNo,
						Email: fst.Email,
						HouseName: fst.HouseName,
						HouseDress: fst.HouseDress,
						VehicleName: fst.VehicleName,
						VehicleNumber: fst.VehicleNumber,
						ParentStudentId: fst.ParentStudentId,

						FutureDR: totalFutureDR,
						FutureCR: totalFutureCR,
						Opening: totalOpening,
						DrTotal: totalDrTotal,
						TotalCredit: totalCredit,
						CrDiscountAmt: crDiscountAmt,
						FutureDues: futureDues,
						TotalDues: totalDues,
						LastReceiptAmt: lastReceiptAmt
					};

					$scope.dataForBottomGridSib.push(beData);


				});
				$scope.gridOptionsSib.api.setRowData($scope.dataForBottomGridSib);
				calculateBottomGridTotals();

				//var DataColl = mx(res.data.Data);
				//$scope.dataForBottomGrid[0].Opening = DataColl.sum(p1 => p1.Opening);
				//$scope.dataForBottomGrid[0].DrTotal = DataColl.sum(p1 => p1.DrTotal);
				//$scope.dataForBottomGrid[0].TotalCredit = DataColl.sum(p1 => p1.TotalCredit);
				//$scope.dataForBottomGrid[0].CrDiscountAmt = DataColl.sum(p1 => p1.CrDiscountAmt);
				//$scope.dataForBottomGrid[0].TotalDues = DataColl.sum(p1 => p1.TotalDues);

				//$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);


				//$scope.gridOptions.api.setRowData(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	function calculateBottomGridTotals() {
		var totalRow = {
			Name: 'TOTAL =>',
			FutureDR: 0,
			FutureCR: 0,
			Opening: 0,
			DrTotal: 0,
			TotalCredit: 0,
			CrDiscountAmt: 0,
			FutureDues: 0,
			TotalDues: 0,
			LastReceiptAmt: 0
		};

		$scope.dataForBottomGridSib.forEach(item => {
			totalRow.FutureDR += item.FutureDR || 0;
			totalRow.FutureCR += item.FutureCR || 0;
			totalRow.Opening += item.Opening || 0;
			totalRow.DrTotal += item.DrTotal || 0;
			totalRow.TotalCredit += item.TotalCredit || 0;
			totalRow.CrDiscountAmt += item.CrDiscountAmt || 0;
			totalRow.FutureDues += item.FutureDues || 0;
			totalRow.TotalDues += item.TotalDues || 0;
			totalRow.LastReceiptAmt += item.LastReceiptAmt || 0;
		});

		// Update bottom grid with totals
		$scope.gridOptionsBottomSib.api.setRowData([totalRow]);
	}
});