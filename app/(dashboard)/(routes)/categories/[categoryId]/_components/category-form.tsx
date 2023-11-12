'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { AlertModal } from '@/components/modals/alert-modal';

import { Category } from '@prisma/client';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData }: { initialData: Category | null }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const title = initialData ? 'Edit category' : 'Create category';
  const description = initialData ? 'Edit a category.' : 'Add a new category';
  const toastMessage = initialData ? 'Category updated.' : 'Category created.';
  const action = initialData ? 'Save changes' : 'Create category';

  // 1. Define your form.
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: CategoryFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/categories/${params.categoryId}`, values);
      } else {
        await axios.post('/api/categories', values);
      }

      router.refresh();
      router.push('/categories');
      toast.success(toastMessage);
    } catch (error) {
      toast.error(toastMessage);
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/categories`);
      toast.success('Category deleted.');
    } catch (error: any) {
      toast.error(
        'Make sure you removed all products using this category first.'
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between space-y-2">
        <Heading title={title} subtitle={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Category name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
