const Day = document.querySelector('.day');
const month = document.querySelector('.month-name');
const date = new Date();

const pre = document.querySelector('.left');
const next = document.querySelector('.right');

const todoField = document.querySelector('.todo');
const todoTitle = document.querySelector('.todo-title');
const todoList = document.querySelector('.todoList');

const input = document.querySelector('input[type="text"]');
const add = document.querySelector('.add');
const reset = document.querySelector('.reset');
const allReset = document.querySelector('.allreset');


let currentMon = 0;
let currentYear = 1;
let currentDay = 1;

let DayOfChoice = currentDay;
let MonOfChoice = currentMon;
let yearOfChoice = currentYear;

let year = currentYear;
let mon = currentMon;

let clickEventArr = [];
let storeToDo = [];

var season = ['봄', '여름', '가을', '겨울']; //스타듀밸리 계절

function isLeapYear(year) {
    return (year % 4 == 0) && (year % 400 == 0 || year % 100 != 0);
}

//달마다 일수 구함 -> 임시로 28일로 설정
function getDayOfMon(mon, year) {
    return 28;
}

//요일 구하는 함수인듯
function getDay(year, mon, date) {
    const conYMD = year + '-' + mon + '-' + date;
    return (new Date(conYMD).getDay());
}
function makeCalendar(year, mon, dayCount) {
    clickEventArr = [];
    Day.innerHTML = '';
    //let getFirstDay = getDay(year, mon, 1);
    let getFirstDay = 1
    let previousMon;
    if (currentMon - 1 < 0) {
        previousMon = 3;
    }
    else {
        previousMon = currentMon - 1;
    }
    let getDayOfPreMon = getDayOfMon(previousMon, year);
    for (let i = (getFirstDay + 6) % 7; i > 0; i--) {
        const listPre = document.createElement('li');
        listPre.textContent = `${getDayOfPreMon - (i - 1)}`;
        listPre.style.opacity = '0.5';
        listPre.classList.add('disabled');
        Day.appendChild(listPre);
    }

    for (let i = 1; i <= dayCount; i++) {
        if (i === currentDay && year === currentYear && mon === currentMon) {
            //선택한 년, 월, 일 다를 때 현재 날짜에 검은색 테두리
            const onlyOneList = document.createElement('li');

            onlyOneList.textContent = `${i}`;
            if (currentYear === yearOfChoice && currentMon === MonOfChoice && currentDay === DayOfChoice) {
                onlyOneList.style.border = '3px solid red';
            }
            else {
                onlyOneList.style.border = '3px solid black';
            }

            if (0 === getDay(year, mon, i)) {
                onlyOneList.style.color = 'red';
            }
            else if (6 == getDay(year, mon, i)) {
                onlyOneList.style.color = 'blue';
            }

            //현재 년, 월 같을 때

            Day.addEventListener('click', (event) => {
                if (event.target !== onlyOneList) {
                    onlyOneList.style.border = '3px solid black';
                }
            });

            Day.appendChild(onlyOneList);
            continue;
        }

        const list = document.createElement('li');
        list.textContent = `${i}`;
        if (i === DayOfChoice && year === yearOfChoice && mon === MonOfChoice) {
            list.style.border = '3px solid red';
            Day.addEventListener('click', (event) => {
                if (event.target !== list) {
                    list.style.border = 'none';
                }
            });
        }

        if (0 === getDay(year, mon, i)) {
            list.style.color = 'red';
        }
        else if (6 == getDay(year, mon, i)) {
            list.style.color = 'blue';
        }

        Day.appendChild(list);
    }
}

function setMonthTitle(year, mon) {
    month.textContent = `${year}년차 ${season[mon]}`
}

function nextMonthOrYear() {
    //봄여름가을겨울 기준으로 변경
    if (mon === 3) {
        year = year + 1;
        mon = 0;
    }
    else {
        mon = mon + 1;
    }
    setMonthTitle(year, mon);
    makeCalendar(year, mon, getDayOfMon(mon, year));
}

function preMonthOrYear() {
    //일단 임시방편으로... 1년차 봄에서 못넘어가게
    if (mon === 0 && year === 1) {}
    else if (mon === 0) {
        year = year - 1;
        mon = 3;
    }
    else {
        mon = mon - 1;
    }
    setMonthTitle(year, mon);
    makeCalendar(year, mon, getDayOfMon(mon, year));
}


function main() {
    setMonthTitle(year, mon);
    makeCalendar(year, mon, getDayOfMon(mon, year));
    todoTitle.textContent = `농부 민주(이/가) ${year}년차 ${season[mon]} ${currentDay}일차에 뭘 했을까 👀⁉`;
    displayToDoOnDays();
}

function displayToDoOnDays() {
    todoList.innerHTML = '';
    const YMD = year + '-' + mon + '-' + DayOfChoice;
    let arrayToDo;
    const elementToDo = document.createElement('li');
    if (!localStorage.getItem(YMD)) {
        return;
    }
    if (localStorage.getItem(YMD).includes(',')) {

        arrayToDo = localStorage.getItem(YMD).split(',');
        arrayToDo.forEach((value) => {
            const deleteBtn = document.createElement('button');
            deleteBtn.setAttribute('class', 'deleteBtn');
            deleteBtn.innerHTML = '<i class="far fa-minus-square"></i>';
            const elementToDo = document.createElement('li');

            elementToDo.innerText = value;
            elementToDo.appendChild(deleteBtn);

            elementToDo.scrollTo();

            todoList.appendChild(elementToDo);
        });

    }
    else {
        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'deleteBtn');
        deleteBtn.innerHTML = '<i class="far fa-minus-square"></i>';

        elementToDo.textContent = localStorage.getItem(YMD);
        elementToDo.appendChild(deleteBtn);
        todoList.appendChild(elementToDo);
    }
}

pre.addEventListener('click', preMonthOrYear);
next.addEventListener('click', nextMonthOrYear);


function clearEvent() {
    clickEventArr.forEach((value) => {
        value.style.border = 'none';
    });
}

Day.addEventListener('click', (event) => {
    if (event.target.tagName === 'UL') return;
    if (event.target.className !== 'disabled') {
        clearEvent();
        todoTitle.textContent = `농부 민주(이/가) ${year}년차 ${season[mon]} ${event.target.textContent}일차에 뭘 했을까 👀⁉`;
        event.target.style.border = '3px solid red';
        DayOfChoice = (event.target.textContent) * 1;
        MonOfChoice = mon;
        yearOfChoice = year;

        displayToDoOnDays();
        clickEventArr.push(event.target);
        console.log(clickEventArr);
        input.focus();
    }

});

function keepStore() {
    const YMD = year + '-' + mon + '-' + DayOfChoice;
    let arrayToDo;
    let arr = new Array();
    const elementToDo = document.createElement('li');
    if (!localStorage.getItem(YMD)) {
        return arr;
    }
    if (localStorage.getItem(YMD).includes(',')) {
        arrayToDo = localStorage.getItem(YMD).split(',');
        arrayToDo.forEach((value) => {
            arr.push(value);
        });
    }
    else {
        arr.push(localStorage.getItem(YMD));
    }
    return arr;
}

function addToDoList() {
    if (input.value === '') {
        alert('please input you are going to do');
        return;
    }

    storeToDo = keepStore();
    storeToDo.push(input.value);

    const YMD = year + '-' + mon + '-' + DayOfChoice;
    localStorage.setItem(YMD, storeToDo);

    displayToDoOnDays();
    input.value = "";
    input.focus();
}

add.addEventListener('click', (event) => {
    addToDoList();
});

input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addToDoList();
    }
});

reset.addEventListener('click', () => {
    const result = prompt(`Do you really want to reset TODO on ${year} ${season[mon]} ${DayOfChoice}? Enter (y/n)`);
    const YMD = year + '-' + mon + '-' + DayOfChoice;
    if (result === 'y') {
        localStorage.removeItem(YMD);
        displayToDoOnDays();
    }
});

allReset.addEventListener('click', () => {
    const result = prompt(`Do you really want to clear all TODO? Enter (y/n) not recomended💥`);
    if (result === 'y') {
        localStorage.clear();
        displayToDoOnDays();
    }
});

todoList.addEventListener('click', (event) => {
    if (event.target.className === 'far fa-minus-square') {
        console.log("a: " + event.target.parentNode.parentNode.textContent);

        const YMD = year + '-' + mon + '-' + DayOfChoice;

        if (localStorage.getItem(YMD).includes(',')) {
            let array = localStorage.getItem(YMD).split(',');
            let copyArray = [];
            array.forEach((value) => {
                if (value !== event.target.parentNode.parentNode.textContent) {
                    copyArray.push(value);
                }
            });
            localStorage.setItem(YMD, copyArray);
        }
        else {
            localStorage.removeItem(YMD);
        }

        todoList.removeChild(event.target.parentNode.parentNode);
    }
});

main();
