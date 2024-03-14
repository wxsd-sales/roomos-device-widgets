import { MikroORM } from '@mikro-orm/core';
import config from '../../mikro-orm.config';
import * as entity from '../database/entities';

export const db = await MikroORM.init({
  ...config,
  ...{ entities: [entity.Session, entity.User, entity.Data, entity.Demo, entity.Activation] }
}).then((r) => r.em.fork());
