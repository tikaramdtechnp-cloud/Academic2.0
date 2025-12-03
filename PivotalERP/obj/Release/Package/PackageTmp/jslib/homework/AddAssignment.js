app.controller('AddAssignmentController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AddAssignment';

	OnClickDefault();
	var glbS = GlobalServices;

	$scope.LoadData = function () {

		$scope.HomeWork_Files_TMP = null;
		$scope.HomeWork_Files_Data = null;

		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AddAssignment: 1

		};

		$scope.searchData = {
			AddAssignment: '',
		};

		$scope.perPage = {
			AddAssignment: GlobalServices.getPerPageRow(),
		};

		$scope.Configuration = {};
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetHAConfiguration",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";


			if (res.data.IsSuccess && res.data.Data) {
				$scope.Configuration = res.data.Data;
			}
			else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.AcademicConfig = {};
		GlobalServices.getAcademicConfig().then(function (res1) {
			$scope.AcademicConfig = res1.data.Data;

			if ($scope.AcademicConfig.ActiveFaculty == true) {

				$scope.FacultyList = [];
				GlobalServices.getFacultyList().then(function (res) {
					$scope.FacultyList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}


			if ($scope.AcademicConfig.ActiveLevel == true) {

				$scope.LevelList = [];
				GlobalServices.getClassLevelList().then(function (res) {
					$scope.LevelList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}

			if ($scope.AcademicConfig.ActiveSemester == true) {

				$scope.SelectedClassSemesterList = [];
				$scope.SemesterList = [];
				GlobalServices.getSemesterList().then(function (res) {
					$scope.SemesterList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}

			if ($scope.AcademicConfig.ActiveBatch == true) {

				$scope.BatchList = [];
				GlobalServices.getBatchList().then(function (res) {
					$scope.BatchList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}

			if ($scope.AcademicConfig.ActiveClassYear == true) {

				$scope.ClassYearList = [];
				/*$scope.SelectedClassClassYearList = [];*/
				GlobalServices.getClassYearList().then(function (res) {
					$scope.ClassYearList = res.data.Data;
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.ClassSection = {};
		glbS.getClassSectionList().then(function (res) {
			$scope.ClassSection = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//student list
		$scope.ClassListsection = [];
		glbS.getClassSectionList().then(function (res) {
			$scope.ClassListsection = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.SubjectList = [];
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllSubjectList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SubjectList = res.data.Data;

			} else {

				if (res.data.IsSuccess == false)
					Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//class List
		$scope.ClassList = [];
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllClassList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ClassList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		//section
		$scope.SectionList = [];
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllSectionList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SectionList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		//subject
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

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		//AssignmentTypeList
		$scope.AssignmentTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetAllAssignmentTypeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AssignmentTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		$scope.newFilter = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date(),
			StudentId: null
		};

		$scope.newAddAssignment = {
			DeadlineDate_TMP: new Date(),
			DeadlineforRedo_TMP: new Date(),
			AssignmentId: null,
			TeacherId: null,
			ClassId: null,
			SubjectId: null,
			SubjectId: null,
			Weblink: '',
			Title: '',
			AssignmentTypeId: null,
			Description: '',
			DeadlineDate: null,
			DeadlineTime: null,
			DeadlineforRedo: null,
			DeadlineforRedoTime: null,
			MarkScheme: null,
			Marks: 0,
			SubmissionsRequired: false,
			IsAllowLateSibmission: false,
			Mode: 'Save'
		};
		$scope.GetTeacherNameList();
		//$scope.GetAllAddHomework();
	}

	function OnClickDefault() {
		document.getElementById('homework-add-form').style.display = "none";

		document.getElementById('add-homework-add-btn').onclick = function () {
			document.getElementById('homework-add-section').style.display = "none";
			document.getElementById('homework-add-form').style.display = "block";
		}

		document.getElementById('back-homework-btn').onclick = function () {
			document.getElementById('homework-add-section').style.display = "block";
			document.getElementById('homework-add-form').style.display = "none";
		}

	}

	$scope.ClearAddAssignment = function () {
		$scope.SubjectColl = [];
		$scope.Assignment_Files_TMP = null;
		$scope.Assignment_Files_Data = null;

		$('input[type=file]').val('');

		$scope.newAddAssignment = {
			DeadlineDate_TMP: new Date(),
			AssignmentId: null,
			TeacherId: null,
			ClassId: null,
			SectionId: null,
			SubjectId: null,
			Weblink: '',
			Title: '',
			AssignmentTypeId: null,
			Description: '',
			DeadlineDate: null,
			DeadlineTime: null,
			DeadlineforRedo: null,
			DeadlineforRedoTime: null,
			MarkScheme:null,
			Marks:0,
			SubmissionsRequired: false,
			IsAllowLateSibmission: false,
			AttachmentColl: [],
			Mode: 'Save'
		};
	}


	//Teacher name

	$scope.GetTeacherNameList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.TeacherNameList = [];
		$http({
			method: 'GET',
			url: base_url + "HomeWork/Transaction/GetTeacherName",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TeacherNameList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	//*********************class wise section name********************************

	$scope.GetTeacherWiseClassList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeId: $scope.newAddAssignment.TeacherId
		};
		$scope.TeacherWiseClassList = [];
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetTeacherWiseClass",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TeacherWiseClassList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	//**********************************************************

	$scope.GetClassWiseSubjectListForALP = function () {
		$scope.SubjectListALP = [];
		var para = {
			ClassId: $scope.newAddAssignment.ClassId
		};
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetSubjectListForLessonPlan",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				$timeout(function () {
					$scope.SubjectListALP = res.data.Data;
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetSubjectLessonWise = function () {
		if ($scope.newAddAssignment.SubjectId) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				ClassId: $scope.newAddAssignment.SelectedClass.ClassId,
				SubjectId: $scope.newAddAssignment.SubjectId
			};
			$scope.SubjectLessonWiseList = [];

			$http({
				method: 'POST',
				url: base_url + "Exam/Transaction/GetSubjectLessonWise",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.SubjectLessonWiseList = res.data.Data;

				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	}

	$scope.GetLessonTopicDetailsWise = function (lessonName) {
		if (lessonName) {
			// Find the LessonId based on the selected LessonName
			var selectedLesson = $scope.SubjectLessonWiseList.find(function (lesson) {
				return lesson.LessonName === lessonName;
			});

			// If found, proceed with the LessonId
			if (selectedLesson) {
				var lessonId = selectedLesson.LessonId;

				// Now you can send the LessonId
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					LessonId: lessonId
				};
				$scope.LessonTopicDetailsWiseList = [];
				$http({
					method: 'POST',
					url: base_url + "Exam/Transaction/GetLessonTopicDetailsWise",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess && res.data.Data) {
						$scope.LessonTopicDetailsWiseList = res.data.Data;
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		}
	};


	//$scope.GetLessonTopicDetailsWise = function () {
	//	if ($scope.newAddAssignment.Lesson) {
	//		$scope.loadingstatus = "running";
	//		showPleaseWait();
	//		var para = {
	//			LessonId: $scope.newAddAssignment.Lesson
	//		};
	//		$scope.LessonTopicDetailsWiseList = [];
	//		$http({
	//			method: 'POST',
	//			url: base_url + "Exam/Transaction/GetLessonTopicDetailsWise",
	//			dataType: "json",
	//			data: JSON.stringify(para)
	//		}).then(function (res) {
	//			hidePleaseWait();
	//			$scope.loadingstatus = "stop";
	//			if (res.data.IsSuccess && res.data.Data) {
	//				$scope.LessonTopicDetailsWiseList = res.data.Data;
	//			} else {
	//				Swal.fire(res.data.ResponseMSG);
	//			}
	//		}, function (reason) {
	//			Swal.fire('Failed' + reason);
	//		});
	//	}
	//}

	//************************* Add Homework *********************************


	$scope.IsValidAddAssignment = function () {
		//if ($scope.newAddAssignment.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter  Name');
		//	return false;
		//}
		return true;
	}
	$scope.SaveUpdateAddAssignment = function () {
		if ($scope.IsValidAddAssignment() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAddAssignment.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAssignment();
					}
				});
			} else
				$scope.CallSaveUpdateAssignment();
		}
	};


	$scope.CallSaveUpdateAssignment = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newAddAssignment.DeadlineDateDet) {
			$scope.newAddAssignment.DeadlineDate = $filter('date')(new Date($scope.newAddAssignment.DeadlineDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newAddAssignment.DeadlineDate = null;
		if ($scope.newAddAssignment.DeadlineforRedoDet) {
			$scope.newAddAssignment.DeadlineforRedo = $filter('date')(new Date($scope.newAddAssignment.DeadlineforRedoDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newAddAssignment.DeadlineforRedo = null;
		if ($scope.newAddAssignment.DeadlineTime_TMP)
			$scope.newAddAssignment.DeadlineTime = $scope.newAddAssignment.DeadlineTime_TMP.toLocaleString();
		else
			$scope.newAddAssignment.DeadlineTime = null;
		if ($scope.newAddAssignment.DeadlineforRedoTime_TMP)
			$scope.newAddAssignment.DeadlineforRedoTime = $scope.newAddAssignment.DeadlineforRedoTime_TMP.toLocaleString();
		else
			$scope.newAddAssignment.DeadlineforRedoTime = null;

		//var selectSec = [];
		//$scope.SectionList.forEach(function (sec) {
		//	if (sec.SectionId == true) {
		//		selectSec.push(sec.SectionId);
  //          }
		//});
		//$scope.newAddAssignment.SectionIdColl = selectSec;

		$scope.newAddAssignment.ClassId = $scope.newAddAssignment.SelectedClass.ClassId;
		var assignmentFiles = $scope.Assignment_Files_Data;
		$http({
			method: 'POST',
			url: base_url + "Homework/Transaction/SaveAddAssignment",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				if (data.files && data.files.length > 0) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file1" + i, data.files[i]);
					}
				}
				return formData;
			},
			data: { jsonData: $scope.newAddAssignment, files: assignmentFiles}
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearAddAssignment();
				//$scope.GetAllAddHomework();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.GetAllAddAssignment = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AddedAssignmentList = [];
		var para = {
			DateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
			StudentId: $scope.newFilter.StudentId,
			
		};
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetAllAddAssignment",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AddedAssignmentList = res.data.Data;
			}
			else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	$scope.GetAddedAssignmentById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			AssignmentId: refData.AssignmentId
		};
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetAddedAssignmentById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAddAssignment = res.data.Data;

				$scope.newAddAssignment.SelectedClass = $scope.ClassSection.ClassList.find(cs => cs.ClassId === res.data.Data.ClassId);

				if ($scope.newAddAssignment.DeadlineDate)
					$scope.newAddAssignment.DeadlineDate_TMP = new Date($scope.newAddAssignment.DeadlineDate);

				if ($scope.newAddAssignment.DeadlineTime)
					$scope.newAddAssignment.DeadlineTime_TMP = new Date($scope.newAddAssignment.DeadlineTime);

				if ($scope.newAddAssignment.DeadlineforRedo)
					$scope.newAddAssignment.DeadlineforRedo_TMP = new Date($scope.newAddAssignment.DeadlineforRedo);

				if ($scope.newAddAssignment.DeadlineforRedoTime)
					$scope.newAddAssignment.DeadlineforRedoTime_TMP = new Date($scope.newAddAssignment.DeadlineforRedoTime);

				$scope.newAddAssignment.Mode = 'Modify';
				document.getElementById('homework-add-section').style.display = "none";
				document.getElementById('homework-add-form').style.display = "block";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.DeleteAddedAssignment = function (refData) {

		Swal.fire({
			title: 'Do you want to delete Assignment Id ' + refData.AssignmentId,
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					AssignmentId: refData.AssignmentId
				};

				$http({
					method: 'POST',
					url: base_url + "HomeWork/Transaction/DeleteAddedAssignment",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAddAssignment();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};



});