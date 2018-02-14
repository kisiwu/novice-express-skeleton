const util = require('util');


function arrayToString(arr){
            return Array.from(arr).map(function(x){
                if(Array.isArray(x)){
                    return "["+arrayToString(x)+"]";
                }
                else if(typeof x === "object"){
                    var v = x;
                    try{
                      v = JSON.stringify(x, null, ' ');
                    }catch(e){
                      v = JSON.stringify(util.inspect(x, { depth: null })).replace("\\n","");
                    }
                    return v;
                }
                else{
                    return x;
                }
            }).join(" ");
}

function doLog(colorNumber, name, args){
/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/
    var stream = process.stdout;
    stream.write('Novice \x1b['+ colorNumber +'m'+ name +'\x1b[0m : \x1b['+ colorNumber +'m');
    var line = arrayToString(args);
    stream.write(line + "\x1b[0m" + "\n");
}

module.exports = {
    log: function(){
        doLog(0, 'log', arguments);
    },

    info: function(){
        doLog(36, 'info', arguments);
    },

    debug: function(){
        doLog(45, 'debug', arguments);
    },

    warn: function(){
        doLog(33, 'warn',arguments);
    },

    error: function(){
        doLog(31, 'error',arguments);
    },

    silly: function(){
        doLog(2, 'silly',arguments);
    }
};
