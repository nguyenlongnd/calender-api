export enum UpdateType {
  SINGLE = 'single',
  FOLLOWING = 'following',
  ALL = 'all',

  RECURRENCE = 'new_recurrence',
  START_TIME = 'new_start_time',
  ALLDAY = 'allday_to_one_day',
  ONEDAY = 'one_day_to_allday',
  NO_CREATE = 'No need to create new recurrence event'
}

export enum DeleteType {
  SINGLE = 'single',
  FOLLOWING = 'following',
  ALL = 'all'
}

export enum GoogleError {
  INVALID_CLIENT = 'invalid_client',
  INVALID_GRANT = 'invalid_grant',
  LIMIT_EXCEEDED = 'Rate Limit Exceeded',
  UNAUTHORIZED = 'Unauthorized',
  INVALID_CREDENTIALS = 'Invalid Credentials'
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  HR = 'HR',
  MEMBER = 'member',
  DIRECTOR = 'director'
}
