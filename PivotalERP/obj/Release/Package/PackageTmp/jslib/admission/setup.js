app.controller('SetupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Setup';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2({ allowClear: true, width: '100%' });
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.StatusColl = [{ id: 1, text: 'Active' }, { id: 2, text: 'DeActive' }];
		$scope.numberingMethods = GlobalServices.getNumberingMethod();

		$scope.currentPages = {		 
			Source: 1,
			CommunicationType: 1,
		};

		$scope.searchData = {
		 
			CommunicationType: '',
			Source: ''
		};

		$scope.perPage = {		 
			CommunicationType: GlobalServices.getPerPageRow(),
			Source: GlobalServices.getPerPageRow(),

		};

		$scope.newSource = {
			SetupId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			Status:1,
			Mode: 'Save'
		};


		$scope.newCommunicationType = {
			SetupId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			Status: 1,
			Mode: 'Save'
		};

		$scope.newEnquiry = {
			BranchId: null,
			NumberingMethod: 1,
			Prefix: '',
			Suffix: '',
			StartNo: 0,
			NumericalPartWidth: 4,
			Mode: 'Save'
		};

		$scope.newRegistration = {
			BranchId: null,
			NumberingMethod: 1,
			Prefix: '',
			Suffix: '',
			StartNo: 0,
			NumericalPartWidth: 4,
			Mode: 'Save'
		};

		$scope.BranchList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

				if ($scope.BranchList && $scope.BranchList.length == 1) {
					$scope.newEnquiry.BranchId = $scope.BranchList[0].BranchId;
					$scope.newRegistration.BranchId = $scope.BranchList[0].BranchId;

					$scope.GetEnquiryConfig();
					$scope.GetRegistrationConfig();
                }
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ClassList = [];
		GlobalServices.getClassList().then(function (res) {
			$scope.ClassList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GetAllSourceList();
		$scope.GetAllCommunicationTypeList();
	}

	function OnClickDefault() {
		document.getElementById('source-form').style.display = "none";
		document.getElementById('setup-complain-form').style.display = "none";

		document.getElementById('add-source').onclick = function () {
			document.getElementById('source-section').style.display = "none";
			document.getElementById('source-form').style.display = "block";
		}
		document.getElementById('sourceback-btn').onclick = function () {
			document.getElementById('source-form').style.display = "none";
			document.getElementById('source-section').style.display = "block";
		}


		document.getElementById('add-setup-complain').onclick = function () {
			document.getElementById('setup-complain-section').style.display = "none";
			document.getElementById('setup-complain-form').style.display = "block";
		}
		document.getElementById('setup-complainback-btn').onclick = function () {
			document.getElementById('setup-complain-form').style.display = "none";
			document.getElementById('setup-complain-section').style.display = "block";
		}
	}

	$scope.ClearSource = function () {
		$scope.newSource = {
			SetupId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			Status:1,
			Mode: 'Save'
		};
	}

	$scope.ClearCommunicationType = function () {
		$scope.newCommunicationType = {
			SetupId: null,
			Name: '',
			Description: '',
			OrderNo: 0,
			Status: 1,
			Mode: 'Save'
		};
	}


	//************************* Source *********************************

	$scope.IsValidSource = function () {
		if ($scope.newSource.Name.isEmpty()) {
			Swal.fire('Please ! Enter Setup Name');
			return false;
		} 
		return true;
	}

	$scope.SaveUpdateSource = function () {
		if ($scope.IsValidSource() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newSource.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSource();
					}
				});
			} else
				$scope.CallSaveUpdateSource();

		}
	};

	$scope.CallSaveUpdateSource = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/SaveSource",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newSource }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearSource();
				$scope.GetAllSourceList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllSourceList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SourceList = [];

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetAllSourceList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SourceList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetSourceById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			SourceId: refData.SourceId
		};

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetSourceById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newSource = res.data.Data;
				$scope.newSource.Mode = 'Modify';

				document.getElementById('source-section').style.display = "none";
				document.getElementById('source-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelSourceById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					SourceId: refData.SourceId
				};

				$http({
					method: 'POST',
					url: base_url + "FrontDesk/Transaction/DelSource",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllSourceList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};



	//************************* Communication Type *********************************

	$scope.IsValidCommunicationType = function () {
		if ($scope.newCommunicationType.Name.isEmpty()) {
			Swal.fire('Please ! Enter Setup Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateCommunicationType = function () {
		if ($scope.IsValidCommunicationType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newCommunicationType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCommunicationType();
					}
				});
			} else
				$scope.CallSaveUpdateCommunicationType();

		}
	};

	$scope.CallSaveUpdateCommunicationType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/SaveCommunicationType",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newCommunicationType }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearCommunicationType();
				$scope.GetAllCommunicationTypeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllCommunicationTypeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.CommunicationTypeList = [];

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/GetAllCommunicationTypeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CommunicationTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetCommunicationTypeById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			CommunicationTypeId: refData.CommunicationTypeId
		};

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/GetCommunicationTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newCommunicationType = res.data.Data;
				$scope.newCommunicationType.Mode = 'Modify';

				document.getElementById('setup-complain-section').style.display = "none";
				document.getElementById('setup-complain-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelSourceById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					SourceId: refData.SourceId
				};

				$http({
					method: 'POST',
					url: base_url + "AdmissionManagement/creation/DelSource",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllSourceList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};





	$scope.GetEnquiryConfig= function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			BranchId:$scope.newEnquiry.BranchId
		};

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/GetEnquiryNumberMethod",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var r = res.data.Data;
				$scope.newEnquiry.NumberingMethod = r.NumberingMethod;
				$scope.newEnquiry.Prefix = r.Prefix;
				$scope.newEnquiry.Suffix = r.Suffix;
				$scope.newEnquiry.StartNo = r.StartNo;
				$scope.newEnquiry.NumericalPartWidth = r.NumericalPartWidth;
				$scope.newEnquiry.Declaration = r.Declaration;
				$scope.newEnquiry.ActiveAdmission = r.ActiveAdmission;
				$scope.newEnquiry.AllowReferralForUserIdColl = r.AllowReferralForUserIdColl;

				if ($scope.newEnquiry.AllowReferralForUserIdColl) {
					$timeout(function () {
						var ethin = [];
						angular.forEach($scope.newEnquiry.AllowReferralForUserIdColl.split(','), function (edet) {
							ethin.push(parseInt(edet));
						});
						$scope.newEnquiry.AllowReferralForUserIdColl_TMP = ethin;
						$('#cboUserEnquiry').val(ethin).trigger('change');
					});

				}

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetRegistrationConfig = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			BranchId: $scope.newRegistration.BranchId
		};

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/GetRegistrationNumberMethod",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var r = res.data.Data;
				$scope.newRegistration.NumberingMethod = r.NumberingMethod;
				$scope.newRegistration.Prefix = r.Prefix;
				$scope.newRegistration.Suffix = r.Suffix;
				$scope.newRegistration.StartNo = r.StartNo;
				$scope.newRegistration.NumericalPartWidth = r.NumericalPartWidth;
				$scope.newRegistration.Declaration = r.Declaration;
				$scope.newRegistration.ActiveAdmission = r.ActiveAdmission;
				$scope.newRegistration.AllowReferralForUserIdColl = r.AllowReferralForUserIdColl;

				if ($scope.newRegistration.AllowReferralForUserIdColl) {
					$timeout(function () {
						var ethin = [];
						angular.forEach($scope.newRegistration.AllowReferralForUserIdColl.split(','), function (edet) {
							ethin.push(parseInt(edet));
						});
						$scope.newRegistration.AllowReferralForUserIdColl_TMP = ethin;
						$('#cboUserRegistration').val(ethin).trigger('change');
					});

				}

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}


	$scope.SaveUpdateConfiguration = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newEnquiry.AllowReferralForUserIdColl_TMP)
			$scope.newEnquiry.AllowReferralForUserIdColl = $scope.newEnquiry.AllowReferralForUserIdColl_TMP.toString();
		else
			$scope.newEnquiry.AllowReferralForUserIdColl = '';

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/SaveEnquiryNumberMethod",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newEnquiry }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait(); 
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newRegistration.AllowReferralForUserIdColl_TMP)
			$scope.newRegistration.AllowReferralForUserIdColl = $scope.newRegistration.AllowReferralForUserIdColl_TMP.toString();
		else
			$scope.newRegistration.AllowReferralForUserIdColl = '';

		$http({
			method: 'POST',
			url: base_url + "AdmissionManagement/creation/SaveRegistrationNumberMethod",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newRegistration }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.SaveForOnlineRegistration = function () {
		$scope.loadingstatus = "running";

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/UpdateClassForOR",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.ClassList }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	};
});