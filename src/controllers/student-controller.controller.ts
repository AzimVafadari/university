import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {Student} from '../models';
import {StudentRepository} from '../repositories';
import {compare} from 'bcryptjs';

@model()
export class NewStudentRequest extends Student {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

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
  ) {}

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

    // Verify if the provided password matches the hashed password stored in the database
    const passwordMatched = await compare(credentials.password, student.password);

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Incorrect password');
    }

    // Convert a Student object into a UserProfile object
    const userProfile: UserProfile = {
      [securityId]: student.studentId.toString(), // Convert to string
      id: student.studentId.toString(), // Convert to string
      name: `${student.firstName} ${student.lastName}`,
      email: student.email,
      // Add any other properties you need
    };

    // Generate a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

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
          schema: getModelSchemaRef(NewStudentRequest, {
            title: 'NewStudent',
          }),
        },
      },
    })
    newStudentRequest: NewStudentRequest,
  ): Promise<Student> {
    const password = await hash(newStudentRequest.password, await genSalt());

    // Create a new student with hashed password
    const savedStudent = await this.studentRepository.create(
      _.omit(newStudentRequest, 'password'),
    );

    // Save the hashed password to your student credentials (adjust as per your model structure)
    await this.studentRepository.updateById(savedStudent.studentId, {
      password: password,
    });

    return savedStudent;
  }
}
