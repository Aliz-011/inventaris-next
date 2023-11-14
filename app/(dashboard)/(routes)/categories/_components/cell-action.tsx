'use client';

import axios from 'axios';
import { useState } from 'react';
import { Copy, MoreHorizontal, Trash, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { CategoryColumn } from './columns';
import { AlertModal } from '@/components/modals/alert-modal';
import { useAuth } from '@clerk/nextjs';
import { isAdmin } from '@/lib/admin';

interface CellActionProps {
  data: CategoryColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const { userId } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/categories/${data.id}`);
      toast.success('Category deleted.');
      router.refresh();
    } catch (error) {
      toast.error(
        'Make sure you removed all products using this category first.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success('Category ID copied to clipboard.');
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>

          {isAdmin(userId) && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/categories/${data.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
