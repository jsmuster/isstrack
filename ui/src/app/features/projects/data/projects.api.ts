/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */
import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apiUrl } from '../../../core/http/api.config'
import {
  AcceptInviteRequest,
  CreateProjectRequest,
  InviteMemberRequest,
  MembershipDto,
  PageResponse,
  ProjectDto,
} from '../../../models/api.models'

@Injectable({ providedIn: 'root' })
export class ProjectsApi {
  constructor(private readonly http: HttpClient) {}

  listProjects(
    page: number,
    size: number,
    search?: string,
    sortBy?: 'recently-updated' | 'oldest-first',
    filter?: 'all' | 'owned' | 'shared'
  ): Observable<PageResponse<ProjectDto>> {
    let params = new HttpParams().set('page', page).set('size', size)
    if (search) {
      params = params.set('search', search)
    }
    if (sortBy) {
      params = params.set('sortBy', sortBy)
    }
    if (filter && filter !== 'all') {
      params = params.set('filter', filter)
    }
    return this.http.get<PageResponse<ProjectDto>>(apiUrl('/api/projects'), { params })
  }

  createProject(request: CreateProjectRequest): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(apiUrl('/api/projects'), request)
  }

  getProject(projectId: number): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(apiUrl(`/api/projects/${projectId}`))
  }

  listMembers(projectId: number, page: number, size: number): Observable<PageResponse<MembershipDto>> {
    const params = new HttpParams().set('page', page).set('size', size)
    return this.http.get<PageResponse<MembershipDto>>(apiUrl(`/api/projects/${projectId}/members`), { params })
  }

  inviteMember(projectId: number, request: InviteMemberRequest): Observable<MembershipDto> {
    return this.http.post<MembershipDto>(apiUrl(`/api/projects/${projectId}/invites`), request)
  }

  acceptInvite(request: AcceptInviteRequest): Observable<MembershipDto> {
    return this.http.post<MembershipDto>(apiUrl('/api/projects/invites/accept'), request)
  }
}
