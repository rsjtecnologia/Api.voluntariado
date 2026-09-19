import { Voluntario, Pastoral, Evento, Termo, TermoTemplate, AuditoriaLog, FuncaoVoluntario, Paroquia, Comunidade } from './types';

export const paroquia: Paroquia = {
  id: 'par-001',
  nome: 'Paróquia São José Operário',
  dioceseId: 'dioc-001',
  endereco: 'Rua das Flores, 123 - Centro',
  telefone: '(11) 3456-7890',
  email: 'contato@paroquiasaojose.org.br',
  padroeiro: 'São José Operário',
};

export const comunidades: Comunidade[] = [
  { id: 'com-001', nome: 'Comunidade Nossa Senhora Aparecida', paroquiaId: 'par-001', endereco: 'Bairro Jardim' },
  { id: 'com-002', nome: 'Comunidade Sagrado Coração de Jesus', paroquiaId: 'par-001', endereco: 'Bairro Vila Nova' },
  { id: 'com-003', nome: 'Comunidade Santa Rita de Cássia', paroquiaId: 'par-001', endereco: 'Bairro Centro' },
];

export const funcoes: FuncaoVoluntario[] = [
  { id: 'fun-001', nome: 'Coordenador', descricao: 'Coordenação geral da pastoral ou evento', ativa: true },
  { id: 'fun-002', nome: 'Apoio', descricao: 'Apoio logístico e operacional', ativa: true },
  { id: 'fun-003', nome: 'Recepção', descricao: 'Recepção e acolhimento', ativa: true },
  { id: 'fun-004', nome: 'Liturgia', descricao: 'Serviços litúrgicos', ativa: true },
  { id: 'fun-005', nome: 'Música', descricao: 'Ministério de música', ativa: true },
  { id: 'fun-006', nome: 'Comunicação', descricao: 'Comunicação e redes sociais', ativa: true },
  { id: 'fun-007', nome: 'Alimentação', descricao: 'Preparação e distribuição de alimentos', ativa: true },
  { id: 'fun-008', nome: 'Organização', descricao: 'Organização de espaços e materiais', ativa: true },
  { id: 'fun-009', nome: 'Segurança', descricao: 'Segurança e controle de acesso', ativa: true },
  { id: 'fun-010', nome: 'Limpeza', descricao: 'Limpeza e conservação', ativa: true },
  { id: 'fun-011', nome: 'Secretaria', descricao: 'Atendimento e secretaria', ativa: true },
  { id: 'fun-012', nome: 'Fotografia', descricao: 'Registro fotográfico', ativa: true },
  { id: 'fun-013', nome: 'Transmissão', descricao: 'Transmissão ao vivo', ativa: true },
  { id: 'fun-014', nome: 'Catequese', descricao: 'Atividades de catequese', ativa: true },
  { id: 'fun-015', nome: 'Ação Social', descricao: 'Atividades de assistência social', ativa: true },
];

export const pastorais: Pastoral[] = [
  {
    id: 'pas-001', nome: 'Pastoral da Liturgia', descricao: 'Responsável pelas celebrações litúrgicas',
    paroquiaId: 'par-001', coordenador: 'Maria Silva Santos', email: 'liturgia@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-01-15', observacoes: 'Atua em todas as missas dominicais'
  },
  {
    id: 'pas-002', nome: 'Pastoral da Juventude', descricao: 'Trabalho evangelizador com jovens',
    paroquiaId: 'par-001', comunidadeId: 'com-001', coordenador: 'João Pedro Oliveira', email: 'juventude@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-02-01'
  },
  {
    id: 'pas-003', nome: 'Pastoral da Catequese', descricao: 'Formação cristã e sacramentos',
    paroquiaId: 'par-001', coordenador: 'Ana Beatriz Ferreira', email: 'catequese@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-01-10'
  },
  {
    id: 'pas-004', nome: 'Pastoral Social', descricao: 'Ações de caridade e assistência',
    paroquiaId: 'par-001', comunidadeId: 'com-002', coordenador: 'Carlos Eduardo Lima', email: 'social@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-03-01'
  },
  {
    id: 'pas-005', nome: 'Pastoral da Comunicação', descricao: 'Comunicação paroquial e redes sociais',
    paroquiaId: 'par-001', coordenador: 'Luciana Mendes', email: 'pascom@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-02-15'
  },
  {
    id: 'pas-006', nome: 'Pastoral do Dízimo', descricao: 'Educação e partilha do dízimo',
    paroquiaId: 'par-001', coordenador: 'Roberto Almeida', email: 'dizimo@paroquiasaojose.org.br',
    status: 'ATIVA', dataCriacao: '2024-01-20'
  },
];

export const voluntarios: Voluntario[] = [
  {
    id: 'vol-001', nomeCompleto: 'Maria Aparecida dos Santos', cpf: '123.456.789-00',
    dataNascimento: '1985-03-15', email: 'maria.santos@email.com', telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores, 45 - Centro', paroquiaId: 'par-001', comunidadeId: 'com-001',
    pastoralId: 'pas-001', funcaoId: 'fun-001', dataInicio: '2025-01-01', status: 'ATIVO'
  },
  {
    id: 'vol-002', nomeCompleto: 'João Pedro Oliveira', cpf: '234.567.890-11',
    dataNascimento: '1990-07-22', email: 'joao.oliveira@email.com', telefone: '(11) 97654-3210',
    endereco: 'Av. Principal, 100 - Jardim', paroquiaId: 'par-001', comunidadeId: 'com-001',
    pastoralId: 'pas-002', funcaoId: 'fun-001', dataInicio: '2025-01-15', status: 'ATIVO'
  },
  {
    id: 'vol-003', nomeCompleto: 'Ana Beatriz Ferreira', cpf: '345.678.901-22',
    dataNascimento: '1978-11-08', email: 'ana.ferreira@email.com', telefone: '(11) 96543-2109',
    endereco: 'Rua São Paulo, 78 - Vila Nova', paroquiaId: 'par-001',
    pastoralId: 'pas-003', funcaoId: 'fun-014', dataInicio: '2025-02-01', status: 'ATIVO'
  },
  {
    id: 'vol-004', nomeCompleto: 'Carlos Eduardo Lima', cpf: '456.789.012-33',
    dataNascimento: '1982-05-30', email: 'carlos.lima@email.com', telefone: '(11) 95432-1098',
    endereco: 'Rua da Paz, 200 - Centro', paroquiaId: 'par-001', comunidadeId: 'com-002',
    pastoralId: 'pas-004', funcaoId: 'fun-015', dataInicio: '2025-01-10', status: 'ATIVO'
  },
  {
    id: 'vol-005', nomeCompleto: 'Luciana Mendes Costa', cpf: '567.890.123-44',
    dataNascimento: '1995-09-12', email: 'luciana.costa@email.com', telefone: '(11) 94321-0987',
    endereco: 'Rua Nova, 55 - Jardim', paroquiaId: 'par-001',
    pastoralId: 'pas-005', funcaoId: 'fun-006', dataInicio: '2025-03-01', status: 'ATIVO'
  },
  {
    id: 'vol-006', nomeCompleto: 'Roberto Almeida Silva', cpf: '678.901.234-55',
    dataNascimento: '1970-01-25', email: 'roberto.silva@email.com', telefone: '(11) 93210-9876',
    endereco: 'Av. Brasil, 300 - Centro', paroquiaId: 'par-001',
    pastoralId: 'pas-006', funcaoId: 'fun-001', dataInicio: '2024-06-01', status: 'ATIVO'
  },
  {
    id: 'vol-007', nomeCompleto: 'Fernanda Rodrigues', cpf: '789.012.345-66',
    dataNascimento: '1988-12-03', email: 'fernanda.r@email.com', telefone: '(11) 92109-8765',
    endereco: 'Rua das Palmeiras, 88 - Vila', paroquiaId: 'par-001', comunidadeId: 'com-003',
    pastoralId: 'pas-001', funcaoId: 'fun-004', dataInicio: '2025-02-15', status: 'PENDENTE'
  },
  {
    id: 'vol-008', nomeCompleto: 'Paulo Henrique Souza', cpf: '890.123.456-77',
    dataNascimento: '1992-06-18', email: 'paulo.souza@email.com', telefone: '(11) 91098-7654',
    endereco: 'Rua Central, 150 - Centro', paroquiaId: 'par-001',
    pastoralId: 'pas-002', funcaoId: 'fun-005', dataInicio: '2024-08-01', status: 'INATIVO'
  },
];

export const eventos: Evento[] = [
  {
    id: 'evt-001', nome: 'Festa do Padroeiro São José', descricao: 'Celebração anual do padroeiro da paróquia',
    paroquiaId: 'par-001', pastoralId: 'pas-001', dataInicial: '2027-03-19', dataFinal: '2027-03-19',
    horario: '08:00 - 22:00', local: 'Salão Paroquial e Igreja Matriz', coordenador: 'Maria Silva Santos',
    status: 'PLANEJAMENTO'
  },
  {
    id: 'evt-002', nome: 'Quermesse Paroquial 2027', descricao: 'Quermesse anual para arrecadação de fundos',
    paroquiaId: 'par-001', pastoralId: 'pas-004', dataInicial: '2027-06-15', dataFinal: '2027-06-15',
    horario: '11:00 - 20:00', local: 'Pátio da Paróquia', coordenador: 'Carlos Eduardo Lima',
    status: 'PLANEJAMENTO'
  },
  {
    id: 'evt-003', nome: 'Festa Junina', descricao: 'Festa junina com comidas típicas e quadrilha',
    paroquiaId: 'par-001', comunidadeId: 'com-001', dataInicial: '2027-06-24', dataFinal: '2027-06-24',
    horario: '18:00 - 23:00', local: 'Salão da Comunidade N.S. Aparecida', coordenador: 'João Pedro Oliveira',
    status: 'PLANEJAMENTO'
  },
  {
    id: 'evt-004', nome: 'Retiro de Carnaval 2027', descricao: 'Retiro espiritual para jovens',
    paroquiaId: 'par-001', pastoralId: 'pas-002', dataInicial: '2027-02-14', dataFinal: '2027-02-16',
    horario: '19:00 - 22:00', local: 'Casa de Retiros São Bento', coordenador: 'João Pedro Oliveira',
    status: 'ATIVO'
  },
  {
    id: 'evt-005', nome: 'Campanha do Agasalho 2027', descricao: 'Arrecadação de agasalhos para famílias carentes',
    paroquiaId: 'par-001', pastoralId: 'pas-004', dataInicial: '2027-05-01', dataFinal: '2027-07-31',
    horario: '09:00 - 17:00', local: 'Diversos pontos de coleta', coordenador: 'Carlos Eduardo Lima',
    status: 'PLANEJAMENTO'
  },
];

export const termos: Termo[] = [
  {
    id: 'ter-001', codigo: 'TVP-2027-000001', tipo: 'ANUAL', voluntarioId: 'vol-001', pastoralId: 'pas-001',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'ASSINADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'a1b2c3d4e5f6', hashDocumentoAssinado: 'f6e5d4c3b2a1',
    dataGeracao: '2027-01-02', dataAssinatura: '2027-01-05', dataSolicitacaoAssinatura: '2027-01-03',
    assinaturaGovBrId: 'sig-001'
  },
  {
    id: 'ter-002', codigo: 'TVP-2027-000002', tipo: 'ANUAL', voluntarioId: 'vol-002', pastoralId: 'pas-002',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'ASSINADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'b2c3d4e5f6a1', hashDocumentoAssinado: 'a1f6e5d4c3b2',
    dataGeracao: '2027-01-16', dataAssinatura: '2027-01-18', dataSolicitacaoAssinatura: '2027-01-17',
    assinaturaGovBrId: 'sig-002'
  },
  {
    id: 'ter-003', codigo: 'TVP-2027-000003', tipo: 'ANUAL', voluntarioId: 'vol-003', pastoralId: 'pas-003',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'AGUARDANDO_ASSINATURA',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'c3d4e5f6a1b2',
    dataGeracao: '2027-02-02', dataSolicitacaoAssinatura: '2027-02-03', assinaturaGovBrId: 'sig-003'
  },
  {
    id: 'ter-004', codigo: 'TVP-2027-000004', tipo: 'ANUAL', voluntarioId: 'vol-004', pastoralId: 'pas-004',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'ASSINADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'd4e5f6a1b2c3', hashDocumentoAssinado: 'c3b2a1f6e5d4',
    dataGeracao: '2027-01-11', dataAssinatura: '2027-01-12', dataSolicitacaoAssinatura: '2027-01-11',
    assinaturaGovBrId: 'sig-004'
  },
  {
    id: 'ter-005', codigo: 'TVP-2027-000005', tipo: 'ANUAL', voluntarioId: 'vol-005', pastoralId: 'pas-005',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'RASCUNHO',
    templateId: 'tpl-001', versao: 1, dataGeracao: '2027-03-01'
  },
  {
    id: 'ter-006', codigo: 'TVP-2027-000006', tipo: 'ANUAL', voluntarioId: 'vol-006', pastoralId: 'pas-006',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'ASSINADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'e5f6a1b2c3d4', hashDocumentoAssinado: 'd4c3b2a1f6e5',
    dataGeracao: '2026-12-20', dataAssinatura: '2026-12-22', dataSolicitacaoAssinatura: '2026-12-21',
    assinaturaGovBrId: 'sig-006'
  },
  {
    id: 'ter-007', codigo: 'TVE-2027-000001', tipo: 'EVENTO', voluntarioId: 'vol-001', eventoId: 'evt-004',
    paroquiaId: 'par-001', dataInicio: '2027-02-14', dataFim: '2027-02-16', status: 'ASSINATURA_EM_ANDAMENTO',
    templateId: 'tpl-002', versao: 1, hashDocumento: 'f6a1b2c3d4e5',
    dataGeracao: '2027-02-10', dataSolicitacaoAssinatura: '2027-02-11', assinaturaGovBrId: 'sig-007'
  },
  {
    id: 'ter-008', codigo: 'TVE-2027-000002', tipo: 'EVENTO', voluntarioId: 'vol-002', eventoId: 'evt-004',
    paroquiaId: 'par-001', dataInicio: '2027-02-14', dataFim: '2027-02-16', status: 'GERADO',
    templateId: 'tpl-002', versao: 1, hashDocumento: 'a1b2c3d4e5f7',
    dataGeracao: '2027-02-10'
  },
  {
    id: 'ter-009', codigo: 'TVP-2027-000007', tipo: 'ANUAL', voluntarioId: 'vol-007', pastoralId: 'pas-001',
    paroquiaId: 'par-001', dataInicio: '2027-01-01', dataFim: '2027-12-31', status: 'RECUSADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'b2c3d4e5f6a2',
    dataGeracao: '2027-02-16', dataSolicitacaoAssinatura: '2027-02-17', assinaturaGovBrId: 'sig-009'
  },
  {
    id: 'ter-010', codigo: 'TVP-2026-000001', tipo: 'ANUAL', voluntarioId: 'vol-001', pastoralId: 'pas-001',
    paroquiaId: 'par-001', dataInicio: '2026-01-01', dataFim: '2026-12-31', status: 'EXPIRADO',
    templateId: 'tpl-001', versao: 1, hashDocumento: 'c3d4e5f6a1b3', hashDocumentoAssinado: 'b3a1f6e5d4c3',
    dataGeracao: '2026-01-02', dataAssinatura: '2026-01-04', dataSolicitacaoAssinatura: '2026-01-03',
    assinaturaGovBrId: 'sig-010'
  },
];

export const templates: TermoTemplate[] = [
  {
    id: 'tpl-001', nome: 'Termo Anual de Voluntariado Pastoral', tipo: 'ANUAL',
    conteudo: `TERMO DE VOLUNTARIADO DE PASTORAL

IDENTIFICAÇÃO:
Termo nº: {{CODIGO}}
Paróquia: {{PAROQUIA}}
Pastoral: {{PASTORAL}}
Comunidade: {{COMUNIDADE}}

VOLUNTÁRIO(A):
Nome: {{NOME_VOLUNTARIO}}
CPF: {{CPF}}
Função: {{FUNCAO}}

PERÍODO DE VIGÊNCIA:
De: {{DATA_INICIO}}
Até: {{DATA_FIM}}

CLÁUSULA 1ª - DO OBJETO
O presente termo tem por objetivo formalizar a participação do(a) voluntário(a) acima identificado(a) nas atividades da pastoral indicada, de forma gratuita e voluntária, nos termos da Lei nº 9.608/1998 (Lei do Voluntariado).

CLÁUSULA 2ª - DAS RESPONSABILIDADES DO VOLUNTÁRIO
I - Cumprir com dedicação as atividades designadas pela coordenação da pastoral;
II - Respeitar os princípios e valores da Igreja Católica;
III - Manter sigilo sobre informações confidenciais;
IV - Participar das formações e reuniões convocadas;
V - Zelar pelos bens e materiais da paróquia.

CLÁUSULA 3ª - DAS RESPONSABILIDADES DA PARÓQUIA/PASTORAL
I - Proporcionar ambiente adequado para o exercício do voluntariado;
II - Oferecer formação continuada;
III - Respeitar a dignidade do voluntário;
IV - Emitir o Termo de Voluntariado conforme legislação vigente.

CLÁUSULA 4ª - DA CONDUTA
O voluntário compromete-se a manter conduta compatível com os valores cristãos e com as normas da paróquia, abstendo-se de qualquer comportamento que possa causar dano à imagem da instituição.

CLÁUSULA 5ª - DO USO DE IMAGEM
[ ] Autorizo o uso da minha imagem para fins de divulgação das atividades pastorais.
[ ] Não autorizo o uso da minha imagem.

CLÁUSULA 6ª - DA PROTEÇÃO DE DADOS (LGPD)
Os dados pessoais coletados serão tratados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), exclusivamente para fins de gestão do voluntariado paroquial, com garantia de segurança e privacidade.

CLÁUSULA 7ª - DA VIGÊNCIA
O presente termo possui vigência de 01 (um) ano, podendo ser renovado mediante novo termo.

Local e Data: {{LOCAL}}, {{DATA_GERACAO}}

___________________________________
{{NOME_VOLUNTARIO}}
Voluntário(a)

___________________________________
{{COORDENADOR}}
Coordenador(a) da Pastoral`,
    versao: 1, ativa: true, dataCriacao: '2026-01-01', dataAtualizacao: '2026-01-01',
    variaveis: ['CODIGO', 'PAROQUIA', 'PASTORAL', 'COMUNIDADE', 'NOME_VOLUNTARIO', 'CPF', 'FUNCAO', 'DATA_INICIO', 'DATA_FIM', 'LOCAL', 'DATA_GERACAO', 'COORDENADOR']
  },
  {
    id: 'tpl-002', nome: 'Termo de Voluntariado para Evento', tipo: 'EVENTO',
    conteudo: `TERMO DE VOLUNTARIADO PARA EVENTO PAROQUIAL

IDENTIFICAÇÃO:
Termo nº: {{CODIGO}}
Evento: {{EVENTO}}
Paróquia: {{PAROQUIA}}
Data do Evento: {{DATA_EVENTO}}
Local: {{LOCAL_EVENTO}}

VOLUNTÁRIO(A):
Nome: {{NOME_VOLUNTARIO}}
CPF: {{CPF}}
Função no Evento: {{FUNCAO}}

PERÍODO DE ATUAÇÃO:
De: {{DATA_INICIO}}
Até: {{DATA_FIM}}

CLÁUSULA 1ª - DO OBJETO
Formalizar a participação voluntária no evento "{{EVENTO}}", de forma gratuita, nos termos da Lei nº 9.608/1998.

CLÁUSULA 2ª - DAS ATIVIDADES
O voluntário desempenhará a função de {{FUNCAO}} durante o evento, conforme orientações da coordenação.

CLÁUSULA 3ª - DAS RESPONSABILIDADES
I - Cumprir horários e escalas definidas;
II - Seguir orientações da coordenação do evento;
III - Zelar pela segurança dos participantes;
IV - Manter conduta adequada ao ambiente paroquial.

CLÁUSULA 4ª - DA SEGURANÇA E CONDUTA
O voluntário compromete-se a seguir todas as normas de segurança do evento e manter conduta compatível com os valores cristãos.

CLÁUSULA 5ª - DO USO DE IMAGEM
[ ] Autorizo o uso da minha imagem para registro e divulgação do evento.
[ ] Não autorizo o uso da minha imagem.

CLÁUSULA 6ª - DA PROTEÇÃO DE DADOS (LGPD)
Conforme Lei nº 13.709/2018, os dados serão tratados exclusivamente para gestão do voluntariado no evento.

CLÁUSULA 7ª - DA VIGÊNCIA
Este termo é válido pelo período de atuação no evento.

Local e Data: {{LOCAL}}, {{DATA_GERACAO}}

___________________________________
{{NOME_VOLUNTARIO}}
Voluntário(a)

___________________________________
{{COORDENADOR}}
Coordenador(a) do Evento`,
    versao: 1, ativa: true, dataCriacao: '2026-01-01', dataAtualizacao: '2026-01-01',
    variaveis: ['CODIGO', 'EVENTO', 'PAROQUIA', 'DATA_EVENTO', 'LOCAL_EVENTO', 'NOME_VOLUNTARIO', 'CPF', 'FUNCAO', 'DATA_INICIO', 'DATA_FIM', 'LOCAL', 'DATA_GERACAO', 'COORDENADOR']
  },
];

export const auditoriaLogs: AuditoriaLog[] = [
  { id: 'aud-001', usuario: 'Admin Paróquia', dataHora: '2027-01-02 09:15:00', ip: '192.168.1.10', acao: 'TERMO_CRIADO', documentoId: 'ter-001', statusNovo: 'RASCUNHO', resultado: 'SUCESSO' },
  { id: 'aud-002', usuario: 'Admin Paróquia', dataHora: '2027-01-02 09:16:00', ip: '192.168.1.10', acao: 'TERMO_GERADO', documentoId: 'ter-001', statusAnterior: 'RASCUNHO', statusNovo: 'GERADO', resultado: 'SUCESSO' },
  { id: 'aud-003', usuario: 'Admin Paróquia', dataHora: '2027-01-03 10:00:00', ip: '192.168.1.10', acao: 'ASSINATURA_SOLICITADA', documentoId: 'ter-001', statusAnterior: 'GERADO', statusNovo: 'AGUARDANDO_ASSINATURA', assinaturaId: 'sig-001', resultado: 'SUCESSO' },
  { id: 'aud-004', usuario: 'Maria Aparecida', dataHora: '2027-01-05 14:30:00', ip: '189.40.22.15', acao: 'TERMO_ASSINADO', documentoId: 'ter-001', statusAnterior: 'ASSINATURA_EM_ANDAMENTO', statusNovo: 'ASSINADO', assinaturaId: 'sig-001', resultado: 'SUCESSO', mensagem: 'Assinatura realizada via gov.br - Conta Prata' },
  { id: 'aud-005', usuario: 'Admin Paróquia', dataHora: '2027-02-02 08:00:00', ip: '192.168.1.10', acao: 'TERMO_CRIADO', documentoId: 'ter-003', statusNovo: 'RASCUNHO', resultado: 'SUCESSO' },
  { id: 'aud-006', usuario: 'Admin Paróquia', dataHora: '2027-02-03 09:00:00', ip: '192.168.1.10', acao: 'ASSINATURA_SOLICITADA', documentoId: 'ter-003', statusAnterior: 'GERADO', statusNovo: 'AGUARDANDO_ASSINATURA', assinaturaId: 'sig-003', resultado: 'SUCESSO' },
  { id: 'aud-007', usuario: 'Admin Paróquia', dataHora: '2027-02-10 11:00:00', ip: '192.168.1.10', acao: 'TERMO_CRIADO', documentoId: 'ter-007', statusNovo: 'RASCUNHO', resultado: 'SUCESSO' },
  { id: 'aud-008', usuario: 'Admin Paróquia', dataHora: '2027-02-11 14:00:00', ip: '192.168.1.10', acao: 'ASSINATURA_SOLICITADA', documentoId: 'ter-007', statusAnterior: 'GERADO', statusNovo: 'ASSINATURA_EM_ANDAMENTO', assinaturaId: 'sig-007', resultado: 'SUCESSO' },
  { id: 'aud-009', usuario: 'Fernanda Rodrigues', dataHora: '2027-02-18 16:00:00', ip: '200.155.33.44', acao: 'TERMO_RECUSADO', documentoId: 'ter-009', statusAnterior: 'AGUARDANDO_ASSINATURA', statusNovo: 'RECUSADO', assinaturaId: 'sig-009', resultado: 'SUCESSO', mensagem: 'Voluntário recusou a assinatura' },
  { id: 'aud-010', usuario: 'Sistema', dataHora: '2027-01-01 00:01:00', ip: 'localhost', acao: 'TERMO_EXPIRADO', documentoId: 'ter-010', statusAnterior: 'ASSINADO', statusNovo: 'EXPIRADO', resultado: 'SUCESSO', mensagem: 'Termo expirou automaticamente - fim da vigência' },
  { id: 'aud-011', usuario: 'Admin Paróquia', dataHora: '2027-03-01 08:30:00', ip: '192.168.1.10', acao: 'VOLUNTARIO_CRIADO', documentoId: 'vol-007', resultado: 'SUCESSO' },
  { id: 'aud-012', usuario: 'Admin Paróquia', dataHora: '2027-03-05 10:00:00', ip: '192.168.1.10', acao: 'DOCUMENTO_DOWNLOAD', documentoId: 'ter-001', resultado: 'SUCESSO', mensagem: 'Download do PDF assinado' },
];
