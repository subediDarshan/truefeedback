'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verify.schema';
import ApiResponse from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
// import { useState } from 'react'; RESEND_DISABLED
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {motion} from "framer-motion"


export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
        code: ""
    }
  });
  // const [isSubmitting, setIsSubmitting] = useState(false) RESEND_DISABLED

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
        // setIsSubmitting(true) RESEND_DISABLED
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/login');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
    finally {
        // setIsSubmitting(false) RESEND_DISABLED
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  {/* <Input {...field} disabled={isSubmitting}/>RESEND_DISABLED */}
                  <Input {...field} disabled={true}/>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={true}>Verify</Button>
          </form>
        </Form>
      </div>
    </div>
    </motion.div>
  );
}