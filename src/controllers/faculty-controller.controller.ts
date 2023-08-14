import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Faculty} from '../models';
import {FacultyRepository} from '../repositories';

export class FacultyControllerController {
  constructor(
    @repository(FacultyRepository)
    public facultyRepository: FacultyRepository,
  ) { }

  @post('/faculties')
  @response(200, {
    description: 'Faculty model instance',
    content: {'application/json': {schema: getModelSchemaRef(Faculty)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faculty, {
            title: 'NewFaculty',

          }),
        },
      },
    })
    faculty: Faculty,
  ): Promise<Faculty> {
    return this.facultyRepository.create(faculty);
  }

  @get('/faculties/count')
  @response(200, {
    description: 'Faculty model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Faculty) where?: Where<Faculty>,
  ): Promise<Count> {
    return this.facultyRepository.count(where);
  }

  @get('/faculties')
  @response(200, {
    description: 'Array of Faculty model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Faculty, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Faculty) filter?: Filter<Faculty>,
  ): Promise<Faculty[]> {
    return this.facultyRepository.find(filter);
  }

  @patch('/faculties')
  @response(200, {
    description: 'Faculty PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faculty, {partial: true}),
        },
      },
    })
    faculty: Faculty,
    @param.where(Faculty) where?: Where<Faculty>,
  ): Promise<Count> {
    return this.facultyRepository.updateAll(faculty, where);
  }

  @get('/faculties/{id}')
  @response(200, {
    description: 'Faculty model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Faculty, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Faculty, {exclude: 'where'}) filter?: FilterExcludingWhere<Faculty>
  ): Promise<Faculty> {
    return this.facultyRepository.findById(id, filter);
  }

  @patch('/faculties/{id}')
  @response(204, {
    description: 'Faculty PATCH success',
  })
  async updateById(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faculty, {partial: true}),
        },
      },
    })
    faculty: Faculty,
  ): Promise<void> {
    await this.facultyRepository.updateById(id, faculty);
  }

  @put('/faculties/{id}')
  @response(204, {
    description: 'Faculty PUT success',
  })
  async replaceById(
    @param.path.string('id') id: number,
    @requestBody() faculty: Faculty,
  ): Promise<void> {
    await this.facultyRepository.replaceById(id, faculty);
  }

  @del('/faculties/{id}')
  @response(204, {
    description: 'Faculty DELETE success',
  })
  async deleteById(@param.path.string('id') id: number): Promise<void> {
    await this.facultyRepository.deleteById(id);
  }
}
