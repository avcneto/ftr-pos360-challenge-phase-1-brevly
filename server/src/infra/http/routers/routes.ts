export enum LinkRoutes {
  LIST_ALL = '/links',
  GET_ORIGINAL_BY_SHORT_URL = '/links/original-url',
  LIST_CSV = '/links/export/csv',
  CREATE = '/links',
  DELETE_BY_ID = '/links/:id',
  INCREMENT_ACCESS_BY_ID = '/links/:id/access',
}
