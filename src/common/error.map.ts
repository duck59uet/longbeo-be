import { Code } from "typeorm";

export const ErrorMap = {
  SUCCESSFUL: {
    Code: 'SUCCESSFUL',
    Message: 'Successfully!',
  },
  UN_AUTHORIZED: {
    Code: 'E401',
    Message: 'Unauthorized',
  },
  NOT_FOUND: {
    Code: 'E001',
    Message: 'Not found',
  },
  E400: {
    Code: 'E400',
    Message: 'Bad request',
  },
  E403: {
    Code: 'E401',
    Message: 'Unauthorized',
  },
  REQUEST_ERROR: {
    Code: 'E039',
    Message: 'Request to server error',
  },
  USER_NOT_FOUND: {
    Code: 'E001',
    Message: 'User not found',
  },
  USER_EXIST: {
    Code: 'E002',
    Message: 'User already exists',
  },
  WRONG_PASSWORD: {
    Code: 'E003',
    Message: 'Wrong password',
  },
  BALANCE_NOT_ENOUGH: {
    Code: 'E004',
    Message: 'Balance not enough',
  },
  SERVICE_NOT_FOUND: {
    Code: 'E005',
    Message: 'Service not found',
  },
  PERMISSION_DENIED: {
    Code: 'E006',
    Message: 'Permission denied',
  },
  USER_LEVEL_NOT_FOUND: {
    Code: 'E007',
    Message: 'User level not found',
  },
  E500: {
    Code: 'E500',
    Message: 'Server error',
  },
};
