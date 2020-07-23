// Johnny-Fife uses stdin, which causes Electron to crash
// this reroutes stdin, so it can be used

var Readable = require("stream").Readable;  
var util = require("util");  
util.inherits(MyStream, Readable);  
function MyStream(opt) {  
  Readable.call(this, opt);
}
MyStream.prototype._read = function() {};  
// hook in our stream
process.__defineGetter__("stdin", function() {  
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

var five = require("johnny-five");
var board = new five.Board({
  repl: false // does not work with browser console
});

board.on("ready", function() {
  console.log('%cArduino ready');

  var phSensor = new five.Sensor("A0");
  
  phSensor.on("change", () => {

    const {value, raw} = phSensor;
  
    const pHVol=value*5.0/1024/6; //convert the analog into millivolt
    const phValue = -5.70 * pHVol + 21.34; //convert the millivolt into pH value
    const phValueAdjusted = ((phValue - 17.4)*10) - 0.20; //Calibrate the PH value according to the hardware
    
    $('#PH').html('PH : '+phValueAdjusted);
  });

  var tdsSensor = new five.Sensor("A1");
  
  tdsSensor.on("change", () => {

    const {value, raw} = tdsSensor;
  
    const phhValueADjusted = value+35 // Calibrate the Phh value according to the hardware
    $('#TDS').html('TDS : '+value + 'pph');

  });

});