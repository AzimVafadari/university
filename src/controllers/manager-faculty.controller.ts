import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Manager,
  Faculty,
} from '../models';
import {ManagerRepository} from '../repositories';

export class ManagerFacultyController {
  constructor(
    @repository(ManagerRepository)
    public managerRepository: ManagerRepository,
  ) { }

  @get('/managers/{id}/faculty', {
    responses: {
      '200': {
        description: 'Faculty belonging to Manager',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Faculty),
          },
        },
      },
    },
  })
  async getFaculty(
    @param.path.number('id') id: typeof Manager.prototype.id,
  ): Promise<Faculty> {
    return this.managerRepository.faculty(id);
  }
}
