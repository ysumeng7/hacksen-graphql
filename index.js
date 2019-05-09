const { ApolloServer, gql } = require("apollo-server");

const { avengers } = require("./model");

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # The "Query" type is the root of all GraphQL queries.
  type Query {
    avengers: [Avenger]
    avenger(uid: String!): Avenger
  }

  type Mutation {
    createAvenger(
      uid: String!
      power: String!
      real_name: String!
      famous_quotes: [String!]
      relationships: RelationshipInput
    ): Avenger!
  }
  """
  Earth's Greatest Heroes
  """
  type Avenger {
    uid: String!
    power: String
    real_name: String
    famous_quotes: [String]
    relationships: Relationship
  }

  # This "Relationship" type can be used in other type declarations.
  type Relationship {
    villain: String
    favourite_person: String
  }

  input RelationshipInput {
    villain: String
    favourite_person: String
  }
`;

// Resolvers define the technique for fetching the types in the schema
const resolvers = {
  Query: {
    avengers: () => avengers,
    avenger: (parent, { uid }) => avengers.find(avenger => avenger.uid === uid)
  },
  Mutation: {
    createAvenger: (
      parent,
      { uid, power, real_name, famous_quotes, relationships },
      context,
      info
    ) => {
      const newAvenger = {
        uid,
        power,
        real_name,
        famous_quotes,
        relationships
      };

      avengers.push(newAvenger);

      return newAvenger;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
