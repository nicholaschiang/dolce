import * as FormPrimitive from '@radix-ui/react-form'
import * as React from 'react'

import { labelVariants } from 'components/ui/label'

import { cn } from 'utils/cn'

const FormSubmit = FormPrimitive.Submit

const FormControl = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Control>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Control>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Control
    ref={ref}
    className={cn('peer', className)}
    {...props}
  />
))
FormControl.displayName = FormPrimitive.Control.displayName

const Form = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Root
    ref={ref}
    className={cn('grid gap-4', className)}
    {...props}
  />
))
Form.displayName = FormPrimitive.Root.displayName

const FormField = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Field>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Field>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Field
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
FormField.displayName = FormPrimitive.Field.displayName

const FormLabelWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-baseline justify-between', className)}
    {...props}
  />
))
FormLabelWrapper.displayName = 'FormLabelWrapper'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Label
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
FormLabel.displayName = FormPrimitive.Label.displayName

const FormMessage = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Message>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Message>
>(({ className, ...props }, ref) => (
  <FormPrimitive.Message
    ref={ref}
    className={cn(
      'text-gray-500 dark:text-gray-400 text-2xs leading-none',
      className,
    )}
    {...props}
  />
))
FormMessage.displayName = FormPrimitive.Message.displayName

export {
  Form,
  FormControl,
  FormSubmit,
  FormField,
  FormLabelWrapper,
  FormLabel,
  FormMessage,
}
