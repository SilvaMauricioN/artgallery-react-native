export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

// Usuario completo que devuelve GET /users y GET /users/:id
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

// Datos que se ingresan en el formulario para crear un usuario
export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
  phone: string;
}

// Respuesta de JSONPlaceholder al crear un usuario
export interface CreatedUser extends CreateUserInput {
  id: number;
}