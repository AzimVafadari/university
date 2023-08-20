import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Manager, ManagerRelations} from '../models';

export class ManagerRepository extends DefaultCrudRepository<
  Manager,
  typeof Manager.prototype.id,
  ManagerRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Manager, dataSource);
  }
}
