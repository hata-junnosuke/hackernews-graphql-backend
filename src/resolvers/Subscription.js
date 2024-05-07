// 受信者側の設定
function newLinkSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_LINK") //NEW_LINKを送信側と結びつける
}

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload
  }
}

function newVoteSubscribe(parent, args, context) {
  return context.pubsub.asyncIterator("NEW_VOTE") //NEW_LINKを送信側と結びつける
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload
  }
}

module.exports = {
  newLink,
  newVote,
}

