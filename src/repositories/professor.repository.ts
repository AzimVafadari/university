import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Professor, ProfessorRelations} from '../models';

export class ProfessorRepository extends DefaultCrudRepository<
  Professor,
  typeof Professor.prototype.id,
  ProfessorRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Professor, dataSource);
  }
}
