"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('commonDashboardController', function ($scope, $http, companyDet) {
    LoadData();
});