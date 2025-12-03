app.controller('LeaveEntryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'LeaveEntry Entry';
	
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.LanguageColl = GlobalServices.getLangList();
		$scope.StudentSearchOptions = GlobalServices.getStudentSearchOptions();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.LeaveDurationList = [
			{ id: 1, text: 'Full Day' },
			{ id: 2, text: 'Half Day' },
			{ id: 3, text: 'Hourly' }			
		];
		$scope.LeavePeriodList = [
			{ id: 1, text: 'First Half' },
			{ id: 2, text: 'Second Half' },
			{ id: 3, text: 'Other' }
		];

		$scope.currentPages = {
			LeaveEntry: 1,
		};
		$scope.searchData = {
			LeaveEntry: '',
		};
		$scope.perPage = {
			LeaveEntry: GlobalServices.getPerPageRow(),
		};

		$scope.LeaveTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "Attendance/Transaction/GetAllLeaveType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newFilter = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date()
		};

		$scope.newLeaveEntry = {
			LeaveEntryId: null,
			LeaveTypeId: null,
			DurationTypeId: null,
			LeavePeriodId: null,
			Remarks: '',
			AttachDocument: '',
			LeaveTo: 1,		
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			NoOfDays: 1,
			AttachmentColl: [],
			SelectStudent: $scope.StudentSearchOptions[0].value,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
		$scope.GetAllLeaveEntryList();
	};

	$scope.DateChanged = function () {
		if ($scope.newLeaveEntry.DateFromDet && $scope.newLeaveEntry.DateToDet) {
			var dt1 = new Date(($filter('date')(new Date($scope.newLeaveEntry.DateFromDet.dateAD), 'yyyy-MM-dd')));
			var dt2 = new Date(($filter('date')(new Date($scope.newLeaveEntry.DateToDet.dateAD), 'yyyy-MM-dd')));

			$scope.newLeaveEntry.NoOfDays = datediff(dt1, dt2)+1;
        }
    }

	$scope.ClearLeaveEntry = function () {
		$timeout(function () {
			$scope.newLeaveEntry = {
				LeaveEntryId: null,
				LeaveTypeId: null,
				DurationTypeId: null,
				LeavePeriodId:null,
				Remarks: '',
				AttachDocument: '',
				LeaveTo: 1,
				AttachmentColl: [],
				SelectStudent: $scope.StudentSearchOptions[0].value,
				SelectEmployee: $scope.EmployeeSearchOptions[0].value,
				DateFrom_TMP: new Date(),
				DateTo_TMP: new Date(),
				NoOfDays: 1,
				Mode: 'Save'
			};

			$('input[type=file]').val('');
		});
	};

	 
	

	$scope.IsValidLeaveEntry = function () {
		if ($scope.newLeaveEntry.Remarks.isEmpty()) {
			Swal.fire('Please ! Enter Reason');
			return false;
		}
		return true;
	};

	$scope.SaveUpdateLeaveEntry = function () {
		if ($scope.IsValidLeaveEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLeaveEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLeaveEntry();
					}
				});
			} else
				$scope.CallSaveUpdateLeaveEntry();
		}
	};

	$scope.CallSaveUpdateLeaveEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var filesColl = $scope.newLeaveEntry.Photo_TMP;

		if ($scope.newLeaveEntry.DateFromDet) {
			$scope.newLeaveEntry.DateFrom = $filter('date')(new Date($scope.newLeaveEntry.DateFromDet.dateAD), 'yyyy-MM-dd');
		}
		if ($scope.newLeaveEntry.DateToDet) {
			$scope.newLeaveEntry.DateTo = $filter('date')(new Date($scope.newLeaveEntry.DateToDet.dateAD), 'yyyy-MM-dd');
		}

		$http({
			method: 'POST',
			url: base_url + "Attendance/Transaction/SaveLeaveRequest",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				  
				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("file" + i, data.files[i].File);
						else
							formData.append("file" + i, data.files[i]);
					}
				}
				return formData;
			},
			data: { jsonData: $scope.newLeaveEntry, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearLeaveEntry();
				$scope.GetAllLeaveEntryList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllLeaveEntryList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LeaveEntryList = [];
		var para = {
			dateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
			dateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "Attendance/Transaction/GetAllLeaveRequest",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveEntryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetLeaveEntryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			LeaveRequestId: refData.LeaveRequestId
		};
		$http({
			method: 'POST',
			url: base_url + "Attendance/Transaction/getLeaveEntryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newLeaveEntry = res.data.Data;

				if ($scope.newLeaveEntry.DateFrom)
					$scope.newLeaveEntry.DateFrom_TMP = new Date($scope.newLeaveEntry.DateFrom);

				if ($scope.newLeaveEntry.DateTo)
					$scope.newLeaveEntry.DateTo_TMP = new Date($scope.newLeaveEntry.DateTo);

				$scope.newLeaveEntry.Mode = 'Modify';
				$scope.open_form_btn();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelLeaveRequestById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',			
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { LeaveRequestId: refData.LeaveRequestId };
				$http({
					method: 'POST',
					url: base_url + "Attendance/Transaction/DeleteLeaveRequest",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllLeaveEntryList();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}
});