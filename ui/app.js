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

    // Implement harsher controls and more verbosity
    $scope.validate = function(){
        for (let i in $scope.shifts){
            const shifts = $scope.shifts[i];
            for (let j of shifts){
                if (!(j.ini < j.end)) return false
            }
        }
        return true;
    };

    $scope.clock = async function (ini, end) {
        if ($scope.validate()) {
            alert('Clocking from [' + ini + '] to [' + end + ']');

            while (ini <= end){
                let day = null;
                switch (ini.getDay()) {
                    case 1: day='monday'; break;
                    case 2: day='tuesday'; break;
                    case 3: day='wednesday'; break;
                    case 4: day='thursday'; break;
                    case 5: day='friday'; break;
                }
                if (day) {
                    console.log('Clocking ' + day);

                    let shifts = $scope.shifts[day];
                    for (let s of shifts) {
                        ini.setHours(parseInt(s.ini.split(':')[0]), parseInt(s.ini.split(':')[1]));
                        console.log("ini: " + ini);
                        await $scope.factorial.clock_in(ini);
                        ini.setHours(parseInt(s.end.split(':')[0]), parseInt(s.end.split(':')[1]));
                        console.log("end: " + ini);
                        await $scope.factorial.clock_out(ini);
                    }
                }

                ini.setDate(ini.getDate()+1);
            }

            // browser.tabs.reload();
        } else {
            alert('Please, ensure all time ranges are correct; I mean, they should start BEFORE they finish')
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

    $scope.clock_month = function () {
        // Set the date intervals
        d = new Date();
        ini = new Date(d.getFullYear(), d.getMonth(), 1);
        end = new Date(d.getFullYear(), d.getMonth()+1, 0);
        ini.setHours(0,0,0,0);
        end.setHours(23,59,59,59);
        $scope.clock(ini, end);
    };

    $scope.save_shifts = function () {
        if ($scope.validate()){
            browser.storage.local.set({shifts: $scope.shifts});
            alert('Preferences saved')
        }
    };

    $scope.add_shift = function(day){
        $scope.shifts[day].push({ini: "00:00", end: "23:59"});
        // Stupid trick
        setTimeout(window.reload_timepickers,500);
    };

    $scope.del_shift = function(day,ini,end){
        for (let i = 0; i<$scope.shifts[day].length; i++){
            const j = $scope.shifts[day][i];
            if ((j.ini === ini )&&(j.end === end)){
                $scope.shifts[day] = $scope.shifts[day].filter((value, index, arr)=>{return index!==i});
                break
            }
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

        $scope.factorial = new factorial();
        console.log('[+] - Loaded factorial core');
        await $scope.factorial.setup();
    }

    setup();
});

window.reload_timepickers = function(){
    const elems = document.querySelectorAll('.timepicker');
    const options = {twelveHour: false, autoClose: true};
    const instances = M.Timepicker.init(elems, options);
};

window.reload_collapsibles = function(){
    const elems = document.querySelectorAll('.collapsible');
    const options = {};
    const instances = M.Collapsible.init(elems, options);
};

window.onload = function () {
    window.reload_collapsibles();
    window.reload_timepickers()
};