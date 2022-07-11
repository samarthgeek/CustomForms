import React, {useState} from 'react';
import {TextInput} from 'react-native';

export type Touched<T> = Record<keyof T, boolean>;
export type Values<T> = Record<keyof T, any>;
export type FormState = 'CLEAN' | 'DIRTY' | 'SUBMITTING';

export interface FormOptions<T> {
  onSubmit: () => Promise<void>;
  initialValues: Record<keyof T, any>;
}

export interface FormFunctions<T> {
  currentField: number;
  handleSubmit: () => Promise<void>;
  options: FormOptions<T>;
  fieldRefs: React.RefObject<TextInput>[];
  reset: () => void;
  setAllTouched: () => void;
  setCurrentField: (field: number) => void;
  setFieldRefs: React.Dispatch<
    React.SetStateAction<React.RefObject<TextInput>[]>
  >;
  setFieldTouched: (field: keyof T) => void;
  setState: (state: FormState) => void;
  setValue: (string: keyof T, value: any) => void;
  state: FormState;
  touched: Record<keyof T, boolean>;
  values: Record<keyof T, any>;
}

export const useForm = <T>(options: FormOptions<T>) => {
  const initialTouched = {...options.initialValues};
  for (const item in initialTouched) {
    initialTouched[item as keyof T] = false;
  }

  const [state, setState] = useState<FormState>('CLEAN');
  const [touched, setTouched] = useState<Touched<T>>(initialTouched);
  const [values, setValues] = useState<Values<T>>(options.initialValues);
  const [currentField, setCurrentField] = useState<number>(0);
  const [fieldRefs, setFieldRefs] = useState<React.RefObject<TextInput>[]>([]);
  console.log(fieldRefs);
  console.log(currentField);
  console.log(state);

  const reset = () => {
    setValues(options.initialValues);
    setTouched(initialTouched);
  };

  const setValue = <U>(field: keyof T, value: U) => {
    setValues(_values => {
      return {..._values, [field]: value};
    });
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched({...touched, [field]: true});
  };

  const setAllTouched = () => {
    const allTouched = {...touched};
    for (const field in touched) {
      allTouched[field] = true;
    }
    setTouched(allTouched);
  };

  const handleSubmit = async () => {
    setAllTouched();
    setState('SUBMITTING');
    await options.onSubmit();
    setState('CLEAN');
  };

  const form = {
    currentField,
    fieldRefs,
    handleSubmit,
    options,
    reset,
    setAllTouched,
    setCurrentField,
    setFieldRefs,
    setFieldTouched,
    setState,
    setValue,
    state,
    touched,
    values,
  };

  return form;
};
