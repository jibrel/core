const recast = require('recast');

class Compile {
  constructor(ast, transforms = []) {
    if (typeof ast === 'string') {
      ast = recast.parse(ast.replace(/\ $/, ''), {
        tolerant: true,
        range: true,
      });
    }

    this.ast = transforms.reduce((ast, transform) => {
      const next = transform(ast);

      if (!next) {
        throw new Error(`A transform unexpectedly returned ${next}`);
      }

      return next;
    }, ast);

    Object.defineProperty(this, 'errors', {
      get: function() {
        return this.ast.program.errors;
      },
    });
  }

  toString() {
    return recast.print(this.ast).code;
  }
}

module.exports = Compile;
