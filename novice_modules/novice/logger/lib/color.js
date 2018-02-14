
const COLORS = {
      RESET : 0,
      BRIGHT : 1,
      DIM : 2,
      UNDERSCORE : 4,
      BLINK : 5,
      REVERSE : 7,
      HIDDEN : 8,
      FGBLACK : 30,
      FGRED : 31,
      FGGREEN : 32,
      FGYELLOW : 33,
      FGBLUE : 34,
      FGMAGENTA : 35,
      FGCYAN : 36,
      FGWHITE : 37
    };

/*BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"*/

module.exports = function color(colorName, sentence){
    return '\x1b['+ (COLORS[colorName] || 0) +'m'+ sentence +'\x1b[0m';
}
