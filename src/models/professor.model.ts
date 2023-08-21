import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from '@loopback/authentication-jwt';
import {Course} from './course.model';

@model({settings: {strict: false}})
export class Professor extends User {
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
  specialization: string;

  @property({
    type: 'number',
  })
  facultyId?: number;

  @hasMany(() => Course)
  courses: Course[];
  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // password: string


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Professor>) {
    super(data);
  }
}

export interface ProfessorRelations {
  // describe navigational properties here
}

export type ProfessorWithRelations = Professor & ProfessorRelations;
