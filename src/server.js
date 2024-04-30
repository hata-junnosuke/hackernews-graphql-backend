const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// HackerNewsのデータを格納
let links = [
  {
    id: 'link-0',
    description: 'GraphQLチュートリアルをUdemyで受講する',
    url: 'www.howtographql.com',
  },
]
// リゾルバを定義
const resolvers = {
  Query: {
    info: () => "HackerNewsクローン",
    feed: () => links
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }

      links.push(link);
      return link;
    }
  }
};

// ApolloServerをインスタンス化
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers
});

// サーバーを起動
server.listen().then(({ url }) => console.log(`${url}でサーバーが起動中・・・`));