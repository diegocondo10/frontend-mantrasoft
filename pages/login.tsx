import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import TextInput from '@src/components/Forms/TextInput';
import CONFIGS from '@src/constants/configs';
import { REQUIRED_RULE } from '@src/constants/rules';
import useToasts from '@src/hooks/useToasts';
import PublicLayout from '@src/layouts/PublicLayout';
import { UsuarioService } from '@src/services/usuario/usuario.service';
import useUsuario from '@src/store/usuario/useUsuario';
import { CustomNextPage } from '@src/types/next';
import { Perfil } from '@src/types/usuario';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { PrimeIcons } from 'primereact/api';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

const LoginPage: CustomNextPage = () => {
  const methods = useForm({ mode: 'onChange' });

  const toast = useToasts();
  const [loading, setLoading] = useState(false);

  const { setUsuario } = useUsuario();

  const loginMutation = useMutation<AxiosResponse>((formData: any) =>
    new UsuarioService().login(formData.username, formData.password),
  );

  const router = useRouter();

  const _onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await loginMutation.mutateAsync(data);
      Cookies.set(CONFIGS.TOKEN_KEY, res.data.access);

      const responsePerfil = await new UsuarioService().perfil();
      setUsuario(responsePerfil.data as Perfil);
      Cookies.set(CONFIGS.USER_KEY, JSON.stringify(responsePerfil.data));

      router.replace('/');
    } catch (error) {
      toast.addErrorToast(error?.allMessagesLikeReact || error.message);
    }
    setLoading(false);
  };

  return (
    <PublicLayout
      loading={{
        loading: loading,
        texto: 'Verificando información',
      }}
    >
      <main className="grid-container center">
        <FormProvider {...methods}>
          <form
            className="flex align-items-center justify-content-center h-screen"
            onSubmit={methods.handleSubmit(_onSubmit)}
          >
            <div className="surface-card p-4 shadow-2 border-round w-full w-10 sm:w-8 md:w-6 lg:w-5 xl:w-4 my-auto">
              <div className="text-center mb-5">
                <Image alt="Los Jardines" src="/logo.jpeg" width="200" height="200" />
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
                  disabled={loading}
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
                  disabled={loading}
                />

                <ErrorMessage name="password" />

                <Button
                  outlined
                  label="Ingresar"
                  type="submit"
                  className="w-full mt-3"
                  icon={PrimeIcons.SEND}
                  iconPos="right"
                  loading={loading}
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
