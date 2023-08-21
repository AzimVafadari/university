import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Student, StudentRelations, Course, Enrollment} from '../models';
import {CourseRepository} from './course.repository';
import {EnrollmentRepository} from './enrollment.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly courses: HasManyRepositoryFactory<Course, typeof Student.prototype.id>;

  public readonly enrollments: HasManyRepositoryFactory<Enrollment, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>, @repository.getter('EnrollmentRepository') protected enrollmentRepositoryGetter: Getter<EnrollmentRepository>,
  ) {
    super(Student, dataSource);
    this.enrollments = this.createHasManyRepositoryFactoryFor('enrollments', enrollmentRepositoryGetter,);
    this.registerInclusionResolver('enrollments', this.enrollments.inclusionResolver);
    this.courses = this.createHasManyRepositoryFactoryFor('courses', courseRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}
