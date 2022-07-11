import React from 'react';
import {SafeAreaView} from 'react-native';
import Form from './src/Forms';
import {useForm} from './src/useForm';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const App = () => {
  const form = useForm<FormValues>({
    initialValues: {firstName: '', lastName: '', email: ''},
    onSubmit: async () => void 0,
  });

  return (
    <SafeAreaView style={{backgroundColor: 'black', flex: 1}}>
      <Form.Wrapper form={form}>
        <Form.BasicTextInput<FormValues>
          field="firstName"
          textContentType="givenName"
          autoComplete="name-given"
          placeholder="first name"
        />
        <Form.BasicTextInput<FormValues>
          field="lastName"
          textContentType="familyName"
          autoComplete="name-family"
          placeholder="last name"
        />
        <Form.BasicTextInput<FormValues>
          field="email"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="email"
        />
      </Form.Wrapper>
    </SafeAreaView>
  );
};

export default App;
