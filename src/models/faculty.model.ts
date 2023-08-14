import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Faculty extends Entity {
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
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  departmentHead: string;

  @property({
    type: 'date',
    required: true,
  })
  establishmentDate: string;

  @property({
    type: 'string',
    required: true,
  })
  location: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Faculty>) {
    super(data);
  }
}

export interface FacultyRelations {
  // describe navigational properties here
}

export type FacultyWithRelations = Faculty & FacultyRelations;
