// Created by Tom Richardson 14/05/2015
// Spec file for testing orderJobs function.
// Tests defined here: http://invalidcast.tumblr.com/post/52980617776/the-ordered-jobs-kata

var orderJobs = require('../order.js');

describe("Jobs", function() {
  it("No jobs", function() {
    var instructions = "";
    var result = orderJobs(instructions);

    expect(result).toEqual("");
  });

  it("Single job", function() {
    var instructions = "a =>";
    var result = orderJobs(instructions);

    expect(result).toEqual("a");
  });

  it("Multiple jobs", function() {
    var instructions = "a =>,b =>,c=>";
    var result = orderJobs(instructions);

    expect(result.length).toEqual(3);
    expect(result.indexOf('a')).not.toEqual(-1);
    expect(result.indexOf('b')).not.toEqual(-1);
    expect(result.indexOf('c')).not.toEqual(-1);
  });

  it("Multiple jobs single dependency", function() {
    var instructions = "a =>,b => c,c=>";
    var result = orderJobs(instructions);

    expect(result.length).toEqual(3);
    expect(result.indexOf('a')).not.toEqual(-1);
    expect(result.indexOf('b')).not.toEqual(-1);
    expect(result.indexOf('c')).not.toEqual(-1);
    expect(result.indexOf('c')).toBeLessThan(result.indexOf('b'));
  });

  it("Multiple jobs multiple dependencies", function() {
    var instructions = "a =>,b => c,c => f,d => a,e => b,f =>";
    var result = orderJobs(instructions);

    expect(result.length).toEqual(6);
    expect(result.indexOf('a')).not.toEqual(-1);
    expect(result.indexOf('b')).not.toEqual(-1);
    expect(result.indexOf('c')).not.toEqual(-1);
    expect(result.indexOf('d')).not.toEqual(-1);
    expect(result.indexOf('e')).not.toEqual(-1);
    expect(result.indexOf('f')).not.toEqual(-1);
    expect(result.indexOf('c')).toBeLessThan(result.indexOf('b'));
    expect(result.indexOf('f')).toBeLessThan(result.indexOf('c'));
    expect(result.indexOf('a')).toBeLessThan(result.indexOf('d'));
    expect(result.indexOf('b')).toBeLessThan(result.indexOf('e'));
  });

  it("Self dependent job", function() {
    var instructions = "a =>,b =>,c => c";
    expect(function(){orderJobs(instructions);}).toThrow();
  });

  it("Circular dependency", function() {
    var instructions = "a =>,b => c,c => f,d => a,e =>,f => b";
    expect(function(){orderJobs(instructions);}).toThrow();
  });
});
