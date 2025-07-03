import {
  Component,
  effect,
  EffectRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';

import { Comment, Pagination } from '@core/interfaces';
import { CommentService } from '@core/services/comment.service';
import { CommentItemComponent } from './comment-item/comment-item.component';
import { CommentFormComponent } from './create-comment/comment-form.component';
import { EditDialogComponent } from './comment-item/edit-dialog/edit-dialog.component';

@Component({
  selector: 'sn-post-comments',
  imports: [
    AnimateOnScrollModule,
    CommentItemComponent,
    CommentFormComponent,
    EditDialogComponent,
  ],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit, OnDestroy {
  private readonly commentService = inject(CommentService);
  private addCommentEffectRef?: EffectRef;
  public comments = signal<Comment[]>([]);
  public page = signal<number>(0);
  public readonly pageSize = 10;
  public hasMore = signal<boolean>(true);
  public isLoading = signal<boolean>(false);
  public postId = input.required<string>();
  public commentSubmitEvent = output<string>();
  public commentEditedEvent = output<Comment>();
  public editableComment = signal<Comment | null>(null);
  public toAddComment = input<Comment | null>();
  public readonly commentAddedEvent = output<void>();
  public toUpdateComment = input<Comment | null>();
  public readonly commentUpdatedEvent = output<void>();

  constructor() {
    this.addCommentEffectRef = effect(() => {
      const newComment = this.toAddComment();
      if (newComment && !this.comments().some((c) => c._id === newComment._id)) {
        this.comments.update((currentComments) => [newComment, ...currentComments]);

        this.commentAddedEvent.emit();
      }
    });

    effect(() => {
      const updatedComment = this.toUpdateComment();
      if (updatedComment) {
        this.comments.update((currentComments) =>
          currentComments.map((c) =>
            c._id === updatedComment._id ? updatedComment : c
          )
        );
        this.commentUpdatedEvent.emit();
      }
    });
  }

  ngOnInit(): void {
    this.resetStatus();
    this.loadMoreComments();
  }

  ngOnDestroy(): void {
    if (this.addCommentEffectRef) {
      this.addCommentEffectRef.destroy();
      this.addCommentEffectRef = undefined;
    }
  }

  private resetStatus() {
    this.comments.set([]);
    this.page.set(0);
    this.hasMore.set(true);
  }

  public onCommentSubmit(comment: string): void {
    if (!comment) return;

    this.commentSubmitEvent.emit(comment);
  }

  public onCommentEdition(comment: Comment): void {
    if (!comment) return;

    this.commentEditedEvent.emit(comment);
    this.updateCommentInList(comment);
  }

  public toggleEditModal(comment: Comment): void {
    if (!comment) return;
    this.editableComment.set(comment);
  }

  public loadMoreComments(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.isLoading.set(true);

    const pagination: Pagination = {
      limit: this.pageSize,
      offset: this.page() * this.pageSize,
    };

    this.commentService.getComments(this.postId(), pagination).subscribe({
      next: (newComments) => {
        if (newComments.length < this.pageSize) this.hasMore.set(false);
        this.comments.set([...this.comments(), ...newComments]);
        this.page.update((p) => p + 1);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  public updateCommentInList(updatedComment: Comment): void {
    this.comments.update((currentComments) =>
      currentComments.map((c) => (c._id === updatedComment._id ? updatedComment : c))
    );
  }
}
