import { TextField, TextFieldProps } from "@mui/material";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import LabelBox, { LabelBoxProps } from "./label-box";

export type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  id: Path<T>;
} & LabelBoxProps &
  Omit<
    TextFieldProps,
    "onChange" | "onBlur" | "inputRef" | "error" | "helperText"
  >;
export default function FormField<T extends FieldValues>({
  control,
  id,
  label,
  required,
  separateLabel,
  labelProps,
  ...fieldProps
}: FormFieldProps<T>) {
  const {
    field: { ref, value, ...controllerProps },
    fieldState: { error },
  } = useController({
    control,
    name: id,
  });

  return (
    <LabelBox
      label={label}
      separateLabel={separateLabel}
      labelProps={labelProps}
      required={required}
    >
      <TextField
        value={value ?? ""}
        {...controllerProps}
        label={separateLabel ? undefined : label}
        inputRef={ref}
        error={Boolean(error)}
        helperText={error?.message}
        autoComplete="new-password"
        {...fieldProps}
      />
    </LabelBox>
  );
}
