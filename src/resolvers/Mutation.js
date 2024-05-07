const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');

// ユーザーの新規登録のリゾルバ
async function signup(parent, args, context) {
  // パスワード設定
  const password = await bcrypt.hash(args.password, 10); // パスワードをハッシュ化, 10はハッシュ化の強度
  // ユーザーの作成
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // JWTの生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 生成したJWTを返す
  return {
    token,
    user,
  };
}

// ユーザーのログインのリゾルバ
async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } });
  if (!user) {
    throw new Error('ユーザーが見つかりません');
  }

  // パスワードの照合
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('パスワードが間違っています');
  }
  // パスワードが正しい場合、JWTを生成して返す
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    }
  });

  // 送信
  context.pubsub.publish("NEW_LINK", newLink)

  return newLink
};

async function vote(parent, args, context) {
  const userId = context.userId

  // const vote = context.prisma.vote.findUnique({
  //   where: {
  //     linkId_userId: {
  //       linkId: Number(args.linkId),
  //       userId: userId
  //     }
  //   }
  // })

  // // 2回目の投票を防ぐ
  // if (Boolean(vote)) {
  //   throw new Error(`すでにその投稿には投票されています: ${args.linkId}`)
  // }

  //  投稿する
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } }
    }
  })
  // 送信
  context.pubsub.publish("NEW_VOTE", newVote)

  return newVote
}

module.exports = {
  signup,
  login,
  post,
  vote,
};

