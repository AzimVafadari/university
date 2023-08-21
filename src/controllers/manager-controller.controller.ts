import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  STRING,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Manager} from '../models';
import {ManagerRepository} from '../repositories';
import {Credentials} from '@loopback/authentication-jwt';
import {Professor} from '../models';
import {ProfessorRepository} from '../repositories';
import {inject} from '@loopback/core';
import {model, property} from '@loopback/repository';
import {
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {compare} from 'bcryptjs';
import { MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
@model()
export class NewManagerRequest extends Manager {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

//create CredentialsSchema
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['password'],
  properties: {
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


export class ManagerControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(ManagerRepository) protected managerRepository: ManagerRepository,
  ) {}

  @post('/managers')
  @response(200, {
    description: 'Manager model instance',
    content: {'application/json': {schema: getModelSchemaRef(Manager)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {
            title: 'NewManager',

          }),
        },
      },
    })
    manager: Manager,
  ): Promise<Manager> {
    return this.managerRepository.create(manager);
  }

  @get('/managers/count')
  @response(200, {
    description: 'Manager model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Manager) where?: Where<Manager>,
  ): Promise<Count> {
    return this.managerRepository.count(where);
  }

  @get('/managers')
  @response(200, {
    description: 'Array of Manager model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Manager, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Manager) filter?: Filter<Manager>,
  ): Promise<Manager[]> {
    return this.managerRepository.find(filter);
  }

  @patch('/managers')
  @response(200, {
    description: 'Manager PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {partial: true}),
        },
      },
    })
    manager: Manager,
    @param.where(Manager) where?: Where<Manager>,
  ): Promise<Count> {
    return this.managerRepository.updateAll(manager, where);
  }

  @get('/managers/{id}')
  @response(200, {
    description: 'Manager model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Manager, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Manager, {exclude: 'where'}) filter?: FilterExcludingWhere<Manager>
  ): Promise<Manager> {
    return this.managerRepository.findById(id, filter);
  }

  @patch('/managers/{id}')
  @response(204, {
    description: 'Manager PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {partial: true}),
        },
      },
    })
    manager: Manager,
  ): Promise<void> {
    await this.managerRepository.updateById(id, manager);
  }

  @put('/managers/{id}')
  @response(204, {
    description: 'Manager PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() manager: Manager,
  ): Promise<void> {
    await this.managerRepository.replaceById(id, manager);
  }

  @del('/managers/{id}')
  @response(204, {
    description: 'Manager DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.managerRepository.deleteById(id);
  }
  @post('/managers/signup')
  @response(200, {
    description: 'Manager',
    content: {
      'application/json': {
        schema: {
          'x-ts-type': Manager,
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewManagerRequest, {
            title: 'NewManager',
            partial: true,
            exclude: ['id']
          }),
        },
      },
    })
    newManagerRequest: NewManagerRequest,
  ): Promise<Manager> {
    const { name, role, password } = newManagerRequest;
    const hashedPassword = await hash(password, await genSalt());

    // Create a new manager with hashed password
    const savedManager = await this.managerRepository.create({
      name,
      role,
      password: hashedPassword,
    });

    return savedManager;
  }

  @post('/managers/login')
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // Find the manager based on the provided email
    const manager = await this.managerRepository.findOne({
      where: { email: credentials.email },
    });

    if (!manager) {
      throw new HttpErrors.NotFound('Manager not found');
    }

    // Verify if the provided password matches the hashed password stored in the database
    const passwordMatched = await compare(credentials.password, manager.password);

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Incorrect password');
    }

    // Convert a Manager object into a UserProfile object
    const userProfile = this.userService.convertToUserProfile(manager as any)

    // Generate a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return { token };
  }
}
