import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrl = '/articles.json';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<BlogArticle[]> {
    return this.http.get<BlogArticle[]>(this.baseUrl);
  }

  getArticleBySlug(slug: string): Observable<BlogArticle | undefined> {
    return new Observable(observer => {
      this.getArticles().subscribe(articles => {
        const article = articles.find(a => a.slug === slug);
        observer.next(article);
        observer.complete();
      });
    });
  }
}
