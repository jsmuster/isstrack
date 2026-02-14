import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apiUrl } from '../../../core/http/api.config'
import { ActivityDto, PageResponse } from '../../../models/api.models'

@Injectable({ providedIn: 'root' })
export class ActivityApi {
  constructor(private readonly http: HttpClient) {}

  listActivity(issueId: number, page: number, size: number): Observable<PageResponse<ActivityDto>> {
    const params = new HttpParams().set('page', page).set('size', size)
    return this.http.get<PageResponse<ActivityDto>>(apiUrl(`/api/issues/${issueId}/activity`), { params })
  }
}
