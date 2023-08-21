import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Enrollment,
  Course,
} from '../models';
import {EnrollmentRepository} from '../repositories';

export class EnrollmentCourseController {
  constructor(
    @repository(EnrollmentRepository)
    public enrollmentRepository: EnrollmentRepository,
  ) { }

  @get('/enrollments/{id}/course', {
    responses: {
      '200': {
        description: 'Course belonging to Enrollment',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Course),
          },
        },
      },
    },
  })
  async getCourse(
    @param.path.number('id') id: typeof Enrollment.prototype.id,
  ): Promise<Course> {
    return this.enrollmentRepository.course(id);
  }
}
