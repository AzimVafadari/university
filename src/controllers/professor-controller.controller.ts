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
import {Professor} from '../models';
import {ProfessorRepository} from '../repositories';
import {inject} from '@loopback/core';
import {model, property} from '@loopback/repository';
import {
  HttpErrors,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {compare} from 'bcryptjs';
import {Credentials, MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {authenticate, TokenService} from '@loopback/authentication';
// create NewProfessorRequest model
@model()
export class NewProfessorRequest extends Professor {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

//create CredentialsSchema
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};
const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class ProfessorControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ProfessorRepository) protected professorRepository: ProfessorRepository,
  ) { }

  // @post('/professors')
  // @response(200, {
  //   description: 'Professor model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Professor)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Professor, {
  //           title: 'NewProfessor',

  //         }),
  //       },
  //     },
  //   })
  //   professor: Professor,
  // ): Promise<Professor> {
  //   return this.professorRepository.create(professor);
  // }

  @get('/professors/count')
  @response(200, {
    description: 'Professor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Professor) where?: Where<Professor>,
  ): Promise<Count> {
    return this.professorRepository.count(where);
  }
  @authenticate('jwt')
  @get('/professors')
  @response(200, {
    description: 'Array of Professor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Professor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Professor) filter?: Filter<Professor>,
  ): Promise<Professor[]> {
    return this.professorRepository.find(filter);
  }

  @patch('/professors')
  @response(200, {
    description: 'Professor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Professor, {partial: true}),
        },
      },
    })
    professor: Professor,
    @param.where(Professor) where?: Where<Professor>,
  ): Promise<Count> {
    return this.professorRepository.updateAll(professor, where);
  }

  @get('/professors/{id}')
  @response(200, {
    description: 'Professor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Professor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('dbId') dbId: number,
    @param.filter(Professor, {exclude: 'where'}) filter?: FilterExcludingWhere<Professor>
  ): Promise<Professor> {
    return this.professorRepository.findById(dbId.toString(), filter);
  }

  @patch('/professors/{dbId}')
  @response(204, {
    description: 'Professor PATCH success',
  })
  async updateById(
    @param.path.string('dbId') dbId: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Professor, {partial: true}),
        },
      },
    })
    professor: Professor,
  ): Promise<void> {
    await this.professorRepository.updateById(dbId.toString(), professor);
  }

  @put('/professors/{id}')
  @response(204, {
    description: 'Professor PUT success',
  })
  async replaceById(
    @param.path.string('dbId') dbId: number,
    @requestBody() professor: Professor,
  ): Promise<void> {
    await this.professorRepository.replaceById(dbId.toString(), professor);
  }

  @del('/professors/{id}')
  @response(204, {
    description: 'Professor DELETE success',
  })
  async deleteById(@param.path.string('dbId') dbId: number): Promise<void> {
    await this.professorRepository.deleteById(dbId.toString());
  }
  // This decorator is for login
  @post('/professors/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  // And the method is here
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // Find the student based on the provided email
    const professor = await this.professorRepository.findOne({
      where: {email: credentials.email},
    });

    if (!professor) {
      throw new HttpErrors.NotFound('Professor not found');
    }

    // Verify if the provided password matches the hashed password stored in the database
    const passwordMatched = compare(credentials.password, professor.password);

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Incorrect password');
    }

    // Convert a Student object into a UserProfile object
    const userProfile = this.userService.convertToUserProfile(professor);

    // Generate a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @post('/professors/signup', {
    responses: {
      '200': {
        description: 'Professor',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Professor,
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
          schema2: getModelSchemaRef(NewProfessorRequest, {
            title: 'NewStudent',
            partial: true,
            exclude: ['id', 'realm', '']
          }),
        },
      },
    })
    newProfessorRequest: NewProfessorRequest,
  ): Promise<Professor> {
    const password = await hash(newProfessorRequest.password, await genSalt());

    // Create a new student with hashed password
    const savedProfessor = await this.professorRepository.create(
      _.omit(newProfessorRequest, 'password'),
    );

    // Save the hashed password to your student credentials (adjust as per your model structure)
    // await this.professorRepository.updateById(savedProfessor.id, {
    //   password: password,
    // });

    return savedProfessor;
  }
}
