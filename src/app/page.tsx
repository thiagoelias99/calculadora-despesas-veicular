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

interface ComboOptions {
  manufacturer: string | null;
  manufacturerOptions: { value: string; label: string }[];
  model: string | null;
  modelOptions: { value: string; label: string }[];
  year: string | null;
  yearOptions: { value: string; label: string }[];
}

export interface Vehicle {
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
        setVehicle(data);
      });
  }

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
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>

  );
}
