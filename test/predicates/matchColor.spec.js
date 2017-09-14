'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchColor = require('../../src/predicates/matchColor');

describe('matchColor', () => {
  describe('default options', () => {
    it('should match colors', done => {
      matchColor(`w`, {colors: ["White"]}).should.equal(true);
      matchColor(`u`, {colors: ["Blue"]}).should.equal(true);
      matchColor(`b`, {colors: ["Black"]}).should.equal(true);
      matchColor(`r`, {colors: ["Red"]}).should.equal(true);
      matchColor(`g`, {colors: ["Green"]}).should.equal(true);
      done();
    });

    it('should not match wrong colors', done => {
      matchColor(`g`, {colors: ["White"]}).should.equal(false);
      matchColor(`w`, {colors: ["Blue"]}).should.equal(false);
      matchColor(`u`, {colors: ["Black"]}).should.equal(false);
      matchColor(`b`, {colors: ["Red"]}).should.equal(false);
      matchColor(`r`, {colors: ["Green"]}).should.equal(false);
      done();
    });

    it('should match multicolored cards', done => {
      matchColor(`w`, {colors: ["White", "Blue"]}).should.equal(true);
      matchColor(`u`, {colors: ["Blue", "Black"]}).should.equal(true);
      matchColor(`b`, {colors: ["Black", "Red"]}).should.equal(true);
      matchColor(`r`, {colors: ["Red", "Green"]}).should.equal(true);
      matchColor(`g`, {colors: ["Green", "White"]}).should.equal(true);
      done();
    });
  });

  describe('require multicolored', () => {
    it('should match multicolored cards', done => {
      matchColor(`wm`, {colors: ["White", "Blue"]}).should.equal(true);
      matchColor(`um`, {colors: ["Blue", "Black"]}).should.equal(true);
      matchColor(`bm`, {colors: ["Black", "Red"]}).should.equal(true);
      matchColor(`rm`, {colors: ["Red", "Green"]}).should.equal(true);
      matchColor(`gm`, {colors: ["Green", "White"]}).should.equal(true);
      done();
    });

    it('should skip mono-colored cards', done => {
      matchColor(`wm`, {colors: ["White"]}).should.equal(false);
      matchColor(`um`, {colors: ["Blue"]}).should.equal(false);
      matchColor(`bm`, {colors: ["Black"]}).should.equal(false);
      matchColor(`rm`, {colors: ["Red"]}).should.equal(false);
      matchColor(`gm`, {colors: ["Green"]}).should.equal(false);
      done();
    });

    it('should skip multi-colored cards of wrong color', done => {
      matchColor(`wm`, {colors: ["Blue", "Green", "Black"]}).should.equal(false);
      matchColor(`wubm`, {colors: ["Red", "Green"]}).should.equal(false);
      done();
    });

    it('should match multicolored cards with additional colors', done => {
      matchColor(`wum`, {colors: ["White", "Blue", "Green"]}).should.equal(true);
      matchColor(`wum`, {colors: ["White", "Red"]}).should.equal(true);
      matchColor(`wum`, {colors: ["Blue", "Black"]}).should.equal(true);
      done();
    });

  });

  describe('exclude unselected', () => {
    it('should exclude unselected colors', done => {
      matchColor(`!w`, {colors: ["White"]}).should.equal(true);
      matchColor(`!w`, {colors: ["White", "Blue"]}).should.equal(false);
      matchColor(`!wu`, {colors: ["White"]}).should.equal(true);
      matchColor(`!wu`, {colors: ["White", "Blue"]}).should.equal(true);
      matchColor(`!wu`, {colors: ["White", "Red"]}).should.equal(false);
      done();
    });
  });

  describe('exclude unselected & required multicolor', () => {
    it('should match exact colors', done => {
      matchColor(`!wum`, {colors: ["White", "Blue"]}).should.equal(true);
      matchColor(`!wugm`, {colors: ["White", "Blue", "Green"]}).should.equal(true);
      done();
    });

    it('should not match if card is mono-colored', done => {
      matchColor(`!wm`, {colors: ["White"]}).should.equal(false);
      done();
    });

    it('should not match if card has less colors', done => {
      matchColor(`!wum`, {colors: ["White"]}).should.equal(false);
      matchColor(`!wugrm`, {colors: ["White", "Blue", "Green"]}).should.equal(false);
      done();
    });

    it('should not match if card has more colors', done => {
      matchColor(`!wum`, {colors: ["White", "Blue", "Green"]}).should.equal(false);
      matchColor(`!wugrm`, {colors: ["White", "Blue", "Green", "Black", "Red"]}).should.equal(false);
      done();
    });

    it('should not match wrong colors', done => {
      matchColor(`!rwum`, {colors: ["White", "Blue", "Green"]}).should.equal(false);
      done();
    });
  });
});