import { GraphQLServer } from "graphql-yoga";

let todos = [
  {
    id: "1",
    text: "Learn GraphQL + Solid",
    done: false,
  }
];

const typeDefs = `
    type Todo {
        id: ID!
        done: Boolean!
        text: String!
    }
    type Query {
        getTodos: [Todo]!
    }
`;

const resolvers = {
  Query: {
    getTodos: () => todos,
  }
};

const server = new GraphQLServer({
  typeDefs, resolvers
});

server.start(() => console.log("Server is running on https://localhost:4000"));