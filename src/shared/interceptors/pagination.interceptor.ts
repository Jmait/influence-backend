import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

export class Pagination {
  limit: number;
  skip?: number;
  page?: number;
  cursor?: { id: string };
}

export class DateFilter {
  startDate: string;

  endDate: string;
}

import { Observable } from 'rxjs';
// import { normalizeDateRange } from '../utils';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let limit = Number(request?.query?.limit) || 25;
    let page = Number(request?.query?.page) || 1;
    const cursor = request?.query?.lastId as string | undefined;
    if (request.method !== 'GET') {
      return next.handle();
    }
    console.log('Pagination Interceptor Activated');

    limit = limit <= 0 ? 25 : limit;
    limit = limit > 100 && !request.url.includes('export') ? 100 : limit;

    let pagination: any;
    let dateFilter: any;
    // dateFilter = normalizeDateRange(
    //   request?.query?.startDate,
    //   request.query.endDate,
    // );
    if (cursor) {
      pagination = {
        limit: Number(limit) + 1,
        cursor: { id: cursor },
        skip: 1,
      };
      console.log('Cursor-based pagination applied:', pagination);
    } else {
      pagination = {
        limit: limit,
        page: page,
      };
    }

    request.pagination = pagination;
    if (request?.query?.date) {
      request.query.date = dateFilter;
    }

    return next.handle();
  }
}
