import useLookupFromOptions from "@hooks/form/use-lookup-from-options";
import { Autocomplete, TextField } from "@mui/material";
import IdPayload from "@server/type/misc/id-payload";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import LabelBox, { LabelBoxProps } from "../label-box";

export type FormIndexedSelectFieldProps<T extends FieldValues> = {
  multi?: boolean;
  control: Control<T>;
  id: Path<T>;
  options: {
    key: IdPayload;
    value: string;
  }[];
  value?: any;
  readOnly?: boolean; 
  onValueChange?: (value: any) => void; 
} & Omit<LabelBoxProps, "children">;
export default function FormIndexedSelectField<T extends FieldValues>({
  multi,
  control,
  id,
  label,
  required,
  labelProps,
  separateLabel,
  options,
  value,
  onValueChange,
  readOnly
}: FormIndexedSelectFieldProps<T>) {
  const defaultValue: any = multi ? [] : "";
  const {
    field: { onChange, value: controlledValue, ...controllerProps },
    fieldState: { error },
  } = useController({
    control,
    name: id,
    defaultValue: defaultValue,
  });

  const [$dict, $keys] = useLookupFromOptions(options);

  const handleChange = (event: React.SyntheticEvent, newValue: any) => {
    const selectedValue = newValue as number;
    if (onValueChange) {
      onValueChange(selectedValue); 
    }
    if (onChange) {
      onChange(selectedValue);
    }
  };


  return (
    <LabelBox
      label={label}
      separateLabel={separateLabel}
      labelProps={labelProps}
      required={required}
    >
      <Autocomplete
        multiple={multi ? true : false}
        options={$keys}
        autoHighlight
        value={value !== undefined ? value : controlledValue}
        getOptionLabel={(opt) => $dict[opt] ?? ""}
        isOptionEqualToValue={(opt, value) => `${opt}` === `${value}`}
        renderInput={(params) => (
          <TextField
            {...params}
            label={separateLabel ? undefined : label}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password",
              readOnly,
            }}
            error={Boolean(error)}
            helperText={error?.message}
            autoComplete="new-password"
            sx={{ backgroundColor: readOnly ? "#F4F4F4" : "white" }} 
          />
        )}
        onChange={handleChange}
        {...controllerProps}
        disabled={readOnly}
      />
    </LabelBox>
  );
}
