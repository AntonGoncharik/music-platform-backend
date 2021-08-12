import { Model } from '../../common/';

const objDef = {
  firstName: { type: 'string', required: false },
  lastName: { type: 'string', required: false },
  email: { type: 'string', required: true },
  password: { type: 'string', required: true },
  active: { type: 'number', required: false },
  activeLink: { type: 'string', required: false },
};

export class UserModel extends Model {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  active?: number;
  activeLink?: string;

  constructor(obj, ignoreRequired = false) {
    super(obj, objDef, 'User', ignoreRequired);
  }
}
