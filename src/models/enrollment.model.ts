import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Course} from './course.model';
import {Student} from './student.model';

@model({settings: {strict: true}})
export class Enrollment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number

  @property({
    type: 'date',
    required: true,
  })
  enrollmentDate: string;

  @property({
    type: 'binary', // Use 'binary' data type for image
  })
  image?: Buffer; // Store the image as a Buffer

  @belongsTo(() => Course)
  courseId: number;

  @belongsTo(() => Student)
  studentId: number;
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
