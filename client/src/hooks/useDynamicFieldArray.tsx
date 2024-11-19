import { useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";

export default function useDynamicFieldArray<T extends FieldValues>(form: UseFormReturn<T>, name: keyof T) {
  const [fields, setFields] = useState<string[]>([]);

  const addField = () => setFields([...fields, ""]);
  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    form.setValue(name as Path<T>, newFields as PathValue<T, Path<T>>);
  };
  const updateField = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
    form.setValue(name as Path<T>, newFields as PathValue<T, Path<T>>);
  };

  return {
    fields,
    addField,
    removeField,
    updateField,
    setFields,
  };
}
