export type EntityId = string;
export type SchoolId = string;

export type SchoolScopedEntity = {
  id: EntityId;
  schoolId: SchoolId;
  createdAt: Date;
  updatedAt: Date;
};

export type CursorPage<T> = {
  items: readonly T[];
  nextCursor: string | null;
};

export type ListQuery = {
  cursor?: string;
  limit: number;
};

export interface SchoolScopedRepository<TEntity extends SchoolScopedEntity, TCreate, TUpdate> {
  findById(schoolId: SchoolId, id: EntityId): Promise<TEntity | null>;
  list(schoolId: SchoolId, query: ListQuery): Promise<CursorPage<TEntity>>;
  create(schoolId: SchoolId, input: TCreate): Promise<TEntity>;
  update(schoolId: SchoolId, id: EntityId, expectedUpdatedAt: Date, input: TUpdate): Promise<TEntity>;
}

export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  uuid(): string;
}

export interface TransactionRunner {
  run<T>(operation: () => Promise<T>): Promise<T>;
}
