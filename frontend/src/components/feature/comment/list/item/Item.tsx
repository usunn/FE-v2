import { useState } from 'react'

import { Pencil1Icon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { kstFormat } from '@toss/date'

import { queryClient } from '@/lib/query-client'
import { commentQueries, deleteCommentApi } from '@/service/api/comment'
import { CommentResponseDto } from '@/service/model'
import { useMyInfoStore } from '@/store'
import { isRoleAboveOrEqual } from '@/utils'

import { DeleteCommentDialog } from './delete-dialog'
import { EditCommentForm } from './edit-form'
import { ProfileAvatar } from './profile-avatar'

interface CommentListItemProps {
  comment: CommentResponseDto
  postId: number
}

export const CommentListItem = ({ comment, postId }: CommentListItemProps) => {
  const { userId, role } = useMyInfoStore((state) => state.myInfo)

  const [isEdit, setIsEdit] = useState(false)
  const enable =
    comment.userId === userId || isRoleAboveOrEqual('ROLE_ADMIN', role)

  const { mutate: deleteComment, error } = useMutation({
    mutationFn: deleteCommentApi,
    onSuccess: () => onSuccess(),
  })

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: commentQueries.lists(postId) })
  }

  if (error) throw error

  return (
    <>
      <div className="flex justify-between">
        <div className="flex flex-row items-center gap-3">
          <ProfileAvatar userId={comment.userId} />
          <div className="flex flex-col pb-1">
            <div>{comment.userName}</div>
            <div className="text-xs text-primary/60">
              {kstFormat(new Date(comment.commentRegDate), 'yyyy.LL.dd')}
            </div>
          </div>
        </div>
        {enable && !comment.deleted && (
          <div className="flex flex-row gap-2 text-primary/70">
            {comment.userId === userId && !isEdit && (
              <Pencil1Icon
                onClick={() => setIsEdit(true)}
                className="h-4 w-4 hover:cursor-pointer hover:text-primary"
              />
            )}
            <DeleteCommentDialog
              onClick={() =>
                deleteComment({ postId, commentId: comment.commentId })
              }
            />
          </div>
        )}
      </div>
      {isEdit ? (
        <EditCommentForm
          postId={postId}
          commentId={comment.commentId}
          defaultContent={comment.commentContent}
          onClickCancel={() => setIsEdit(false)}
        />
      ) : (
        <div className="px-1 py-2">{comment.commentContent}</div>
      )}
    </>
  )
}
