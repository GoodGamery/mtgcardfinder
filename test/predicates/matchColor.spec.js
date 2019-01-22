'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
chai.should();

const matchColor = require('../../src/predicates/matchColor');

describe('matchColor', () => {
  describe('default options', () => {
    it('should match colors', done => {
      matchColor(`w`, {colors: ["W"]}).should.equal(true);
      matchColor(`u`, {colors: ["U"]}).should.equal(true);
      matchColor(`b`, {colors: ["B"]}).should.equal(true);
      matchColor(`r`, {colors: ["R"]}).should.equal(true);
      matchColor(`g`, {colors: ["G"]}).should.equal(true);
      done();
    });

    it('should not match wrong colors', done => {
      matchColor(`g`, {colors: ["W"]}).should.equal(false);
      matchColor(`w`, {colors: ["U"]}).should.equal(false);
      matchColor(`u`, {colors: ["B"]}).should.equal(false);
      matchColor(`b`, {colors: ["R"]}).should.equal(false);
      matchColor(`r`, {colors: ["G"]}).should.equal(false);
      done();
    });

    it('should match multicolored cards', done => {
      matchColor(`w`, {colors: ["W", "U"]}).should.equal(true);
      matchColor(`u`, {colors: ["U", "B"]}).should.equal(true);
      matchColor(`b`, {colors: ["B", "R"]}).should.equal(true);
      matchColor(`r`, {colors: ["R", "G"]}).should.equal(true);
      matchColor(`g`, {colors: ["G", "W"]}).should.equal(true);
      done();
    });
  });

  describe('require multicolored', () => {
    it('should match multicolored cards', done => {
      matchColor(`wm`, {colors: ["W", "U"]}).should.equal(true);
      matchColor(`um`, {colors: ["U", "B"]}).should.equal(true);
      matchColor(`bm`, {colors: ["B", "R"]}).should.equal(true);
      matchColor(`rm`, {colors: ["R", "G"]}).should.equal(true);
      matchColor(`gm`, {colors: ["G", "W"]}).should.equal(true);
      done();
    });

    it('should skip mono-colored cards', done => {
      matchColor(`wm`, {colors: ["W"]}).should.equal(false);
      matchColor(`um`, {colors: ["U"]}).should.equal(false);
      matchColor(`bm`, {colors: ["B"]}).should.equal(false);
      matchColor(`rm`, {colors: ["R"]}).should.equal(false);
      matchColor(`gm`, {colors: ["G"]}).should.equal(false);
      done();
    });

    it('should skip multi-colored cards of wrong color', done => {
      matchColor(`wm`, {colors: ["B", "G", "B"]}).should.equal(false);
      matchColor(`wubm`, {colors: ["R", "G"]}).should.equal(false);
      done();
    });

    it('should match multicolored cards with additional colors', done => {
      matchColor(`wum`, {colors: ["W", "U", "G"]}).should.equal(true);
      matchColor(`wum`, {colors: ["W", "R"]}).should.equal(true);
      matchColor(`wum`, {colors: ["U", "B"]}).should.equal(true);
      done();
    });

  });

  describe('exclude unselected', () => {
    it('should exclude unselected colors', done => {
      matchColor(`!w`, {colors: ["W"]}).should.equal(true);
      matchColor(`!w`, {colors: ["W", "U"]}).should.equal(false);
      matchColor(`!wu`, {colors: ["W"]}).should.equal(true);
      matchColor(`!wu`, {colors: ["W", "U"]}).should.equal(true);
      matchColor(`!wu`, {colors: ["W", "R"]}).should.equal(false);
      done();
    });
  });

  describe('exclude unselected & required multicolor', () => {
    it('should match exact colors', done => {
      matchColor(`!wum`, {colors: ["W", "U"]}).should.equal(true);
      matchColor(`!wugm`, {colors: ["W", "U", "G"]}).should.equal(true);
      done();
    });

    it('should not match if card is mono-colored', done => {
      matchColor(`!wm`, {colors: ["W"]}).should.equal(false);
      done();
    });

    it('should not match if card has less colors', done => {
      matchColor(`!wum`, {colors: ["W"]}).should.equal(false);
      matchColor(`!wugrm`, {colors: ["W", "U", "G"]}).should.equal(false);
      done();
    });

    it('should not match if card has more colors', done => {
      matchColor(`!wum`, {colors: ["W", "U", "G"]}).should.equal(false);
      matchColor(`!wugrm`, {colors: ["W", "U", "G", "B", "R"]}).should.equal(false);
      done();
    });

    it('should not match wrong colors', done => {
      matchColor(`!rwum`, {colors: ["W", "U", "G"]}).should.equal(false);
      done();
    });
  });
});