import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, BlogArticle } from '../../services/blog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  imports: [
    CommonModule
  ],
  styleUrl: './blog.scss'
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);
  articles: BlogArticle[] = [];
  article: WritableSignal<BlogArticle | null> = signal(null);
  lastArticle: WritableSignal<BlogArticle> = signal({} as BlogArticle);
  slug?: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Ambil semua artikel dari JSON
    this.blogService.getArticles().subscribe(data => {
      this.lastArticle.set(data[data.length - 1]  as BlogArticle);
      this.articles = data;

      // Cek apakah ada slug di URL
      this.slug = this.route.snapshot.paramMap.get('slug') ?? undefined;

      if (this.slug) {
        const found = this.articles.find(a => a.slug === this.slug);
        if (found) {
          this.article.set(found);
        }
      }

      this.loading = false;
    });
  }

  goToArticle(slug: string) {
    this.router.navigate(['/blog', slug]);
    if(this.slug !== slug) {
      const found = this.articles.find(a => a.slug === slug);
      if (found) {
        this.article.set(found);
      }
    }
  }

  backToList() {
    this.router.navigate(['/blog']);
  }
}