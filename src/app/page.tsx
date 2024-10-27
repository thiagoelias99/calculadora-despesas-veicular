'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Combobox } from '@/components/ui/combo-box';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from '@/lib/pt-zod';
import { formatCurrency } from '@/lib/utils';
import { HandCoinsIcon } from 'lucide-react';

interface ComboOptions {
  manufacturer: string | null;
  manufacturerOptions: { value: string; label: string }[];
  model: string | null;
  modelOptions: { value: string; label: string }[];
  year: string | null;
  yearOptions: { value: string; label: string }[];
}

interface Vehicle {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

export interface Estado {
  sigla: string;
  nome: string;
  carro: number;
  moto: number;
  caminhao: number;
}

const estados: Estado[] = [
  {
    "sigla": "AC",
    "nome": "Acre",
    "carro": 0.04,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "AL",
    "nome": "Alagoas",
    "carro": 0.03,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "AP",
    "nome": "Amapá",
    "carro": 0.03,
    "moto": 0.03,
    "caminhao": 0.015
  },
  {
    "sigla": "AM",
    "nome": "Amazonas",
    "carro": 0.03,
    "moto": 0.025,
    "caminhao": 0.015
  },
  {
    "sigla": "BA",
    "nome": "Bahia",
    "carro": 0.025,
    "moto": 0.015,
    "caminhao": 0.015
  },
  {
    "sigla": "CE",
    "nome": "Ceará",
    "carro": 0.032,
    "moto": 0.015,
    "caminhao": 0.02
  },
  {
    "sigla": "DF",
    "nome": "Distrito Federal",
    "carro": 0.035,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "ES",
    "nome": "Espírito Santo",
    "carro": 0.04,
    "moto": 0.02,
    "caminhao": 0.01
  },
  {
    "sigla": "GO",
    "nome": "Goiás",
    "carro": 0.0375,
    "moto": 0.0275,
    "caminhao": 0.015
  },
  {
    "sigla": "MA",
    "nome": "Maranhão",
    "carro": 0.025,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "MT",
    "nome": "Mato Grosso",
    "carro": 0.04,
    "moto": 0.025,
    "caminhao": 0.015
  },
  {
    "sigla": "MS",
    "nome": "Mato Grosso do Sul",
    "carro": 0.035,
    "moto": 0.02,
    "caminhao": 0.01
  },
  {
    "sigla": "MG",
    "nome": "Minas Gerais",
    "carro": 0.04,
    "moto": 0.02,
    "caminhao": 0.01
  },
  {
    "sigla": "PA",
    "nome": "Pará",
    "carro": 0.025,
    "moto": 0.015,
    "caminhao": 0.01
  },
  {
    "sigla": "PB",
    "nome": "Paraíba",
    "carro": 0.025,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "PR",
    "nome": "Paraná",
    "carro": 0.035,
    "moto": 0.015,
    "caminhao": 0.01
  },
  {
    "sigla": "PE",
    "nome": "Pernambuco",
    "carro": 0.03,
    "moto": 0.025,
    "caminhao": 0.015
  },
  {
    "sigla": "PI",
    "nome": "Piauí",
    "carro": 0.025,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "RJ",
    "nome": "Rio de Janeiro",
    "carro": 0.04,
    "moto": 0.035,
    "caminhao": 0.01
  },
  {
    "sigla": "RN",
    "nome": "Rio Grande do Norte",
    "carro": 0.025,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "RS",
    "nome": "Rio Grande do Sul",
    "carro": 0.03,
    "moto": 0.015,
    "caminhao": 0.01
  },
  {
    "sigla": "RO",
    "nome": "Rondônia",
    "carro": 0.04,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "RR",
    "nome": "Roraima",
    "carro": 0.03,
    "moto": 0.025,
    "caminhao": 0.01
  },
  {
    "sigla": "SC",
    "nome": "Santa Catarina",
    "carro": 0.02,
    "moto": 0.02,
    "caminhao": 0.01
  },
  {
    "sigla": "SP",
    "nome": "São Paulo",
    "carro": 0.04,
    "moto": 0.02,
    "caminhao": 0.015
  },
  {
    "sigla": "SE",
    "nome": "Sergipe",
    "carro": 0.025,
    "moto": 0.015,
    "caminhao": 0.015
  },
  {
    "sigla": "TO",
    "nome": "Tocantins",
    "carro": 0.025,
    "moto": 0.02,
    "caminhao": 0.015
  }
]

const veiculos = [
  {
    value: 'carro',
    label: 'Carro'
  },
  {
    value: 'moto',
    label: 'Moto'
  },
  {
    value: 'caminhao',
    label: 'Caminhão'
  }
]

const formSchema = z.object({
  ipva: z.union([
    z.string().refine((value) => parseFloat(value) >= 0, {
      message: 'Deve ser um número positivo',
    }).transform((value) => parseFloat(value)),
    z.number().refine((value) => value >= 0, {
      message: 'Deve ser um número positivo',
    }),
  ]),
  combustivel: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
  seguro: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
  manutencao: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),


  lavagem: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
  estacionamento: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
  outros: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
  pedagio: z.string().refine((value) => parseFloat(value) >= 0, {
    message: 'Deve ser um número positivo',
  }).transform((value) => parseFloat(value)).optional(),
})

export default function Home() {
  const [comboOptions, setComboOptions] = useState<ComboOptions>({
    manufacturer: null,
    manufacturerOptions: [],
    model: null,
    modelOptions: [],
    year: null,
    yearOptions: []
  });

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const [estado, setEstado] = useState<Estado | null>(estados[24]);

  const [total, setTotal] = useState<number>(0);

  const [tipoVeiculo, setTipoVeiculo] = useState<string>('carro');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ipva: 0,
    },
  })

  useEffect(() => {
    fetchManufacturers();
  }, []);

  async function handleManufactureChange(value: string) {
    setComboOptions({
      ...comboOptions,
      manufacturer: value,
      model: null,
      modelOptions: [],
      year: null,
      yearOptions: []
    });
    setVehicle(null);
    await fetchModels(value);
  }

  async function handleModelChange(value: string) {
    setComboOptions({
      ...comboOptions,
      model: value,
      year: "",
      yearOptions: []
    });
    setVehicle(null);
    await fetchYears(value);
  }

  async function handleYearChange(value: string) {
    setComboOptions({
      ...comboOptions,
      year: value
    });
    await fetchVehicle(value);
  }

  function getPluralVeiculo(tipo: string) {
    switch (tipo) {
      case 'carro':
        return 'carros';
      case 'moto':
        return 'motos';
      case 'caminhao':
        return 'caminhoes';
      default:
        return 'carros';
    }
  }

  useEffect(() => {
    fetchManufacturers();
  }, [tipoVeiculo]);

  async function fetchManufacturers() {
    fetch(`https://parallelum.com.br/fipe/api/v1/${getPluralVeiculo(tipoVeiculo)}/marcas`)
      .then(response => response.json())
      .then(data => {
        const options = data?.map((manufacturer: { nome: string; codigo: string }) => ({
          value: manufacturer.codigo,
          label: manufacturer.nome
        }));
        setComboOptions({
          manufacturer: null,
          manufacturerOptions: options,
          model: null,
          modelOptions: [],
          year: null,
          yearOptions: []
        });
      });
  }

  async function fetchModels(manufacturer: string | null) {
    if (!manufacturer) { return }
    fetch(`https://parallelum.com.br/fipe/api/v1/${getPluralVeiculo(tipoVeiculo)}/marcas/${manufacturer}/modelos`)
      .then(response => response.json())
      .then(data => {
        const options = data.modelos?.map((model: { nome: string; codigo: string }) => ({
          value: model.codigo,
          label: model.nome
        }));
        setComboOptions({
          ...comboOptions,
          manufacturer: manufacturer,
          modelOptions: options
        });
      });
  }

  function fetchYears(model: string | null) {
    if (!model) { return }

    fetch(`https://parallelum.com.br/fipe/api/v1/${getPluralVeiculo(tipoVeiculo)}/marcas/${comboOptions.manufacturer}/modelos/${model}/anos`)
      .then(response => response.json())
      .then(data => {
        const options = data.map((year: { nome: string; codigo: string }) => ({
          value: year.codigo,
          label: year.nome
        }));
        setComboOptions({
          ...comboOptions,
          model: model,
          yearOptions: options
        });
      });
  }

  async function fetchVehicle(year: string | null) {
    if (!year) { return }
    fetch(`https://parallelum.com.br/fipe/api/v1/${getPluralVeiculo(tipoVeiculo)}/marcas/${comboOptions.manufacturer}/modelos/${comboOptions.model}/anos/${year}`)
      .then(response => response.json())
      .then(data => {
        const vehicle = data as Vehicle;
        setVehicle(vehicle);
        const ipvaValue = parseFloat(vehicle.Valor.replaceAll("R$ ", "").replaceAll(".", "").replaceAll(",", ".")) * (Number(estado?.[tipoVeiculo]) || 1) || 0;
        form.setValue('ipva', ipvaValue.toFixed(2));
      });
  }

  useEffect(() => {
    if (estado && vehicle) {
      const ipvaValue = parseFloat(vehicle.Valor.replaceAll("R$ ", "").replaceAll(".", "").replaceAll(",", ".")) * (Number(estado?.[tipoVeiculo]) || 1) || 0;
      form.setValue('ipva', ipvaValue.toFixed(2));
    }
  }, [estado, vehicle]);

  useEffect(() => {
    setVehicle(null);
    setComboOptions({
      manufacturer: null,
      manufacturerOptions: [],
      model: null,
      modelOptions: [],
      year: null,
      yearOptions: []
    });
  }, [tipoVeiculo]);

  useEffect(() => {

    let total2 = 0
    total2 += Number(form.getValues('ipva') || 0)
    total2 += Number(form.getValues('combustivel') || 0) * 12
    total2 += Number(form.getValues('seguro') || 0) || 0
    total2 += Number(form.getValues('manutencao') || 0) || 0
    total2 += Number(form.getValues('estacionamento') || 0) * 12
    total2 += Number(form.getValues('pedagio') || 0) * 12
    total2 += Number(form.getValues('lavagem') || 0) * 12
    total2 += Number(form.getValues('outros') || 0);

    setTotal(total2);
  }, [form.watch()]);

  return (
    <>
      <Card className='max-w-screen-sm mx-auto mt-8'>
        <CardHeader>
          <CardTitle className='text-center'>Calculadora de Gastos Anuais de Veículo</CardTitle>
          <CardDescription>Preencha as informações para estimar o gasto anual para manter seu veículo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1'>
              <Label>Tipo do seu veículo</Label>
              <Combobox
                value={tipoVeiculo}
                options={veiculos}
                onSelect={(value) => setTipoVeiculo(value)}
                className='mt-1'
              />
            </div>
            <div className='space-y-1'>
              <Label>Fabricante</Label>
              <Combobox
                value={comboOptions.manufacturer}
                options={comboOptions.manufacturerOptions}
                onSelect={handleManufactureChange}
                className='mt-1'
              />
            </div>
            <div className='space-y-1'>
              <Label>Modelo</Label>
              <Combobox
                value={comboOptions.model}
                options={comboOptions.modelOptions}
                onSelect={handleModelChange}
                className='mt-1'
              />
            </div>
            <div className='space-y-1'>
              <Label>Ano de Fabricação</Label>
              <Combobox
                value={comboOptions.year}
                options={comboOptions.yearOptions}
                onSelect={handleYearChange}
                className='mt-1'
              />
            </div>
            <div className='space-y-1'>
              <Label>Estado de registro do veículo</Label>
              <Combobox
                value={estado?.sigla || null}
                options={estados.map(estado => ({ value: estado.sigla, label: estado.nome }))}
                onSelect={(value) => setEstado(estados.find(estado => estado.sigla === value) || null)}
                className='mt-1'
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {
        vehicle && (
          <div>
            <Card className='mt-4 max-w-screen-sm mx-auto'>
              <CardHeader>
                <CardTitle>Informações do Veículo</CardTitle>
                <CardDescription>Verifique as informações do veículo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-row justify-start items-baseline gap-2'>
                  <Label>Código FIPE:</Label>
                  <p>{vehicle.CodigoFipe}</p>
                </div>
                <div className='flex flex-row justify-start items-baseline gap-2'>
                  <Label>Valor:</Label>
                  <p>{vehicle.Valor}</p>
                </div>
              </CardContent>
            </Card>


            <Card className='mt-4 max-w-screen-sm mx-auto'>
              <CardContent className='mt-4'>
                <Form {...form}>
                  <form className='flex flex-col gap-4'>
                    <FormField
                      control={form.control}
                      name="ipva"
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>Valor estimado do IPVA em {estado?.nome}</FormLabel>
                          <FormControl>
                            <div className='flex gap-2 justify-start items-baseline'>
                              <span>R$ </span>
                              <Input type='number' min={0} step="0.01" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="combustivel"
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>Gasto mensal com combustível</FormLabel>
                          <FormControl>
                            <div className='flex gap-2 justify-start items-baseline'>
                              <span>R$ </span>
                              <Input type='number' {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="seguro"
                      render={({ field }) => (
                        <FormItem className=''>
                          <FormLabel>Valor anual do Seguro</FormLabel>
                          <FormControl>
                            <div className='flex gap-2 justify-start items-baseline'>
                              <span>R$ </span>
                              <Input type='number' min={0} step="0.01" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='contents'>
                      <FormField
                        control={form.control}
                        name="manutencao"
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Valor anual de Manuteção </FormLabel>
                            <FormControl>
                              <div className='flex gap-2 justify-start items-baseline'>
                                <span>R$ </span>
                                <Input type='number' min={0} step="0.01" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="estacionamento"
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Valor mensal de Estacionamento </FormLabel>
                            <FormControl>
                              <div className='flex gap-2 justify-start items-baseline'>
                                <span>R$ </span>
                                <Input type='number' min={0} step="0.01" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pedagio"
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Valor mensal de Pedágio </FormLabel>
                            <FormControl>
                              <div className='flex gap-2 justify-start items-baseline'>
                                <span>R$ </span>
                                <Input type='number' min={0} step="0.01" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lavagem"
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Valor mensal de Limpeza</FormLabel>
                            <FormControl>
                              <div className='flex gap-2 justify-start items-baseline'>
                                <span>R$ </span>
                                <Input type='number' min={0} step="0.01" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="outros"
                        render={({ field }) => (
                          <FormItem className=''>
                            <FormLabel>Valor anual com outros gastos </FormLabel>
                            <FormControl>
                              <div className='flex gap-2 justify-start items-baseline'>
                                <span>R$ </span>
                                <Input type='number' min={0} step="0.01" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )
      }

      <div className='fixed bottom-0 right-0 left-0 flex flex-row gap-4 justify-center bg-primary text-primary-foreground py-6 rounded-t-3xl'>
        <HandCoinsIcon />
        <div>
        <p className='text-muted'>Gasto Total Anual: <strong className='text-xl'>{formatCurrency(total)}</strong></p>
        <p className='text-muted text-xs text-center'>por mês: <strong className='text-base'>{formatCurrency(total/12)}</strong></p>
        </div>
      </div>

      <p className='text-center text-muted-foreground mt-4 text-sm'>Criado por Thiago Elias</p>
    </>

  );
}
