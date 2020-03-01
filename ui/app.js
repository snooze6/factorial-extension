var scope;

angular.module('snooock', []).controller('main', function($scope) {
    scope = $scope;
    $scope.factorial = null;

    $scope.shifts = {
      monday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      tuesday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      wednesday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      thursday : [{ini: "09:00", end: "14:00"}, {ini: "15:00", end: "18:00"}],
      friday : [{ini: "08:00", end: "15:00"}]
    };

    $scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    $scope.selected_day;
    $scope.select_day = function(day){
        $scope.selected_day = day;
    };

    $scope.tabs = ['shifts', 'configuration', 'about'];
    $scope.selected_tab = 'shifts';
    $scope.select_tab = function (tab) {
        $scope.selected_tab = tab;
    };

    $scope.validate = function(){
        for (let i in $scope.shifts){
            const shifts = $scope.shifts[i];
            for (let j of shifts){
                if (!(j.ini < j.end)) return false
            }
        }
        return true;
    };

    $scope.clock = function (ini, end) {
        if ($scope.validate()) {
            alert('Clocking from [' + ini + '] to [' + end + ']')
        } else {
            alert('Please, ensure all time ranges are correct; I mean, they shold start BEFORE they finish')
        }
    };

    $scope.clock_today = function () {
        // Set the date intervals
        ini = new Date();
        end = new Date();
        ini.setHours(0,0,0,0);
        end.setHours(23,59,59,59);
        $scope.clock(ini, end);
    };

    $scope.clock_week = function () {
        // Set the date intervals
        ini = new Date();
        end = new Date();
        ini.setDate(ini.getDate() - (ini.getDay() + 6) % 7);
        ini.setHours(0,0,0,0);
        end.setDate(ini.getDate() + 6);
        end.setHours(23,59,59,59);
        $scope.clock(ini, end);
    };

    $scope.save_shifts = function () {
        if ($scope.validate()){
            browser.storage.local.set({shifts: $scope.shifts});
            alert('Preferences saved')
        }
    };

    async function setup() {
        console.log('[+] - Starting extension');
        browser.storage.local.get().then(
            (result) => {
                if (Object.keys(result).length !== 0) {
                    $scope.shifts = result.shifts;
                    console.log('[+] - Loaded shifts from preferencies');
                }
            },
            (error) => {
                alert(error);
            }
        );

        // $scope.factorial = new factorial();
        // console.log('[+] - Loaded factorial core');
        // await $scope.factorial.setup();
    }

    setup();
});

window.onload = function () {
    {
        const elems = document.querySelectorAll('.collapsible');
        const options = {};
        const instances = M.Collapsible.init(elems, options);
    }
    {
        const elems = document.querySelectorAll('.timepicker');
        const options = {twelveHour: false, autoClose: true};
        const instances = M.Timepicker.init(elems, options);
    }
};