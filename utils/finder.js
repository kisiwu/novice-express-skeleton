var fs = require('fs'),
    path = require('path');

module.exports = {
    __files(dir, filelist, subdir){

      var self = this;

      subdir = subdir || "";
      var files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = self["__files"](path.join(dir, file), filelist, path.join(subdir, file));
        }
        else {
          filelist.push(path.join(subdir, file));
        }
      });
      return filelist;
    },

    /**
    * @param {String} dir - directory where to look for files
    * @param {String} ext - extension files
    * @param {String} filename - file to exclude
    *
    * @return {Array} paths
    */
    files(dir, ext, filename){
      var files = this.__files(dir);
      files = files.map(function(file){
        return path.join(dir, file).replace(/\\{1,}/g, '/');
      });

      if(ext){
        files = files.filter(function(file){
          return file.substr(-(ext.length)) === ext;
        });
      }

      if(filename){
          filename = this.filename(filename);
          var idx = files.indexOf(filename);
          if(idx != -1){
            files.splice(idx, 1);
          }
      }
      return files;
    },

    __dirs(dir, filelist, subdir){

      var self = this;

      subdir = subdir || "";
      var files = fs.readdirSync(dir);
      filelist = filelist || [];
      files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist.push(path.join(subdir, file));
        }
      });
      return filelist;
    },

    dirs(dir, filename){
      var files = this.__dirs(dir);
      files = files.map(function(file){
        return path.join(dir, file).replace(/\\{1,}/g, '/');
      });

      if(filename){
          filename = this.filename(filename);
          var idx = files.indexOf(filename);
          if(idx != -1){
            files.splice(idx, 1);
          }
      }
      return files;
    },

    filename(name){
      return name.replace(/\\{1,}/g, '/');;
    },

    basename(name){
      return path.basename(name);
    },

    stat(filepath){
      return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stats) => {
          if(err)
            return reject(err);

          resolve(stats);
        });
      });
    }
};
