import React, {useEffect, useRef} from 'react';
import {StyleSheet, TextInput, TextInputProps, View} from 'react-native';
import {FormFunctions} from './useForm';

// ************************** STYLES *******************************************/

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  textInput: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
  },
});

// ************************** FUNCTIONS ****************************************/
interface HandleChangeProps<T> {
  field: keyof T;
  form?: FormFunctions<T>;
  value: any;
}

const handleChange = <T,>({field, form, value}: HandleChangeProps<T>) => {
  if (!form) {
    return;
  }
  if (form.state === 'CLEAN') {
    form.setState('DIRTY');
  }
  form.setValue(field, value);
};

const handleBlur = <T,>(form: FormFunctions<T> | undefined, field: keyof T) => {
  if (!form) {
    return;
  }
  form.setFieldTouched(field);
};

const handleSubmitEditing = <T,>(
  order: number | undefined,
  form: FormFunctions<T> | undefined,
) => {
  if (
    order === undefined ||
    form === undefined ||
    form?.fieldRefs.length - 1 < order
  ) {
    return;
  }
  if (order === form?.fieldRefs.length - 1) {
    form.handleSubmit();
  } else {
    const element = form?.fieldRefs[order + 1].current as TextInput;
    if (element.focus !== undefined) {
      element.focus();
    }
    form?.setCurrentField(order + 1);
  }
};

// ************************** FORM WRAPPER *************************************/
interface FormProps<T> {
  children: React.ReactNode;
  form: FormFunctions<T>;
}

const Wrapper = <T,>({children, form}: FormProps<T>) => {
  let order = 0;
  return (
    <View>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          if (child.props.field) {
            order += 1;
          }
          return React.cloneElement(child, {
            form: form,
            order: child.props.field ? order - 1 : undefined,
          });
        }
      })}
    </View>
  );
};

// ************************** BASIC INPUT ***********************************/
interface BasicTextInputProps<T> extends TextInputProps {
  field: keyof T;
  form?: FormFunctions<T>;
  order?: number;
}

const BasicTextInput = <T,>(props: BasicTextInputProps<T>): JSX.Element => {
  const {form, field, order} = props;
  const ref = useRef<TextInput>(null);
  useEffect(() => {
    form?.setFieldRefs(_prev => [..._prev, ref]);
  }, []);

  const keyboardReturnKeyType =
    order !== undefined && form?.fieldRefs && order < form?.fieldRefs.length - 1
      ? 'next'
      : 'done';

  return (
    <View style={styles.inputContainer}>
      <TextInput
        defaultValue={form?.values[field]}
        onBlur={() => handleBlur<T>(form, field)}
        onChangeText={text =>
          handleChange<T>({
            field,
            form,
            value: text,
          })
        }
        onSubmitEditing={() => handleSubmitEditing<T>(order, form)}
        ref={ref}
        returnKeyType={keyboardReturnKeyType}
        style={styles.textInput}
        autoFocus={false}
        placeholderTextColor="#263243"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={false}
        {...props}
      />
    </View>
  );
};

const Form = {
  BasicTextInput,
  Wrapper,
};

export default Form;
