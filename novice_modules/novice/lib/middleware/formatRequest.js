module.exports = function(novice, req){
  if (!req.novice)
    req.novice = novice;
}
