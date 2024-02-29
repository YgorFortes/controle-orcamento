import { OpenAPIV3_1 } from 'openapi-types';



// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const swaggerDocs : OpenAPIV3_1.Document = {
  openapi: '3.0.1',
  info: {
    title: 'Controle de orçamento familiar',
    version: '1.0.0',
    description: 'A API gerencia o orçamento familiar ao registrar tanto as receitas quanto as despesas, fornecendo a capacidade de gerar relatórios mensais detalhados.',
    contact: {
      name: 'Dev: Ygor da Silva Fortes',
      email: 'ygorsilva532@gmail.com',
    },
    license: {
      name: 'GPLv3',
      url: 'https://www.gnu.org/licenses/gpl-3.0.pt-br.html',
    },
  },

  servers: [
    {
      url: 'http://localhost:8000/api/v1',
    },
  ],

  paths: {
    '/cadastrar': {
      post:  {
        tags: ['Usuário'],
        summary: 'Cadastro de usuário',
        description: 'Essa rota cadastrar um novo usuário e gera um token',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#components/schemas/Usuario',
                required: ['nome', 'login', 'email', 'senha', 'confirmarSenha'],
                
              },
              example: {
                nome: 'João Silva',
                login: 'joaosilva123',
                email: 'joao@example.com',
                senha: 'senha@123',
                confirmarSenha: 'senha@123',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário cadastrado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Usuário cadastrado com sucesso.',
                    },
                    token: {
                      type: 'string',
                      description: 'O token de autenticação gerado para o usuário',
                    },
                  },
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/BadRequestComponentUsuario',
          },
          409: {
            $ref: '#/components/responses/ConflictComponentUsuario',
          },
          500: {
            $ref: '#/components/responses/InternalServerErrorComponentUsuario',
          },
        },
      },
    },
  

    '/login': {
      post: {
        tags: ['Usuário'],
        summary: 'Autenticação de usuário',
        description: 'Autentica um usuário usando o login ou email e senha.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  login: {
                    type: 'string',
                    pattern: '^[^\s]+$',
                    description: 'O login do usuário',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'O endereço de e-mail do usuário.',
                  },
                  senha: {
                    type: 'string',
                    description: 'A senha do usuário',
                  },
                },
                required: ['senha'],
                anyOf: [
                  { 'required': ['login'] },
                  { 'required': ['email'] },
                ],
                example: {
                  login: 'joaosilva123',
                  email: 'joao@example.com',
                  senha: 'senha@123',
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Usuário logado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      description: 'O token de autenticação gerado para o usuário',
                    },
                    login: {
                      type: 'string',
                      description: 'O login do usuário',
                    },
                    nome: {
                      type: 'string',
                      description: 'O nome do usuário',
                    },
                  },
                  example: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTcwOTA2OTYwMCwiZXhwIjoxNzA5Njc0NDAwfQ.UvGU2Vt02--sfEWPvZavQkcVNHgfND1a_bN_RtFS12Y',
                    login: 'João Silva',
                    nome: 'Ronaldo',
                  },
                },
              },
            },
          },

          400: {
            $ref: '#/components/responses/BadRequestComponentUsuario',
          },

          401: {
            description: 'As credenciais fornecidas não são válidas.',
            content : {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'object',
                      properties: {
                        mensagem: {
                          type: 'string',
                          description: 'Mensagem indicando que as credenciais não são válidas.',
                        },
                      },
                      example: {
                        mensagem: 'Credenciais invalidas',
                      },
                    },
                    {
                      type: 'object',
                      properties: {
                        mensagem: {
                          type: 'string',
                          description: 'Mensagem indicando que a senha é invalida',
                        },
                      },
                      example: {
                        mensagem: 'Não autorizado',
                      },
                    },
                  ],
                },
              },
            },
          },

          500: {
            $ref: '#/components/responses/InternalServerErrorComponentUsuario',
            
          },
        },
      },
    },

    '/usuario/atualizar': {
      patch: {
        tags: ['Usuário'],
        summary: 'Atualiza o usuário',
        description: 'Atualiza o usuário que esteja logado pelo seu token',
        security: [
          {
            auth: [],
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#components/schemas/Usuario',
                description: 'Todos os valores são opcionais. Se passar senha, confirmarSenha deve ser passado também',
              },
              examples: {
                'example 1': {
                  value: {
                    senha: 'minhanovaSenha@123',
                    confirmarSenha: 'minhanovaSenha@123',
                  },
                },
                'example 2': {
                  value: {
                    login: 'MeuNovolOGIN',
                  },
                },
                'example 3': {
                  value: {
                    nome: 'Novo João Silva',
                    login: 'novojoaosilva123',
                    email: 'novojoao@example.com',
                    senha: 'novosenha@123',
                    confirmarSenha: 'novosenha@123',
                  },
                },
              },
            },
          },
         
        },
        responses: {
          '200': {
            description: 'Usuário atualizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Usuário atualizado com sucesso.',
                    },
  
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentUsuario',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '409':{
            $ref: '#/components/responses/ConflictComponentUsuario',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentUsuario',
          },
        },
      },
    },

    '/usuario/excluir': {
      delete: {
        tags: ['Usuário'],
        summary: 'Faz logout do usuário logado',
        description: 'Essa rota faz logout do usuário logado e impede do token seja usado novamente',
        security: [
          {
            auth: [],
          },
        ],
        requestBody: {
          description: 'Obrigatório a senha de usuário',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  senha: {
                    type: 'string',
                    description: 'A senha do usuário.',
                  },
                  confirmarSenha: {
                    type: 'string',
                    description: 'Confirmação da senha do usuário.',
                  },
                },
                required: ['senha', 'confirmarSenha'],
              },
              example: {
                senha: 'senha@123',
                confirmarSenha: 'senha@123',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Usuário deletado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem de sucesso',
                    },
                  },
                },

                example: {
                  mensagem: 'Usuário deletado de sucesso',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentUsuario',
          },

          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },

          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentUsuario',
          },
        },
      },
    },

    '/usuario/logout': {
      get: {
        tags: ['Usuário'],
        summary: 'deleta o usuário',
        description: 'deleta o usuário que esteja logado pelo seu token',
        security: [
          {
            auth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Usuário deslogado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem de sucesso',
                    },
                  },
                },
                example: {
                  mensagem: 'Usuário deslogado com sucesso',
                },
              },
            },
          },
  
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
  
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentUsuario',
          },
  
        },
      },
    },

    '/receitas': {
      post: {
        security: [
          {
            auth: [],
          },
        ],
        tags: ['Receitas'],
        summary: 'Registrar suas entradas de receitas mensais para controle financeiro',
        description: 'Essa rota cadastra receita para controle financeiro',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Receita',
                required: ['descricao, valor, data'],
              },
              example: {
                descricao: 'meu salario',
                valor: 4000,
                data: '2024-01-26T12:34:56.789Z',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Receita cadastrada com sucesso.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Receita',
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Listar todas as receitas disponíveis',
        description: 'Esta rota retorna uma lista paginada de todas as receitas disponíveis.',
        tags: ['Receitas'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número da pagina desejada',
            schema: {
              type: 'integer',
            },
            required: false,
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Número máximo de itens por página',
            schema: {
              type: 'integer',
            },
            required: false,
          },
          {
            name: 'descricao',
            in: 'query',
            description: 'A descricao de receita',
            schema: {
              type: 'string',
            },
            required: false,
          },
        ],
        responses: {
          '200': {
            description: 'Esta rota retorna uma lista paginada de todas as receitas disponíveis ou descrição de acordo',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Receita',
                  },
                },
                examples: {
                  'example 1': {
                    value:  [
                      {
                        id: 2,
                        descricao: 'salario da esposa',
                        valor: 4000,
                        data: '2024-01-26T12:34:56.789Z',
                      },
                      {
                        id: 3,
                        descricao: 'meu salario',
                        valor: 3000,
                        data: '2024-01-26T12:34:56.789Z',
                      },
                    ],
                  },
                  'example 2': {
                    value: [],
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
    },

    '/receitas/{id}':{
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Mostra receita correspondente ao id.',
        description: 'Esta rota retorna receita por id.',
        tags: ['Receitas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de receita',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],

        responses: {
          '200': {
            description: 'Retorna Receita correspondente por id.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Receita',
                      
                    },
                    {
                      properties: {
                        mensagem: {
                          type: 'string',
                          example: 'Receita não encontrada.',
                        },
                      }, 
                    },
                  ], 
                },
                examples: {
                  'example 1': {
                    value: {
                      id: 3,
                      descricao: 'meu salario',
                      valor: 3000,
                      data: '2024-01-26T12:34:56.789Z',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Receita não encontrada',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
      put: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Atualizar a receita correspondente ao id.',
        description: 'Essa rota atualiza a receita correspondente ao id e retornar a receita atualizada.',
        tags: ['Receitas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de receita',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Receita',
                required: ['descricao, valor, data'],
              },
              example: {
                descricao: 'meu salario atualizado',
                valor: 5000,
                data: '2024-01-26T12:34:56.789Z',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Retorna uma mensagem de sucesso',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Receita',
                    },
                    {
                      type: 'object',
                      description: 'Representa receita não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de receita não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Receita não encontrada.',
                        },
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    value:{
                      id: 2,
                      descricao: 'salario da esposa',
                      valor: 4000,
                      data: '2024-01-26T12:34:56.789Z',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Receita não encontrada',
                    },
                  },
                },
              },
            }, 
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
      delete: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Deletar a receita correspondente ao id.',
        description: 'Essa rota atualiza a receita correspondente ao id e retornar uma mensagem de sucesso.',
        tags: ['Receitas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de receita',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Retorna uma mensagem de sucesso',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Receita',
                    },
                    {
                      type: 'object',
                      description: 'Representa receita não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de receita não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Receita não encontrada.',
                        },
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    value: {
                      mensagem: 'Receita excluida com sucesso.',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Receita não encontrada',
                    },
                  },
                },
              },
            }, 
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
    },

    '/receitas/{ano}/{mes}': {
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Listar todas as receitas do ano e mês especificados',
        description: 'Esta rota retorna uma lista paginada de todas as receitas disponíveis para o ano e mês especificados.',
        tags: ['Receitas'],
        parameters: [
          {
            name: 'ano',
            in: 'path',
            description: 'Ano da receita',
            schema: {
              type: 'integer',
            },
            required: true,
          },
          {
            name: 'mes',
            in: 'path',
            description: 'Mês da receita',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],

        responses: {
          '200': {
            description: 'Retorna uma lista  de todas as receitas disponíveis de acordo com o mês e ano',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Receita',
                      },
                    },
                    {
                      type: 'object',
                      description: 'Representa receita não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de receita não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Receita não encontrada.',
                        },
                      },
                    },
                    {
                      type: 'array',
                      items: {
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Receita não encontrada',
                    },
                  },
                  'example 3': {
                    value: [],
                  },
                },
              },
            },
          }, 
          '400': {
            $ref: '#/components/responses/BadRequestComponentReceitas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentReceitas',
          },
        },
      },
    },
    
    '/despesas': {
      post: {
        security: [
          {
            auth: [],
          },
        ],
        tags: ['Despesas'],
        summary: 'Registrar suas entradas para despesas mensais',
        description: 'Essa rota cadastra despesa para controle financeiro. Se categoria não for colocado. Será preenchido como "outras" ',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Despesa',
                required: ['descricao, valor, data'],
              },
              example: {
                descricao: 'Compra de mantimentos',
                valor: 50.00,
                data: '2024-02-29',
                categoria: 'alimentacao',
              },
            },
          },
          
        },
        responses: {
          '201': {
            description: 'Retorna uma mensagem de sucesso',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Receita',
                    },
                    {
                      type: 'object',
                      description: 'Representa receita não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de receita não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Já existe uma despesa cadastrada com a mesma descrição e data.',
                        },
                      },
                    },
                  ],
                },
                example: {
                  id: 4,
                  descricao: 'Compra de mantimentos',
                  valor: 50.00,
                  data: '2024-02-29',
                  categoria: 'alimentacao',        
                },
              },
            }, 
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
        
      },

      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Listar todas as despesas disponíveis',
        description: 'Esta rota retorna uma lista paginada de todas as despesas disponíveis.',
        tags: ['Despesas'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número da pagina desejada',
            schema: {
              type: 'integer',
            },
            required: false,
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Número máximo de itens por página',
            schema: {
              type: 'integer',
            },
            required: false,
          },
          {
            name: 'descricao',
            in: 'query',
            description: 'A descricao de despesas',
            schema: {
              type: 'string',
            },
            required: false,
          },
        ],
        responses: {
          '200': {
            description: 'Esta rota retorna uma lista paginada de todas as despesas disponíveis ou descrição de acordo',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Despesa',
                  },
                },
                examples: {
                  'example 1': {
                    value:  [
                      {
                        id: 2,
                        descricao: 'Compras do mês',
                        valor: 4000,
                        data: '2024-01-26T12:34:56.789Z',
                        categoria: 'alimentacao',
                      },
                      {
                        id: 3,
                        descricao: 'Uber',
                        valor: 3000,
                        data: '2024-01-26T12:34:56.789Z',
                        categoria: 'transporte',
                      },
                    ],
                  },
                  'example 2': {
                    value: [],
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
      },
    },

    '/despesas/{id}':{
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Mostra despesa correspondente ao id.',
        description: 'Esta rota retorna despesa correspondente ao id.',
        tags: ['Despesas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de despesa',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],

        responses: {
          '200': {
            description: 'Retorna Despesa correspondente por id.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Despesa',
                      
                    },
                    {
                      properties: {
                        mensagem: {
                          type: 'string',
                          example: 'Despesa não encontrada.',
                        },
                      }, 
                    },
                  ], 
                },
                examples: {
                  'example 1': {
                    value: {
                      id: 2,
                      descricao: 'Compras do mês',
                      valor: 4000,
                      data: '2024-01-26T12:34:56.789Z',
                      categoria: 'alimentacao',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Receita não encontrada',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
      },
      put: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Atualizar a despesa correspondente ao id.',
        description: 'Essa rota atualiza a despesa correspondente ao id e retornar a despesa atualizada.',
        tags: ['Despesas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de despesa',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Despesa',
                required: ['descricao, valor, data, categoria'],
              },
              example: {
                descricao: 'Compra de mantimentos atualizada',
                valor: 500.00,
                data: '2024-02-29',
                categoria: 'alimentacao',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Retorna uma mensagem de sucesso',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Despesa',
                    },
                    {
                      type: 'object',
                      description: 'Representa despesa não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de despesa não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Despesa não encontrada.',
                        },
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    value:{
                      descricao: 'Compra de mantimentos',
                      valor: 50.00,
                      data: '2024-02-29',
                      categoria: 'alimentacao',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Despesa não encontrada',
                    },
                  },
                },
              },
            }, 
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
      },
      delete: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Deleta a despesa correspondente ao id.',
        description: 'Essa rota atualiza a receita correspondente ao id e retornar uma mensagem de sucesso.',
        tags: ['Despesas'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'Número id correspondente de despesa',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Retorna uma mensagem de sucesso',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Despesa',
                    },
                    {
                      type: 'object',
                      description: 'Representa despesa não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de despesa não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'despesa não encontrada.',
                        },
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    value: {
                      mensagem: 'Despesa excluida com sucesso.',
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Despesa não encontrada',
                    },
                  },
                },
              },
            }, 
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
      },
    },

    '/despesas/{ano}/{mes}': {
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Listar todas as despesas do ano e mês especificados',
        description: 'Esta rota retorna uma lista paginada de todas as despesas disponíveis para o ano e mês especificados.',
        tags: ['Despesas'],
        parameters: [
          {
            name: 'ano',
            in: 'path',
            description: 'Ano da despesa',
            schema: {
              type: 'integer',
            },
            required: true,
          },
          {
            name: 'mes',
            in: 'path',
            description: 'Mês da despesa',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],

        responses: {
          '200': {
            description: 'Retorna uma lista  de todas as despesas disponíveis de acordo com o mês e ano',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Despesa',
                      },
                    },
                    {
                      type: 'object',
                      description: 'Representa despesa não encontrada',
                      properties: {
                        descricao: {
                          type: 'string',
                          description: 'Mensagem de despesa não encontrada',
                        },
                        valor: {
                          type: 'number',
                          format: 'float',
                          description: 'Despesa não encontrada.',
                        },
                      },
                    },
                    {
                      type: 'array',
                      items: {
                      },
                    },
                  ],
                },
                examples: {
                  'example 1': {
                    
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Despesa não encontrada',
                    },
                  },
                  'example 3': {
                    value: [],
                  },
                },
              },
            },
          }, 
          '400': {
            $ref: '#/components/responses/BadRequestComponentDespesas',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentDespesas',
          },
        },
      },
    },

    '/resumo/{ano}/{mes}': {
      get: {
        security: [
          {
            auth: [],
          },
        ],
        summary: 'Fornece um resumo dos dados financeiros para um mês específico',
        description: 'Esta rota  deve detalhad várias métricas financeiras para o mês especificado, incluindo receita total, despesa total, saldo final e detalhamento das despesas por categoria',
        tags: ['Resumos'],
        parameters: [
          {
            name: 'ano',
            in: 'path',
            description: 'Ano para detalhamento do resumo',
            schema: {
              type: 'integer',
            },
            required: true,
          },
          {
            name: 'mes',
            in: 'path',
            description: 'Mês para detalhamento do resumo',
            schema: {
              type: 'integer',
            },
            required: true,
          },
        ],
        responses: {
          '200': {
            description: 'Retorna Resumo correspondente ao ano e mes.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  oneOf: [
                    {
                      $ref: '#/components/schemas/Resumo',
                      
                    },
                    {
                      properties: {
                        mensagem: {
                          type: 'string',
                          example: 'Não encontrado receitas ou despesas nessse mês.',
                        },
                      }, 
                    },
                  ], 
                },
                examples: {
                  'example 1': {
                    value: {
                      valorTotalReceitas: 4000,
                      valorTotalDespesa: 50,
                      saldoFinalDoMes: 3950,
                      totalPorCategoria: {
                        outras: 50,
                      },
                    },
                  },
                  'example 2': {
                    value: {
                      mensagem: 'Não encontrado receitas ou despesas nessse mês.',
                    },
                  },
                },
              },
            },
          },
          '400': {
            $ref: '#/components/responses/BadRequestComponentResumo',
          },
          '401': {
            $ref: '#/components/responses/AuthorizationError',
          },
          '500': {
            $ref: '#/components/responses/InternalServerErrorComponentResumo',
          },
        },
      },


    },
    
  },


  components: {
    schemas: {
      'Usuario': {
        type: 'object',
        description: 'Representa um usuário.',
        properties: {
          nome: {
            type: 'string',
            description: 'Nome do usuário.',
            minLength: 2,
            maxLength: 50,
          },
          login: {
            type: 'string',
            description: 'O login de usuário.',
            pattern: '^[^\\s]+$',
          },
          email: {
            type: 'string',
            description: 'O endereço de e-mail de usuário.',
            format: 'email',
          },
          senha: {
            type: 'string',
            description: 'A senha do usuário.',
          },
          confirmarSenha: {
            type: 'string',
            description: 'Confirmação da senha do usuário.',
          },
        },
      },

      'Receita': {
        type: 'object',
        description: 'Representa receita',
        properties: {
          descricao: {
            type: 'string',
            description: 'Descrição da receita (obrigatório)',
          },
          valor: {
            type: 'number',
            format: 'float',
            description: 'Valor da receita (obrigatório e deve ser positivo)',
          },
          data: {
            type: 'string',
            format: 'date',
            description: 'Data da receita (obrigatório, formato: YYYY-MM-DD)',
          },
        },
      },

      'Despesa': {
        type: 'object',
        description: 'Representa despesa',
        properties: {
          descricao: {
            type: 'string',
            description: 'Descrição da despesa.',
          },
          valor: {
            type: 'number',
            description: 'Valor da despesa (números positivos apenas).',
          },
          data: {
            type: 'string',
            format: 'date',
            description: 'Data da despesa (no formato YYYY-MM-DD).',
          },
          categoria: {
            type: 'string',
            description: 'Categoria da despesa.',
            enum: ['alimentacao', 'transporte', 'moradia', 'saude', 'educacao', 'lazer', 'outros'],
          },
        },
      },

      'Resumo': {
        description: 'Representa resumo',
        type: 'object',
        properties: {
          resultado: {
            type: 'object',
            properties: {
              valorTotalReceitas: {
                type: 'number',
                description: 'Valor total das receitas no mês.',
                example: 4000,
              },
              valorTotalDespesas: {
                type: 'number',
                description: 'Valor total das despesas no mês.',
                example: 50,
              },
              saldoFinalDoMes: {
                type: 'number',
                description: 'Saldo final do mês.',
                example: 3950,
              },
              totalPorCategoria: {
                type: 'object',
                description: 'Totais de despesas por categoria.',
                properties: {
                  outras: {
                    type: 'number',
                    description: "Total das despesas na categoria 'outras'.",
                    example: 50,
                  },
                },
              },
            },
          },
        },
      },
    },

    responses: {
      BadRequestComponentUsuario: {
        description: 'Os dados fornecidos para a requisição de o usuário são inválidos ou estão faltando informações necessárias.',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro por dados inválidos ou estão faltando informações necessárias.',
                },
              },
              example: {
                mensagem: 'O campo senha não pode conter espaços entre os caracteres.',
              },
            },
          },
        },
      },

      ConflictComponentUsuario: {
        description: 'Conflito: Email ou login já cadastrados.',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro indicando que o usuário já está cadastrado com o email ou login fornecidos.',
                },
              },
              example: {
                mensagem: 'O usuário já está cadastrado. Utilize um login ou e-mail diferente para criar uma nova conta.',
              },
            },
          },
        },
      },
      
      InternalServerErrorComponentUsuario: {
        description: 'Problema interno no servidor',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro indicando que o servidor está com problemas. Provavelmente algum  problema no banco.',
                },
              },
              example: {
                mensagem: 'Não foi possível registrar, atualizar ou excluir  o usuário',
              },
            },
          },
        },
        
      },


      AuthorizationError: {
        description: 'Erro de autorização',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
              anyOf: [
                {
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Token não existe. Certifique-se de incluir o token no cabeçalho Authorization.',
                    },
                  },
                },
                {
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Token não existe.',
                    },
                  },
                },
                {
                  properties: {
                    message: {
                      type: 'string',
                      example: 'A secret deve ser fornecida para gerar o token.',
                    },
                  },
                },
                {
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Token inválido.',
                    },
                  },
                },
              ],
              example: {
                mensagem: 'Não autorizado.',  
              },
            },
          },
        },
      },

      BadRequestComponentReceitas: {
        description: 'Os dados fornecidos para a requisição de o receitas são inválidos ou estão faltando informações necessárias.',
        content : {
          'application/json': {
            schema: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem de erro por dados inválidos ou estão faltando informações necessárias.',
                    },
                  },
                  example: {
                    mensagem: 'Mensagem de erro indicando que um campo obrigatório não foi fornecido.',
                  },
                },
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem idicando que já existe uma receita com esse mes cadastrado.',
                    },
                  },
                  example: {
                    mensagem: 'Receita salario do mês 12 já cadastrada.',
                  },
                },
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem idicando que o limite máximo permitido no query params é de 100 registros',
                    },
                  },
                  example: {
                    mensagem: 'O limite máximo permitido para a pesquisa é de 100 registros por página.',
                  },
                },
                
              ],
            },
            examples: {
              'example 1': {
                value: {
                  mensagem: 'Campo descricao é obrigatorio',
                },
              },
              'example 2': {
                value: {
                  mensagem: 'Receita salario do mês 12 já cadastrada.',
                },
              },
              'example 3': {
                value: {
                  mensagem: 'Mensagem indicando que o limite máximo permitido no query params é de 100 registros. ',
                },
              },
            },
          },
        },
      },

      InternalServerErrorComponentReceitas: {
        description: 'Problema interno no servidor',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro indicando que o servidor está com problemas. Provavelmente algum  problema no banco.',
                },
              },
              example: {
                mensagem: 'Não foi possível encontrar, registrar, atualizar ou excluir a receita',
              },
            },
          },
        },
        
      },

      BadRequestComponentDespesas: {
        description: 'Os dados fornecidos para a requisição de o despesas são inválidos ou estão faltando informações necessárias.',
        content : {
          'application/json': {
            schema: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem de erro por dados inválidos ou estão faltando informações necessárias.',
                    },
                  },
                  example: {
                    mensagem: 'Mensagem de erro indicando que um campo obrigatório não foi fornecido.',
                  },
                },
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem idicando que já existe uma despesas com esse mes cadastrado.',
                    },
                  },
                  example: {
                    mensagem: 'Despesa mantimento alimentar do mês 12 já cadastrada.',
                  },
                },
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem idicando que o limite máximo permitido no query params é de 100 registros',
                    },
                  },
                  example: {
                    mensagem: 'O limite máximo permitido para a pesquisa é de 100 registros por página.',
                  },
                },
                
              ],
            },
            examples: {
              'example 1': {
                value: {
                  mensagem: 'Campo descricao é obrigatorio',
                },
              },
              'example 2': {
                value: {
                  mensagem: 'Despesa mantimento alimentar do mês 12 já cadastrada.',
                },
              },
              'example 3': {
                value: {
                  mensagem: 'Mensagem indicando que o limite máximo permitido no query params é de 100 registros. ',
                },
              },
            },
          },
        },
      },

      InternalServerErrorComponentDespesas: {
        description: 'Problema interno no servidor',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro indicando que o servidor está com problemas. Provavelmente algum  problema no banco.',
                },
              },
              example: {
                mensagem: 'Não foi possível encontrar, registrar, atualizar ou excluir a despesa',
              },
            },
          },
        },
        
      },

      BadRequestComponentResumo: {
        description: 'Os dados fornecidos para a requisição de o resumo são inválidos ou estão faltando informações necessárias.',
        content : {
          'application/json': {
            schema: {
              oneOf: [
                {
                  type: 'object',
                  properties: {
                    mensagem: {
                      type: 'string',
                      description: 'Mensagem de erro por dados inválidos ou estão faltando informações necessárias.',
                    },
                  },
                  example: {
                    mensagem: 'O campo ano deve ser um número.',
                  },
                },
                
              ],
            },
            example: {
              mensagem: 'O campo ano deve ser um número.',
            },
          },
        },
      },

      InternalServerErrorComponentResumo: {
        description: 'Problema interno no servidor',
        content : {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                mensagem: {
                  type: 'string',
                  description: 'Mensagem de erro indicando que o servidor está com problemas. Provavelmente algum problema no banco.',
                },
              },
              example: {
                mensagem: 'Não foi possível encontrar o resumo detalhado do mês.',
              },
            },
          },
        },
        
      },


      
    },


    securitySchemes: {
      auth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Autenticação utilizando um token de acesso JWT (JSON Web Token).',
      },
    },
  },

};
