var CryptoJS = require("crypto-js");

const HASHERS = [
    "md5",
    "sha1",
    "sha256",
    "sha224",
    "sha512",
    "sha384",
    "sha3",
    "ripemd160"
];

module.exports = function Crypto64(args, novice){

    var secretKey = novice.parameterBag.resolve(args.secretKey || "crypto64");

    var hasher = novice.parameterBag.resolve(args.hasher || "sha256");
    hasher = require("crypto-js/"+hasher);
    var salt = novice.parameterBag.resolve(args.salt || CryptoJS.lib.WordArray.random(128/8));
    var keySize = 256/32;

    function encode(data){
        return CryptoJS.AES.encrypt(data, secretKey);
    }

    function encodeObject(data){
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
    }

    function decodeObject(ciphertext){
        var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    }

    function decode(ciphertext){
        var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    function hashPassword(password){
      //return CryptoJS.HmacSHA512(password, secretKey).toString();
      return CryptoJS.PBKDF2(password.toString(), salt, { keySize:  keySize}).toString();
    }

    function hashcode(clearPass){
      return encode(hashPassword(clearPass)).toString()
    }

    function comparePasswords(clearPass, encodedHashedPass){
      encodedHashedPass = decode(encodedHashedPass);
      clearPass = hashPassword(clearPass);
      return clearPass == encodedHashedPass;
    }


    return {
        encode: encode,
        decode: decode,
        encodeObject: encodeObject,
        decodeObject: decodeObject,

        hashPassword: hashPassword,
        hashcode: hashcode,
        comparePasswords: comparePasswords
    };

}
