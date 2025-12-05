"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('smsCntl',function ($scope, $http, $filter) {
        // Initialize variables
    $scope.isLoading = false;
    $scope.page = 1;
        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.smsMessages = [];
        $scope.pagination = {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 20
        };

        // Date range
        $scope.dateRange = {
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // 1 month ago
            endDate: new Date()
        };

        // Filter options
        $scope.filters = {
            status: 'all',
            network: 'all',
            searchText: ''
        };

        // Network options (based on your API response)
        $scope.networkOptions = ['all', 'ntc', 'ncell', 'smart'];

        // Status options
        $scope.statusOptions = ['all', 'delivered', 'pending', 'failed', 'sent'];

        // Format date for API
        $scope.formatDateForApi = function (date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        };

        // Load SMS report
        $scope.loadSmsReport = function (page) {
            $scope.isLoading = true;
            $scope.errorMessage = '';
            $scope.successMessage = '';

            var params = {
                startDate: $scope.formatDateForApi($scope.dateRange.startDate),
                endDate: $scope.formatDateForApi($scope.dateRange.endDate),
                page: page || 1
            };

            // Make API call to your MVC controller
            $http({
                method: 'GET',
                url: '/SMS/SMS/GetSmsReportJson',
                params: params
            })
                .then(function (response) {
                    if (response.data.success) {
                        $scope.smsMessages = response.data.data;
                        $scope.pagination = {
                            currentPage: response.data.currentPage,
                            totalPages: response.data.totalPages,
                            totalItems: response.data.total,
                            itemsPerPage: response.data.itemsPerPage || 20
                        };
                        $scope.successMessage = 'Loaded ' + $scope.smsMessages.length + ' messages';
                    } else {
                        $scope.errorMessage = response.data.error || 'Failed to load SMS report';
                    }
                })
                .catch(function (error) {
                    $scope.errorMessage = 'Error: ' + (error.data || error.statusText);
                })
                .finally(function () {
                    $scope.isLoading = false;
                });
        };


        $scope.loadAllMessages = function () {
            $scope.isLoading = true;
            $scope.errorMessage = '';
            $scope.successMessage = '';
            $scope.smsMessages = [];

            var params = {
                startDate: $scope.formatDateForApi($scope.dateRange.startDate),
                endDate: $scope.formatDateForApi($scope.dateRange.endDate),
                getAll: true
            };

            $http({
                method: 'GET',
                url: '/SMS/SMS/GetAllSmsMessagesJson',
                params: params
            })
                .then(function (response) {
                    if (response.data.success) {
                        $scope.smsMessages = response.data.data;
                        $scope.pagination.totalItems = $scope.smsMessages.length;
                        $scope.successMessage = 'Loaded all ' + $scope.smsMessages.length + ' messages';
                    } else {
                        $scope.errorMessage = response.data.error || 'Failed to load all messages';
                    }
                })
                .catch(function (error) {
                    $scope.errorMessage = 'Error: ' + (error.data || error.statusText);
                })
                .finally(function () {
                    $scope.isLoading = false;
                });
        };


        $scope.exportToCSV = function () {
            var params = {
                startDate: $scope.formatDateForApi($scope.dateRange.startDate),
                endDate: $scope.formatDateForApi($scope.dateRange.endDate)
            };

            // Trigger file download
            window.location.href = '/SMS/SMS/ExportToCsv?' +
                'startDate=' + params.startDate +
                '&endDate=' + params.endDate;
        };

        // Filter messages
        $scope.filteredMessages = function () {
            return $scope.smsMessages.filter(function (message) {

                if ($scope.filters.status && $scope.filters.status !== 'all' &&
                    message.Status !== $scope.filters.status) {
                    return false;
                }


                if ($scope.filters.network && $scope.filters.network !== 'all' &&
                    message.Network !== $scope.filters.network) {
                    return false;
                }

                if ($scope.filters.searchText) {
                    var searchLower = $scope.filters.searchText.toLowerCase();
                    return message.Recipient.toLowerCase().includes(searchLower) ||
                        message.Body.toLowerCase().includes(searchLower) ||
                        message.Status.toLowerCase().includes(searchLower);
                }

                return true;
            });
        };

        // Format date for display
        $scope.formatDate = function (dateString) {
            if (!dateString || dateString === '0000-00-00 00:00:00') return 'N/A';
            return $filter('date')(new Date(dateString), 'medium');
        };

        // Get status badge class
        $scope.getStatusClass = function (status) {
            switch (status.toLowerCase()) {
                case 'delivered': return 'badge-success';
                case 'sent': return 'badge-info';
                case 'pending': return 'badge-warning';
                case 'failed': return 'badge-danger';
                default: return 'badge-secondary';
            }
        };

        // Pagination functions
        $scope.goToPage = function (page) {
            if (page >= 1 && page <= $scope.pagination.totalPages) {
                $scope.loadSmsReport(page);
            }
        };

        $scope.getPages = function () {
            var pages = [];
            var startPage = Math.max(1, $scope.pagination.currentPage - 2);
            var endPage = Math.min($scope.pagination.totalPages, startPage + 4);

            for (var i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        };

        // Initialize - load first page
    $scope.loadSmsReport(1);
   // =======================================================



    //$scope.isLoading = false;
    //$scope.errorMessage = '';
    //$scope.successMessage = '';
    //$scope.smsMessages = [];
    //$scope.pagination = {
    //    currentPage: 1,
    //    totalPages: 1,
    //    totalItems: 0,
    //    itemsPerPage: 20
    //};



    //$scope.loadSmsReport(1);
    //function loadSmsReport(page) {
    //    $scope.dateRange = {
    //        startDate: new Date(),
    //        endDate: new Date()
    //    };


    //    var columnDefs = [
    //        //  { headerName: "IPAddress", field: "IPAddress", filter: "agTextColumnFilter", width: 210, pinned: 'left' },
    //        { headerName: "Recipient", field: "Recipient", filter: 'agTextColumnFilter', width: 140 },
    //        { headerName: "Network", field: "Network", filter: 'agTextColumnFilter', width: 140 },
    //        { headerName: "Credit", field: "Credit", filter: 'agTextColumnFilter', width: 140 },
    //        { headerName: "Status", field: "UserName", width: 150, cellStyle: { 'text-align': 'center' } },
    //        { headerName: "Created At", field: "MacAddress", filter: 'agTextColumnFilter', width: 180 },
    //        { headerName: "Message", field: "ResponseLog", filter: 'agTextColumnFilter', width: 150 }

    //    ];


    //    $scope.gridOptions = {
    //        //angularCompileRows: true,
    //        // a default column definition with properties that get applied to every column
    //        defaultColDef: {
    //            filter: true,
    //            resizable: true,
    //            sortable: true,
    //            // set every column width
    //            width: 100,

    //        },
    //        enableSorting: true,
    //        multiSortKey: 'ctrl',
    //        enableColResize: true,
    //        overlayLoadingTemplate: "Please click the Load button to populate record.",
    //        overlayNoRowsTemplate: "No Records found",
    //        rowSelection: 'multiple',
    //        columnDefs: columnDefs,
    //        rowData: null,
    //        filter: true,
    //        //suppressHorizontalScroll: true,
    //        alignedGrids: [],
    //        enableFilter: true

    //    };

    //    // lookup the container we want the Grid to use
    //    $scope.eGridDiv = document.querySelector('#datatable');

    //    // create the grid passing in the div to use together with the columns & data we want to use
    //    new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);


    //}

    //$scope.GetData = function () {

    //    $scope.loadingstatus = 'running';
    //    showPleaseWait();

    //    var para = {
    //        startDate: $filter('date')(new Date($scope.DateFromDet.dateAD), 'yyyy-MM-dd'),
    //        endDate: $filter('date')(new Date($scope.DateToDet.dateAD), 'yyyy-MM-dd'),
    //        page:page
    //    };

    //    $scope.isLoading = true;
    //    $scope.errorMessage = '';
    //    $scope.successMessage = '';
    //    $scope.smsMessages = [];

    //    var para = {
    //        startDate: $scope.formatDateForApi($scope.dateRange.startDate),
    //        endDate: $scope.formatDateForApi($scope.dateRange.endDate),
    //        getAll: true
    //    };

    //    $http({
    //        method: 'GET',
    //        url: '/SMS/SMS/GetAllSmsMessagesJson',
    //        params: para
    //    })
    //        .then(function (response) {
    //            $scope.loadingstatus = 'stop';
    //            hidePleaseWait();

    //            if (response.data.success && response.data.data) {
    //                $scope.DataColl = response.data.data;

    //                $scope.gridOptions.api.setRowData($scope.DataColl);


    //            } else
    //                alert(res.data.ResponseMSG);





    //            if (response.data.success) {
    //                $scope.smsMessages = response.data.data;
    //                $scope.pagination.totalItems = $scope.smsMessages.length;
    //                $scope.successMessage = 'Loaded all ' + $scope.smsMessages.length + ' messages';
    //            } else {
    //                $scope.errorMessage = response.data.error || 'Failed to load all messages';
    //            }
    //        })
    //        .catch(function (error) {
    //            $scope.errorMessage = 'Error: ' + (error.data || error.statusText);
    //        })
    //        .finally(function () {
    //            $scope.isLoading = false;
    //        });























    //    $http({
    //        method: 'POST',
    //        url: base_url + "Setup/Security/GetSMSAPILog",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = 'stop';
    //        hidePleaseWait();

    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.DataColl = res.data.Data;

    //            $scope.gridOptions.api.setRowData($scope.DataColl);


    //        } else
    //            alert(res.data.ResponseMSG);

    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });



    //}

    //$scope.onFilterTextBoxChanged = function () {
    //    $scope.gridOptions.api.setQuickFilter($scope.search);
    //}

    //$scope.onBtExport = function () {
    //    var params = {
    //        fileName: 'log.csv',
    //        sheetName: 'data'
    //    };

    //    $scope.gridOptions.api.exportDataAsCsv(params);
    //}
});