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
});