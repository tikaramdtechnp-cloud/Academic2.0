app.controller('UploadPhotoSignatureController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Upload Photos and Signature';

	/*OnClickDefault();*/

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();

		$scope.UploadStudentPhotoOptions = [{ id: 1, text: 'Regd.No.' }, { id: 2, text: 'Board Regd.No.' }, { id: 3, text: 'Enroll No.' }, { id: 4, text: 'Card No.' }, { id: 5, text: 'EMS Id' }
			, { id: 6, text: 'System Id' }, { id: 7, text: 'StudentId' }, { id: 8, text: 'RollNo' }
		];

		$scope.UploadEmployeePhotoOptions = [{ id: 1, text: 'EmployeeCode' }, { id: 2, text: 'Enroll No.' }, { id: 3, text: 'Card No.' }, { id: 4, text: 'EmployeeId' }, { id: 5, text: 'AutoNumber' }];

		$scope.ClassList = [];
		GlobalServices.getClassSectionList().then(function (res) {
			$scope.ClassList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.currentPages = {
			StudentPhotoPhoto: 1,
			EmployeePhotoPhoto: 1,
			UploadSignature: 1
		};

		$scope.searchData = {
			StudentPhotoPhoto: '',
			EmployeePhotoPhoto: '',
			UploadSignature: ''
		};

		$scope.perPage = {
			StudentPhotoPhoto: GlobalServices.getPerPageRow(),
			EmployeePhotoPhoto: GlobalServices.getPerPageRow(),
			UploadSignature: GlobalServices.getPerPageRow()
		};



		$scope.newStudentPhoto = {
			StudentPhotoId: null,
			PhotoUploadedBy: null,

			Mode: 'Save'
		};

		$scope.newEmployeePhoto = {
			EmployeePhotoId: null,
			PhotoUploadedBy: null,
			Mode: 'Save'
		};

		$scope.newUploadSignature = {
			UploadSignatureId: null,
			
			Mode: 'Save'
		};


		//$scope.GetAllStudentPhotoList();
		//$scope.GetAllEmployeePhotoList();
		//$scope.GetAllUploadSignatureList();

	}

	$scope.ChangeUploadBy = function () {
		if ($scope.newStudentPhoto.PhotoUploadedBy != 8)
			$scope.newStudentPhoto.SelectedClassSec = null;
    }
	
	$scope.UploadStudentPhotoToSrv = function () {
		if ($scope.newStudentPhoto.Files_TMP && $scope.newStudentPhoto.Files_TMP.length > 0) {

			if ($scope.newStudentPhoto.SelectedClassSec) {
				$scope.newStudentPhoto.ClassId = $scope.newStudentPhoto.SelectedClassSec.ClassId;
				$scope.newStudentPhoto.SectionId = $scope.newStudentPhoto.SelectedClassSec.SectionId;
            }

			$http({
				method: 'POST',
				url: base_url + "Academic/Creation/UpdateStudentPhoto",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("jsonData", angular.toJson(data.jsonData));

					var f = 0;
					angular.forEach(data.files, function (fl) {
						formData.append("file" + f, fl);
						f = f + 1;
					});
					
					return formData;
				},
				data: { jsonData: $scope.newStudentPhoto, files: $scope.newStudentPhoto.Files_TMP }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				var data = res.data;
				Swal.fire(data.ResponseMSG);

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});


		}
	};

	$scope.ClearStudentPhoto = function () {
		$scope.newStudentPhoto = {
			StudentPhotoId: null,
			PhotoUploadedBy: null,
			Mode: 'Save'
		};
	}
	$scope.ClearEmployeePhoto = function () {
		$scope.newEmployeePhoto = {
			EmployeePhotoId: null,
			ClassId: null,
			Mode: 'Save'
		};
	}
	$scope.UploadEmployeePhotoToSrv = function () {
		if ($scope.newEmployeePhoto.Files_TMP && $scope.newEmployeePhoto.Files_TMP.length > 0) {

			$http({
				method: 'POST',
				url: base_url + "Academic/Creation/UpdateEmployeePhoto",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("jsonData", angular.toJson(data.jsonData));

					var f = 0;
					angular.forEach(data.files, function (fl) {
						formData.append("file" + f, fl);
						f = f + 1;
					});

					return formData;
				},
				data: { jsonData: $scope.newEmployeePhoto, files: $scope.newEmployeePhoto.Files_TMP }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				var data = res.data;
				Swal.fire(data.ResponseMSG);

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});


		}
	};
	$scope.ClearUploadSignature = function () {
		$scope.newUploadSignature = {
			
			Mode: 'Save'
		};
	}

	//************************* StudentPhoto *********************************

	$scope.IsValidStudentPhoto = function () {
		if ($scope.newStudentPhoto.PhotoUploadedBy.isEmpty()) {
			Swal.fire('Please !Select Who Uploaded Photo');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateStudentPhoto = function () {
		if ($scope.IsValidStudentPhoto() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newStudentPhoto.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateStudentPhoto();
					}
				});
			} else
				$scope.CallSaveUpdateStudentPhoto();

		}
	};

	$scope.CallSaveUpdateStudentPhoto = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/SaveStudentPhoto",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newStudentPhoto }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearStudentPhoto();
				$scope.GetAllStudentPhotoList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllStudentPhotoList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.StudentPhotoList = [];

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllStudentPhotoList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.StudentPhotoList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetStudentPhotoById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			StudentPhotoId: refData.StudentPhotoId
		};

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetStudentPhotoById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newStudentPhoto = res.data.Data;
				$scope.newStudentPhoto.Mode = 'Modify';

				document.getElementById('StudentPhoto-content').style.display = "none";
				document.getElementById('StudentPhoto-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelStudentPhotoById = function (refData) {

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
					StudentPhotoId: refData.StudentPhotoId
				};

				$http({
					method: 'POST',
					url: base_url + "Academic/Creation/DelStudentPhoto",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllStudentPhotoList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	//*************************Employee Photo*********************************

	//$scope.IsValidEmployeePhoto = function () {
	//	if ($scope.newEmployeePhoto.Name.isEmpty()) {
	//		Swal.fire('Please ! Enter EmployeePhoto Name');
	//		return false;
	//	}



	//	return true;
	//}

	$scope.SaveUpdateEmployeePhoto = function () {
		if ($scope.IsValidEmployeePhoto() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeePhoto.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmployeePhoto();
					}
				});
			} else
				$scope.CallSaveUpdateEmployeePhoto();

		}
	};

	$scope.CallSaveUpdateEmployeePhoto = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/SaveEmployeePhoto",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newEmployeePhoto }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearEmployeePhoto();
				$scope.GetAllEmployeePhotoList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllEmployeePhotoList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeePhotoList = [];

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllEmployeePhotoList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeePhotoList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetEmployeePhotoById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			EmployeePhotoId: refData.EmployeePhotoId
		};

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetEmployeePhotoById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeePhoto = res.data.Data;
				$scope.newEmployeePhoto.Mode = 'Modify';

				document.getElementById('batch-StudentPhoto').style.display = "none";
				document.getElementById('batch-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelEmployeePhotoById = function (refData) {

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
					EmployeePhotoId: refData.EmployeePhotoId
				};

				$http({
					method: 'POST',
					url: base_url + "Academic/Creation/DelEmployeePhoto",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllEmployeePhotoList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	//************************* Signature *********************************

	$scope.ClearUploadSignaturePrinciple = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.Principle = null;
				$scope.newUploadSignature.Principle_TMP = [];
			});

		});



		$('#imgPrinciple').attr('src', '');
		$('#imgPrinciple1').attr('src', '');


	};

	$scope.ClearUploadSignatureVicePrinciple = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.VicePrinciple = null;
				$scope.newUploadSignature.VicePrinciple_TMP = [];
			});

		});


		$('#imgVicePrinciple').attr('src', '');
		$('#imgVicePrinciple1').attr('src', '');


	};

	$scope.ClearUploadSignatureAccountant = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.Accountant = null;
				$scope.newUploadSignature.Accountant_TMP = [];
			});

		});



		$('#imgAccountant').attr('src', '');
		$('#imgAccountant1').attr('src', '');
	};

	$scope.ClearUploadSignatureAcademicC = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.AcademicC = null;
				$scope.newUploadSignature.AcademicC_TMP = [];
			});

		});



		$('#imgAcademicC').attr('src', '');
		$('#imgAcademicC1').attr('src', '');
	};


	$scope.ClearUploadSignatureExamC = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.ExamC = null;
				$scope.newUploadSignature.ExamC_TMP = [];
			});

		});



		$('#imgExamC').attr('src', '');
		$('#imgExamC1').attr('src', '');
	};

	$scope.ClearUploadSignatureWarden = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.Warden = null;
				$scope.newUploadSignature.Warden_TMP = [];
			});

		});



		$('#imgWarden').attr('src', '');
		$('#imgWarden1').attr('src', '');
	};


	$scope.ClearUploadSignatureLibrarian = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newUploadSignature.Librarian = null;
				$scope.newUploadSignature.Librarian_TMP = [];
			});

		});



		$('#imgLibrarian').attr('src', '');
		$('#imgLibrarian1').attr('src', '');
	};



	


	$scope.SaveUpdateUploadSignature = function () {
		if ($scope.IsValidUploadSignature() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newUploadSignature.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateUploadSignature();
					}
				});
			} else
				$scope.CallSaveUpdateUploadSignature();

		}
	};

	$scope.CallSaveUpdateUploadSignature = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var photo = $scope.newUploadSignature.Photo_TMP;
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Transaction/SaveUploadSignature",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i].File);
					}
				}

				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);



				return formData;
			},
			data: { jsonData: $scope.newUploadSignature, stPhoto: photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearStudent();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});

		var photo = $scope.newUploadSignature.Principle_TMP;
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Transaction/SaveUploadSignature",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i].File);
					}
				}

				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);



				return formData;
			},
			data: { jsonData: $scope.newUploadSignature, stPhoto: photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearStudent();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveUploadSignature",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newUploadSignature }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearUploadSignature();
				$scope.GetAllUploadSignatureList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllUploadSignatureList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.UploadSignatureList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllUploadSignatureList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UploadSignatureList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetUploadSignatureById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			UploadSignatureId: refData.UploadSignatureId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetUploadSignatureById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newUploadSignature = res.data.Data;
				$scope.newUploadSignature.Mode = 'Modify';

				//document.getElementById('table-listing').style.display = "none";
				//document.getElementById('notice-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelUploadSignatureById = function (refData) {

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
					UploadSignatureId: refData.UploadSignatureId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelUploadSignature",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllUploadSignatureList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});