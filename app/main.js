var csvContent = "data:text/csv;charset=utf-8,Name,Status,Time,Date\n";
var globIntId = -1;
var buttonAdded = false;
function f() {
    try {
        b = document.querySelector('#main > header > div>div>span').textContent;
        name = document.querySelectorAll('#main > header > div>div>div>span')[1].textContent;
    } catch (TypeError) {
        return;
    }
    if (b === "typing…" && typing) {
        typing = false;
        if (checkPermission()) {
            var not = new Notification(name + " Typing");
            tm = new Date();
            csvContent += name + ",startedTyping," + tm.toLocaleTimeString() + "," + tm.toLocaleDateString() + "\n";
        }
    }
    if (b === "online" || b === "typing…") {
        if (b === "online") {
            typing = true;
        }
        if (!online || name !== lastName || ft) {
            online = true;
            lastName = name;
            ft = false;
            onlineTimeObj = new Date();
            onlineTimeMs = onlineTimeObj.getTime();
            onlineTimeStr = onlineTimeObj.toLocaleString();
            console.log(name + ",Online," + onlineTimeObj.toLocaleTimeString() + "," + onlineTimeObj.toLocaleDateString() + "\n");
            csvContent += name + ",Online," + onlineTimeObj.toLocaleTimeString() + "," + onlineTimeObj.toLocaleDateString() + "\n";
            if (checkPermission()) {
                var not = new Notification(name + " Online",{
                    body: onlineTimeStr
                });
            }
        }
    }
    if (b.search("last seen") > -1) {
        if (online || ft || name !== lastName) {
            online = false;
            ft = false;
            lastName = name;
            typing = true;
            offlineTimeObj = new Date();
            offlineTimeMs = offlineTimeObj.getTime();
            offlineTimeStr = offlineTimeObj.toLocaleString();
            console.log(name + ",0," + offlineTimeObj.toLocaleTimeString() + "," + offlineTimeObj.toLocaleDateString() + "\n");
            csvContent += name + ",0," + offlineTimeObj.toLocaleTimeString() + "," + offlineTimeObj.toLocaleDateString() + "\n";
            if (checkPermission()) {
                var not = new Notification(name + " Offline",{
                    body: b
                });
            }
        }
    }
}
function monitor(intervalId) {
    intervalId = intervalId || false;
    ft = true;
    online = false;
    typing = true;
    csvContent = "data:text/csv;charset=utf-8,Name,Status,Time,Date\n";
    if (!buttonAdded) {
        putCSVLink();
        putStopButton();
        buttonAdded = true;
    }
    try {
        lastName = document.querySelector("#main > header > div.chat-body > div.chat-main > h2 > span");
    } catch (TypeError) {
        return;
    }
    if (intervalId !== false) {
        clearInterval(intervalId);
        globIntId = -1;
        return true;
    }
    interval = setInterval(f, 1000);
    globIntId = interval;
    alert("Start");
    return interval;
}
function checkPermission() {
    if (!("Notification"in window)) {
        return flase;
    }
    else if (Notification.permission === "granted") {
        return true;
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            if (permission === "granted") {
                return true;
            }
        });
    }
}
function getCSV(data) {
    data = encodeURI(data);
onlineTimeObj = new Date();
    var link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "monitor_data_"+onlineTimeObj.toLocaleTimeString()+".csv");
    document.body.appendChild(link);
    link.click();
}
function getOnlineData() {
    getCSV(csvContent);
}
function putCSVLink() {
    var button = document.createElement("button");
    button.textContent = "GetOnlineCSV";
    button.className = "online-monitor";
    button.style = "padding: 0px 10px 0px 10px"
    button.onclick = getOnlineData;
    var sideBar = document.querySelector("#side > header");
    sideBar.appendChild(button);
}
function toggleButton() {
    if (globIntId === -1) {
        monitor();
        this.textContent = "Stop";
    } else {
        clearInterval(globIntId);
        globIntId = -1;
        alert("Stopped");
        this.textContent = "Start";
        console.log("Stopped");
    }
}
function putStopButton() {
    var button = document.createElement("button");
    button.className = "online-monitor";
    button.textContent = "Toggle";
    button.onclick = toggleButton;
    var sideBar = document.querySelector("#side > header");
    sideBar.appendChild(button);
}
monitor();
