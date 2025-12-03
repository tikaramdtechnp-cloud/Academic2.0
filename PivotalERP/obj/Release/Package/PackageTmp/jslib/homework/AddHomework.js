app.controller('AddHomeworkController', function ($scope, $http, $timeout, $filter, GlobalServices, $sce) {
	$scope.Title = 'AddHomework';

	OnClickDefault();
	var glbS = GlobalServices;

	$scope.LoadData = function () {

		$scope.HomeWork_Files_TMP = null;
		$scope.HomeWork_Files_Data = null;

		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AddHomework: 1

		};

		$scope.searchData = {
			AddHomework: '',
		};

		$scope.perPage = {
			AddHomework: GlobalServices.getPerPageRow(),
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
		//homeworkType
		$scope.HomeworkTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "Homework/Transaction/GetAllHomeworkTypeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.HomeworkTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newFilter = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date(),
			StudentId:null,
			ClassId:null,
			SubjectId:null,
			EmployeeId:null
		};

		$scope.newAddHomework = {
			DeadlineDate_TMP: new Date(),
			HomeworkId: null,
			TeacherId: null,
			ClassId: null,
			SectionId: null,
			SubjectId: null,
			Subject: [],
			Lesson: '',
			Topic: '',
			HomeworkTypeId: null,
			Description: '',
			DeadlineDate: null,
			DeadlineTime: null,
			DeadlineforRedo: null,
			DeadlineforRedoTime: null,
			HomeworkFile: '',
			SubmissionsRequired: false,
			IsAllowLateSibmission: false,
			HomeWork_Files_TMP:'',
			HomeWork_Files_Data:'',
			AttachmentColl: [],
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

	$scope.ClearAddHomework = function () {
		$scope.newAddHomework = {
			HomeworkId: null,
			TeacherId: null,
			ClassId: null,
			SectionId: null,
			Section: [],
			SubjectId: null,
			Lesson: '',
			Topic: '',
			HomeworkTypeId: null,
			Description: '',
			DeadlineDate: null,
			DeadlineTime: null,
			DeadlineforRedo: null,
			DeadlineforRedoTime: null,
			HomeworkFile: '',
			SubmissionsRequired: false,
			IsAllowLateSibmission: false,
			AttachmentColl:[],
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
			EmployeeId: $scope.newAddHomework.TeacherId
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
			ClassId: $scope.newAddHomework.SelectedClass.ClassId
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
		if ($scope.newAddHomework.SubjectId) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				ClassId: $scope.newAddHomework.SelectedClass.ClassId,
				SubjectId: $scope.newAddHomework.SubjectId
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

	//************************* Add Homework *********************************


	$scope.IsValidHomeworkType = function () {
		//if ($scope.newAddHomework.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter  Name');
		//	return false;
		//}
		return true;
	}
	$scope.SaveUpdateAddHomework = function () {
		if ($scope.IsValidHomeworkType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAddHomework.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateHomework();
					}
				});
			} else
				$scope.CallSaveUpdateHomework();
		}
	};
	function dataURItoFile(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		var blob = new Blob([ab], { type: mimeString });
		return new File([blob], 'fileName', { type: mimeString });
	}

	$scope.CallSaveUpdateHomework = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newAddHomework.DeadlineDateDet) {
			$scope.newAddHomework.DeadlineDate = $filter('date')(new Date($scope.newAddHomework.DeadlineDateDet.dateAD), 'yyyy-MM-dd');
		} else {
			$scope.newAddHomework.DeadlineDate = null;
		}

		if ($scope.newAddHomework.DeadlineforRedoDet) {
			$scope.newAddHomework.DeadlineforRedo = $filter('date')(new Date($scope.newAddHomework.DeadlineforRedoDet.dateAD), 'yyyy-MM-dd');
		} else {
			$scope.newAddHomework.DeadlineforRedo = null;
		}

		if ($scope.newAddHomework.DeadlineTime_TMP) {
			$scope.newAddHomework.DeadlineTime = $scope.newAddHomework.DeadlineTime_TMP.toLocaleString();
		} else {
			$scope.newAddHomework.DeadlineTime = null;
		}

		if ($scope.newAddHomework.DeadlineForReDoTime_TMP) {
			$scope.newAddHomework.DeadlineforRedoTime = $scope.newAddHomework.DeadlineForReDoTime_TMP.toLocaleString();
		} else {
			$scope.newAddHomework.DeadlineforRedoTime = null;
		}

		var homeworkFiles = [];
		if ($scope.HomeWork_Files_Data && $scope.HomeWork_Files_Data.length > 0) {
			angular.forEach($scope.HomeWork_Files_Data, function (fd) {
				homeworkFiles.push(dataURItoFile(fd));
			});
		} else {
			angular.forEach($scope.HomeWork_Files_TMP, function (fd) {
				homeworkFiles.push(fd);
			});
		}
		$scope.AttachmentColl = homeworkFiles;
		$scope.newAddHomework.ClassId = $scope.newAddHomework.SelectedClass.ClassId;
		console.log("homeworkFiles: ", homeworkFiles);

		$http({
			method: 'POST',
			url: base_url + "Homework/Transaction/SaveAddHomeWork",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files && data.files.length > 0) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file1" + i, data.files[i]);
					}
				}

				console.log("formData: ", formData);
				return formData;
			},
			data: { jsonData: $scope.newAddHomework, files: homeworkFiles }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {

				$scope.GetAllAddHomework1();
				$scope.ClearAddHomework();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			console.error("Error: ", errormessage);
		});
	};


	//$scope.GetAllAddHomework = function () {
	//	$scope.loadingstatus = "running";
	//	showPleaseWait();
	//	$scope.AddHomeworkList = [];

	//	var para = {
	//		DateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
	//		DateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
	//		StudentId: $scope.newFilter.StudentId,
	//		ClassId: $scope.newFilter.ClassId,
	//		SubjectId: $scope.newFilter.SubjectId,
	//		EmployeeId: $scope.newFilter.TeacherId
	//	};
	//	$http({
	//		method: 'POST',
	//		url: base_url + "HomeWork/Transaction/GetAllAddHomework",
	//		dataType: "json",
	//		data: JSON.stringify(para)
	//	}).then(function (res) {
	//		hidePleaseWait();
	//		$scope.loadingstatus = "stop";
	//		if (res.data.IsSuccess && res.data.Data) {
	//			$scope.AddHomeworkList = res.data.Data;
	//		} else {
	//			Swal.fire(res.data.ResponseMSG);
	//		}
	//	}, function (reason) {
	//		Swal.fire('Failed' + reason);
	//	});
	//}

	$scope.GetAllAddHomework1 = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AddedHomeworkList = [];
		var para = {
			DateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
			StudentId: $scope.newFilter.StudentId,
			ClassId: ($scope.newFilter.SelectedClass && $scope.newFilter.SelectedClass.ClassId) ? $scope.newFilter.SelectedClass.ClassId : null,
			SubjectId: $scope.newFilter.SubjectId,
			EmployeeId: $scope.newFilter.TeacherId,
			BatchId: $scope.newFilter.BatchId,
			SemesterId: $scope.newFilter.SemesterId,
			ClassYearId: $scope.newFilter.ClassYearId
		};
		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetAllAddHomework",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AddedHomeworkList = res.data.Data;
			}
			else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
    }




	$scope.GetAddHomeworkById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			HomeWorkId: refData.HomeWorkId
		};

		$http({
			method: 'POST',
			url: base_url + "HomeWork/Transaction/GetAddedHomeworkById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAddHomework = res.data.Data;

				//$scope.newAddHomework.SelectedClass = $scope.ClassSection.ClassList.find(cs => cs.ClassId === res.data.Data.ClassId);

				if ($scope.newAddHomework.DeadlineDate)
					$scope.newAddHomework.DeadlineDate_TMP = new Date($scope.newAddHomework.DeadlineDate);

				if ($scope.newAddHomework.DeadlineTime)
					$scope.newAddHomework.DeadlineTime_TMP = new Date($scope.newAddHomework.DeadlineTime);

				if ($scope.newAddHomework.DeadlineforRedo)
					$scope.newAddHomework.DeadlineforRedo_TMP = new Date($scope.newAddHomework.DeadlineforRedo);

				if ($scope.newAddHomework.DeadlineforRedoTime)
					$scope.newAddHomework.DeadlineForReDoTime_TMP = new Date($scope.newAddHomework.DeadlineforRedoTime);

				

				$scope.newAddHomework.Mode = 'Modify';
				document.getElementById('homework-add-section').style.display = "none";
				document.getElementById('homework-add-form').style.display = "block";
				
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};





	$scope.DelAddedHomeWork = function (refData) {
		Swal.fire({
			title: 'Do you want to delete Homework Id ' + refData.HomeWorkId,
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					HomeWorkId: refData.HomeWorkId
				};
				$http({
					method: 'POST',
					url: base_url + "HomeWork/Transaction/DeleteAddedHomework",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAddHomework1();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.viewAttachmentsOnly = function (homDet) {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.AttFilesViewOnly = [];

		var para = {
			HomeWorkId: homDet.HomeWorkId
		};

		$http({
			method: 'POST',
			url: base_url + "Homework/Transaction/GetAddedHomeworkById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {
				var attachments = res.data.Data.Attachments;

				//angular.forEach(attachments, function (doc) {
				//	var fpath = (WEBURLPATH.trim() + doc.trim()).replace(/\\/g, '/');
				//	var fileExt = fpath.split('.').pop().toLowerCase();
				//	var isPdf = fileExt === 'pdf';

				//	$scope.AttFilesViewOnly.push({
				//		url: fpath,
				//		type: isPdf ? 'pdf' : 'image'
				//	});
				//});
				$scope.AttFilesViewOnly = [];

				angular.forEach(attachments, function (doc) {
					var fpath = (WEBURLPATH.trim() + doc.trim()).replace(/\\/g, '/');
					var fileExt = fpath.split('.').pop().toLowerCase();
					var isPdf = fileExt === 'pdf';

					$scope.AttFilesViewOnly.push({
						url: fpath,
						type: isPdf ? 'pdf' : 'image'
					});
				});

				$('#attachmentModalOnly').modal('show');
			} else {
				Swal.fire("No attachments found for this homework.");
			}

		}, function (reason) {
			hidePleaseWait();
			Swal.fire('Failed to load attachments: ' + reason);
		});
	};



	$scope.previewFile = function (file) {
		// Optional: trust PDF URLs for iframe
		if (file.type === 'pdf') {
			file.safeUrl = $sce.trustAsResourceUrl(file.url); // $sce should be injected
		}
		$scope.SelectedFilePreview = file;
		$('#previewModal').modal('show');
	};

	// Optional cleanup on close
	$('#previewModal').on('hidden.bs.modal', function () {
		$scope.SelectedFilePreview = null;
		$scope.$apply();
	});


});