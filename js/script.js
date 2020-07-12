var Calendar = function(model, options, date){
    this.Options = {
        NavShow: true,
        DateTimeShow: true,
        EventClick: '',
        DisabledDays: [],
        ModelChange: model
    };

    for(var key in options){
        this.Options[key] = typeof options[key]=='string'?options[key].toLowerCase():options[key];
    }

    model?this.Model=model:this.Model={};
    this.Today = new Date(2013,2,2) ;

    this.Selected = this.Today
    this.Today.Month = this.Today.getMonth();
    this.Today.Year = this.Today.getFullYear();
    if(date){this.Selected = date}
    this.Selected.Month = this.Selected.getMonth();
    this.Selected.Year = this.Selected.getFullYear();

    this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
    this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 0).getDay();
    this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

    this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
    if(this.Selected.Month===0){this.Prev = new Date(this.Selected.Year-1, 11, 1);}
    this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
};

function createCalendar(calendar, element, adjuster){
    if(typeof adjuster !== 'undefined'){
        var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
        calendar = new Calendar(calendar.Model, calendar.Options, newDate);
        element.innerHTML = '';
    }else{
        for(var key in calendar.Options){
            typeof calendar.Options[key] != 'function' && typeof calendar.Options[key] != 'object' && calendar.Options[key]?element.className += " " + key + "-" + calendar.Options[key]:0;
        }
    }
    var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var mainSection = document.createElement('div');
    mainSection.className += "calendar-main";

    function AddDateTime(){
        var datetime = document.createElement('div');
        datetime.className += "calendar-datetime";
        if(calendar.Options.NavShow && !calendar.Options.NavVertical){
            var rwd = document.createElement('div');
            rwd.className += "calendar-left calendar-nav";
            rwd.addEventListener('click', function(){createCalendar(calendar, element, -1);} );
            rwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
            datetime.appendChild(rwd);
        }
        var today = document.createElement('div');
        today.className += ' calendar-today';
        today.innerHTML = months[calendar.Selected.Month] + " " + calendar.Selected.Year;
        datetime.appendChild(today);
        if(calendar.Options.NavShow && !calendar.Options.NavVertical){
            var fwd = document.createElement('div');
            fwd.className += "calendar-right calendar-nav";
            fwd.addEventListener('click', function(){createCalendar(calendar, element, 1);} );
            fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
            datetime.appendChild(fwd);
        }
        if(calendar.Options.DatetimeLocation){
            document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
            document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
        }
        else{mainSection.appendChild(datetime);}
        var dayToday = document.createElement('div');
        dayToday.className = "calendar-dayToday"
        dayToday.innerHTML = 'Сегодня'
        datetime.appendChild(dayToday)
    }

    function AddLabels(){
        var labels = document.createElement('div');
        labels.className = 'calendar-daysWeek';
        var labelsList = ["Понедельник,", "Вторник,", "Среда,", "Четверг,", "Пятница,", "Суббота,", "Воскресенье,"];
        for(var i = 0; i < labelsList.length; i++){
            var label = document.createElement('div');
            label.className += "calendar-daysWeek__label";
            label.innerHTML = labelsList[i];
            labels.appendChild(label);
        }
        mainSection.appendChild(labels);
    }

    function AddDays(){
        function DayNumber(n){
            var number = document.createElement('div');
            number.className += " calendar-number";
            number.innerHTML += n;
            return number;
        }
        var days = document.createElement('div');
        days.className += " calendar-days";
        for(var i = 0; i < (calendar.Selected.FirstDay); i++){
            var day = document.createElement('div');
            day.className += " calendar-days__prevMonth";
            var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i+1));
            day.appendChild(number);
            days.appendChild(day);
        }
        for(var i = 0; i < calendar.Selected.Days; i++){
            var day = document.createElement('div');
            day.className += " calendar-days__currMonth";
            var number = DayNumber(i+1);
            for(var n = 0; n < calendar.Model.length; n++){
                var evDate = calendar.Model[n].Date;
                var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i+1));
                if(evDate.getTime() == toDate.getTime()){
                    number.className += " calendar-event";
                    var title = document.createElement('div');
                    title.className += " calendar-event__title";
                    if(typeof calendar.Model[n].Link == 'function' || calendar.Options.EventClick){
                        var a = document.createElement('div');
                        a.innerHTML += calendar.Model[n].Title;
                        if(calendar.Options.EventClick){
                            var z = calendar.Model[n].Link;
                            if(typeof calendar.Model[n].Link != 'string'){
                                a.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
                                if(calendar.Options.EventTargetWholeDay){
                                    day.className += " clickable";
                                    day.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)) );
                                }
                            }else{
                                a.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
                                if(calendar.Options.EventTargetWholeDay){
                                    day.className += " clickable";
                                    day.addEventListener('click', calendar.Options.EventClick.bind(null, z) );
                                }
                            }
                        }else{
                            a.addEventListener('click', calendar.Model[n].Link);
                            if(calendar.Options.EventTargetWholeDay){
                                day.className += " clickable";
                                day.addEventListener('click', calendar.Model[n].Link);
                            }
                        }
                        title.appendChild(a);
                    }else{
                        title.innerHTML += '<div>' + calendar.Model[n].Title + '</div>';
                    }
                    number.appendChild(title);
                }
            }
            day.appendChild(number);
            if((i+1) == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year){
                day.className += " calendar-today";
            }
            days.appendChild(day);
        }
        var extraDays = 7;
        if(days.children.length === 35){extraDays = 0;}
        for(var i = 0; i < (extraDays - calendar.Selected.LastDay); i++){
            var day = document.createElement('div');
            day.className += "calendar-days__nextMonth";
            var number = DayNumber(i+1);
            day.appendChild(number);
            days.appendChild(day);
        }
        mainSection.appendChild(days);
    }
    element.appendChild(mainSection);
    if(calendar.Options.DateTimeShow){
        AddDateTime();
    }
    AddLabels();
    AddDays();
}

function calendar(el, data, settings){
    var obj = new Calendar(data, settings);
    createCalendar(obj, el);
}

var events = [
    {'Date': new Date(2013, 2, 9), 'Title': '<span>Напиться!</span><br>Витя Костин, Петр Михайлов'},
    {'Date': new Date(2013, 2, 22), 'Title': '<span>ДР!</span><br>Дима Молодцов'},
];
var settings = {};
var element = document.getElementById('calendar');
calendar(element, events, settings);