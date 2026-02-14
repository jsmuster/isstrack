import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apiUrl } from '../../../core/http/api.config'
import { CreateIssueRequest, IssueDetailDto, IssueDto, PageResponse, PatchIssueRequest } from '../../../models/api.models'

export interface IssueQueryParams {
  status?: string | null
  priority?: string | null
  assigneeUserId?: number | null
  tag?: string | null
  q?: string | null
  page?: number
  size?: number
  sort?: string | null
}

@Injectable({ providedIn: 'root' })
export class IssuesApi {
  constructor(private readonly http: HttpClient) {}

  searchIssues(q: string, page = 0, size = 10): Observable<PageResponse<IssueDto>> {
    const params = new HttpParams().set('q', q).set('page', page).set('size', size)
    return this.http.get<PageResponse<IssueDto>>(apiUrl('/api/issues'), { params })
  }

  listIssues(projectId: number, params: IssueQueryParams): Observable<PageResponse<IssueDto>> {
    let httpParams = new HttpParams()
    if (params.status) httpParams = httpParams.set('status', params.status)
    if (params.priority) httpParams = httpParams.set('priority', params.priority)
    if (params.assigneeUserId !== undefined && params.assigneeUserId !== null) {
      httpParams = httpParams.set('assigneeId', params.assigneeUserId)
    }
    if (params.tag) httpParams = httpParams.set('tag', params.tag)
    if (params.q) httpParams = httpParams.set('q', params.q)
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page)
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size)
    if (params.sort) httpParams = httpParams.set('sort', params.sort)

    return this.http.get<PageResponse<IssueDto>>(apiUrl(`/api/projects/${projectId}/issues`), { params: httpParams })
  }

  createIssue(projectId: number, request: CreateIssueRequest): Observable<IssueDto> {
    return this.http.post<IssueDto>(apiUrl(`/api/projects/${projectId}/issues`), request)
  }

  getIssueDetail(issueId: number, commentsPage = 0, commentsSize = 20, activityPage = 0, activitySize = 20): Observable<IssueDetailDto> {
    const params = new HttpParams()
      .set('commentsPage', commentsPage)
      .set('commentsSize', commentsSize)
      .set('activityPage', activityPage)
      .set('activitySize', activitySize)
    return this.http.get<IssueDetailDto>(apiUrl(`/api/issues/${issueId}`), { params })
  }

  patchIssue(issueId: number, request: PatchIssueRequest): Observable<IssueDto> {
    return this.http.patch<IssueDto>(apiUrl(`/api/issues/${issueId}`), request)
  }
}
