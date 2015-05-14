// Created by Tom Richardson 14/05/2015
// Exports the orderJob function for use in the tests

String.prototype.insert = function (index, string) {
  if (index > 0) return this.substring(0, index) + string + this.substring(index, this.length);
  else           return string + this;
};

function orderJobs(instructions) {
  if(instructions === "") return "";

  var instructionMap = [];

  instructions.split(',').forEach(function(instruction, index, arr) {
    var object = new Instruction(instruction, 
      function getDependency(key) {
        return instructionMap[key];
      });
    instructionMap[object.name] = object;
  });

  var ordered = "";
  for(key in instructionMap) {
    ordered = instructionMap.hasOwnProperty(key) 
              ? addInstruction(instructionMap[key], ordered) 
              : ordered;
  }

  console.log(ordered);
  return ordered;
};

function addInstruction(instruction, output, chain) {
  if(typeof chain === 'undefined') chain = "";
  if(chain.indexOf(instruction.name) !== -1) throw 'Circular dependency!';
  
  if(output.indexOf(instruction.name) === -1) {
    if(instruction.getDependency()){
      output = addInstruction(instruction.getDependency(), output, chain+instruction.name);
      output = output.insert(output.indexOf(instruction.getDependency().name)+1, instruction.name);
    } else {
      output += instruction.name;
    }
  }

  return output;
};

function Instruction(instruction, getDependency) {
  var _name, _dependency;

  _name = instruction[0];
  _dependency = instruction.length === 6 ? instruction[5] : null;

  if(_name === _dependency) throw "Instruction dependent on self";
  return {
    name: _name,
    getDependency: function() {
      var dependency = getDependency(_dependency);
      return typeof dependency === 'undefined' ? null : dependency;
    }
  };
};

module.exports = orderJobs;