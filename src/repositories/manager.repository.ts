import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Manager, ManagerRelations, Faculty} from '../models';
import {FacultyRepository} from './faculty.repository';

export class ManagerRepository extends DefaultCrudRepository<
  Manager,
  typeof Manager.prototype.id,
  ManagerRelations
> {

  public readonly faculty: BelongsToAccessor<Faculty, typeof Manager.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('FacultyRepository') protected facultyRepositoryGetter: Getter<FacultyRepository>,
  ) {
    super(Manager, dataSource);
    this.faculty = this.createBelongsToAccessorFor('faculty', facultyRepositoryGetter,);
    this.registerInclusionResolver('faculty', this.faculty.inclusionResolver);
  }
}
