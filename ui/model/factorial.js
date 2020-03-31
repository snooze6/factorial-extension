class factorial {
    // async fetch(url, options){
    //     console.log('[+] - Fetching '+url);
    //     return
    // }

    constructor(){
        this.url_base = atob("aHR0cHM6Ly9hcGkuZmFjdG9yaWFsaHIuY29t");
        this.url_add  = this.url_base + "/attendance/shifts";
        this.url_edit = this.url_base + "/attendance/shifts/${shiftid}";
        this.url_see  = this.url_base + "/attendance/periods/${periodid}";
        this.url_access = this.url_base + "/accesses";
        this.url_shifts = this.url_base + "/attendance/shifts?year=${year}&month=${month}&employee_id=${employee}";
        this.url_periods = this.url_base + "/attendance/periods?year=${year}&month=${month}&employee_id=${employee}";
        this.url_clock_in = this.url_base + "/attendance/shifts/clock_in";
        this.url_clock_out = this.url_base + "/attendance/shifts/clock_out";
        this.headers =  {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "application/json;charset=utf-8",
        };
    }
    async getuid(){
        let r1 = await fetch(this.url_base + "/employees", {
            "credentials": "include",
            "headers": this.headers,
            "method": "GET",
            "mode": "cors"
        });
        let j1 = await r1.json();
        for (let i of j1){
            if (i['identifier']){
                this.identifier = i['identifier'];
                this.id = i['id'];
                this.access_id = i['access_id'];
                this.headers["X-Factorial-Access"] = this.access_id;
                console.log('[+] - Got access_id: '+this.access_id)

                return this.access_id;
            }
        }
        return null;
    }
    async getdata(year, month){
        let date = new Date();
        if (!year)
            year = date.getFullYear();
        if (!month)
            month = date.getMonth();
        let url1 = this.url_shifts
            .replace("${employee}",this.id)
            .replace("${month}",month)
            .replace("${year}",year);
        let url2 = this.url_periods
            .replace("${employee}",this.id)
            .replace("${month}",month)
            .replace("${year}",year);
        let r1 = await fetch(url1, {
            "credentials": "include",
            "headers": this.headers,
            "method": "GET",
            "mode": "cors"
        });
        let r2 = await fetch(url2, {
            "credentials": "include",
            "headers": this.headers,
            "method": "GET",
            "mode": "cors"
        });
        let j1 = await r1.json();
        let j2 = await r2.json();
        this.shifts = j1;
        this.periods = j2;

        console.log('[+] - Got shifts & periods')
        return {shifts: j1, periods: j2}
    }

    toISOLocal(d) {
        var z  = n =>  ('0' + n).slice(-2);
        var zz = n => ('00' + n).slice(-3);
        var off = d.getTimezoneOffset();
        var sign = off < 0? '+' : '-';
        off = Math.abs(off);

        return d.getFullYear() + '-'
            + z(d.getMonth()+1) + '-' +
            z(d.getDate()) + 'T' +
            z(d.getHours()) + ':'  +
            z(d.getMinutes()) + ':' +
            z(d.getSeconds()) + '.' +
            zz(d.getMilliseconds()) +
            sign + z(off/60|0) + ':' + z(off%60);
    }

    async clock_in(date){
        await fetch(this.url_clock_in, {
            "credentials": "include",
            "headers": this.headers,
            "body": "{\"now\":\""+(this.toISOLocal(date).split('.')[0])+"\"}",
            "method": "POST",
            "mode": "cors"
        });
    }
    async clock_out(date){
        await fetch(this.url_clock_out, {
            "credentials": "include",
            "headers": this.headers,
            "body": "{\"now\":\""+(this.toISOLocal(date).split('.')[0])+"\"}",
            "method": "POST",
            "mode": "cors"
        });
    }
    async clock(date_ini, date_end, week_hours){
        console.log('{');
        console.log('  From: '+date_ini.toString()+',');
        console.log('  To: '+date_end.toString()+',');
        console.log('  [');
        while (date_ini <= date_end){
            let time;
            time = week_hours[date_ini.getDay()]; //hours can be 8, 7 or 0.
            let periods = [];
            if (time==8){
                date_ini.setHours(10,0,0); periods.push(new Date(date_ini));
                await this.clock_in(date_ini);
                date_ini.setHours(15,0,0); periods.push(new Date(date_ini));
                await this.clock_out(date_ini);
                date_ini.setHours(16,0,0); periods.push(new Date(date_ini));
                await this.clock_in(date_ini);
                date_ini.setHours(19,0,0); periods.push(new Date(date_ini));
                await this.clock_out(date_ini);
            }
            if (time==7){
                date_ini.setHours(9,0,0); periods.push(new Date(date_ini));
                await this.clock_in(date_ini);
                date_ini.setHours(16,0,0); periods.push(new Date(date_ini));
                await this.clock_out(date_ini);
            }
            date_ini.setDate(date_ini.getDate()+1);
            let datestring = "";
            for (let i of periods){
                datestring += this.toISOLocal(i)+',';
            }
            datestring = datestring.slice(0,-1);
            if (date_ini <= date_end)
                console.log('  { hours: '+time+', ['+datestring+'],');
            else
                console.log('  { hours: '+time+', ['+datestring+']');
        }
        console.log('  ]');
        console.log('}');
    }
    async setup(){
        await this.getuid();
        await this.getdata();
    }

    async doit(){
        // Init Factorial object
        let f = new factorial();
        await f.setup();
        // Set the date intervals
        let monday = new Date();
        let sunday = new Date();
        monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7); //WTF
        sunday.setDate(monday.getDate() + 6);
        // Doit!
        await f.clock(monday, sunday, {1: 8, 2: 8, 3: 8, 4: 8, 5: 7, 6: 0, 7: 0});
    }
}