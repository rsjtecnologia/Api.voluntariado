// Tipos do sistema de Gestão de Termos de Voluntariado Paroquial

export interface Diocese {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
}

export interface Paroquia {
  id: string;
  nome: string;
  dioceseId: string;
  endereco: string;
  telefone: string;
  email: string;
  padroeiro: string;
  logo?: string;
}

export interface Comunidade {
  id: string;
  nome: string;
  paroquiaId: string;
  endereco: string;
}

export interface Voluntario {
  id: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  paroquiaId: string;
  comunidadeId?: string;
  pastoralId?: string;
  funcaoId?: string;
  dataInicio: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  observacoes?: string;
}

export interface Pastoral {
  id: string;
  nome: string;
  descricao: string;
  paroquiaId: string;
  comunidadeId?: string;
  coordenador: string;
  email: string;
  status: 'ATIVA' | 'INATIVA';
  dataCriacao: string;
  observacoes?: string;
}

export interface Evento {
  id: string;
  nome: string;
  descricao: string;
  paroquiaId: string;
  comunidadeId?: string;
  pastoralId?: string;
  dataInicial: string;
  dataFinal: string;
  horario: string;
  local: string;
  coordenador: string;
  status: 'PLANEJAMENTO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO';
  observacoes?: string;
}

export interface EventoVoluntario {
  id: string;
  eventoId: string;
  voluntarioId: string;
  funcaoId: string;
  atividades: string;
}

export interface FuncaoVoluntario {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
}

export type TipoTermo = 'ANUAL' | 'EVENTO';

export type StatusTermo = 
  | 'RASCUNHO'
  | 'GERADO'
  | 'AGUARDANDO_ASSINATURA'
  | 'ASSINATURA_EM_ANDAMENTO'
  | 'ASSINADO'
  | 'RECUSADO'
  | 'CANCELADO'
  | 'EXPIRADO'
  | 'ERRO_ASSINATURA';

export interface Termo {
  id: string;
  codigo: string; // TVP-2027-000001 ou TVE-2027-000001
  tipo: TipoTermo;
  voluntarioId: string;
  pastoralId?: string;
  eventoId?: string;
  paroquiaId: string;
  dataInicio: string;
  dataFim: string;
  status: StatusTermo;
  templateId: string;
  versao: number;
  hashDocumento?: string;
  hashDocumentoAssinado?: string;
  dataGeracao: string;
  dataAssinatura?: string;
  dataSolicitacaoAssinatura?: string;
  assinaturaGovBrId?: string;
  documentoUrl?: string;
  documentoAssinadoUrl?: string;
  observacoes?: string;
}

export interface TermoTemplate {
  id: string;
  nome: string;
  tipo: TipoTermo;
  conteudo: string;
  versao: number;
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  variaveis: string[];
}

export interface TermoAssinatura {
  id: string;
  termoId: string;
  govBrSignatureId?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'RECUSADA' | 'EXPIRADA' | 'ERRO';
  dataSolicitacao: string;
  dataConclusao?: string;
  certificadoUsuario?: string;
  hashAssinado?: string;
  pkcs7Signature?: string;
}

export type TipoAuditoria = 
  | 'TERMO_CRIADO'
  | 'TERMO_GERADO'
  | 'ASSINATURA_SOLICITADA'
  | 'ASSINATURA_INICIADA'
  | 'TERMO_ASSINADO'
  | 'TERMO_RECUSADO'
  | 'TERMO_CANCELADO'
  | 'TERMO_EXPIRADO'
  | 'TERMO_RENOVADO'
  | 'DOCUMENTO_DOWNLOAD'
  | 'TEMPLATE_CRIADO'
  | 'TEMPLATE_ATUALIZADO'
  | 'VOLUNTARIO_CRIADO'
  | 'VOLUNTARIO_ATUALIZADO';

export interface AuditoriaLog {
  id: string;
  usuario: string;
  dataHora: string;
  ip?: string;
  acao: TipoAuditoria;
  documentoId?: string;
  versao?: number;
  statusAnterior?: string;
  statusNovo?: string;
  assinaturaId?: string;
  resultado: 'SUCESSO' | 'ERRO';
  mensagem?: string;
}

export interface Notificacao {
  id: string;
  destinatarioId: string;
  tipo: 'EMAIL' | 'INTERNA' | 'WHATSAPP';
  assunto: string;
  mensagem: string;
  lida: boolean;
  dataEnvio: string;
  dataLeitura?: string;
}

export type PerfilUsuario = 
  | 'ADMIN_DIOCESE'
  | 'ADMIN_PAROQUIA'
  | 'COORDENADOR_PASTORAL'
  | 'RESPONSAVEL_EVENTO'
  | 'SECRETARIA'
  | 'VOLUNTARIO'
  | 'AUDITOR';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  paroquiaId?: string;
  ativo: boolean;
}

// Interface do serviço de assinatura gov.br
export interface IGovBrSignatureService {
  criarSolicitacaoAssinatura(termoId: string, documentoHash: string): Promise<string>;
  obterStatusAssinatura(signatureId: string): Promise<StatusTermo>;
  cancelarSolicitacaoAssinatura(signatureId: string): Promise<void>;
  obterDocumentoAssinado(signatureId: string): Promise<Blob>;
  validarAssinatura(signatureId: string): Promise<boolean>;
}

// Interface do serviço de armazenamento
export interface IDocumentStorageService {
  upload(file: Blob, metadata: Record<string, string>): Promise<string>;
  download(fileId: string): Promise<Blob>;
  delete(fileId: string): Promise<void>;
  getSignedUrl(fileId: string, expiresInSeconds: number): Promise<string>;
}

// Interface do serviço de notificações
export interface INotificationService {
  enviarEmail(destinatario: string, assunto: string, mensagem: string): Promise<void>;
  enviarNotificacaoInterna(destinatarioId: string, assunto: string, mensagem: string): Promise<void>;
  enviarWhatsApp(destinatario: string, mensagem: string): Promise<void>;
}
