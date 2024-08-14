import Button from '@src/components/Button';
import ErrorMessage from '@src/components/Forms/ErrorMessage';
import PageTitle from '@src/components/PageTitle';
import { REQUIRED_RULE } from '@src/constants/rules';
import useToasts from '@src/hooks/useToasts';
import PrivateLayout from '@src/layouts/PrivateLayout';
import { UsuarioService } from '@src/services/usuario/usuario.service';
import { CustomNextPage } from '@src/types/next';
import { commandPush } from '@src/utils/router';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

const CambiarContraseniaPage: CustomNextPage<any> = ({ id }) => {
  const methods = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);

  const toast = useToasts();

  const query = useQuery(['usuario', id], () => new UsuarioService().retrieve(id), {
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const usuario = query.data?.data;
  const fullName = `${usuario?.username} - ${usuario?.email}`;
  const onSubmit = (formData) => {
    setLoading(true);
    try {
      new UsuarioService().setPassword(id, formData.password);
      toast.addSuccessToast(`Se ha actualizado la contraseña del usuario: ${fullName}`);
      Router.push('/auditoria/usuarios');
    } catch (error) {
      toast.addErrorToast('Ha ocurrido un problema al momento de cambiar la contraseña');
    }
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <PrivateLayout
        loading={{
          loading: query.isFetching || loading,
        }}
        breadCrumbItems={[
          {
            label: 'Usuarios',
            command: commandPush('/auditoria/usuarios'),
          },
          {
            label: fullName,
          },
          { label: 'Cambiar contraseña' },
        ]}
      >
        <main className="grid grid-nogutter">
          <div className="col-12 text-center">
            <PageTitle>Cambiar contraseña</PageTitle>
            <h3>{fullName}</h3>
          </div>
          <form className="col-12 grid grid-nogutter justify-content-center">
            <div className="col-11 md:col-8 lg:col-6 xl:col-4 border-1 border-gray-200 p-5">
              <div className="grid grid-nogutter justify-content-around">
                <div className="field col-11 my-5">
                  <label>Nueva contraseña</label>
                  <Controller
                    name="password"
                    rules={{ ...REQUIRED_RULE }}
                    render={({ field, fieldState }) => (
                      <Password
                        inputClassName="w-full"
                        className="w-full"
                        invalid={fieldState.invalid}
                        value={field.value}
                        onChange={field.onChange}
                        panelClassName="hidden w-full"
                        toggleMask
                        autoComplete="off"
                      />
                    )}
                  />
                  <ErrorMessage name="password" />
                </div>
                <div className="col-5">
                  <Button label="Regresar" outlined block />
                </div>
                <div className="col-5">
                  <Button label="Guardar" outlined block onClick={methods.handleSubmit(onSubmit)} />
                </div>
              </div>
            </div>
          </form>
        </main>
      </PrivateLayout>
    </FormProvider>
  );
};

CambiarContraseniaPage.isPrivate = true;
export const getServerSideProps: GetServerSideProps<any> = async ({ query }) => {
  return {
    props: query,
  };
};
export default CambiarContraseniaPage;
