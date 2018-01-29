var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type RandomDie{
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int! ): [Int]
}
  type Query {
    hello: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    getDie(numSides: Int): RandomDie
  }
`);

class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({ numRolls }) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

  var root = {
      hello: () => { return 'Hello World!'; },
      random: () => { return Math.random(); },
      rollThreeDice: () => { return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6)); },
      rollDice: ({numDice,numSides }) => {
          var output = [];
          for (var i = 0; i < numDice; i++) {
              output.push(1 + Math.floor(Math.random() * (numSides || 6)));
          }
          return output;
      },
      getDie: ({ numSides }) => { return new RandomDie(numSides || 6);}
};

//graphql(schema, '{hello}', root).then((response) => {
//    console.log(response);
//});

var app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');