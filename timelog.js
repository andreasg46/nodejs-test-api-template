const debug = process.env.DEBUGLOGS || false;

const timeLog = (message, type) => {
    if (type == null) {
        type = 'INFO';
    }
    if (type === 'DEBUG' && !debug) {
        return;
    }
    type = (type + '           ').substring(0, 8);
    const d = new Date();
    let month = '0' + d.getMonth() + 1;
    let day = '0' + d.getDate();
    const year = d.getFullYear();
    let hours = '0' + d.getHours();
    let minutes = '0' + d.getMinutes();
    let seconds = '0' + d.getSeconds();
    month = month.substring(month.length - 2);
    day = day.substring(day.length - 2);
    hours = hours.substring(hours.length - 2);
    minutes = minutes.substring(minutes.length - 2);
    seconds = seconds.substring(seconds.length - 2);
    return console.log(`${day}/${month}/${year} - ${hours}:${minutes}:${seconds} : ${type} : ${message}`);
};

module.exports = timeLog;
