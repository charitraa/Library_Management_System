import { useState } from "react";
import { Check, Loader2, Pencil, Reply, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  useComments,
  useDeleteComment,
  useDeleteReply,
  usePostComment,
  useReplyComment,
  useUpdateComment,
  useUpdateReply,
} from "@/hooks/api/use-comments";
import { useMe } from "@/hooks/api/use-auth";
import { resUrl } from "@/api/entities";

interface CommentSectionProps {
  bookInfoId: string;
  /** Show the plain "add a comment" composer (the portal page brings its own review form). */
  showComposer?: boolean;
  /** Staff can delete any comment or reply, not just their own. */
  canModerate?: boolean;
}

export default function CommentSection({
  bookInfoId,
  showComposer = false,
  canModerate = false,
}: CommentSectionProps) {
  const { toast } = useToast();
  const { data: me } = useMe();
  const currentUserId = me?.data?.userId;

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const { data: comments } = useComments(bookInfoId);
  const { mutate: postComment, isPending: isPosting } = usePostComment(() => {
    setNewComment("");
    toast({ title: "Comment posted" });
  });
  const { mutate: replyToComment, isPending: isReplying } = useReplyComment(() => {
    setReplyingTo(null);
    setReplyText("");
  });
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment(() => {
    setEditingCommentId(null);
    toast({ title: "Comment updated" });
  });
  const { mutate: updateReply, isPending: isUpdatingReply } = useUpdateReply(() => {
    setEditingReplyId(null);
    toast({ title: "Reply updated" });
  });
  const { mutate: deleteComment } = useDeleteComment(() => toast({ title: "Comment deleted" }));
  const { mutate: deleteReply } = useDeleteReply(() => toast({ title: "Reply deleted" }));

  const commentRows = comments?.data ?? [];

  const startEditComment = (commentId: string, current: string) => {
    setEditingReplyId(null);
    setEditingCommentId(commentId);
    setEditText(current);
  };

  const startEditReply = (commentReplyId: string, current: string) => {
    setEditingCommentId(null);
    setEditingReplyId(commentReplyId);
    setEditText(current);
  };

  const editControls = (onSave: () => void, isSaving: boolean) => (
    <div className="flex gap-2">
      <Input
        autoFocus
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && editText.trim() && onSave()}
        className="rounded-xl"
      />
      <Button size="sm" disabled={isSaving || !editText.trim()} onClick={onSave}>
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setEditingCommentId(null);
          setEditingReplyId(null);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {showComposer && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
            disabled={isPosting}
          />
          <Button
            size="sm"
            disabled={isPosting || !newComment.trim()}
            onClick={() => postComment({ bookInfoId, comment: newComment.trim() })}
          >
            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Comment
          </Button>
        </div>
      )}

      {commentRows.length === 0 && (
        <p className="text-center text-muted-foreground py-6 text-sm">
          No comments yet.
        </p>
      )}

      {commentRows.map((comment) => {
        const isOwnComment = comment.userId === currentUserId;
        return (
          <div
            key={comment.commentId}
            className="p-5 bg-card border rounded-2xl shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center font-bold text-muted-foreground overflow-hidden">
                  {comment.user?.profilePicUrl ? (
                    <img
                      src={resUrl(comment.user.profilePicUrl)}
                      alt={comment.user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    comment.user?.fullName?.[0] ?? "?"
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{comment.user?.fullName}</h4>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isOwnComment && editingCommentId !== comment.commentId && (
                  <button
                    onClick={() => startEditComment(comment.commentId, comment.comment)}
                    className="text-muted-foreground/60 hover:text-primary transition-colors"
                    title="Edit comment"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {(isOwnComment || canModerate) && (
                  <button
                    onClick={() => deleteComment(comment.commentId)}
                    className="text-muted-foreground/60 hover:text-destructive transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {editingCommentId === comment.commentId ? (
              editControls(
                () => updateComment({ commentId: comment.commentId, comment: editText.trim() }),
                isUpdatingComment,
              )
            ) : (
              <p className="text-sm leading-relaxed">{comment.comment}</p>
            )}

            {comment.replies?.length > 0 && (
              <div className="ml-5 space-y-3 border-l-2 border-muted pl-5">
                {comment.replies.map((reply) => {
                  const isOwnReply =
                    (reply as { userId?: string }).userId !== undefined
                      ? (reply as { userId?: string }).userId === currentUserId
                      : reply.user?.fullName === me?.data?.fullName;
                  return (
                    <div key={reply.commentReplyId} className="flex items-start justify-between gap-2">
                      {editingReplyId === reply.commentReplyId ? (
                        <div className="flex-1">
                          {editControls(
                            () =>
                              updateReply({
                                commentReplyId: reply.commentReplyId,
                                reply: editText.trim(),
                              }),
                            isUpdatingReply,
                          )}
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="text-xs font-bold">{reply.user?.fullName}</p>
                            <p className="text-sm text-muted-foreground">{reply.reply}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isOwnReply && (
                              <button
                                onClick={() => startEditReply(reply.commentReplyId, reply.reply)}
                                className="text-muted-foreground/60 hover:text-primary transition-colors"
                                title="Edit reply"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {(isOwnReply || canModerate) && (
                              <button
                                onClick={() => deleteReply(reply.commentReplyId)}
                                className="text-muted-foreground/60 hover:text-destructive transition-colors"
                                title="Delete reply"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {replyingTo === comment.commentId ? (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && replyText.trim()) {
                      replyToComment({ commentId: comment.commentId, reply: replyText.trim() });
                    }
                  }}
                  className="rounded-xl"
                />
                <Button
                  size="sm"
                  disabled={isReplying || !replyText.trim()}
                  onClick={() =>
                    replyToComment({ commentId: comment.commentId, reply: replyText.trim() })
                  }
                >
                  {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setReplyingTo(comment.commentId)}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline w-fit"
              >
                <Reply className="h-3.5 w-3.5" /> Reply
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
