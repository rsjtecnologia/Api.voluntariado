import { useState } from 'react';
import { voluntarios, pastorais, eventos, termos, templates, auditoriaLogs, funcoes, comunidades, paroquia } from './data/mockData';
import { Termo, StatusTermo, TipoTermo, TipoAuditoria } from './data/types';

// ==================== UTILITY FUNCTIONS ====================
function getStatusColor(status: StatusTermo): string {
  const colors: Record<StatusTermo, string> = {
    RASCUNHO: 'bg-gray-100 text-gray-700',
    GERADO: 'bg-blue-100 text-blue-700',
    AGUARDANDO_ASSINATURA: 'bg-yellow-100 text-yellow-700',
    ASSINATURA_EM_ANDAMENTO: 'bg-blue-100 text-blue-700',
    ASSINADO: 'bg-green-100 text-green-700',
    RECUSADO: 'bg-red-100 text-red-700',
    CANCELADO: 'bg-gray-100 text-gray-700',
    EXPIRADO: 'bg-gray-800 text-white',
    ERRO_ASSINATURA: 'bg-orange-100 text-orange-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

function getStatusIcon(status: StatusTermo): string {
  const icons: Record<StatusTermo, string> = {
    RASCUNHO: '📝', GERADO: '📄', AGUARDANDO_ASSINATURA: '🟡',
    ASSINATURA_EM_ANDAMENTO: '🔵', ASSINADO: '🟢', RECUSADO: '🔴',
    CANCELADO: '⛔', EXPIRADO: '⚫', ERRO_ASSINATURA: '⚠️',
  };
  return icons[status] || '📄';
}

function getAuditoriaLabel(acao: TipoAuditoria): string {
  const labels: Record<TipoAuditoria, string> = {
    TERMO_CRIADO: 'Termo Criado', TERMO_GERADO: 'Termo Gerado',
    ASSINATURA_SOLICITADA: 'Assinatura Solicitada', ASSINATURA_INICIADA: 'Assinatura Iniciada',
    TERMO_ASSINADO: 'Termo Assinado', TERMO_RECUSADO: 'Termo Recusado',
    TERMO_CANCELADO: 'Termo Cancelado', TERMO_EXPIRADO: 'Termo Expirado',
    TERMO_RENOVADO: 'Termo Renovado', DOCUMENTO_DOWNLOAD: 'Download Documento',
    TEMPLATE_CRIADO: 'Template Criado', TEMPLATE_ATUALIZADO: 'Template Atualizado',
    VOLUNTARIO_CRIADO: 'Voluntário Criado', VOLUNTARIO_ATUALIZADO: 'Voluntário Atualizado',
  };
  return labels[acao] || acao;
}

function getVoluntarioNome(id: string): string {
  return voluntarios.find(v => v.id === id)?.nomeCompleto || 'N/A';
}

function getPastoralNome(id?: string): string {
  if (!id) return 'N/A';
  return pastorais.find(p => p.id === id)?.nome || 'N/A';
}

function getEventoNome(id?: string): string {
  if (!id) return 'N/A';
  return eventos.find(e => e.id === id)?.nome || 'N/A';
}

function formatDate(date: string): string {
  if (!date) return '-';
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

// ==================== ICONS (SVG Components) ====================
function IconDashboard() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>; }
function IconUsers() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>; }
function IconChurch() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>; }
function IconCalendar() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function IconDocument() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>; }
function IconTemplate() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg>; }
function IconShield() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>; }
function IconHistory() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function IconArchitecture() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>; }
function IconBell() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>; }
function IconCheck() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>; }
function IconSearch() { return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }

// ==================== MAIN APP ====================
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedTermo, setSelectedTermo] = useState<Termo | null>(null);
  const [showTermoDetail, setShowTermoDetail] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
    { id: 'voluntarios', label: 'Voluntários', icon: <IconUsers /> },
    { id: 'pastorais', label: 'Pastorais', icon: <IconChurch /> },
    { id: 'eventos', label: 'Eventos', icon: <IconCalendar /> },
    { id: 'termos', label: 'Termos', icon: <IconDocument /> },
    { id: 'templates', label: 'Templates', icon: <IconTemplate /> },
    { id: 'validacao', label: 'Validação', icon: <IconShield /> },
    { id: 'auditoria', label: 'Auditoria', icon: <IconHistory /> },
    { id: 'arquitetura', label: 'Arquitetura', icon: <IconArchitecture /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} onSelectTermo={(t) => { setSelectedTermo(t); setShowTermoDetail(true); }} />;
      case 'voluntarios': return <VoluntariosPage />;
      case 'pastorais': return <PastoraisPage />;
      case 'eventos': return <EventosPage />;
      case 'termos': return <TermosPage onSelectTermo={(t) => { setSelectedTermo(t); setShowTermoDetail(true); }} />;
      case 'templates': return <TemplatesPage />;
      case 'validacao': return <ValidacaoPage />;
      case 'auditoria': return <AuditoriaPage />;
      case 'arquitetura': return <ArquiteturaPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} onSelectTermo={(t) => { setSelectedTermo(t); setShowTermoDetail(true); }} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">✝</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-sm font-bold text-gray-800 leading-tight">Voluntariado</h1>
                <p className="text-xs text-gray-500">Paroquial</p>
              </div>
            )}
          </div>
        </div>
        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`sidebar-link w-full ${currentPage === item.id ? 'active' : 'text-gray-600 hover:text-primary-700'}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-700">{paroquia.nome}</p>
              <p>Administração</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-gray-700">
              <IconBell />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 text-sm font-medium">AP</span>
              </div>
              {sidebarOpen && <span className="text-sm text-gray-700 font-medium">Admin Paróquia</span>}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </main>

      {/* Termo Detail Modal */}
      {showTermoDetail && selectedTermo && (
        <TermoDetailModal termo={selectedTermo} onClose={() => setShowTermoDetail(false)} />
      )}
    </div>
  );
}

// ==================== DASHBOARD PAGE ====================
function DashboardPage({ onNavigate, onSelectTermo }: { onNavigate: (page: string) => void; onSelectTermo: (t: Termo) => void }) {
  const totalVoluntarios = voluntarios.filter(v => v.status === 'ATIVO').length;
  const termosAssinados = termos.filter(t => t.status === 'ASSINADO').length;
  const termosAguardando = termos.filter(t => t.status === 'AGUARDANDO_ASSINATURA' || t.status === 'ASSINATURA_EM_ANDAMENTO').length;
  const termosVencidos = termos.filter(t => t.status === 'EXPIRADO').length;
  const termosProxVencimento = 2; // Simulado
  const termosRecusados = termos.filter(t => t.status === 'RECUSADO').length;
  const eventosAtivos = eventos.filter(e => e.status === 'ATIVO' || e.status === 'PLANEJAMENTO').length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Voluntários Ativos" value={totalVoluntarios} icon="👥" color="bg-blue-50 border-blue-200" onClick={() => onNavigate('voluntarios')} />
        <StatCard title="Termos Assinados" value={termosAssinados} icon="✅" color="bg-green-50 border-green-200" onClick={() => onNavigate('termos')} />
        <StatCard title="Aguardando Assinatura" value={termosAguardando} icon="🟡" color="bg-yellow-50 border-yellow-200" onClick={() => onNavigate('termos')} />
        <StatCard title="Eventos Ativos" value={eventosAtivos} icon="📅" color="bg-purple-50 border-purple-200" onClick={() => onNavigate('eventos')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Próx. Vencimento" value={termosProxVencimento} icon="⏰" color="bg-orange-50 border-orange-200" />
        <StatCard title="Termos Vencidos" value={termosVencidos} icon="⚫" color="bg-gray-50 border-gray-200" />
        <StatCard title="Termos Recusados" value={termosRecusados} icon="🔴" color="bg-red-50 border-red-200" />
        <StatCard title="Pastorais Ativas" value={pastorais.filter(p => p.status === 'ATIVA').length} icon="⛪" color="bg-indigo-50 border-indigo-200" onClick={() => onNavigate('pastorais')} />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Termos por Status */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Termos por Status</h3>
          <div className="space-y-3">
            {(['ASSINADO', 'AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO', 'RASCUNHO', 'GERADO', 'RECUSADO', 'EXPIRADO'] as StatusTermo[]).map(status => {
              const count = termos.filter(t => t.status === status).length;
              if (count === 0) return null;
              const percentage = (count / termos.length) * 100;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="text-sm w-40 truncate">{getStatusIcon(status)} {status.replace(/_/g, ' ')}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-primary-500 transition-all" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voluntários por Pastoral */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Voluntários por Pastoral</h3>
          <div className="space-y-3">
            {pastorais.map(pastoral => {
              const count = voluntarios.filter(v => v.pastoralId === pastoral.id && v.status === 'ATIVO').length;
              if (count === 0) return null;
              const percentage = (count / totalVoluntarios) * 100;
              return (
                <div key={pastoral.id} className="flex items-center gap-3">
                  <span className="text-sm w-40 truncate">{pastoral.nome}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-church-500 transition-all" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Terms */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Termos Recentes</h3>
            <button onClick={() => onNavigate('termos')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Ver todos →</button>
          </div>
          <div className="space-y-3">
            {termos.slice(0, 5).map(termo => (
              <button key={termo.id} onClick={() => onSelectTermo(termo)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <div>
                  <p className="text-sm font-medium text-gray-800">{termo.codigo}</p>
                  <p className="text-xs text-gray-500">{getVoluntarioNome(termo.voluntarioId)}</p>
                </div>
                <span className={`badge ${getStatusColor(termo.status)}`}>
                  {getStatusIcon(termo.status)} {termo.status.replace(/_/g, ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">⚠️ Alertas</h3>
          <div className="space-y-3">
            <AlertItem type="warning" message="3 termos próximos do vencimento (30 dias)" />
            <AlertItem type="error" message="1 termo com assinatura recusada - TVP-2027-000007" />
            <AlertItem type="info" message="2 voluntários aguardando termo para evento ativo" />
            <AlertItem type="warning" message="Festa do Padroeiro sem todos os termos assinados" />
            <AlertItem type="success" message="Todos os termos da Pastoral da Liturgia estão em dia" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, onClick }: { title: string; value: number; icon: string; color: string; onClick?: () => void }) {
  return (
    <div className={`stat-card border ${color} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function AlertItem({ type, message }: { type: 'warning' | 'error' | 'info' | 'success'; message: string }) {
  const colors = { warning: 'bg-yellow-50 border-yellow-200 text-yellow-800', error: 'bg-red-50 border-red-200 text-red-800', info: 'bg-blue-50 border-blue-200 text-blue-800', success: 'bg-green-50 border-green-200 text-green-800' };
  const icons = { warning: '⚠️', error: '🔴', info: 'ℹ️', success: '✅' };
  return (
    <div className={`p-3 rounded-lg border text-sm ${colors[type]}`}>
      <span className="mr-2">{icons[type]}</span>{message}
    </div>
  );
}

// ==================== VOLUNTARIOS PAGE ====================
function VoluntariosPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const filtered = voluntarios.filter(v => v.nomeCompleto.toLowerCase().includes(search.toLowerCase()) || v.cpf.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400"><IconSearch /></span>
          <input type="text" placeholder="Buscar voluntário por nome ou CPF..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <span className="mr-2">+</span> Novo Voluntário
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Nome</th>
              <th className="table-header">CPF</th>
              <th className="table-header">Pastoral</th>
              <th className="table-header">Função</th>
              <th className="table-header">Status</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(vol => (
              <tr key={vol.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium">{vol.nomeCompleto}</td>
                <td className="table-cell">{vol.cpf}</td>
                <td className="table-cell">{getPastoralNome(vol.pastoralId)}</td>
                <td className="table-cell">{funcoes.find(f => f.id === vol.funcaoId)?.nome || '-'}</td>
                <td className="table-cell">
                  <span className={`badge ${vol.status === 'ATIVO' ? 'bg-green-100 text-green-700' : vol.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                    {vol.status}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex gap-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">Editar</button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">Termos</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <VoluntarioForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

function VoluntarioForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Novo Voluntário</h3>
          <p className="text-sm text-gray-500 mt-1">Cadastro em conformidade com a LGPD - Coleta mínima de dados</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label><input className="input-field" placeholder="Nome completo" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label><input className="input-field" placeholder="000.000.000-00" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label><input type="date" className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label><input type="email" className="input-field" placeholder="email@exemplo.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label><input className="input-field" placeholder="(00) 00000-0000" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Comunidade</label>
              <select className="input-field"><option value="">Selecione...</option>{comunidades.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Pastoral</label>
              <select className="input-field"><option value="">Selecione...</option>{pastorais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
              <select className="input-field"><option value="">Selecione...</option>{funcoes.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}</select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label><input className="input-field" placeholder="Endereço completo" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Observações</label><textarea className="input-field" rows={3} placeholder="Observações adicionais..."></textarea></div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700"><strong>LGPD:</strong> Os dados coletados são necessários para a gestão do voluntariado e emissão do Termo de Voluntariado. O voluntário será informado sobre a finalidade do tratamento de seus dados pessoais.</p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onClose}>Salvar Voluntário</button>
        </div>
      </div>
    </div>
  );
}

// ==================== PASTORAIS PAGE ====================
function PastoraisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{pastorais.length} pastorais cadastradas</p>
        <button className="btn-primary"><span className="mr-2">+</span> Nova Pastoral</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastorais.map(pastoral => {
          const volCount = voluntarios.filter(v => v.pastoralId === pastoral.id && v.status === 'ATIVO').length;
          const termosCount = termos.filter(t => t.pastoralId === pastoral.id).length;
          return (
            <div key={pastoral.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 text-lg">⛪</span>
                </div>
                <span className={`badge ${pastoral.status === 'ATIVA' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{pastoral.status}</span>
              </div>
              <h3 className="font-semibold text-gray-800">{pastoral.nome}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pastoral.descricao}</p>
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                <p className="text-xs text-gray-500"><strong>Coordenador:</strong> {pastoral.coordenador}</p>
                <p className="text-xs text-gray-500"><strong>Voluntários:</strong> {volCount}</p>
                <p className="text-xs text-gray-500"><strong>Termos:</strong> {termosCount}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Ver detalhes</button>
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Voluntários</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== EVENTOS PAGE ====================
function EventosPage() {
  const statusColors: Record<string, string> = { PLANEJAMENTO: 'bg-blue-100 text-blue-700', ATIVO: 'bg-green-100 text-green-700', CONCLUIDO: 'bg-gray-100 text-gray-700', CANCELADO: 'bg-red-100 text-red-700' };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{eventos.length} eventos cadastrados</p>
        <button className="btn-primary"><span className="mr-2">+</span> Novo Evento</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {eventos.map(evento => {
          const volCount = voluntarios.filter(v => eventos.some(e => e.id === evento.id)).length;
          return (
            <div key={evento.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{evento.nome}</h3>
                    <p className="text-xs text-gray-500">{formatDate(evento.dataInicial)} {evento.dataInicial !== evento.dataFinal ? ` - ${formatDate(evento.dataFinal)}` : ''}</p>
                  </div>
                </div>
                <span className={`badge ${statusColors[evento.status]}`}>{evento.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{evento.descricao}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Horário</p>
                  <p className="text-xs font-medium">{evento.horario}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Local</p>
                  <p className="text-xs font-medium truncate">{evento.local}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Coordenador</p>
                  <p className="text-xs font-medium truncate">{evento.coordenador}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Gerenciar Voluntários</button>
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">Gerar Termos</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== TERMOS PAGE ====================
function TermosPage({ onSelectTermo }: { onSelectTermo: (t: Termo) => void }) {
  const [filter, setFilter] = useState<string>('TODOS');
  const [typeFilter, setTypeFilter] = useState<string>('TODOS');
  
  const filtered = termos.filter(t => {
    if (filter !== 'TODOS' && t.status !== filter) return false;
    if (typeFilter !== 'TODOS' && t.tipo !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <select className="input-field w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="TODOS">Todos os Status</option>
            <option value="RASCUNHO">Rascunho</option>
            <option value="GERADO">Gerado</option>
            <option value="AGUARDANDO_ASSINATURA">Aguardando Assinatura</option>
            <option value="ASSINATURA_EM_ANDAMENTO">Em Andamento</option>
            <option value="ASSINADO">Assinado</option>
            <option value="RECUSADO">Recusado</option>
            <option value="EXPIRADO">Expirado</option>
          </select>
          <select className="input-field w-auto" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="TODOS">Todos os Tipos</option>
            <option value="ANUAL">Anual (Pastoral)</option>
            <option value="EVENTO">Evento</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Termo Anual</button>
          <button className="btn-primary">Termo de Evento</button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Código</th>
              <th className="table-header">Tipo</th>
              <th className="table-header">Voluntário</th>
              <th className="table-header">Pastoral/Evento</th>
              <th className="table-header">Vigência</th>
              <th className="table-header">Status</th>
              <th className="table-header">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(termo => (
              <tr key={termo.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectTermo(termo)}>
                <td className="table-cell font-mono font-medium text-primary-700">{termo.codigo}</td>
                <td className="table-cell">
                  <span className={`badge ${termo.tipo === 'ANUAL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {termo.tipo === 'ANUAL' ? '📋 Anual' : '📅 Evento'}
                  </span>
                </td>
                <td className="table-cell">{getVoluntarioNome(termo.voluntarioId)}</td>
                <td className="table-cell text-xs">{termo.tipo === 'ANUAL' ? getPastoralNome(termo.pastoralId) : getEventoNome(termo.eventoId)}</td>
                <td className="table-cell text-xs">{formatDate(termo.dataInicio)} a {formatDate(termo.dataFim)}</td>
                <td className="table-cell">
                  <span className={`badge ${getStatusColor(termo.status)}`}>
                    {getStatusIcon(termo.status)} {termo.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="text-primary-600 hover:text-primary-700 text-xs">PDF</button>
                    {termo.status === 'GERADO' && <button className="text-green-600 hover:text-green-700 text-xs">Assinar</button>}
                    {termo.status === 'ASSINADO' && <button className="text-gray-600 hover:text-gray-700 text-xs">Download</button>}
                    {termo.status === 'EXPIRADO' && <button className="text-primary-600 hover:text-primary-700 text-xs">Renovar</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== TERMO DETAIL MODAL ====================
function TermoDetailModal({ termo, onClose }: { termo: Termo; onClose: () => void }) {
  const termoLogs = auditoriaLogs.filter(l => l.documentoId === termo.id);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{termo.codigo}</h3>
            <p className="text-sm text-gray-500">
              {termo.tipo === 'ANUAL' ? 'Termo de Voluntariado Pastoral' : 'Termo de Voluntariado para Evento'} • Versão {termo.versao}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <div className="mt-1">
                <span className={`badge text-sm ${getStatusColor(termo.status)}`}>
                  {getStatusIcon(termo.status)} {termo.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">Voluntário</p>
              <p className="text-sm font-medium mt-1">{getVoluntarioNome(termo.voluntarioId)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 uppercase">{termo.tipo === 'ANUAL' ? 'Pastoral' : 'Evento'}</p>
              <p className="text-sm font-medium mt-1">{termo.tipo === 'ANUAL' ? getPastoralNome(termo.pastoralId) : getEventoNome(termo.eventoId)}</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">📋 Linha do Tempo</h4>
            <div className="space-y-3">
              {termo.dataGeracao && <TimelineItem date={termo.dataGeracao} label="Documento gerado" active />}
              {termo.dataSolicitacaoAssinatura && <TimelineItem date={termo.dataSolicitacaoAssinatura} label="Assinatura solicitada via gov.br" active />}
              {termo.status === 'ASSINATURA_EM_ANDAMENTO' && <TimelineItem date="Em andamento" label="Voluntário autenticando no gov.br..." active={false} pending />}
              {termo.dataAssinatura && <TimelineItem date={termo.dataAssinatura} label="Documento assinado com sucesso" active />}
              {termo.status === 'RECUSADO' && <TimelineItem date="-" label="Assinatura recusada pelo voluntário" active={false} error />}
              {termo.status === 'EXPIRADO' && <TimelineItem date="-" label="Termo expirado - fim da vigência" active={false} error />}
            </div>
          </div>

          {/* Gov.br Signature Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">🔐 Assinatura Eletrônica gov.br</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-blue-600">ID Assinatura:</span> <span className="font-mono">{termo.assinaturaGovBrId || 'Pendente'}</span></div>
              <div><span className="text-blue-600">Protocolo:</span> <span className="font-mono">{termo.assinaturaGovBrId ? 'SIG-' + termo.id.toUpperCase() : '-'}</span></div>
              <div><span className="text-blue-600">Hash Documento:</span> <span className="font-mono truncate">{termo.hashDocumento || '-'}</span></div>
              <div><span className="text-blue-600">Hash Assinado:</span> <span className="font-mono truncate">{termo.hashDocumentoAssinado || 'Pendente'}</span></div>
            </div>
            {termo.status === 'AGUARDANDO_ASSINATURA' && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-700">O voluntário será redirecionado para autenticação no gov.br (nível Prata/Ouro obrigatório).</p>
                <p className="text-xs text-blue-600 mt-1">API: assinatura-api.iti.br/externo/v2/assinarPKCS7</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary text-sm"><IconDocument /> <span className="ml-1">Visualizar PDF</span></button>
            {termo.status === 'GERADO' && <button className="btn-primary text-sm">🔐 Solicitar Assinatura gov.br</button>}
            {termo.status === 'ASSINADO' && <button className="btn-success text-sm">📥 Download PDF Assinado</button>}
            {termo.status === 'EXPIRADO' && <button className="btn-primary text-sm">🔄 Renovar Termo</button>}
            {(termo.status === 'AGUARDANDO_ASSINATURA' || termo.status === 'GERADO') && <button className="btn-danger text-sm">Cancelar</button>}
            <button className="btn-secondary text-sm">📋 Auditoria</button>
          </div>

          {/* Audit Trail */}
          {termoLogs.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">📝 Registro de Auditoria</h4>
              <div className="space-y-2">
                {termoLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-xs">
                    <span className="text-gray-500 w-32">{log.dataHora}</span>
                    <span className="font-medium text-gray-700">{getAuditoriaLabel(log.acao)}</span>
                    {log.statusNovo && <span className={`badge ${getStatusColor(log.statusNovo as StatusTermo)}`}>{log.statusNovo}</span>}
                    <span className="text-gray-400 ml-auto">{log.usuario}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ date, label, active, pending, error }: { date: string; label: string; active: boolean; pending?: boolean; error?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : pending ? 'bg-yellow-500 animate-pulse' : active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <div className="flex-1">
        <p className={`text-sm ${error ? 'text-red-600' : pending ? 'text-yellow-600' : 'text-gray-700'}`}>{label}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
}

// ==================== TEMPLATES PAGE ====================
function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{templates.length} templates cadastrados</p>
        <button className="btn-primary"><span className="mr-2">+</span> Novo Template</button>
      </div>
      {templates.map(template => (
        <div key={template.id} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">{template.nome}</h3>
              <div className="flex gap-2 mt-1">
                <span className={`badge ${template.tipo === 'ANUAL' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{template.tipo}</span>
                <span className="badge bg-gray-100 text-gray-600">v{template.versao}</span>
                <span className={`badge ${template.ativa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{template.ativa ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-xs">Editar</button>
              <button className="btn-secondary text-xs">Nova Versão</button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{template.conteudo.substring(0, 500)}...</pre>
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Variáveis disponíveis:</p>
            <div className="flex flex-wrap gap-1">
              {template.variaveis.map(v => (
                <span key={v} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-mono">{'{{' + v + '}}'}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== VALIDACAO PAGE ====================
function ValidacaoPage() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<'valido' | 'invalido' | null>(null);
  const [termoEncontrado, setTermoEncontrado] = useState<Termo | null>(null);

  const buscar = () => {
    const termo = termos.find(t => t.codigo === codigo.toUpperCase());
    if (termo && termo.status === 'ASSINADO') {
      setResultado('valido');
      setTermoEncontrado(termo);
    } else if (termo) {
      setResultado('invalido');
      setTermoEncontrado(termo);
    } else {
      setResultado('invalido');
      setTermoEncontrado(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconShield />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Validação de Termo</h3>
        <p className="text-sm text-gray-500 mt-1">Verifique a autenticidade de um Termo de Voluntariado</p>
      </div>

      <div className="card p-6">
        <div className="flex gap-3">
          <input className="input-field flex-1" placeholder="Ex: TVP-2027-000001" value={codigo} onChange={e => setCodigo(e.target.value)} />
          <button className="btn-primary" onClick={buscar}>
            <IconCheck /> <span className="ml-1">Validar</span>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Você também pode escanear o QR Code do documento.</p>
      </div>

      {resultado === 'valido' && termoEncontrado && (
        <div className="card p-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✓</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-green-800">Documento Válido</h4>
              <p className="text-sm text-green-600">Este termo possui assinatura eletrônica válida via gov.br</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Código:</span> <span className="font-mono font-medium">{termoEncontrado.codigo}</span></div>
            <div><span className="text-gray-500">Tipo:</span> {termoEncontrado.tipo === 'ANUAL' ? 'Voluntariado Pastoral' : 'Voluntariado Evento'}</div>
            <div><span className="text-gray-500">Emissão:</span> {formatDate(termoEncontrado.dataGeracao)}</div>
            <div><span className="text-gray-500">Assinatura:</span> {formatDate(termoEncontrado.dataAssinatura || '')}</div>
            <div><span className="text-gray-500">Voluntário:</span> {getVoluntarioNome(termoEncontrado.voluntarioId)}</div>
            <div><span className="text-gray-500">Vigência:</span> {formatDate(termoEncontrado.dataInicio)} a {formatDate(termoEncontrado.dataFim)}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-xs text-green-700">Hash SHA-256: <span className="font-mono">{termoEncontrado.hashDocumentoAssinado}</span></p>
            <p className="text-xs text-green-600 mt-1">Validação: Assinar digitalmente via ITI - validar.iti.gov.br</p>
          </div>
        </div>
      )}

      {resultado === 'invalido' && (
        <div className="card p-6 border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✗</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-800">Documento Inválido</h4>
              <p className="text-sm text-red-600">
                {termoEncontrado 
                  ? `Este termo existe mas não possui assinatura válida. Status: ${termoEncontrado.status}`
                  : 'Código não encontrado na base de dados.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Demo */}
      <div className="card p-6 text-center">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Exemplo de QR Code no PDF</h4>
        <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
          <div className="text-center">
            <div className="grid grid-cols-5 gap-0.5 w-20 h-20 mx-auto">
              {Array.from({length: 25}).map((_, i) => (
                <div key={i} className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'} rounded-sm`}></div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">/validar-termo/{'{CODIGO}'}</p>
      </div>
    </div>
  );
}

// ==================== AUDITORIA PAGE ====================
function AuditoriaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{auditoriaLogs.length} registros de auditoria</p>
        <button className="btn-secondary">Exportar CSV</button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-header">Data/Hora</th>
              <th className="table-header">Usuário</th>
              <th className="table-header">Ação</th>
              <th className="table-header">Documento</th>
              <th className="table-header">Status</th>
              <th className="table-header">Resultado</th>
              <th className="table-header">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {auditoriaLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="table-cell text-xs font-mono">{log.dataHora}</td>
                <td className="table-cell text-sm">{log.usuario}</td>
                <td className="table-cell"><span className="badge bg-gray-100 text-gray-700">{getAuditoriaLabel(log.acao)}</span></td>
                <td className="table-cell text-xs font-mono">{log.documentoId || '-'}</td>
                <td className="table-cell text-xs">
                  {log.statusNovo ? <span className={`badge ${getStatusColor(log.statusNovo as StatusTermo)}`}>{log.statusNovo}</span> : '-'}
                </td>
                <td className="table-cell">
                  <span className={`badge ${log.resultado === 'SUCESSO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.resultado}</span>
                </td>
                <td className="table-cell text-xs font-mono text-gray-400">{log.ip || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== ARQUITETURA PAGE ====================
function ArquiteturaPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Arquitetura do Sistema</h2>
        <p className="text-gray-500 mt-2">Gestão de Termos de Voluntariado Paroquial - Visão Geral</p>
      </div>

      {/* Architecture Diagram */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏗️ Arquitetura Geral</h3>
        <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <pre className="text-xs font-mono text-gray-700 leading-relaxed">{`
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Tailwind)                      │
├─────────────┬──────────────┬──────────────┬─────────────┬───────────────┤
│  Dashboard  │  Voluntários │   Pastorais  │   Eventos   │    Termos     │
├─────────────┴──────────────┴──────────────┴─────────────┴───────────────┤
│                    Templates │ Validação │ Auditoria                      │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ REST API
┌─────────────────────────────────▼───────────────────────────────────────┐
│                     BACKEND (Laravel + JWT)                              │
├─────────────┬──────────────┬──────────────┬─────────────┬───────────────┤
│  Voluntário │   Pastoral   │    Evento    │    Termo    │   Template    │
│  Service    │   Service    │   Service    │   Service   │   Service     │
├─────────────┴──────────────┴──────────────┴─────────────┴───────────────┤
│  GovBrSignature │ DocumentStorage │ Notification │ Audit │ PDFGenerator │
│    Service      │     Service     │    Service   │ Log   │   Service    │
└────────┬────────────────┬────────────────┬───────────┬──────────────────┘
         │                │                │           │
    ┌────▼────┐    ┌──────▼──────┐   ┌────▼────┐  ┌──▼──────────┐
    │ gov.br  │    │ S3/Azure/   │   │  SMTP/  │  │ SQL Server  │
    │  API    │    │   Local     │   │ WhatsApp│  │   (EF Core) │
    │(assin.) │    │  Storage    │   │         │  │             │
    └─────────┘    └─────────────┘   └─────────┘  └─────────────┘
          `}</pre>
        </div>
      </div>

      {/* Database Schema */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🗄️ Modelo de Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'DIOCESES', fields: ['id', 'nome', 'cidade', 'estado'] },
            { name: 'PAROQUIAS', fields: ['id', 'nome', 'diocese_id', 'endereco', 'padroeiro'] },
            { name: 'COMUNIDADES', fields: ['id', 'nome', 'paroquia_id', 'endereco'] },
            { name: 'PASTORAIS', fields: ['id', 'nome', 'paroquia_id', 'comunidade_id', 'coordenador'] },
            { name: 'VOLUNTARIOS', fields: ['id', 'nome', 'cpf', 'email', 'paroquia_id', 'pastoral_id'] },
            { name: 'FUNCOES_VOLUNTARIO', fields: ['id', 'nome', 'descricao', 'ativa'] },
            { name: 'EVENTOS', fields: ['id', 'nome', 'paroquia_id', 'pastoral_id', 'data_inicial', 'data_final'] },
            { name: 'EVENTOS_VOLUNTARIOS', fields: ['id', 'evento_id', 'voluntario_id', 'funcao_id'] },
            { name: 'TERMOS', fields: ['id', 'codigo', 'tipo', 'voluntario_id', 'status', 'hash'] },
            { name: 'TERMOS_TEMPLATES', fields: ['id', 'nome', 'tipo', 'conteudo', 'versao', 'ativa'] },
            { name: 'TERMOS_ASSINATURAS', fields: ['id', 'termo_id', 'govbr_id', 'status', 'hash'] },
            { name: 'TERMOS_AUDITORIA', fields: ['id', 'usuario', 'acao', 'documento_id', 'data_hora'] },
            { name: 'NOTIFICACOES', fields: ['id', 'destinatario_id', 'tipo', 'assunto', 'mensagem'] },
            { name: 'USUARIOS', fields: ['id', 'nome', 'email', 'perfil', 'paroquia_id'] },
            { name: 'CONFIGURACOES', fields: ['id', 'paroquia_id', 'chave', 'valor'] },
          ].map(table => (
            <div key={table.name} className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-primary-700 uppercase">{table.name}</h4>
              <div className="mt-2 space-y-0.5">
                {table.fields.map(f => (
                  <p key={f} className="text-xs text-gray-600 font-mono">{f}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gov.br Integration */}
      <div className="card p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">🔐 Integração Assinatura Eletrônica gov.br</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Fluxo Oficial (documentação ITI/gov.br):</h4>
            <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside">
              <li><strong>Autenticação:</strong> Login Único gov.br (OAuth 2.0) - conta Prata/Ouro obrigatória</li>
              <li><strong>Autorização:</strong> <code className="bg-gray-100 px-1 rounded">cas.iti.br/oauth2.0/authorize</code> com scope=sign</li>
              <li><strong>Access Token:</strong> POST <code className="bg-gray-100 px-1 rounded">cas.iti.br/oauth2.0/token</code></li>
              <li><strong>Certificado:</strong> GET <code className="bg-gray-100 px-1 rounded">assinatura-api.iti.br/externo/v2/certificadoPublico</code></li>
              <li><strong>Assinatura:</strong> POST <code className="bg-gray-100 px-1 rounded">assinatura-api.iti.br/externo/v2/assinarPKCS7</code> com hash SHA-256</li>
              <li><strong>Resultado:</strong> Pacote PKCS#7 com assinatura digital avançada</li>
            </ol>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Interface IGovBrSignatureService:</h4>
            <pre className="text-xs font-mono text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">{`interface IGovBrSignatureService {
  // Redireciona para OAuth gov.br e obtém authorization code
  criarSolicitacaoAssinatura(termoId: string, hash: string): Promise<string>;
  
  // Consulta status da assinatura
  obterStatusAssinatura(signatureId: string): Promise<StatusTermo>;
  
  // Cancela solicitação pendente
  cancelarSolicitacaoAssinatura(signatureId: string): Promise<void>;
  
  // Obtém PKCS#7 com assinatura para incorporar no PDF
  obterDocumentoAssinado(signatureId: string): Promise<Blob>;
  
  // Valida assinatura via ITI (validar.iti.gov.br)
  validarAssinatura(signatureId: string): Promise<boolean>;
}`}</pre>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800"><strong>⚠️ Nota Importante:</strong> A API de Assinatura Eletrônica do gov.br é destinada a órgãos públicos. Para utilização por uma paróquia, é necessário que o sistema esteja hospedado em domínio oficial ou que a integração seja realizada através da Diocese/Cúria que possui credenciais. A arquitetura está preparada para essa integração quando as credenciais forem obtidas.</p>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🌐 API REST - Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { method: 'POST', path: '/api/voluntarios', desc: 'Criar voluntário' },
            { method: 'GET', path: '/api/voluntarios', desc: 'Listar voluntários' },
            { method: 'GET', path: '/api/voluntarios/{id}', desc: 'Detalhar voluntário' },
            { method: 'POST', path: '/api/pastorais', desc: 'Criar pastoral' },
            { method: 'GET', path: '/api/pastorais', desc: 'Listar pastorais' },
            { method: 'POST', path: '/api/eventos', desc: 'Criar evento' },
            { method: 'GET', path: '/api/eventos', desc: 'Listar eventos' },
            { method: 'POST', path: '/api/termos/anual', desc: 'Criar termo anual' },
            { method: 'POST', path: '/api/termos/evento', desc: 'Criar termo de evento' },
            { method: 'GET', path: '/api/termos/{id}', desc: 'Detalhar termo' },
            { method: 'POST', path: '/api/termos/{id}/gerar', desc: 'Gerar PDF' },
            { method: 'POST', path: '/api/termos/{id}/solicitar-assinatura', desc: 'Solicitar assinatura' },
            { method: 'GET', path: '/api/termos/{id}/assinatura/status', desc: 'Status assinatura' },
            { method: 'POST', path: '/api/termos/{id}/renovar', desc: 'Renovar termo' },
            { method: 'GET', path: '/api/termos/{id}/pdf', desc: 'Download PDF' },
            { method: 'GET', path: '/api/validacao/{codigo}', desc: 'Validar termo' },
          ].map((ep, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
              <span className={`px-2 py-0.5 rounded font-bold text-white ${ep.method === 'GET' ? 'bg-green-500' : 'bg-blue-500'}`}>{ep.method}</span>
              <span className="font-mono text-gray-700">{ep.path}</span>
              <span className="text-gray-400 ml-auto">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & LGPD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔒 Segurança</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Autenticação JWT com Laravel</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Controle por perfil (RBAC)</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Isolamento por paróquia (multi-tenant)</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Criptografia de dados sensíveis</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> URLs temporárias para documentos</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Hash SHA-256 para integridade</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Logs de auditoria imutáveis</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Validação de uploads</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 LGPD</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Minimização de dados</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Finalidade definida e transparente</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Controle de acesso por perfil</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Política de retenção documental</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Histórico de operações</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Consentimento para uso de imagem</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Eliminação quando aplicável</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Registro de tratamento (Art. 37)</li>
          </ul>
        </div>
      </div>

      {/* Document Flow */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📄 Fluxo de Geração e Assinatura</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['Criar Termo', '→', 'Gerar PDF', '→', 'Calcular Hash', '→', 'Salvar Versão', '→', 'Solicitar Assinatura', '→', 'Autenticação gov.br', '→', 'Assinar PKCS#7', '→', 'Incorporar no PDF', '→', 'Documento Final', '→', 'Armazenar', '→', 'Auditar'].map((step, i) => (
            step === '→' 
              ? <span key={i} className="text-gray-400">→</span>
              : <span key={i} className="bg-primary-50 text-primary-700 px-2 py-1 rounded font-medium">{step}</span>
          ))}
        </div>
      </div>

      {/* Status Flow */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🔄 Ciclo de Vida do Termo</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(['RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO', 'ASSINADO'] as const).map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-gray-400">→</span>}
              <span className={`badge ${getStatusColor(s)}`}>{getStatusIcon(s)} {s.replace(/_/g, ' ')}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Status alternativos: RECUSADO | CANCELADO | EXPIRADO | ERRO_ASSINATURA</p>
      </div>

      {/* Tech Stack */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Stack Tecnológica</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Frontend', value: 'React + Tailwind CSS', icon: '🎨' },
            { label: 'Backend', value: 'Laravel + JWT', icon: '⚡' },
            { label: 'Banco', value: 'SQL Server + EF Core', icon: '🗄️' },
            { label: 'PDF', value: 'DomPDF / TCPDF', icon: '📄' },
            { label: 'Assinatura', value: 'API gov.br (ITI)', icon: '🔐' },
            { label: 'Storage', value: 'S3 / Azure Blob', icon: '☁️' },
            { label: 'Notificações', value: 'SMTP + Push', icon: '🔔' },
            { label: 'Queue', value: 'Laravel Queue', icon: '📨' },
          ].map(tech => (
            <div key={tech.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="text-2xl">{tech.icon}</span>
              <p className="text-xs font-semibold text-gray-700 mt-1">{tech.label}</p>
              <p className="text-xs text-gray-500">{tech.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-tenant */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏛️ Evolução Multi-Instituição</h3>
        <pre className="text-xs font-mono text-gray-700 bg-gray-50 p-4 rounded overflow-x-auto">{`
Diocese
└── Paróquias (multi-tenant)
    ├── Comunidades
    ├── Pastorais
    │   └── Voluntários
    │       └── Termos (TVP-YYYY-NNNNNN)
    ├── Eventos
    │   └── Termos (TVE-YYYY-NNNNNN)
    ├── Templates
    └── Configurações
        `}</pre>
      </div>
    </div>
  );
}
