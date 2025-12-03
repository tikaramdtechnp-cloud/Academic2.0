app.controller('TodaysClassController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Todays Class';
	var glbS = GlobalServices;

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = glbS.getConfirmMSG();
		$scope.perPageColl = glbS.getPerPageList();
		$scope.EmployeeSearchOptions = glbS.getEmployeeSearchOptions();
		//$scope.confirmMSG = GlobalServices.getConfirmMSG();
		//$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.perPage = {
			Classwise: glbS.getPerPageRow(),		 
			Teacherwise: glbS.getPerPageRow(),
			Subjectwise: glbS.getPerPageRow(),
		};

		$scope.currentPages = {
			Classwise: 1,
			Teacherwise: 1,
			Subjectwise:1,

		};


		$scope.searchData = {
			Classwise: '',
			Teacherwise: '',
			Subjectwise: '',			
		};

		$scope.ClassSection = {};
		glbS.getClassSectionList().then(function (res) {
			$scope.ClassSection = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.todayClass = {
			ForDate: new Date(),
			ForDate_TMP:new Date(),
			SelectedClass: null,			 
			ReportType:1
		}

		$scope.newTeacherwise = {
			ForDate: new Date(),
			ForDate_TMP: new Date(),
			EmployeeId:null
		}

		$scope.newSubjectwise = {
			ForDate: new Date(),
			ForDate_TMP: new Date(),
			SubjectId: null
		}

		$scope.SubjectList = [];

		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllSubjectList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SubjectList = res.data.Data;
			}  
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetTodayLessonPlan = function (rType) {

		
		var para = {};

		if (rType == 1) {
			$scope.DataList1 = [];
			para = {
				forDate: $filter('date')(new Date($scope.todayClass.ForDateDet.dateAD), 'yyyy-MM-dd'),
				classId: ($scope.todayClass.SelectedClass ? $scope.todayClass.SelectedClass.ClassId : null),
				sectionId: ($scope.todayClass.SelectedClass ? $scope.todayClass.SelectedClass.SectionId : null),
				subjectId: null,
				employeeId: null,
				reportType: rType
			};
		} else if (rType == 2) {
			$scope.DataList2 = [];
			para = {
				forDate: $filter('date')(new Date($scope.newTeacherwise.ForDateDet.dateAD), 'yyyy-MM-dd'),
				classId: null,
				sectionId: null,
				subjectId: null,
				employeeId: $scope.newTeacherwise.EmployeeId,
				reportType: rType
			};
        }
		else if (rType == 3) {
			$scope.DataList3 = [];
			para = {
				forDate: $filter('date')(new Date($scope.newSubjectwise.ForDateDet.dateAD), 'yyyy-MM-dd'),
				classId: null,
				sectionId: null,
				subjectId: $scope.newSubjectwise.SubjectId,
				employeeId: null,
				reportType: rType
			};
		}
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetTodayLessonPlan",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				if(rType==1)
					$scope.DataList1 = res.data.Data;
				else if (rType == 2)
					$scope.DataList2 = res.data.Data;
				else if (rType == 3)
					$scope.DataList3 = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
    }

	


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});