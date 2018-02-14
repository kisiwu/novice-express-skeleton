'use strict';

module.exports = class ServiceTest {
  constructor(hauteur, largeur, autre, autre2) {
      //console.log(autre);console.log(autre2);
    this.hauteur = hauteur;
    this.largeur = largeur;
  }

  get area() {
    return this.calcArea();
  }

  calcArea() {
    return this.largeur * this.hauteur;
  }
};
