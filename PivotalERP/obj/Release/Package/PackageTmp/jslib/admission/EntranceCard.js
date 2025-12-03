

app.controller('EntranceCardController', function ($scope, $http, $timeout, $filter, $rootScope, $translate, GlobalServices, FileSaver) {
	$scope.Title = 'Entrance Card';

	var gSrv = GlobalServices;
	getterAndSetter();

	$scope.PrintHtmlForm = function () {

		$('#admission-enquiry-form').printThis({
			importCSS: true,
			importStyle: true,
			formValues: true,
			//header: "<h1>Look at all of my kitties!</h1>"
		});

	}

	

	
	//$scope.GetEnqSummaryList = function () {
	//	$scope.loadingstatus = "running";
	//	showPleaseWait();

	//	if ($scope.newEnquiry.ToDateDet && $scope.newEnquiry.FromDateDet) {
	//		var para = {
	//			dateFrom: $filter('date')(new Date($scope.newEnquiry.FromDateDet.dateAD), 'yyyy-MM-dd'),
	//			dateTo: $filter('date')(new Date($scope.newEnquiry.ToDateDet.dateAD), 'yyyy-MM-dd')
	//		}
	//		$http({
	//			method: 'POST',
	//			url: base_url + "FrontDesk/Transaction/GetEnqSummary",
	//			dataType: "json",
	//			data: JSON.stringify(para)
	//		}).then(function (res) {
	//			hidePleaseWait();
	//			$scope.loadingstatus = "stop";
	//			if (res.data.IsSuccess) {
	//				$scope.gridOptions.data = res.data.Data;
	//			} else {
	//				Swal.fire(res.data.ResponseMSG);
	//			}
	//		}, function (reason) {
	//			Swal.fire('Failed' + reason);
	//		});
	//	}
	//}


	function getterAndSetter() {
		$scope.gridOptions = [];
		$scope.gridOptions = {
			showGridFooter: true,
			showColumnFooter: false,
			useExternalPagination: false,
			useExternalSorting: false,
			enableFiltering: true,
			enableSorting: true,
			enableRowSelection: true,
			enableSelectAll: true,
			enableGridMenu: true,

			columnDefs: [
				{ name: "SNo", displayName: "S.No.", minWidth: 90, headerCellClass: 'headerAligment', cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>' },
				{
					name: "Enquiry/Reg No.",
					width: 150, field: "EnquiryId",
					cellTemplate: '<div class="ui-grid-cell-contents">' +
						'{{ row.entity.EnquiryId || "" }} {{ row.entity.RegId || "" }}' +
						'</div>'
				},
				{ name: "Status", displayName: "Status", minWidth: 100, headerCellClass: 'headerAligment' },
				{ name: "Sourse", displayName: "Sourse", minWidth: 150, headerCellClass: 'headerAligment' },
				{ name: "EntryDate", displayName: "Enquiry Date", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "Name", displayName: "Name", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "Gender", displayName: "Gender", minWidth: 100, headerCellClass: 'headerAligment' },
				{ name: "ClassName", displayName: "For Class", minWidth: 140, headerCellClass: 'headerAligment' },			
				{
					name: "DOB_AD", displayName: "DOB(AD)", minWidth: 140, headerCellClass: 'headerAligment',
					cellTemplate: '<div>{{row.entity.DOB_AD |dateFormat}}</div>',
				},
				{ name: "DOB_BS", displayName: "DOB(BS)", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "ContactNo", displayName: "ContactNo", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "Email", displayName: "Email", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "Address", displayName: "Address", minWidth: 160, headerCellClass: $scope.highlightFilteredHeader, headerCellClass: 'headerAligment' },		
				{ name: "ExamName", displayName: "Exam Name", minWidth: 110, headerCellClass: 'headerAligment' },
				{ name: "ExamDate", displayName: "Exam Date", minWidth: 110, headerCellClass: 'headerAligment' },
				{ name: "ExamTime", displayName: "Exam Time", minWidth: 110, headerCellClass: 'headerAligment' },
				{ name: "SymbolNo", displayName: "SymbolNo", minWidth: 140, headerCellClass: 'headerAligment' },
				{ name: "Venue", displayName: "Venue", minWidth: 140, headerCellClass: 'headerAligment' },				
				{ name: "PaymentStatus", displayName: "Payment Status", minWidth: 140, headerCellClass: 'headerAligment' },
				
			],
			//   rowTemplate: rowTemplate(),
			exporterCsvFilename: 'enqSummary.csv',
			exporterPdfDefaultStyle: { fontSize: 9 },
			exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
			exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'blue' },
			exporterPdfHeader: { text: "Dynamic Technosoft Pvt. Ltd. <br> Birgunj Nepal", style: 'headerStyle' },
			exporterPdfFooter: function (currentPage, pageCount) {
				return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function (docDefinition) {
				docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
				docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
				return docDefinition;
			},
			exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			exporterExcelFilename: 'enqSummary.xlsx',
			exporterExcelSheetName: 'enqSummary',
			onRegisterApi: function (gridApi) {
				$scope.gridApi = gridApi;
			}
		};
	};

	$scope.GetEnqSummaryList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		if ($scope.newEnquiry.ToDateDet && $scope.newEnquiry.FromDateDet) {
			var para = {
				DateFrom: $filter('date')(new Date($scope.newEnquiry.FromDateDet.dateAD), 'yyyy-MM-dd'),
				DateTo: $filter('date')(new Date($scope.newEnquiry.ToDateDet.dateAD), 'yyyy-MM-dd')
			}
			$http({
				method: 'POST',
				url: base_url + "AdmissionManagement/Creation/GetDataForEntranceCard",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess) {
					$scope.gridOptions.data = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	}

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.ComDet = {};


		GlobalServices.getCompanyDet().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ComDet = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$timeout(function () {
			//Add by prashant Chaitra 26
			$scope.SubjectList = [];
			GlobalServices.getSubjectList().then(function (res) {
				$scope.SubjectList = res.data.Data;
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
			//Add by prashant End

			gSrv.getClassList().then(function (res) {
				$scope.ClassList = res.data.Data;			

				$scope.GetEntranceConfig();

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});

		$scope.newCompanyDetails = {};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetCompanyDet",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newCompanyDet = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.Logo = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllAboutUsList",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.Logo = res.data.Data[0];
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.currentPages = {
			Enquiry: 1,			
		};

		$scope.searchData = {
			Enquiry: ''		
		};

		$scope.newEnquiry = {			
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date()
		};

        $scope.newDet = {
            ExamName: '',
            ExamDate_TMP: new Date(),
            StartTime: '',
            EndTime: '',
            Venue: '',
            ForClassWise: false,
            ClassWiseEntranceSetupList: [],
            ExamRules: '',
            ResultDate_TMP: new Date(),
            Subject: '',
            FullMarks: 0,
            PassMarks: 0,
            Mode: 'Save'
		};

		//For Symboll No.

		$scope.ClassSection = {};
		GlobalServices.getClassSectionList().then(function (res) {
			$scope.ClassSection = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.newSymbolNumber = {
			SymbolNumberId: null,
			StartNo: 1,
			StartAlpha: '',
			PadWidth: 0,
			Prefix: '',
			Suffix: '',
			ExamTypeId: null,
			Mode: 'Save'
		};

	};

	//For Symbol No Start
	$scope.ClearSymbolNumber = function () {
		$scope.newSymbolNumber = {
			SymbolNumberId: null,
			StartNo: 1,
			StartAlpha: '',
			PadWidth: 0,
			Prefix: '',
			Suffix: '',
			ExamTypeId: null,
			Mode: 'Save'
		};
    }

	$scope.GetEntranceSymbolNo = function () {

		
		$scope.newSymbolNumber.StudentList = [];
		if ($scope.newSymbolNumber.ClassId) {

			var para = {
				ClassId: $scope.newSymbolNumber.ClassId === 0 ? null : $scope.newSymbolNumber.ClassId ?? null,
			};
			$http({
				method: 'POST',
				url: base_url + "AdmissionManagement/Creation/GetEntranceSymbolNo",
				dataSchedule: "json",
				data: JSON.stringify(para)
			}).then(function (res1) {
				if (res1.data.IsSuccess && res1.data.Data) {
					$scope.newSymbolNumber.StudentList = res1.data.Data;

				} else {
					Swal.fire(res1.data.ResponseMSG);
				}
			});
		}

	};



	$scope.AutoGenerateSymbolNo = function () {

		if ($scope.newSymbolNumber) {
			var startNo = parseInt($scope.newSymbolNumber.StartNo);
			var pad = $scope.newSymbolNumber.PadWidth;
			if (isNaN(startNo))
				startNo = 0;

			var startAlpha = $scope.newSymbolNumber.StartAlpha;

			var tmpDataColl = $scope.newSymbolNumber.StudentList;// $filter('orderBy')($scope.newSymbolNumber.StudentList, $scope.sortKey, $scope.reverse);

			angular.forEach(tmpDataColl, function (st) {
				st.SymbolNo = $scope.newSymbolNumber.Prefix + startNo.toString().padStart(pad, '0') + $scope.newSymbolNumber.Suffix + (startAlpha ? startAlpha : '');
				startNo++;

				if (startAlpha)
					startAlpha = nextChar(startAlpha);
			});
		}

	};

	function nextChar(c) {
		var u = c.toUpperCase();
		if (same(u, 'Z')) {
			var txt = '';
			var i = u.length;
			while (i--) {
				txt += 'A';
			}
			return 'A';
			//return (txt + 'A');
		} else {
			var p = "";
			var q = "";
			if (u.length > 1) {
				p = u.substring(0, u.length - 1);
				q = String.fromCharCode(p.slice(-1).charCodeAt(0));
			}
			var l = u.slice(-1).charCodeAt(0);
			var z = nextLetter(l);

			return z;
			//if (z === 'A') {
			//	return p.slice(0, -1) + nextLetter(q.slice(-1).charCodeAt(0)) + z;
			//} else {
			//	return p + z;
			//}
		}
	}

	function nextLetter(l) {
		if (l < 90) {
			return String.fromCharCode(l + 1);
		}
		else {
			return 'A';
		}
	}

	function same(str, char) {
		var i = str.length;
		while (i--) {
			if (str[i] !== char) {
				return false;
			}
		}
		return true;
	}

	$scope.SaveUpdateSymbolNumber = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var tmpData = [];

		angular.forEach($scope.newSymbolNumber.StudentList, function (st) {

			var newData = {
				EnquiryNo: (st.EnquiryId !== null && st.EnquiryId !== undefined) ? st.EnquiryId : cs.RegId,
				Prefix: $scope.newSymbolNumber.Prefix,
				Suffix: $scope.newSymbolNumber.Suffix,
				StartNumber: $scope.newSymbolNumber.StartNo,
				StartAlpha: $scope.newSymbolNumber.StartAlpha,
				PadWith: $scope.newSymbolNumber.PadWidth,
				SymbolNo: st.SymbolNo
			}
			tmpData.push(newData);
		});
		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/Creation/SaveEntranceSymbolNo",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: tmpData }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearSymbolNumber();
				$scope.GetEntranceSymbolNo();

			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}



    //For Symbol No End

	$scope.validateFullAndPassMarks = function (newDet) {
		if (newDet.FullMarks != null && newDet.PassMarks != null && newDet.FullMarks <= newDet.PassMarks) {
			Swal.fire({
				icon: 'error',
				title: 'Invalid Marks',
				text: 'Full Marks must be greater than Pass Marks.'
			});
		}
	};

	$scope.validateExamAndResultDate = function (newDet) {
		if (newDet.ExamDateDet && newDet.ResultDateDet) {
			let examDate = new Date(newDet.ExamDateDet.year, newDet.ExamDateDet.month - 1, newDet.ExamDateDet.day);
			let resultDate = new Date(newDet.ResultDateDet.year, newDet.ResultDateDet.month - 1, newDet.ResultDateDet.day);

			if (resultDate < examDate) {
				Swal.fire({
					icon: 'error',
					title: 'Invalid Date',
					text: 'Result Date cannot be before Exam Date.'
				});
			}
		}
	};

	$scope.validateStartAndEndTime = function (newDet) {
		if (newDet.StartTime_TMP && newDet.EndTime_TMP) {
			let startTime = new Date("1970-01-01T" + newDet.StartTime_TMP + ":00");
			let endTime = new Date("1970-01-01T" + newDet.EndTime_TMP + ":00");

			if (startTime >= endTime) {
				Swal.fire({
					icon: 'error',
					title: 'Invalid Time',
					text: 'Start Time must be before End Time.'
				});
			}
		}
	};




	$scope.IsValidConfig = function () {
		//if ($scope.newStudent.RegdPrefix.isEmpty()) {
		//	Swal.fire('Please ! Enter Regd. Prefix');
		//	return false;
		//}

		//if ($scope.newStudent.RegdSuffix.isEmpty()) {
		//	Swal.fire('Please ! Enter Regd. Suffix');
		//	return false;
		//}



		return true;
	}

	$scope.copyToClassWiseList = function () {
		if (!$scope.newDet.ForClassWise || !$scope.newDet.ClassWiseEntranceSetupList) return;

		$scope.newDet.ClassWiseEntranceSetupList.forEach(function (cl) {
			cl.ExamName = $scope.newDet.ExamName;
			cl.ExamDate_TMP = $scope.newDet.ExamDate_TMP;
			cl.ExamDateDet = angular.copy($scope.newDet.ExamDateDet);
			cl.StartTime_TMP = $scope.newDet.StartTime_TMP;
			cl.EndTime_TMP = $scope.newDet.EndTime_TMP;
			cl.ResultDate_TMP = $scope.newDet.ResultDate_TMP;
			cl.ResultDateDet = angular.copy($scope.newDet.ResultDateDet);
			cl.ResultTime_TMP = $scope.newDet.ResultTime_TMP;
			cl.SubjectColl = angular.copy($scope.newDet.SubjectColl);
			cl.FullMarks = $scope.newDet.FullMarks;
			cl.PassMarks = $scope.newDet.PassMarks;
			cl.Venue = $scope.newDet.Venue;
		});
	};


	$scope.SaveUpdateSetup = function () {
		if ($scope.IsValidConfig() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEntranceSetup();
					}
				});
			} else
				$scope.CallSaveUpdateEntranceSetup();

		}
	};

	
	$scope.CallSaveUpdateEntranceSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newDet.ExamDateDet)
			$scope.newDet.ExamDate = $filter('date')(new Date($scope.newDet.ExamDateDet.dateAD), 'yyyy-MM-dd');

		if ($scope.newDet.StartTime_TMP)
			$scope.newDet.StartTime = $scope.newDet.StartTime_TMP.toLocaleString();


		if ($scope.newDet.EndTime_TMP)
			$scope.newDet.EndTime = $scope.newDet.EndTime_TMP.toLocaleString();

		angular.forEach($scope.newDet.ClassWiseEntranceSetupList, function (cl) {
			if (cl.ExamDateDet) {
				cl.ExamDate = $filter('date')(new Date(cl.ExamDateDet.dateAD), 'yyyy-MM-dd');
			}

			if (cl.StartTime_TMP)
				cl.StartTime = cl.StartTime_TMP.toLocaleString();

			if (cl.EndTime_TMP)
				cl.EndTime = cl.EndTime_TMP.toLocaleString();

			//Add by prashnt Chaitra 26
			if (cl.ResultDateDet && cl.ResultTime_TMP) {
				// Extract date from ResultDateDet
				const datePart = new Date(cl.ResultDateDet.dateAD);
				// Extract time from ResultTime_TMP
				const timePart = new Date(cl.ResultTime_TMP);
				// Combine date and time into a single Date object
				const combinedDateTime = new Date(
					datePart.getFullYear(),
					datePart.getMonth(),
					datePart.getDate(),
					timePart.getHours(),
					timePart.getMinutes(),
					timePart.getSeconds()
				);

				// Format the combined date and time
				cl.ResultDate = $filter('date')(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');
			} else {
				cl.ResultDate = null;
			}

			if (cl.SubjectColl)
				cl.Subject = cl.SubjectColl.toString();
			else
				cl.Subject = '';

		});

		//Add by prashnt Chaitra 26
		if ($scope.newDet.ResultDateDet && $scope.newDet.ResultTime_TMP) {
			// Extract date from ResultDateDet
			const datePart = new Date($scope.newDet.ResultDateDet.dateAD);
			// Extract time from ResultTime_TMP
			const timePart = new Date($scope.newDet.ResultTime_TMP);
			// Combine date and time into a single Date object
			const combinedDateTime = new Date(
				datePart.getFullYear(),
				datePart.getMonth(),
				datePart.getDate(),
				timePart.getHours(),
				timePart.getMinutes(),
				timePart.getSeconds()
			);

			// Format the combined date and time
			$scope.newDet.ResultDate = $filter('date')(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');
		} else {
			$scope.newDet.ResultDate = null;
		}

		if ($scope.newDet.SubjectColl)
			$scope.newDet.Subject = $scope.newDet.SubjectColl.toString();
		else
			$scope.newDet.Subject = '';

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/Creation/SaveEntranceSetup",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetEntranceConfig = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/Creation/GetEntranceSetup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;

				if ($scope.newDet.ExamDate)
					$scope.newDet.ExamDate_TMP = new Date($scope.newDet.ExamDate);

				if ($scope.newDet.StartTime)
					$scope.newDet.StartTime_TMP = new Date($scope.newDet.StartTime);

				if ($scope.newDet.EndTime)
					$scope.newDet.EndTime_TMP = new Date($scope.newDet.EndTime);


				var cRankList = mx($scope.newDet.ClassWiseEntranceSetupList);
				$scope.newDet.ClassWiseEntranceSetupList = [];
				angular.forEach($scope.ClassList, function (cl) {
					var find = cRankList.firstOrDefault(p1 => p1.ClassId == cl.ClassId);
					var subjectArray = [];
					if (find && find.Subject) {
						subjectArray = find.Subject.split(',').map(Number);
					}
					$scope.newDet.ClassWiseEntranceSetupList.push({
						ClassId: cl.ClassId,
						text: cl.Name,
						ExamName: find ? find.ExamName : '',
						ExamDate_TMP: find && find.ExamDate ? new Date(find.ExamDate) : '',
						StartTime_TMP: find && find.StartTime ? new Date(find.StartTime) : '',
						EndTime_TMP: find && find.EndTime ? new Date(find.EndTime) : '',
						Venue: find ? find.Venue : '',
						ResultDate_TMP: find && find.ResultDate ? new Date(find.ResultDate) : '',
						ResultTime_TMP: find && find.ResultDate ? new Date(find.ResultDate) : '',
						FullMarks: find ? find.FullMarks : '',
						PassMarks: find ? find.PassMarks : '',
						SubjectColl: subjectArray
					});
				});
				//Add by Prashant Chaitra 26
				if ($scope.newDet.ResultDate) {
					$scope.newDet.ResultDate_TMP = new Date($scope.newDet.ResultDate);
					$scope.newDet.ResultTime_TMP = new Date($scope.newDet.ResultDate);
				}


				if ($scope.newDet.Subject) {
					$scope.newDet.SubjectColl = $scope.newDet.Subject.split(',').map(Number);

					setTimeout(function () {
						$('.select2').trigger('change');
					}, 100);
				}

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}


	$scope.ShowPrintDialog = function () {
		$scope.newPrint = {
			DataColl: []
		};

		// Get all the selected rows from the grid
		var tmpCheckedData = $scope.gridApi.selection.getSelectedRows();
		for (let i = 0; i < tmpCheckedData.length; i++) {
			$scope.newPrint.DataColl.push(tmpCheckedData[i]);
		}

		if ($scope.newPrint.DataColl.length == 0) {
			Swal.fire('Please select data from the list to print admit card');
			return;
		} else {
			$('#admitcardmodal').modal('show');
		}
	};

	$scope.PrintData = function () {
		$('.CardSection').printThis();
	}
});