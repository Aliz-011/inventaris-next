'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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

import { Product } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Heading from '@/components/heading';

import useCart from '@/hooks/use-cart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useConfettiStore } from '@/hooks/use-confetti-store';

const formSchema = z.object({
  customer: z.string().min(2, {
    message: 'customer must be at least 2 characters.',
  }),
  phone: z.string().min(12, {
    message: 'phone must be at least 12 characters.',
  }),
  paymentType: z.enum(['qr', 'cash'], {
    required_error: 'You need to select a payment type.',
  }),
});

type OrderFormValues = z.infer<typeof formSchema>;

const OrderForm = ({ products }: { products: Product[] }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{
    [itemId: string]: { productId: string; quantity: number };
  }>({});

  const router = useRouter();
  const cart = useCart();
  const confetti = useConfettiStore((state) => state.onOpen);

  const handleProductChange = (
    itemId: string,
    productId: string,
    quantity: number
  ) => {
    setSelectedProducts({
      ...selectedProducts,
      [itemId]: { productId, quantity },
    });
  };

  // 1. Define your form.
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      phone: '',
    },
  });

  async function onSubmit(values: OrderFormValues) {
    try {
      setLoading(true);
      console.log(selectedProducts);

      const { status } = await axios.post('/api/orders', {
        ...values,
        productIds: Object.fromEntries(
          Object.entries(selectedProducts).map(
            ([itemId, { productId, quantity }]) => [productId, quantity]
          )
        ),
      });

      if (status === 400) {
        throw new Error('Something went wrong');
      }

      router.refresh();
      router.push('/');
      confetti();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Create order" subtitle="Add a new order" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create order</CardTitle>
          <CardDescription>
            Please fill in the required information below and click submit
            button to create an order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid w-full items-center gap-4"
            >
              <div className="md:grid md:grid-cols-3 gap-8 items-center">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Customer name..."
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Customer phone number..."
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center gap-x-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="qr" />
                            </FormControl>
                            <FormLabel className="font-normal">QR</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal">Cash</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col gap-y-2 mt-6">
                <h3 className="text-sm font-semibold">Item list</h3>
                {cart.items.map((item) => (
                  <div
                    className="flex flex-col items-center gap-x-4 gap-y-2 relative md:flex-row"
                    key={item.id}
                  >
                    <div className="flex flex-col md:w-2/3">
                      <Select
                        disabled={loading}
                        value={selectedProducts[item.id]?.productId || ''}
                        onValueChange={(value) =>
                          handleProductChange(
                            item.id,
                            value,
                            selectedProducts[item.id]?.quantity || 0
                          )
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-y-2 md:w-1/3">
                      <Input
                        id="name"
                        placeholder="quantity"
                        value={selectedProducts[item.id]?.quantity || 0}
                        onChange={(e) =>
                          handleProductChange(
                            item.id,
                            selectedProducts[item.id]?.productId || '',
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => cart.removeItem(item.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  type="button"
                  className="rounded-full"
                  onClick={cart.addItem}
                >
                  Add new item
                </Button>
              </div>
              <Button>Create order</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderForm;
