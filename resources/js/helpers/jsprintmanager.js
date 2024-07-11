//Check JSPM WebSocket status
const jspmWSStatus = function () {
    if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open)
        return true;
    else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Closed) {
        alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
        return false;
    }
    else if (JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.BlackListed) {
        alert('JSPM has blacklisted this website!');
        return false;
    }
}

const jspmInit = function () {
    //WebSocket settings
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.WS.onStatusChanged = function () {
      if (jspmWSStatus()) {
        //get client installed printers
        JSPM.JSPrintManager.getPrinters().then(function (myPrinters) {
          that.printer = myPrinters[0]
          that.printers = myPrinters
        });
      }
    };
}

export { jspmWSStatus }