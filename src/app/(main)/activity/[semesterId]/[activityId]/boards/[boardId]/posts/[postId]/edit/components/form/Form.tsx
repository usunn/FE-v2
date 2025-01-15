'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useParams, usePathname, useRouter } from 'next/navigation'

import UpdateContentFieldEditor from '@/components/feature/post/post-editor/UpdateEditorField'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  Separator,
  useToast,
} from '@/components/ui'
import { queryClient } from '@/lib/query-client'
import { CreateActivityPost, CreateActivityPostSchema } from '@/schema/post'
import { activityPostQuries, updateActivityPostApi } from '@/service/api'
import { PostWithBoardResponseDto } from '@/service/models'

import { ActivityDateFieldDialog } from './date-field-dialog'

interface EditActivityPostFormProps {
  boardId: number
  editPostData: PostWithBoardResponseDto
}

export const EditActivityPostForm = ({
  boardId,
  editPostData,
}: EditActivityPostFormProps) => {
  const { toast } = useToast()
  const router = useRouter()
  const pathName = usePathname()
  const params = useParams()

  const postId = Number(params.postId)

  const { mutate: updateActivityPost, isPending } = useMutation({
    mutationFn: updateActivityPostApi,
    onSuccess: (data) => onSuccess(data.message),
  })

  const form = useForm<CreateActivityPost>({
    resolver: zodResolver(CreateActivityPostSchema),
    defaultValues: {
      postTitle: '',
      postContent: '',
      postImageIds: [],
      postActivityStartDate: '',
      postActivityEndDate: '',
    },
  })

  useEffect(() => {
    if (editPostData) {
      form.reset({
        postTitle: editPostData.postTitle,
        postContent: editPostData.postContent,
        // TODO: 이미지 관련 수정 필요
        postImageIds: [],
        postActivityStartDate: editPostData.postActivityStartDate,
        postActivityEndDate: editPostData.postActivityEndDate || '',
      })
    }
  }, [editPostData, form])

  const onSuccess = (message?: string) => {
    toast({
      title: message,
      duration: 2000,
    })

    queryClient.refetchQueries({
      queryKey: activityPostQuries.details({ boardId, postId }),
    })

    const basePath = pathName.split('/').slice(0, -1).join('/')
    router.push(basePath)
  }
  const onSumbit = form.handleSubmit(
    (values) => {
      console.log(values)
      updateActivityPost({ boardId, postId, data: values })
    },
    (error) => {
      console.log(error)
    },
  )

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSumbit()
        }}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="postTitle"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center">
                <Label className="text-md w-40">게시글 제목</Label>
                <FormControl>
                  <Input value={field.value} onChange={field.onChange} />
                </FormControl>
              </div>
              <div className="flex justify-end">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <ActivityDateFieldDialog />
        <Separator />
        <div>게시글 내용 수정하기</div>
        <UpdateContentFieldEditor
          addImageId={(url, id) => {
            console.log(url, id)
          }}
          contents={editPostData?.postContent}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            게시글 수정
          </Button>
        </div>
      </form>
    </Form>
  )
}
