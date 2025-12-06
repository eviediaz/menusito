export const LOCATIONS = [
  'Universidad Nacional - Puerta 3',
  'Centro Empresarial San Isidro',
  'Instituto Tecnológico - Cafetería',
  'Campus Sur - Edificio A',
  'Parque Empresarial La Molina',
  'Centro de Negocios Breña',
];

export function isValidLocation(location: string): boolean {
  return LOCATIONS.includes(location);
}
