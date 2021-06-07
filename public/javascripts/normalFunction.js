require('dotenv').config()

function convertDate(add) {
    var hours = `${process.env.hours}`
    var mins = `${process.env.mins}`

    var date = new Date();
    date.setDate(new Date().getDate() + add + 1);
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var dd = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    var convertedDate = new Date(yyyy, mm, dd, parseInt(hours), parseInt(mins))
    return convertedDate;
}

module.exports = {
    convertDate
}