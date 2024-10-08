'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/common/constants/routes.constant'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ILoginBody } from '@/common/interfaces/users.interface'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/apis/users.api'
import { ErrorResponse } from '@/common/interfaces/response.interface'
import { ILoginSchema } from '@/common/schemas/users.schema'
import Spinner from '@/components/spinner'
import useUserStore from '@/stores/user.store'

export default function Login() {
  // Hooks
  const { toast } = useToast()
  const router = useRouter()
  const { setIsAuth } = useUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginBody>({
    resolver: yupResolver(ILoginSchema)
  })

  // Queries
  const loginMutation = useMutation({
    mutationFn: (body: ILoginBody) => loginUser(body),
    onSuccess: () => {
      router.push(ROUTES.home.path)
      setIsAuth(true)
    },
    onError: (error: ErrorResponse) => {
      toast({
        title: (error.response?.data?.message as string) || error.message,
        variant: 'destructive'
      })
    }
  })

  // Handlers
  const handleLoginForm = (data: ILoginBody) => {
    loginMutation.mutate(data)
  }

  return (
    <div>
      <div className='grid gap-2 text-center'>
        <h1 className='text-3xl font-bold'>Đăng nhập</h1>
        <p className='text-balance text-muted-foreground'>Nhập thông tin phía dưới để đăng nhập</p>
      </div>
      <form onSubmit={handleSubmit(handleLoginForm)} className='grid gap-4 mt-3'>
        <div className='relative grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' type='text' placeholder='m@example.com' {...register('email')} />
          <span className='absolute -bottom-4 text-xs text-red-600'>{errors.email?.message}</span>
        </div>
        <div className='relative grid gap-2'>
          <div className='flex items-center'>
            <div className='flex justify-between w-full'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Link href={ROUTES.forgot_password.path} className='text-xs underline text-right hover:text-red-500'>
                {ROUTES.forgot_password.name}
              </Link>
            </div>
            <span className='absolute -bottom-4 text-xs text-red-600'>{errors.password?.message}</span>
          </div>
          <Input id='password' type='password' {...register('password')} />
        </div>

        <Button type='submit' disabled={loginMutation.isPending} className='w-full'>
          {loginMutation.isPending && <Spinner className='mr-1' />}
          Đăng nhập
        </Button>
        <Link href={ROUTES.google_auth.path} className='border p-1 w-full flex justify-center space-x-2'>
          <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='22' height='22' viewBox='0 0 48 48'>
            <path
              fill='#fbc02d'
              d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
            ></path>
            <path
              fill='#e53935'
              d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
            ></path>
            <path
              fill='#4caf50'
              d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
            ></path>
            <path
              fill='#1565c0'
              d='M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
            ></path>
          </svg>
          <span>Đăng nhập Google</span>
        </Link>
      </form>
      <div className='mt-4 text-center text-sm'>
        Chưa có tài khoản?{' '}
        <Link href={ROUTES.register.path} className='underline'>
          Đăng ký
        </Link>
      </div>
    </div>
  )
}
