const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// HackerNewsのデータを格納
// let links = [
//   {
//     id: 'link-0',
//     description: 'GraphQLチュートリアルをUdemyで受講する',
//     url: 'www.howtographql.com',
//   },
// ]
// リゾルバを定義
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    }
  },

  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      })
      return newLink;
    }
  }
};

// ApolloServerをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: { prisma }
});

// サーバーを起動
server.listen().then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));