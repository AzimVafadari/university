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
  Professor,
  Course,
} from '../models';
import {ProfessorRepository} from '../repositories';

export class ProfessorCourseController {
  constructor(
    @repository(ProfessorRepository) protected professorRepository: ProfessorRepository,
  ) { }

  @get('/professors/{id}/courses', {
    responses: {
      '200': {
        description: 'Array of Professor has many Course',
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
    return this.professorRepository.courses(id.toString()).find(filter);
  }

  @post('/professors/{id}/courses', {
    responses: {
      '200': {
        description: 'Professor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Course)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Professor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {
            title: 'NewCourseInProfessor',
            exclude: ['id'],
            optional: ['professorId']
          }),
        },
      },
    }) course: Omit<Course, 'id'>,
  ): Promise<Course> {
    return this.professorRepository.courses(id).create(course);
  }

  @patch('/professors/{id}/courses', {
    responses: {
      '200': {
        description: 'Professor.Course PATCH success count',
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
    return this.professorRepository.courses(id.toString()).patch(course, where);
  }

  @del('/professors/{id}/courses', {
    responses: {
      '200': {
        description: 'Professor.Course DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Course)) where?: Where<Course>,
  ): Promise<Count> {
    return this.professorRepository.courses(id.toString()).delete(where);
  }
}
