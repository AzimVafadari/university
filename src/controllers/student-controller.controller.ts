import {authenticate, TokenService,} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Count, CountSchema, FilterExcludingWhere, model, property, repository, Where, Filter} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  del,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {Manager, Student} from '../models';
import {ManagerRepository, StudentRepository} from '../repositories';
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

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class StudentController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(StudentRepository) protected studentRepository: StudentRepository,
    @repository(ManagerRepository) protected managerRepository: ManagerRepository,
  ) {}

  @get('/students/count')
  @response(200, {
    description: 'student model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.studentRepository.count(where);
  }

  @get('/students')
  @response(200, {
    description: 'Array of student model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Student, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Student) filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.studentRepository.find(filter);
  }

  @patch('/students')
  @response(200, {
    description: 'student PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Student,
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.studentRepository.updateAll(student, where);
  }

  @get('/students/{id}')
  @response(200, {
    description: 'student model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Student, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Student, {exclude: 'where'}) filter?: FilterExcludingWhere<Student>
  ): Promise<Student> {
    return this.studentRepository.findById(id, filter);
  }

  @patch('/students/{id}')
  @response(204, {
    description: 'student PATCH success',
  })
  async updateById(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Student,
  ): Promise<void> {
    await this.studentRepository.updateById(id, student);
  }

  @put('/students/{id}')
  @response(204, {
    description: 'student PUT success',
  })
  async replaceById(
    @param.path.string('id') id: number,
    @requestBody() student: Student,
  ): Promise<void> {
    await this.studentRepository.replaceById(id, student);
  }

  @del('/students/{id}')
  @response(204, {
    description: 'student DELETE success',
  })
  async deleteById(@param.path.string('id') id: number): Promise<void> {
    await this.studentRepository.deleteById(id);
  }
  // This decorator is for login

  @post('/students/login', {
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
    const student = await this.studentRepository.findOne({
      where: {email: credentials.email},
    });

    if (!student) {
      throw new HttpErrors.NotFound('Student not found');
    }

    if (credentials.password !== student.password) {
      throw new HttpErrors.Unauthorized('Incorrect password');
    }

    const userProfile = this.userService.convertToUserProfile(student as any)
    // Generate a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
  @authenticate('jwt')
  @post('/students/signup', {
    responses: {
      '200': {
        description: 'Student',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Student,
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
         schema: getModelSchemaRef(Student, {
            title: 'Newstudent',
            partial: true,
            exclude: ['id']
          }),
        },
      },
    })
    student: Student,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const find = await this.managerRepository.findById(currentUserProfile[securityId] as any)
    const password = await hash(student.password, await genSalt());
    student.password = password;
    const savedStudent = await this.studentRepository.create(
      student
    );
    if(find.role === "minor"){
      return savedStudent;
    }
    else{
      throw new HttpErrors.NotFound('Manager is not minor');
    }
  }
}
