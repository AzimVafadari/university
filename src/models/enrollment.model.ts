import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Enrollment extends Entity {
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
  studentId: string;


  @property({
    type: 'string',
    required: true,
  })
  CourseId: string;

  @property({
    type: 'date',
    required: true,
  })
  enrollmentDate: string;

  @property({
    type: 'number',
    required: true,
  })
  grade: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Enrollment>) {
    super(data);
  }
}

export interface EnrollmentRelations {
  // describe navigational properties here
}

export type EnrollmentWithRelations = Enrollment & EnrollmentRelations;
