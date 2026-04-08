import type { Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { Input, type InputProps } from '@/components/ui/Input';

type FormInputProps<TFieldValues extends FieldValues> = Omit<
  InputProps,
  'onBlur' | 'onChange' | 'value'
> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
};

export const FormInput = <TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: FormInputProps<TFieldValues>) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <Input
        error={fieldState.error?.message}
        onBlur={field.onBlur}
        onChangeText={field.onChange}
        value={
          typeof field.value === 'string' ? field.value : field.value ? String(field.value) : ''
        }
        {...rest}
      />
    )}
  />
);
