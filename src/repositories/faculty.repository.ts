import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Faculty, FacultyRelations} from '../models';

export class FacultyRepository extends DefaultCrudRepository<
  Faculty,
  typeof Faculty.prototype.id,
  FacultyRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Faculty, dataSource);
  }
}
