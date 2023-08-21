import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Student,
  Enrollment,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentEnrollmentController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Array of Student has many Enrollment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Enrollment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Enrollment>,
  ): Promise<Enrollment[]> {
    return this.studentRepository.enrollments(id).find(filter);
  }

  @post('/students/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(Enrollment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enrollment, {
            title: 'NewEnrollmentInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) enrollment: Omit<Enrollment, 'id'>,
  ): Promise<Enrollment> {
    return this.studentRepository.enrollments(id).create(enrollment);
  }

  @patch('/students/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Student.Enrollment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enrollment, {partial: true}),
        },
      },
    })
    enrollment: Partial<Enrollment>,
    @param.query.object('where', getWhereSchemaFor(Enrollment)) where?: Where<Enrollment>,
  ): Promise<Count> {
    return this.studentRepository.enrollments(id).patch(enrollment, where);
  }

  @del('/students/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Student.Enrollment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Enrollment)) where?: Where<Enrollment>,
  ): Promise<Count> {
    return this.studentRepository.enrollments(id).delete(where);
  }
}
