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
  Course,
  Enrollment,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseEnrollmentController {
  constructor(
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Array of Course has many Enrollment',
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
    return this.courseRepository.enrollments(id).find(filter);
  }

  @post('/courses/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Course model instance',
        content: {'application/json': {schema: getModelSchemaRef(Enrollment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Course.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Enrollment, {
            title: 'NewEnrollmentInCourse',
            exclude: ['id'],
            optional: ['courseId']
          }),
        },
      },
    }) enrollment: Omit<Enrollment, 'id'>,
  ): Promise<Enrollment> {
    return this.courseRepository.enrollments(id).create(enrollment);
  }

  @patch('/courses/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Course.Enrollment PATCH success count',
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
    return this.courseRepository.enrollments(id).patch(enrollment, where);
  }

  @del('/courses/{id}/enrollments', {
    responses: {
      '200': {
        description: 'Course.Enrollment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Enrollment)) where?: Where<Enrollment>,
  ): Promise<Count> {
    return this.courseRepository.enrollments(id).delete(where);
  }
}
