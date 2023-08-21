import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Course} from './course.model';
import {Professor} from './professor.model';
import {Manager} from './manager.model';

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


  @hasOne(() => Manager)
  manager: Manager;

  @hasMany(() => Professor)
  professors: Professor[];
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
