const jwt = require('jsonwebtoken');
APP_SECRET = "Graphql"

// トークンを復号するための関数
function getTokenPayload(token){
  // トークン化された前の情報（user.id）を復号する
  return jwt.verify(token, APP_SECRET);
}

// ユーザーIDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    // リクエストヘッダーを確認
    const authHeader = req.headers.authorization;
    // 権限あるなら
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('トークンが見つかりませんでした');
      }
      // トークンを復号する
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    // クエリパラメータを確認
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error('ユーザーIDが見つかりません');
}

module.exports = {
  APP_SECRET,
  getUserId,
};