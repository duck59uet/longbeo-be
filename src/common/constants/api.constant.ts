export const CONTROLLER_CONSTANTS = {
  AUTH: 'auth',
  USER: 'user',
  ORDER: 'order',
  TOPUP: 'topup',
  BALANCE: 'balance',
};
export const URL_CONSTANTS = {
  CONNECT_WALLET: 'connect_wallet',
  CREATE_USER: 'create',
  UPDATE_USER: '/update',
  UPDATE_USER_ROLE: 'update-role',
  CREATE_COLLECTION: 'create-collection',
  GET_COLLECTION_ID: '/:id',
  AUTH: 'auth',
  GET_CONTRACT_BY_ADDRESS: ':contractAddress',
  GET_CHART_BY_ADDRESS: 'chart/:symbol',
  HOLDER_DISTRIBUTION: 'holder/:id',
  UPLOAD_GCP: 'image/gcp',
  ORDER_HISTORY: 'history',
  USER_ORDER_HISTORY: 'user/history/:address',
  ALL_SYMBOL: 'symbols/all',
  LIKE_COMMENT: 'like/:id',
  UNLIKE_COMMENT: 'unlike/:id',
  MARKET_CAP: 'market-cap/:id',
  SEARCH_COLLECTION_BY_NAME: '/search/name',
  LIST_COIN_HELD: 'list-coin/held',
  COMMENT_COLLECTION: ':id/comment',
};
