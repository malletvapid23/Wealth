﻿(function () {
    'use strict';

    var controllerId = 'chapter6Controller';
    angular.module('main')
        .controller(controllerId, ['userResourcePoolService', 'logger', chapter6Controller]);

    function chapter6Controller(userResourcePoolService, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 1;
        //var resourcePoolId = 2;

        //var refreshTimeout = null;

        var vm = this;
        vm.totalCostData = null;
        vm.totalCostChartConfig = null;
        vm.totalCost2ChartConfig = null;
        vm.decreaseNumberOfSales = decreaseNumberOfSales;
        vm.decreaseResourcePoolRate = decreaseResourcePoolRate;
        vm.increaseNumberOfSales = increaseNumberOfSales;
        vm.increaseResourcePoolRate = increaseResourcePoolRate;
        vm.resetNumberOfSales = resetNumberOfSales;

        initialize();

        /* Implementations */

        function initialize() {
            configureCharts();
            loadChartData();

            //refreshTimeout = $timeout(refreshPage, 5000);

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(refreshTimeout);
            //});
        }

        function decreaseNumberOfSales() {
            userResourcePoolService.decreaseNumberOfSales(vm.totalCostData.Id)
                .success(function () {
                    refreshChartData();
                });
        }

        function decreaseResourcePoolRate() {
            userResourcePoolService.decreaseResourcePoolRate(vm.totalCostData.Id)
                .success(function () {
                    refreshChartData();
                });
        }

        function increaseNumberOfSales() {
            userResourcePoolService.increaseNumberOfSales(vm.totalCostData.Id)
                .success(function () {
                    refreshChartData();
                });
        }

        function increaseResourcePoolRate() {
            userResourcePoolService.increaseResourcePoolRate(vm.totalCostData.Id)
                .success(function () {
                    refreshChartData();
                });
        }

        function resetNumberOfSales() {
            userResourcePoolService.resetNumberOfSales(vm.totalCostData.Id)
                .success(function () {
                    refreshChartData();
                });
        }

        //function refreshPage() {

        //    var organizationIndex = Math.floor(Math.random() * 4);
        //    vm.oldSystemChartConfig.series[organizationIndex].data[0] += 1;
        //    vm.newSystemChartConfig.series[0].data[0] += 1;

        //    refreshTimeout = $timeout(refreshPage, 1000);
        //}

        //function decrease(index) {
        //    vm.chartData[index].y = vm.chartData[index].y - 5 < 0
        //        ? 0
        //        : vm.chartData[index].y - 5;
        //}

        //function increase(index) {
        //    vm.chartData[index].y += 5;
        //}

        function configureCharts() {

            //vm.oldSystemChartConfig = {
            //    title: {
            //        text: ''
            //    },
            //    options: {
            //        chart: {
            //            type: 'column'
            //        },
            //        yAxis: {
            //            title: { text: 'Development process' },
            //            min: 0,
            //            allowDecimals: false
            //        },
            //        xAxis: { categories: ['Knowledge'] },
            //        plotOptions: {
            //            column: {
            //                pointWidth: 15
            //            }
            //        }
            //    },
            //    series: [
            //        { name: "My Precious", data: [0] },
            //        { name: "Vicky's Secret", data: [0] },
            //        { name: 'Imperial Stars', data: [0] },
            //        { name: 'Xplore Eldorado', data: [0] }
            //    ]
            //};

            //vm.newSystemChartConfig = {
            //    title: {
            //        text: ''
            //    },
            //    options: {
            //        chart: {
            //            type: 'column'
            //        },
            //        yAxis: {
            //            title: { text: 'Development process' },
            //            min: 0,
            //            allowDecimals: false
            //        },
            //        xAxis: { categories: ['Knowledge'] },
            //        plotOptions: {
            //            column: {
            //                pointWidth: 15
            //            }
            //        }
            //    },
            //    series: [
            //        { name: 'Global Knowledge Database', data: [0] }
            //    ]
            //};
            
            // Old
            vm.totalCostChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Number of sales' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Units'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                }
            };

            // New
            vm.totalCost2ChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Number of sales' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Units'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                }
            };

            //vm.licenseResultChartConfig = {
            //    title: {
            //        text: ''
            //    },
            //    options: {
            //        chart: {
            //            type: 'pie'
            //        },
            //        plotOptions: {
            //            pie: {
            //                allowPointSelect: true
            //            }
            //        }
            //    }
            //};
        }

        function loadChartData() {

            vm.totalCostChartConfig.loading = true;
            vm.totalCost2ChartConfig.loading = true;

            // TODO !
            //userResourcePoolService. getUserResourcePool ... (resourcePoolId)
            //    .success(function (userResourcePool) {
            //        vm.totalCostData = userResourcePool;

            //        // Convert
            //        var chartData = [];
            //        var chartData2 = [];
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {

            //            // Old
            //            var chartDataItem = {
            //                name: vm.totalCostData.UserOrganizationSet[i].OrganizationName,
            //                data: [vm.totalCostData.UserOrganizationSet[i].TotalProfit]
            //            }
            //            chartData.push(chartDataItem);

            //            // New
            //            var chartDataItem2 = {
            //                name: vm.totalCostData.UserOrganizationSet[i].OrganizationName,
            //                data: [vm.totalCostData.UserOrganizationSet[i].TotalIncome]
            //            }
            //            chartData2.push(chartDataItem2);
            //        }

            //        vm.totalCostChartConfig.series = chartData;
            //        vm.totalCost2ChartConfig.series = chartData2;

            //        vm.totalCostChartConfig.loading = false;
            //        vm.totalCost2ChartConfig.loading = false;

            //    });





            //// License Result Chart

            //vm.licenseResultChartConfig.loading = true;

            //resourcePoolService.getLicenseSet(resourcePoolId)
            //    .success(function (licenseSet) {

            //        vm.licenseResultLicenseSet = licenseSet;

            //        // Convert licenseSet to chart data
            //        var licenseResultChartData = [];
            //        for (var i = 0; i < vm.licenseResultLicenseSet.length; i++) {
            //            var chartDataItem = {
            //                name: vm.licenseResultLicenseSet[i].LicenseName,
            //                y: vm.licenseResultLicenseSet[i].AverageRating
            //            }
            //            licenseResultChartData.push(chartDataItem);
            //        }

            //        vm.licenseResultChartConfig.series = [{ data: licenseResultChartData }];
            //        vm.licenseResultChartConfig.loading = false;

            //    });
        }

        function refreshChartData() {

            vm.totalCostChartConfig.loading = true;
            vm.totalCost2ChartConfig.loading = true;


            // TODO

            //userResourcePoolService. getUserResourcePool ... (resourcePoolId)
            //    .success(function (userResourcePool) {
            //        vm.totalCostData = userResourcePool;

            //        // Convert
            //        // Old
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {
            //            vm.totalCostChartConfig.series[i].data[0] = vm.totalCostData.UserOrganizationSet[i].TotalProfit;
            //        }

            //        // New
            //        for (var i = 0; i < vm.totalCostData.UserOrganizationSet.length; i++) {
            //            vm.totalCost2ChartConfig.series[i].data[0] = vm.totalCostData.UserOrganizationSet[i].TotalIncome;
            //        }

            //        vm.totalCostChartConfig.loading = false;
            //        vm.totalCost2ChartConfig.loading = false;
            //    });
        }

        //function resetChanges() {
        //    loadChartData();
        //}

        //function saveChanges() {

        //    userLicenseRatingService.getUserLicenseRatingSetByResourcePoolId(resourcePoolId, false)
        //        .then(function (data) {

        //            // Convert chart data to userSectorRating
        //            for (var i = 0; i < vm.chartData.length; i++) {
        //                var dataItem = data[i];
        //                var chartDataItem = vm.chartData[i];

        //                if (dataItem.Rating !== chartDataItem.y) {
        //                    dataItem.Rating = chartDataItem.y;

        //                    var rowVersion = dataItem.RowVersion;
        //                    dataItem.RowVersion = '';
        //                    dataItem.RowVersion = rowVersion;
        //                }
        //            }

        //            userLicenseRatingService.saveChanges()
        //                .then(function () {
        //                    logger.logSuccess('Your changes have been saved!', null, true);

        //                    vm.displayLicenseResult = true;

        //                    loadChartData();
        //                });
        //        });
        //}
    };
})();
