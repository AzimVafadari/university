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
  Faculty,
  Professor,
} from '../models';
import {FacultyRepository} from '../repositories';

export class FacultyProfessorController {
  constructor(
    @repository(FacultyRepository) protected facultyRepository: FacultyRepository,
  ) { }

  @get('/faculties/{id}/professors', {
    responses: {
      '200': {
        description: 'Array of Faculty has many Professor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Professor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Professor>,
  ): Promise<Professor[]> {
    return this.facultyRepository.professors(id).find(filter);
  }

  @post('/faculties/{id}/professors', {
    responses: {
      '200': {
        description: 'Faculty model instance',
        content: {'application/json': {schema: getModelSchemaRef(Professor)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Faculty.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Professor, {
            title: 'NewProfessorInFaculty',
            exclude: ['id'],
            optional: ['facultyId']
          }),
        },
      },
    }) professor: Omit<Professor, 'id'>,
  ): Promise<Professor> {
    return this.facultyRepository.professors(id).create(professor);
  }

  @patch('/faculties/{id}/professors', {
    responses: {
      '200': {
        description: 'Faculty.Professor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Professor, {partial: true}),
        },
      },
    })
    professor: Partial<Professor>,
    @param.query.object('where', getWhereSchemaFor(Professor)) where?: Where<Professor>,
  ): Promise<Count> {
    return this.facultyRepository.professors(id).patch(professor, where);
  }

  @del('/faculties/{id}/professors', {
    responses: {
      '200': {
        description: 'Faculty.Professor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Professor)) where?: Where<Professor>,
  ): Promise<Count> {
    return this.facultyRepository.professors(id).delete(where);
  }
}
