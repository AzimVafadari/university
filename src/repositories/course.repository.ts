import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Course, CourseRelations, Professor, Enrollment} from '../models';
import {ProfessorRepository} from './professor.repository';
import {EnrollmentRepository} from './enrollment.repository';

export class CourseRepository extends DefaultCrudRepository<
  Course,
  typeof Course.prototype.id,
  CourseRelations
> {

  public readonly professor: BelongsToAccessor<Professor, typeof Course.prototype.id>;

  public readonly enrollments: HasManyRepositoryFactory<Enrollment, typeof Course.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProfessorRepository') protected professorRepositoryGetter: Getter<ProfessorRepository>, @repository.getter('EnrollmentRepository') protected enrollmentRepositoryGetter: Getter<EnrollmentRepository>,
  ) {
    super(Course, dataSource);
    this.enrollments = this.createHasManyRepositoryFactoryFor('enrollments', enrollmentRepositoryGetter,);
    this.registerInclusionResolver('enrollments', this.enrollments.inclusionResolver);
    this.professor = this.createBelongsToAccessorFor('professor', professorRepositoryGetter,);
    this.registerInclusionResolver('professor', this.professor.inclusionResolver);
  }
}
