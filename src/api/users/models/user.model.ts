import { Model } from '../../../common';

const objDef = {
  id: { type: 'number', required: false },
  firstName: { type: 'string', required: false },
  lastName: { type: 'string', required: false },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
  active: { type: 'number', required: false },
  activationLink: { type: 'string', required: false },
  avatarPath: { type: 'string', required: false },
};

export class UserModel extends Model {
  id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  active?: number;
  activationLink?: string;
  avatarPath?: string;

  constructor(obj, ignoreRequired = false) {
    super(obj, objDef, 'User', ignoreRequired);
  }
}
