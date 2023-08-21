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
import {TokenService} from '@loopback/authentication';
import {CourseRepository} from '../repositories';
import {Course} from '../models';
export type CustomCredentials = {
  code: string;
  password: string;
};

// create NewProfessorRequest model
@model()
export class NewCourseRequest extends Course {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
//create CredentialsSchema
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['code', 'password'],
  properties: {
    code: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 3,
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


export class CourseControllerController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(CourseRepository) protected courseRepository: CourseRepository,
  ) { }

  // @post('/courses')
  // @response(200, {
  //   description: 'Course model instance',
  //   content: {'application/json': {schema: getModelSchemaRef(Course)}},
  // })
  // async create(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Course, {
  //           title: 'NewCourse',
  //           exclude: ['id'],
  //         }),
  //       },
  //     },
  //   })
  //   course: Course,
  // ): Promise<Course> {
  //   return this.courseRepository.create(course);
  // }

  @get('/courses/count')
  @response(200, {
    description: 'Course model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Course) where?: Where<Course>,
  ): Promise<Count> {
    return this.courseRepository.count(where);
  }

  @get('/courses')
  @response(200, {
    description: 'Array of Course model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Course, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Course) filter?: Filter<Course>,
  ): Promise<Course[]> {
    return this.courseRepository.find(filter);
  }

  @patch('/courses')
  @response(200, {
    description: 'Course PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        }, CourseControllerController
      },
    })
    course: Course,
    @param.where(Course) where?: Where<Course>,
  ): Promise<Count> {
    return this.courseRepository.updateAll(course, where);
  }

  @get('/courses/{id}')
  @response(200, {
    description: 'Course model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Course, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: number,
    @param.filter(Course, {exclude: 'where'}) filter?: FilterExcludingWhere<Course>
  ): Promise<Course> {
    return this.courseRepository.findById(id, filter);
  }

  @patch('/courses/{id}')
  @response(204, {
    description: 'Course PATCH success',
  })
  async updateById(
    @param.path.string('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Course, {partial: true}),
        },
      },
    })
    course: Course,
  ): Promise<void> {
    await this.courseRepository.updateById(id, course);
  }

  @put('/courses/{id}')
  @response(204, {
    description: 'Course PUT success',
  })
  async replaceById(
    @param.path.string('id') id: number,
    @requestBody() course: Course,
  ): Promise<void> {
    await this.courseRepository.replaceById(id, course);
  }

  @del('/courses/{id}')
  @response(204, {
    description: 'Course DELETE success',
  })
  async deleteById(@param.path.string('id') id: number): Promise<void> {
    await this.courseRepository.deleteById(id);
  }
  // This decorator is for login

  // @post('/courses/login', {
  //   responses: {
  //     '200': {
  //       description: 'Token',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'object',
  //             properties: {
  //               token: {
  //                 type: 'string',
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // // And the method is here(120022)

  // async login(
  //   @requestBody(CredentialsRequestBody) credentials: CustomCredentials,
  //   ): Promise<{ token: string }> {
  //     // Find the course based on the provided code
  //     const course = await this.courseRepository.findOne({
  //       where: { code: credentials.code },
  //     });

  //   if (!course) {
  //     throw new HttpErrors.NotFound('Course not found');
  //   }

  //   // Verify if the provided password matches the hashed password stored in the database
  //   const passwordMatched = await compare(
  //     credentials.code,
  //     course.password
  //   );

  //   if (!passwordMatched) {
  //     throw new HttpErrors.Unauthorized('Incorrect password');
  //   }

  //   // Convert a course object into a UserProfile object
  //   const userProfile: UserProfile = {
  //     [securityId]: course.code, // Convert to string
  //     id: course.id, // Convert to string
  //     // Adjust the properties based on your Course model structure
  //     // For example: name: course.name
  //     name: course.name,
  //     code: course.code,
  //     description: course.description,
  //     credits: course.credits,
  //     facultyId: course.facultyId
  //   };

  //   // Generate a JSON Web Token based on the user profile
  //   const token = await this.jwtService.generateToken(userProfile);

  //   return { token };
  // }

  @post('/courses/register', {
    responses: {
      '200': {
        description: 'Course',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': Course,
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
          schema: getModelSchemaRef(NewCourseRequest, {
            title: 'NewCourse',
            partial:true,
            exclude: ['id']
          }),
        },
      },
    })
    newCourseRequest: NewCourseRequest,
  ): Promise<Course> {
    const password = await hash(newCourseRequest.password, await genSalt());

    // Create a new student with hashed password
    const savedCourse = await this.courseRepository.create(
      _.omit(newCourseRequest, 'password'),
    );

    // Save the hashed password to your student credentials (adjust as per your model structure)
    // await this.courseRepository.updateById(savedCourse.id, {
    //   password: password,
    // });

    return savedCourse;
  }
}
