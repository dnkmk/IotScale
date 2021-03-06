﻿var Scale = (function(){
    var self = {};
    var lastRead = 0;
    var component;
    if (typeof Components != 'undefined')
        component = new Components.Scale();
    else
        component = {
            getReading: function () { return Math.random(); },
            tare: function () { },
            calibrate: function () { },
            leadingUnit: "",
            trailingUnit: " g"
        };
    var isReading = false;
    var readingIntervalId;
    var leadingUnit = "";
    var trailingUnit = "";

    function writeReading() {
        $("#result").text( lastRead);
    }
    function read() {
        lastRead = component.getReading();
        writeReading();
    }
    function setUnits(calibrationText, currentWeightText) {
        var parts = calibrationText.split(currentWeightText);
        leadingUnit = parts[0];
        trailingUnit = parts.splice(1).join(currentWeightText);
    }
    self.beginReading = WinJS.UI.eventHandler(function () {
        if (!isReading) {
            isReading = true;
            readingIntervalId = setInterval(read, 5000);
        }
    });
    self.pauseReading = WinJS.UI.eventHandler(function () {
        window.clearInterval(readingIntervalId);
        isReading = false;
    });
        
    self.readOnce = WinJS.UI.eventHandler(read);
    self.tare = WinJS.UI.eventHandler(function () {
        component.tare();
        read();
        writeReading();
    });
    self.calibrate = WinJS.UI.eventHandler(function () {
        var calibrationText = $('#input-calibrate input').val();
        var currentWeightText = calibrationText.match(/[0-9]+(\.)?([0-9]+)?|([0-9]+)?(\.)([0-9]+)/g)[0] || "1";
        var currentWeight = 1;
        if (Number(currentWeightText) !== 0) {
            currentWeight = Number(currentWeightText);
            setUnits(calibrationText, currentWeightText);
        }
        component.trailingUnit = trailingUnit;
        component.leadingUnit = leadingUnit;
        component.calibrate(currentWeight);
    });
    return self;
})();
