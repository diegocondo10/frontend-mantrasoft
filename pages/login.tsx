import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import CONFIGS from '@src/constants/configs';
import { REQUIRED_RULE } from '@src/constants/rules';
import useToasts from '@src/hooks/useToasts';
import PublicLayout from '@src/layouts/PublicLayout';
import { UsuarioService } from '@src/services/usuario/usuario.service';
import { CustomNextPage } from '@src/types/next';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/dist/client/router';
import { PrimeIcons } from 'primereact/api';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

const LoginPage: CustomNextPage = () => {
  const methods = useForm({ mode: 'onChange' });

  const toast = useToasts();

  const loginMutation = useMutation<AxiosResponse>((formData: any) =>
    new UsuarioService().login(formData.username, formData.password),
  );

  const router = useRouter();

  const _onSubmit = async (data: any) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      localStorage.setItem(CONFIGS.TOKEN_KEY, res.data.access);
      localStorage.setItem(CONFIGS.REFRESH_TOKEN_KEY, res.data.refresh);
      router.replace('/');
    } catch (error) {
      toast.addErrorToast(error?.allMessagesLikeReact || error.message);
    }
  };

  return (
    <PublicLayout
      loading={{
        loading: loginMutation.isLoading,
        texto: 'Verificando información',
      }}
    >
      <main className="grid-container center">
        <FormProvider {...methods}>
          <form
            className="flex align-items-center justify-content-center h-screen"
            onSubmit={methods.handleSubmit(_onSubmit)}
          >
            <div className="surface-card p-4 shadow-2 border-round w-full w-10 md:w-8 lg:w-6 xl:w-4 my-auto">
              <div className="text-center mb-5">
                <div className="text-900 text-5xl font-medium mb-3">Bienvenido</div>
              </div>

              <div>
                <label htmlFor="username" className="block text-900 font-medium mb-2">
                  Usuario
                </label>
                <TextInput
                  block
                  controller={{
                    name: 'username',
                    rules: { ...REQUIRED_RULE },
                  }}
                  disabled={loginMutation.isLoading}
                />
                <ErrorMessage name="username" />

                <label htmlFor="password" className="block text-900 font-medium my-2">
                  Password
                </label>
                <TextInput
                  block
                  type="password"
                  controller={{
                    name: 'password',
                    rules: { ...REQUIRED_RULE },
                  }}
                  disabled={loginMutation.isLoading}
                />

                <ErrorMessage name="password" />

                <Button
                  label="Ingresar"
                  type="submit"
                  className="w-full mt-3"
                  icon={PrimeIcons.SEND}
                  iconPos="right"
                  loading={loginMutation.isLoading}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </PublicLayout>
  );
};

export default LoginPage;
