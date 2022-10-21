import * as z from 'zod';

export type TodoStatus = z.infer<typeof TodoStatusSchema>;
export const TodoStatusSchema = z.enum(['uncompleted', 'completed']);

export type TodoItem = z.infer<typeof TodoItemSchema>;
export const TodoItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  content: z.string(),
  status: TodoStatusSchema,
});

export type ShoppingListItemStatus = z.infer<typeof ShoppingListItemStatusSchema>;
export const ShoppingListItemStatusSchema = z.enum(['unpicked', 'picked']);

export type ShoppingListItem = z.infer<typeof ShopplingListItemSchema>;
export const ShopplingListItemSchema = z.object({
  id: z.string(),
  content: z.string(),
  status: ShoppingListItemStatusSchema,
});

export type ShoppingList = z.infer<typeof ShoppingListSchema>;
export const ShoppingListSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  items: z.array(ShopplingListItemSchema),
});
