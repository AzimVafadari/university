import {Entity, model, property, hasMany} from '@loopback/repository';
import {Course} from './course.model';

@model({settings: {strict: false}})
export class Student extends Entity{
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number
  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  StudentId: string;

  @property({
    type: 'date',
    required: true,
  })
  enrollmentDate: string;

  @property({
    type: 'string',
    required: true,
  })
  facultyId: string;

  @hasMany(() => Course)
  courses: Course[];
  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // password: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
