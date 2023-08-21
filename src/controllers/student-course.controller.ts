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
  Course,
} from '../models';
import {StudentRepository} from '../repositories';

export class StudentCourseController {
  constructor(
    @repository(StudentRepository) protected studentRepository: StudentRepository,
  ) { }

  @get('/students/{id}/courses', {
    responses: {
      '200': {
        description: 'Array of Student has many Course',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Course)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Course>,
  ): Promise<Course[]> {
    return this.studentRepository.courses(id).find(filter);
  }

  @post('/students/{id}/courses', {
    responses: {
      '200': {
        description: 'Student model instance',
        content: {'application/json': {schema: getModelSchemaRef(Course)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {
            title: 'NewCourseInStudent',
            exclude: ['id'],
            optional: ['studentId']
          }),
        },
      },
    }) course: Omit<Course, 'id'>,
  ): Promise<Course> {
    return this.studentRepository.courses(id).create(course);
  }

  @patch('/students/{id}/courses', {
    responses: {
      '200': {
        description: 'Student.Course PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        },
      },
    })
    course: Partial<Course>,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.studentRepository.courses(id).patch(course, where);
  }

  @del('/students/{id}/courses', {
    responses: {
      '200': {
        description: 'Student.Course DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.studentRepository.courses(id).delete(where);
  }
}
