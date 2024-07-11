export default function(count) {
    if(count) {
        let message = "Enregistrer avant de partir ?"
        window.onbeforeunload = function(event) {
            var e = e || window.event
            if (e) {
                e.returnValue = message
            }
            return message;
        }
    } else {
        window.onbeforeunload = null
    } 
}