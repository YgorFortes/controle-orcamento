export interface InterfaceUserLogin {
  login? : string,
  email? : string, 
  senha: string
}

export interface InterfaceUserRegister {
  nome: string,
  login : string,
  email : string, 
  senha: string,
}

export interface InterfaceUserUpdate {
  nome?: string,
  login? : string,
  email? : string, 
  senha?: string,
}

export interface InserfaceUserDelete {
  senha: string,
  confirmarSenha: string
}
