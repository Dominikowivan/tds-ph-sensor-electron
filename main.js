// Johnny-Fife uses stdin, which causes Electron to crash
// this reroutes stdin, so it can be used

var Readable = require("stream").Readable;
var util = require("util");
util.inherits(MyStream, Readable);
function MyStream(opt) {
  Readable.call(this, opt);
}
MyStream.prototype._read = function () {};
// hook in our stream
process.__defineGetter__("stdin", function () {
  if (process.__stdin) return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

const pphAdjustment = 35;

// Uso de Johnny five:

// Se importa Johnny five
var five = require("johnny-five");

// Se crea el board
var board = new five.Board({
  repl: false,
});

// Cuando el board este listo, ejecuta el callback
board.on("ready", function () {
  console.log("%cArduino ready");

  // Obtiene el sensor de PH conectado a la entrada A0
  var phSensor = new five.Sensor("A0");

  phSensor.on("change", () => {
    //Cuando cambia
    const { value, raw } = phSensor;

    // Adata el valor analogo sensado  a valor PH
    const pHVol = (value * 5.0) / 1024 / 6; //convert the analog into millivolt
    const phValue = -5.7 * pHVol + 21.34; //convert the millivolt into pH value
    const phValueAdjusted = (phValue - 17.4) * 10 - 0.2; //Calibrate the PH value according to the hardware

    // Finalmente, renderiza el valor
    $("#PH").html("PH : " + phValueAdjusted);
  });

  // Obtiene el sensor de TDS
  var tdsSensor = new five.Sensor("A1");

  tdsSensor.on("change", () => {
    // Cuando cambia
    const { value, raw } = tdsSensor;

    // Adata el valor analogo sensado y lo ajusta a phh
    const phhValueADjusted = value + pphAdjustment;

    $("#TDS").html("TDS : " + value + "pph");
  });
});
