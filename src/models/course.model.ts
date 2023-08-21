import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Professor} from './professor.model';

@model({settings: {strict: true}})
export class Course extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
  })
  credits: number;

  @property({
    type: 'number',
    required: true,
  })
  facultyId: string;
  @property({
    type: 'number',
  })
  studentId?: number;

  @property({
    type: 'number',
    required: true
  })
  units: number;

  @belongsTo(() => Professor)
  professorId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Course>) {
    super(data);
  }
}

export interface CourseRelations {
  // describe navigational properties here
}

export type CourseWithRelations = Course & CourseRelations;
