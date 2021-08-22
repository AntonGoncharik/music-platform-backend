import { Model } from '../../common';

const objDef = {
  name: { type: 'string', required: true },
  path: { type: 'string', required: true },
};

export class TrackModel extends Model {
  name: string;
  path: string;

  constructor(obj, ignoreRequired = false) {
    super(obj, objDef, 'Track', ignoreRequired);
  }
}
