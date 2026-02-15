import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apiUrl } from '../../../core/http/api.config'
import { AddCommentRequest, CommentDto, PageResponse, UpdateCommentRequest } from '../../../models/api.models'

@Injectable({ providedIn: 'root' })
export class CommentsApi {
  constructor(private readonly http: HttpClient) {}

  listComments(issueId: number, page: number, size: number): Observable<PageResponse<CommentDto>> {
    const params = new HttpParams().set('page', page).set('size', size)
    return this.http.get<PageResponse<CommentDto>>(apiUrl(`/api/issues/${issueId}/comments`), { params })
  }

  addComment(issueId: number, request: AddCommentRequest): Observable<CommentDto> {
    return this.http.post<CommentDto>(apiUrl(`/api/issues/${issueId}/comments`), request)
  }

  updateComment(issueId: number, commentId: number, request: UpdateCommentRequest): Observable<CommentDto> {
    return this.http.put<CommentDto>(apiUrl(`/api/issues/${issueId}/comments/${commentId}`), request)
  }

  deleteComment(issueId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(apiUrl(`/api/issues/${issueId}/comments/${commentId}`))
  }
}
