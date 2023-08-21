import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Course,
  Professor,
} from '../models';
import {CourseRepository} from '../repositories';

export class CourseProfessorController {
  constructor(
    @repository(CourseRepository)
    public courseRepository: CourseRepository,
  ) { }

  @get('/courses/{id}/professor', {
    responses: {
      '200': {
        description: 'Professor belonging to Course',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Professor),
          },
        },
      },
    },
  })
  async getProfessor(
    @param.path.number('id') id: typeof Course.prototype.id,
  ): Promise<Professor> {
    return this.courseRepository.professor(id);
  }
}
