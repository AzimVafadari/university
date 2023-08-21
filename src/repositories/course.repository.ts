import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Course, CourseRelations, Professor} from '../models';
import {ProfessorRepository} from './professor.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly professor: BelongsToAccessor<Professor, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProfessorRepository') protected professorRepositoryGetter: Getter<ProfessorRepository>,
  ) {
    super(Course, dataSource);
    this.professor = this.createBelongsToAccessorFor('professor', professorRepositoryGetter,);
    this.registerInclusionResolver('professor', this.professor.inclusionResolver);
  }
}
