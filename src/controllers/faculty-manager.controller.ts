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
  Manager,
} from '../models';
import {FacultyRepository} from '../repositories';

export class FacultyManagerController {
  constructor(
    @repository(FacultyRepository) protected facultyRepository: FacultyRepository,
  ) { }

  @get('/faculties/{id}/manager', {
    responses: {
      '200': {
        description: 'Faculty has one Manager',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Manager),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Manager>,
  ): Promise<Manager> {
    return this.facultyRepository.manager(id).get(filter);
  }

  @post('/faculties/{id}/manager', {
    responses: {
      '200': {
        description: 'Faculty model instance',
        content: {'application/json': {schema: getModelSchemaRef(Manager)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Faculty.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {
            title: 'NewManagerInFaculty',
            exclude: ['id'],
            optional: ['facultyId']
          }),
        },
      },
    }) manager: Omit<Manager, 'id'>,
  ): Promise<Manager> {
    return this.facultyRepository.manager(id).create(manager);
  }

  @patch('/faculties/{id}/manager', {
    responses: {
      '200': {
        description: 'Faculty.Manager PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {partial: true}),
        },
      },
    })
    manager: Partial<Manager>,
    @param.query.object('where', getWhereSchemaFor(Manager)) where?: Where<Manager>,
  ): Promise<Count> {
    return this.facultyRepository.manager(id).patch(manager, where);
  }

  @del('/faculties/{id}/manager', {
    responses: {
      '200': {
        description: 'Faculty.Manager DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Manager)) where?: Where<Manager>,
  ): Promise<Count> {
    return this.facultyRepository.manager(id).delete(where);
  }
}
