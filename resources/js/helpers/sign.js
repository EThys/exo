const sign = function() {
    return new Promise((resolve, reject) => {
        var isInstalled = document.documentElement.getAttribute('SigPlusExtLiteExtension-installed');
        if (!isInstalled) {
          alert("SigPlusExtLite extension is either not installed or disabled. Please install or enable extension.");
        }
        let imgWidth = "364"
        let imgHeight = "170"
        var message = { 
          "firstName": "", 
          "lastName": "", 
          "eMail": "", 
          "location": "", 
          "imageFormat": 1, 
          "imageX": imgWidth,
          "imageY": imgHeight, 
          "imageTransparency": false, 
          "imageScaling": false, 
          "maxUpScalePercent": 0.0,
          "rawDataFormat": "ENC", 
          "minSigPoints": 25 
        };
        top.document.addEventListener('SignResponse', SignResponse, false);
        var messageData = JSON.stringify(message);
        var element = document.createElement("MyExtensionDataElement");
        element.setAttribute("messageAttribute", messageData);
        document.documentElement.appendChild(element);
        var evt = document.createEvent("Events");
        evt.initEvent("SignStartEvent", true, false);
        element.dispatchEvent(evt);
        function SignResponse(event)
        {
          var str = event.target.getAttribute("msgAttribute");
          var obj = JSON.parse(str);
          //Process the response
          if(obj.isSigned) {
            resolve(obj)
          } else {
            reject(obj)
          }
        }

    })
  }

  export default sign