import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import CONFIGS from '@src/constants/configs';
import useToasts from '@src/hooks/useToasts';
import PublicLayout from '@src/layouts/PublicLayout';
import API from '@src/services/api';
import { urlLogin } from '@src/services/urls';
import classNames from 'classnames';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

const LoginPage: NextPage<any> = () => {
  const methods = useForm({ mode: 'onChange' });
  const { addApiErrorToast } = useToasts();
  const loginMutation = useMutation((formData) => API.public().post(urlLogin, formData));

  const router = useRouter();

  const _onSubmit = async (data: any) => {
    try {
      const res = await loginMutation.mutateAsync(data);

      localStorage.setItem(CONFIGS.TOKEN_KEY, res.data.access);
      localStorage.setItem(CONFIGS.REFRESH_TOKEN_KEY, res.data.refresh);
      router.replace('/');
    } catch (error) {
      addApiErrorToast(error, { path: 'detail' });
    }
  };

  return (
    <PublicLayout>
      <main className="grid-container center">
        <FormProvider {...methods}>
          <form className="flex align-items-center justify-content-center" onSubmit={methods.handleSubmit(_onSubmit)}>
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
              <div className="text-center mb-5">
                <img src="assets/images/blocks/logos/hyper.svg" alt="hyper" height={50} className="mb-3" />
                <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
              </div>

              <div>
                <Controller
                  name="username"
                  rules={{
                    required: 'Obligatorio',
                  }}
                  render={({ field, fieldState }) => (
                    <React.Fragment>
                      <label htmlFor={field.name} className="block text-900 font-medium mb-2">
                        Usuario
                      </label>
                      <InputText
                        id={field.name}
                        className={classNames('w-full', {
                          'p-invalid': fieldState.invalid,
                        })}
                        {...field}
                      />
                      <ErrorMessage name={field.name} />
                    </React.Fragment>
                  )}
                />
                <Controller
                  name="password"
                  rules={{
                    required: 'Obligatorio',
                  }}
                  render={({ field, fieldState }) => (
                    <React.Fragment>
                      <label htmlFor={field.name} className="block text-900 font-medium my-2">
                        Password
                      </label>
                      <InputText
                        type="password"
                        className={classNames('w-full', {
                          'p-invalid': fieldState.invalid,
                        })}
                        {...field}
                      />

                      <ErrorMessage name={field.name} />
                    </React.Fragment>
                  )}
                />

                <Button label="Ingresar" type="submit" className="w-full mt-3" icon={PrimeIcons.SEND} iconPos="right" />
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </PublicLayout>
  );
};

export default LoginPage;
