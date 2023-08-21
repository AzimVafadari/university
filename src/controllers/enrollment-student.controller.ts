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
  Student,
} from '../models';
import {EnrollmentRepository} from '../repositories';

export class EnrollmentStudentController {
  constructor(
    @repository(EnrollmentRepository)
    public enrollmentRepository: EnrollmentRepository,
  ) { }

  @get('/enrollments/{id}/student', {
    responses: {
      '200': {
        description: 'Student belonging to Enrollment',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Student),
          },
        },
      },
    },
  })
  async getStudent(
    @param.path.number('id') id: typeof Enrollment.prototype.id,
  ): Promise<Student> {
    return this.enrollmentRepository.student(id);
  }
}
