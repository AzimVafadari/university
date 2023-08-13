import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Professor extends Entity {
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
  facultyId: string;

  @property({
    type: 'string',
    required: true,
  })
  specialization: string;

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
