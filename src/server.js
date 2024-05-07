const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const {getUserId} = require('./utils');

// リゾルバートをインポート
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Vote = require('./resolvers/Vote');

// サブスクリプションの実装
// Publisher(送信者)/Subscriber(受信者)
const { PubSub } = require("apollo-server")

const prisma = new PrismaClient();
const pubsub = new PubSub()

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
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

// ApolloServerをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null
    } 
  }
});

// サーバーを起動
server.listen().then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));