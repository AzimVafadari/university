import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Faculty, FacultyRelations, Professor, Manager} from '../models';
import {ProfessorRepository} from './professor.repository';
import {ManagerRepository} from './manager.repository';

export class FacultyRepository extends DefaultCrudRepository<
  Faculty,
  typeof Faculty.prototype.id,
  FacultyRelations
> {

  public readonly professors: HasManyRepositoryFactory<Professor, typeof Faculty.prototype.id>;

  public readonly manager: HasOneRepositoryFactory<Manager, typeof Faculty.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProfessorRepository') protected professorRepositoryGetter: Getter<ProfessorRepository>, @repository.getter('ManagerRepository') protected managerRepositoryGetter: Getter<ManagerRepository>,
  ) {
    super(Faculty, dataSource);
    this.manager = this.createHasOneRepositoryFactoryFor('manager', managerRepositoryGetter);
    this.registerInclusionResolver('manager', this.manager.inclusionResolver);
    this.professors = this.createHasManyRepositoryFactoryFor('professors', professorRepositoryGetter,);
    this.registerInclusionResolver('professors', this.professors.inclusionResolver);
  }
}
