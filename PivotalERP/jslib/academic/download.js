app.controller('DownloadController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Download';

	var gSrv = GlobalServices;

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.StudentSearchOptions = GlobalServices.getStudentSearchOptions();

		$scope.ClassList = [];
		gSrv.getClassSectionList().then(function (res) {
			$scope.ClassList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newStudent = {
			StudentId: null,
			ClassId: null,
			SelectStudent: $scope.StudentSearchOptions[0].value,
			Mode: 'Save'
		};

		$scope.newEmployee = {
			EmployeeId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};

		$scope.newDownloadStudent = {
			DownloadStudentId: null,
			ClassId: null,
			SectionId: null,
			Mode: 'Save'
		};
		$scope.newDownloadEmployee = {
			DownloadEmployeeId: null,
			DepartmentId: null,
			Mode: 'Save'
		};

	}

	$scope.GetStudentFileDataById = function () {

		if ($scope.newStudent.StudentId) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				StudentId: $scope.newStudent.StudentId
			};
			$http({
				method: 'POST',
				url: base_url + "Academic/Creation/GetStudentDocFileById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.stdDet = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

		}
	};


	$scope.GetEmployeeFileDataById = function () {

		if ($scope.newEmployee.EmployeeId) {
			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				EmployeeId: $scope.newEmployee.EmployeeId
			};

			$http({
				method: 'POST',
				url: base_url + "Academic/Creation/GetEmployeeDocFileById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.empDet = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		};
	}



	$scope.ShowDocPdf = function (item) {
		$scope.viewImg1 = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg1.ContentPath = item.DocPath;
			$scope.viewImg1.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer1').src = item.DocPath;
			$('#DocView').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg1.ContentPath = item.PhotoPath;
			$scope.viewImg1.FileType = 'image';  // Assuming PhotoPath is for images
			$('#DocView').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg1.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg1.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg1.FileType === 'pdf') {
				document.getElementById('pdfViewer1').src = $scope.viewImg1.ContentPath;
			}

			$('#DocView').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};
});