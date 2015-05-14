// Created by Tom Richardson 14/05/2015
// Exports the orderJob function for use in the tests

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

function orderJobs(instructions) {
  if(instructions === "") return "";
  var instruction = instructions.split(',').map(function(element){
    return new Instruction(element);
  });

  var instructionMap = [];
  instruction.forEach(function(element, index) {
    instructionMap[element.name] = element;
  });

  var ordered = "";

  instruction.forEach(function(element, index) {
    ordered = addInstruction(element, instructionMap, ordered);
  });

  console.log(ordered);
  return ordered;
};

function addInstruction(instruction, instructionMap, output, chain){
  if(typeof chain === 'undefined') chain = "";
  if(chain.indexOf(instruction.name) !== -1) {
    throw 'Circular dependency!';
  }
  if(output.indexOf(instruction.name) === -1){
    if(instruction.dependency){
      output = addInstruction(instructionMap[instruction.dependency], instructionMap, output, chain+instruction.name);
      var dependencyIndex = output.indexOf(instruction.dependency);
      if(dependencyIndex >= output.length){
        output += instruction.name;
      } else {
        output = output.insert(dependencyIndex+1, instruction.name);
      }
    } else {
      output += instruction.name;
    }
  }

  return output;
};

function Instruction(instruction){
  var _name, _dependency;

  _name = instruction[0];
  _dependency = instruction.length === 6 ? instruction[5] : null;

  if(_name === _dependency) throw "Instruction dependent on self";
  return {
    name: _name,
    dependency: _dependency
  };
};

module.exports = orderJobs;