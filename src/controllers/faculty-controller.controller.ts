import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  model,
  property,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  MyUserService,
} from '@loopback/authentication-jwt';
import {Faculty} from '../models';
import {FacultyRepository} from '../repositories';
import {CredentialsRequestBody} from './student-controller.controller';
import {Credentials, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {NewProfessorRequest} from './professor-controller.controller';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {inject} from '@loopback/core';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {TokenService} from '@loopback/authentication';
@model()
export class NewFacultyRequest extends Faculty {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

export class FacultyControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(FacultyRepository) protected facultyRepository: FacultyRepository,
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

  @post('/faculties/register', {
    responses: {
      '200': {
        description: 'faculty',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Faculty,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewFacultyRequest, {
            title: 'NewStudent',
            partial:true,
            exclude: ['id', 'passwprd']
          }),
        },
      },
    })
    newFacultyRequest: NewFacultyRequest,
  ): Promise<Faculty> {
    const password = await hash(newFacultyRequest.password, await genSalt());

    // Create a new student with hashed password
    const savedFaculty = await this.facultyRepository.create(
      _.omit(newFacultyRequest, 'password'),
    );

    // Save the hashed password to your student credentials (adjust as per your model structure)
    // await this.professorRepository.updateById(savedProfessor.id, {
    //   password: password,
    // });

    return savedFaculty;
  }
}

