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

  const [total, setTotal] = useState<number>(0);

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
      modelOptions: []
    });
    await fetchModels(value);
  }

  async function handleModelChange(value: string) {
    setComboOptions({
      ...comboOptions,
      model: value,
      year: null,
      yearOptions: []
    });
    await fetchYears(value);
  }

  async function handleYearChange(value: string) {
    setComboOptions({
      ...comboOptions,
      year: value
    });
    await fetchVehicle(value);
  }

  async function fetchManufacturers() {
    fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
      .then(response => response.json())
      .then(data => {
        const options = data.map((manufacturer: { nome: string; codigo: string }) => ({
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

  async function fetchModels(manufacturer: string) {
    if (!manufacturer) { return }
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${manufacturer}/modelos`)
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

  function fetchYears(model: string) {
    if (!model) { return }

    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${comboOptions.manufacturer}/modelos/${model}/anos`)
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

  async function fetchVehicle(year: string) {
    fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${comboOptions.manufacturer}/modelos/${comboOptions.model}/anos/${year}`)
      .then(response => response.json())
      .then(data => {
        const vehicle = data as Vehicle;
        setVehicle(vehicle);
        console.log(vehicle)
        const ipvaValue = parseFloat(vehicle.Valor.replace("R$ ", "").replace(".", "").replace(",", ".")) * 0.04
        form.setValue('ipva', ipvaValue);
      });
  }

  useEffect(() => {
    const total =
      Number(form.getValues('ipva') || 0)
      + Number(form.getValues('combustivel') || 0) * 12
      + Number(form.getValues('seguro') || 0) || 0
      + Number(form.getValues('manutencao') || 0) || 0
      + Number(form.getValues('estacionamento') || 0) * 12
      + Number(form.getValues('pedagio') || 0) * 12
      + Number(form.getValues('lavagem') || 0) * 12
      + Number(form.getValues('outros') || 0);

    setTotal(total);
  }, [form.watch()]);

  return (
    <Card className='max-w-screen-sm mx-auto mt-8'>
      <CardHeader>
        <CardTitle className='text-center'>Calculadora de Gastos Anuais de Veículo</CardTitle>
        <CardDescription>Preencha as informações para estimar o gasto anual para manter seu veículo</CardDescription>
      </CardHeader>
      <CardContent>
        <Label>Selecione o fabricante do seu veículo</Label>
        <Combobox
          value={comboOptions.manufacturer}
          options={comboOptions.manufacturerOptions}
          onSelect={handleManufactureChange}
          className='mt-1'
        />
        <Label>Selecione o Modelo do seu veículo</Label>
        <Combobox
          value={comboOptions.model}
          options={comboOptions.modelOptions}
          onSelect={handleModelChange}
          className='mt-1'
        />
        <Label>Selecione o Ano do seu veículo</Label>
        <Combobox
          value={comboOptions.year}
          options={comboOptions.yearOptions}
          onSelect={handleYearChange}
          className='mt-1'
        />
        <Label>Informações do Veículo</Label>
        <div>
          {vehicle ? (
            <div>
              <p>Código FIPE: {vehicle.CodigoFipe}</p>
              <p>Valor: {vehicle.Valor}</p>
            </div>
          ) : (
            <p>Selecione um veículo para ver as informações</p>
          )}
        </div>

        <div className='fixed bottom-0 right-0'>
          <p>Gasto Total Anual: R$ {total.toFixed(2)}</p>
        </div>


        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="ipva"
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Valor estimado do IPVA</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
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
                    <Input type='number' {...field} />
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
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manutencao"
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Valor anual de Manuteção </FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
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
                    <Input type='number' {...field} />
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
                    <Input type='number' {...field} />
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
                  <FormLabel>Valor menal de Limpeza</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
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
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>


      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>

  );
}
