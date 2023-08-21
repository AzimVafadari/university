import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Student, StudentRelations, Course} from '../models';
import {CourseRepository} from './course.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly courses: HasManyRepositoryFactory<Course, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CourseRepository') protected courseRepositoryGetter: Getter<CourseRepository>,
  ) {
    super(Student, dataSource);
    this.courses = this.createHasManyRepositoryFactoryFor('courses', courseRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}
