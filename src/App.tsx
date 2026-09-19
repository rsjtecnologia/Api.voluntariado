import { useState } from 'react';
import { angularStructure, angularCore, angularFeatures, angularShared, angularEnvironment } from './data/angularCode';
import { laravelStructure, laravelRoutes, laravelModels, laravelControllers, laravelServices, laravelMigrations, laravelConfig } from './data/laravelCode';

type Page = 'overview' | 'angular' | 'laravel' | 'database' | 'api' | 'govbr' | 'security' | 'install';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFile, setActiveFile] = useState<string>('');

  const menuItems: { id: Page; label: string; icon: string; section?: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: '🏠', section: 'DOCUMENTAÇÃO' },
    { id: 'angular', label: 'Frontend Angular', icon: '🅰️', section: 'CÓDIGO-FONTE' },
    { id: 'laravel', label: 'Backend Laravel', icon: '🔺' },
    { id: 'database', label: 'Banco de Dados', icon: '🗄️' },
    { id: 'api', label: 'API REST', icon: '🌐' },
    { id: 'govbr', label: 'Integração gov.br', icon: '🔐', section: 'INTEGRAÇÕES' },
    { id: 'security', label: 'Segurança & LGPD', icon: '🛡️' },
    { id: 'install', label: 'Instalação', icon: '⚙️', section: 'DEPLOY' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">✝</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="text-xs font-bold text-slate-800 leading-tight">Voluntariado Paroquial</h1>
                <p className="text-[10px] text-slate-500">Angular + Laravel</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <div key={item.id}>
              {item.section && (
                <div className="sidebar-section mt-3 first:mt-0">{sidebarOpen ? item.section : ''}</div>
              )}
              <button
                onClick={() => { setCurrentPage(item.id); setActiveFile(''); }}
                className={`sidebar-link w-full text-left ${currentPage === item.id ? 'active' : 'text-slate-600'}`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            </div>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-slate-200">
            <div className="flex gap-2">
              <span className="badge bg-red-100 text-red-700 text-[10px]">Angular 17</span>
              <span className="badge bg-orange-100 text-orange-700 text-[10px]">Laravel 11</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-base font-semibold text-slate-800">
              {menuItems.find(m => m.id === currentPage)?.icon} {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="badge bg-slate-100 text-slate-600">v1.0.0</span>
            <span>Documentação Técnica</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {currentPage === 'overview' && <OverviewPage />}
            {currentPage === 'angular' && <AngularPage activeFile={activeFile} setActiveFile={setActiveFile} />}
            {currentPage === 'laravel' && <LaravelPage activeFile={activeFile} setActiveFile={setActiveFile} />}
            {currentPage === 'database' && <DatabasePage />}
            {currentPage === 'api' && <ApiPage />}
            {currentPage === 'govbr' && <GovBrPage />}
            {currentPage === 'security' && <SecurityPage />}
            {currentPage === 'install' && <InstallPage />}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==================== CODE VIEWER COMPONENT ====================
function CodeViewer({ code, filename, language }: { code: string; filename?: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {filename && (
        <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
          {language && <span className="text-[10px] text-slate-500 uppercase">{language}</span>}
        </div>
      )}
      <button onClick={copy} className={`absolute top-2 right-2 px-2 py-1 text-xs rounded transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
      <pre className={`code-block ${filename ? 'rounded-t-none' : ''}`}>{code}</pre>
    </div>
  );
}

function FileTreeItem({ name, icon, indent = 0, onClick, active }: { name: string; icon: string; indent?: number; onClick?: () => void; active?: boolean }) {
  return (
    <div 
      className={`file-tree-item ${active ? 'bg-primary-50 text-primary-700' : ''}`}
      style={{ paddingLeft: `${12 + indent * 16}px` }}
      onClick={onClick}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}

// ==================== OVERVIEW PAGE ====================
function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-3xl">✝</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Termos de Voluntariado Paroquial</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Plataforma completa para cadastro de voluntários, geração de termos, assinatura eletrônica via gov.br e gestão documental.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <span className="badge bg-red-100 text-red-700 px-3 py-1">🅰️ Angular 17+</span>
          <span className="badge bg-orange-100 text-orange-700 px-3 py-1">🔺 Laravel 11</span>
          <span className="badge bg-blue-100 text-blue-700 px-3 py-1">🔐 JWT Auth</span>
          <span className="badge bg-green-100 text-green-700 px-3 py-1">🗄️ SQL Server</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-3">🎯 Objetivo</h3>
          <p className="text-sm text-slate-600">
            Permitir que a paróquia cadastre voluntários, vincule-os às pastorais e eventos, gere documentos PDF, 
            controle o ciclo de assinatura eletrônica via gov.br e mantenha auditoria completa de todas as operações.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-3">📋 Tipos de Termos</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>TVP</strong> - Termo de Voluntariado Pastoral (anual)</p>
            <p><strong>TVE</strong> - Termo de Voluntariado para Evento</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🏗️ Arquitetura do Sistema</h3>
        <CodeViewer code={`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND - Angular 17+ (Standalone Components)            │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────────┤
│   Auth       │  Dashboard   │  Voluntários │   Pastorais  │    Eventos     │
│   Module     │   Module     │   Module     │   Module     │    Module      │
├──────────────┴──────────────┴──────────────┴──────────────┴────────────────┤
│              Termos │ Templates │ Validação │ Auditoria                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Core: Interceptors (JWT) │ Guards (Auth/Role) │ Services │ Models          │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ HTTP/REST + JWT Bearer Token
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                    BACKEND - Laravel 11 (API)                                │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────────┤
│  Auth        │  Voluntario  │   Pastoral   │    Evento    │     Termo      │
│  Controller  │  Controller  │  Controller  │  Controller  │   Controller   │
├──────────────┴──────────────┴──────────────┴──────────────┴────────────────┤
│                          SERVICE LAYER (Business Logic)                      │
├──────────────┬──────────────┬──────────────┬──────────────┬────────────────┤
│ TermoService │ GovBrSign    │ PdfGenerator │  Storage     │  Notification  │
│              │ Service      │ Service      │  Service     │  Service       │
├──────────────┴──────────────┴──────────────┴──────────────┴────────────────┤
│  AuditoriaService │ HashService │ DocumentStorageService                    │
└────────┬────────────────┬────────────────┬────────────────┬────────────────┘
         │                │                │                │
    ┌────▼────┐    ┌──────▼──────┐   ┌────▼────┐    ┌──────▼──────┐
    │ gov.br  │    │  S3/Azure/  │   │  SQL    │    │   Queue     │
    │  API    │    │   Local     │   │ Server  │    │  (Jobs)     │
    │(assin.) │    │  Storage    │   │(EF/DB)  │    │             │
    └─────────┘    └─────────────┘   └─────────┘    └─────────────┘
`} filename="arquitetura.txt" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📊 Hierarquia Institucional</h3>
        <CodeViewer code={`
Diocese
└── Paróquias (multi-tenant, isoladas por paroquia_id)
    ├── Comunidades
    ├── Pastorais
    │   ├── Coordenador
    │   └── Voluntários
    │       └── Termos (TVP-YYYY-NNNNNN)
    ├── Eventos
    │   ├── Voluntários vinculados
    │   └── Termos (TVE-YYYY-NNNNNN)
    ├── Templates de Termos
    └── Configurações
`} />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔄 Ciclo de Vida do Termo</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO', 'ASSINADO'].map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-400">→</span>}
              <span className="badge bg-primary-50 text-primary-700 px-2 py-1">{s.replace(/_/g, ' ')}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Status alternativos: RECUSADO | CANCELADO | EXPIRADO | ERRO_ASSINATURA</p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">👥 Perfis de Usuário (RBAC)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { perfil: 'ADMIN_DIOCESE', desc: 'Acesso total à diocese' },
            { perfil: 'ADMIN_PAROQUIA', desc: 'Administra a paróquia' },
            { perfil: 'COORDENADOR_PASTORAL', desc: 'Gerencia uma pastoral' },
            { perfil: 'RESPONSAVEL_EVENTO', desc: 'Gerencia eventos' },
            { perfil: 'SECRETARIA', desc: 'Operações administrativas' },
            { perfil: 'VOLUNTARIO', desc: 'Acesso aos próprios termos' },
            { perfil: 'AUDITOR', desc: 'Consulta logs de auditoria' },
          ].map(p => (
            <div key={p.perfil} className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-700">{p.perfil}</p>
              <p className="text-[10px] text-slate-500 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== ANGULAR PAGE ====================
function AngularPage({ activeFile, setActiveFile }: { activeFile: string; setActiveFile: (f: string) => void }) {
  const [tab, setTab] = useState('structure');
  
  const files: Record<string, { code: string; lang: string }> = {
    'app.config.ts': { code: angularStructure.appConfig, lang: 'typescript' },
    'app.routes.ts': { code: angularStructure.appRoutes, lang: 'typescript' },
    'auth.interceptor.ts': { code: angularCore.authInterceptor, lang: 'typescript' },
    'error.interceptor.ts': { code: angularCore.errorInterceptor, lang: 'typescript' },
    'auth.guard.ts': { code: angularCore.authGuard, lang: 'typescript' },
    'role.guard.ts': { code: angularCore.roleGuard, lang: 'typescript' },
    'auth.service.ts': { code: angularCore.authService, lang: 'typescript' },
    'notification.service.ts': { code: angularCore.notificationService, lang: 'typescript' },
    'models': { code: angularCore.models, lang: 'typescript' },
    'dashboard.component.ts': { code: angularFeatures.dashboardComponent, lang: 'typescript' },
    'termos.service.ts': { code: angularFeatures.termosComponent.split('// src/app/features/termos/termo-assinatura')[0], lang: 'typescript' },
    'termo-assinatura.component.ts': { code: '// src/app/features/termos/termo-assinatura/termo-assinatura.component.ts\n' + angularFeatures.termosComponent.split('// src/app/features/termos/termo-assinatura/')[1]?.split('// src/app/features/voluntarios')[0] || '', lang: 'typescript' },
    'voluntarios.service.ts': { code: angularFeatures.voluntariosComponent.split('// src/app/features/voluntarios/voluntario-form')[0], lang: 'typescript' },
    'voluntario-form.component.ts': { code: '// src/app/features/voluntarios/voluntario-form/voluntario-form.component.ts\n' + (angularFeatures.voluntariosComponent.split('// src/app/features/voluntarios/voluntario-form/voluntario-form.component.ts')[1] || ''), lang: 'typescript' },
    'validacao.component.ts': { code: angularFeatures.validacaoComponent, lang: 'typescript' },
    'cpf.validator.ts': { code: angularShared.cpfValidator, lang: 'typescript' },
    'status-badge.pipe.ts': { code: angularShared.statusBadgePipe, lang: 'typescript' },
    'environment.ts': { code: angularEnvironment, lang: 'typescript' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200">
        {[
          { id: 'structure', label: '📁 Estrutura' },
          { id: 'code', label: '💻 Código' },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'structure' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Estrutura do Projeto Angular</h3>
          <CodeViewer code={angularStructure.root} filename="angular-project-structure" />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">📦 Módulos Lazy-Loaded</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• features/auth/ - Autenticação</li>
                <li>• features/dashboard/ - Dashboard</li>
                <li>• features/voluntarios/ - CRUD Voluntários</li>
                <li>• features/pastorais/ - CRUD Pastorais</li>
                <li>• features/eventos/ - CRUD Eventos</li>
                <li>• features/termos/ - Gestão de Termos</li>
                <li>• features/templates/ - Templates</li>
                <li>• features/auditoria/ - Logs de Auditoria</li>
                <li>• features/validacao/ - Validação Pública</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">🔧 Core Module</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• interceptors/ - JWT, Error handling</li>
                <li>• guards/ - Auth, Role-based access</li>
                <li>• services/ - Auth, Notification, API</li>
                <li>• models/ - Interfaces TypeScript</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div className="flex gap-4">
          <div className="w-64 flex-shrink-0">
            <div className="card p-3 sticky top-0">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Arquivos</h4>
              <div className="space-y-0.5 max-h-[70vh] overflow-y-auto">
                <FileTreeItem name="app/" icon="📁" active={false} />
                <FileTreeItem name="app.config.ts" icon="📄" indent={1} onClick={() => setActiveFile('app.config.ts')} active={activeFile === 'app.config.ts'} />
                <FileTreeItem name="app.routes.ts" icon="📄" indent={1} onClick={() => setActiveFile('app.routes.ts')} active={activeFile === 'app.routes.ts'} />
                <FileTreeItem name="core/" icon="📁" indent={1} />
                <FileTreeItem name="interceptors/" icon="📁" indent={2} />
                <FileTreeItem name="auth.interceptor.ts" icon="📄" indent={3} onClick={() => setActiveFile('auth.interceptor.ts')} active={activeFile === 'auth.interceptor.ts'} />
                <FileTreeItem name="error.interceptor.ts" icon="📄" indent={3} onClick={() => setActiveFile('error.interceptor.ts')} active={activeFile === 'error.interceptor.ts'} />
                <FileTreeItem name="guards/" icon="📁" indent={2} />
                <FileTreeItem name="auth.guard.ts" icon="📄" indent={3} onClick={() => setActiveFile('auth.guard.ts')} active={activeFile === 'auth.guard.ts'} />
                <FileTreeItem name="role.guard.ts" icon="📄" indent={3} onClick={() => setActiveFile('role.guard.ts')} active={activeFile === 'role.guard.ts'} />
                <FileTreeItem name="services/" icon="📁" indent={2} />
                <FileTreeItem name="auth.service.ts" icon="📄" indent={3} onClick={() => setActiveFile('auth.service.ts')} active={activeFile === 'auth.service.ts'} />
                <FileTreeItem name="notification.service.ts" icon="📄" indent={3} onClick={() => setActiveFile('notification.service.ts')} active={activeFile === 'notification.service.ts'} />
                <FileTreeItem name="models/" icon="📁" indent={2} />
                <FileTreeItem name="termo.model.ts" icon="📄" indent={3} onClick={() => setActiveFile('models')} active={activeFile === 'models'} />
                <FileTreeItem name="features/" icon="📁" indent={1} />
                <FileTreeItem name="dashboard/" icon="📁" indent={2} />
                <FileTreeItem name="dashboard.component.ts" icon="📄" indent={3} onClick={() => setActiveFile('dashboard.component.ts')} active={activeFile === 'dashboard.component.ts'} />
                <FileTreeItem name="termos/" icon="📁" indent={2} />
                <FileTreeItem name="termos.service.ts" icon="📄" indent={3} onClick={() => setActiveFile('termos.service.ts')} active={activeFile === 'termos.service.ts'} />
                <FileTreeItem name="termo-assinatura.component.ts" icon="📄" indent={3} onClick={() => setActiveFile('termo-assinatura.component.ts')} active={activeFile === 'termo-assinatura.component.ts'} />
                <FileTreeItem name="voluntarios/" icon="📁" indent={2} />
                <FileTreeItem name="voluntarios.service.ts" icon="📄" indent={3} onClick={() => setActiveFile('voluntarios.service.ts')} active={activeFile === 'voluntarios.service.ts'} />
                <FileTreeItem name="voluntario-form.component.ts" icon="📄" indent={3} onClick={() => setActiveFile('voluntario-form.component.ts')} active={activeFile === 'voluntario-form.component.ts'} />
                <FileTreeItem name="validacao/" icon="📁" indent={2} />
                <FileTreeItem name="validacao.component.ts" icon="📄" indent={3} onClick={() => setActiveFile('validacao.component.ts')} active={activeFile === 'validacao.component.ts'} />
                <FileTreeItem name="shared/" icon="📁" indent={1} />
                <FileTreeItem name="cpf.validator.ts" icon="📄" indent={2} onClick={() => setActiveFile('cpf.validator.ts')} active={activeFile === 'cpf.validator.ts'} />
                <FileTreeItem name="status-badge.pipe.ts" icon="📄" indent={2} onClick={() => setActiveFile('status-badge.pipe.ts')} active={activeFile === 'status-badge.pipe.ts'} />
                <FileTreeItem name="environments/" icon="📁" indent={1} />
                <FileTreeItem name="environment.ts" icon="📄" indent={2} onClick={() => setActiveFile('environment.ts')} active={activeFile === 'environment.ts'} />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {activeFile && files[activeFile] ? (
              <CodeViewer code={files[activeFile].code} filename={activeFile} language={files[activeFile].lang} />
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-400">← Selecione um arquivo para visualizar o código</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== LARAVEL PAGE ====================
function LaravelPage({ activeFile, setActiveFile }: { activeFile: string; setActiveFile: (f: string) => void }) {
  const [tab, setTab] = useState('structure');
  
  const files: Record<string, { code: string; lang: string }> = {
    'routes/api.php': { code: laravelRoutes, lang: 'php' },
    'Models/Termo.php': { code: laravelModels.termo, lang: 'php' },
    'Models/Voluntario.php': { code: laravelModels.voluntario, lang: 'php' },
    'Models/User.php': { code: laravelModels.user, lang: 'php' },
    'TermoController.php': { code: laravelControllers.termoController, lang: 'php' },
    'AuthController.php': { code: laravelControllers.authController, lang: 'php' },
    'DashboardController.php': { code: laravelControllers.dashboardController, lang: 'php' },
    'GovBrSignatureService.php': { code: laravelServices.govBrSignatureService, lang: 'php' },
    'TermoService.php': { code: laravelServices.termoService, lang: 'php' },
    'PdfGeneratorService.php': { code: laravelServices.pdfGeneratorService, lang: 'php' },
    'AuditoriaService.php': { code: laravelServices.auditoriaService, lang: 'php' },
    'HashService.php': { code: laravelServices.hashService, lang: 'php' },
    'DocumentStorageService.php': { code: laravelServices.documentStorageService, lang: 'php' },
    'migrations': { code: laravelMigrations, lang: 'php' },
    'config/jwt.php': { code: laravelConfig.jwt, lang: 'php' },
    'config/govbr.php': { code: laravelConfig.govbr, lang: 'php' },
    '.env.example': { code: laravelConfig.env, lang: 'env' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200">
        {[
          { id: 'structure', label: '📁 Estrutura' },
          { id: 'code', label: '💻 Código' },
        ].map(t => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'structure' && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">Estrutura do Projeto Laravel</h3>
          <CodeViewer code={laravelStructure.root} filename="laravel-project-structure" />
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">🎮 Controllers</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• AuthController - JWT Auth</li>
                <li>• VoluntarioController - CRUD</li>
                <li>• PastoralController - CRUD</li>
                <li>• EventoController - CRUD</li>
                <li>• TermoController - Gestão completa</li>
                <li>• TermoTemplateController</li>
                <li>• DashboardController</li>
                <li>• ValidacaoController</li>
                <li>• AuditoriaController</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">⚙️ Services</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• TermoService - Lógica de termos</li>
                <li>• GovBrSignatureService - Assinatura</li>
                <li>• PdfGeneratorService - Geração PDF</li>
                <li>• DocumentStorageService - Storage</li>
                <li>• NotificationService - Notificações</li>
                <li>• AuditoriaService - Auditoria</li>
                <li>• HashService - Hash SHA-256</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">📦 Models</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• User (JWTSubject)</li>
                <li>• Diocese</li>
                <li>• Paroquia</li>
                <li>• Comunidade</li>
                <li>• Pastoral</li>
                <li>• Voluntario</li>
                <li>• Evento</li>
                <li>• Termo</li>
                <li>• TermoTemplate</li>
                <li>• TermoAssinatura</li>
                <li>• AuditoriaLog</li>
                <li>• Notificacao</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === 'code' && (
        <div className="flex gap-4">
          <div className="w-64 flex-shrink-0">
            <div className="card p-3 sticky top-0">
              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Arquivos</h4>
              <div className="space-y-0.5 max-h-[70vh] overflow-y-auto">
                <FileTreeItem name="routes/" icon="📁" />
                <FileTreeItem name="api.php" icon="📄" indent={1} onClick={() => setActiveFile('routes/api.php')} active={activeFile === 'routes/api.php'} />
                <FileTreeItem name="app/Models/" icon="📁" />
                <FileTreeItem name="Termo.php" icon="📄" indent={1} onClick={() => setActiveFile('Models/Termo.php')} active={activeFile === 'Models/Termo.php'} />
                <FileTreeItem name="Voluntario.php" icon="📄" indent={1} onClick={() => setActiveFile('Models/Voluntario.php')} active={activeFile === 'Models/Voluntario.php'} />
                <FileTreeItem name="User.php" icon="📄" indent={1} onClick={() => setActiveFile('Models/User.php')} active={activeFile === 'Models/User.php'} />
                <FileTreeItem name="Controllers/Api/" icon="📁" />
                <FileTreeItem name="TermoController.php" icon="📄" indent={1} onClick={() => setActiveFile('TermoController.php')} active={activeFile === 'TermoController.php'} />
                <FileTreeItem name="AuthController.php" icon="📄" indent={1} onClick={() => setActiveFile('AuthController.php')} active={activeFile === 'AuthController.php'} />
                <FileTreeItem name="DashboardController.php" icon="📄" indent={1} onClick={() => setActiveFile('DashboardController.php')} active={activeFile === 'DashboardController.php'} />
                <FileTreeItem name="Services/" icon="📁" />
                <FileTreeItem name="GovBrSignatureService.php" icon="📄" indent={1} onClick={() => setActiveFile('GovBrSignatureService.php')} active={activeFile === 'GovBrSignatureService.php'} />
                <FileTreeItem name="TermoService.php" icon="📄" indent={1} onClick={() => setActiveFile('TermoService.php')} active={activeFile === 'TermoService.php'} />
                <FileTreeItem name="PdfGeneratorService.php" icon="📄" indent={1} onClick={() => setActiveFile('PdfGeneratorService.php')} active={activeFile === 'PdfGeneratorService.php'} />
                <FileTreeItem name="AuditoriaService.php" icon="📄" indent={1} onClick={() => setActiveFile('AuditoriaService.php')} active={activeFile === 'AuditoriaService.php'} />
                <FileTreeItem name="HashService.php" icon="📄" indent={1} onClick={() => setActiveFile('HashService.php')} active={activeFile === 'HashService.php'} />
                <FileTreeItem name="DocumentStorageService.php" icon="📄" indent={1} onClick={() => setActiveFile('DocumentStorageService.php')} active={activeFile === 'DocumentStorageService.php'} />
                <FileTreeItem name="database/migrations/" icon="📁" />
                <FileTreeItem name="create_all_tables.php" icon="📄" indent={1} onClick={() => setActiveFile('migrations')} active={activeFile === 'migrations'} />
                <FileTreeItem name="config/" icon="📁" />
                <FileTreeItem name="jwt.php" icon="📄" indent={1} onClick={() => setActiveFile('config/jwt.php')} active={activeFile === 'config/jwt.php'} />
                <FileTreeItem name="govbr.php" icon="📄" indent={1} onClick={() => setActiveFile('config/govbr.php')} active={activeFile === 'config/govbr.php'} />
                <FileTreeItem name=".env.example" icon="📄" onClick={() => setActiveFile('.env.example')} active={activeFile === '.env.example'} />
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {activeFile && files[activeFile] ? (
              <CodeViewer code={files[activeFile].code} filename={activeFile} language={files[activeFile].lang} />
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-400">← Selecione um arquivo para visualizar o código</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== DATABASE PAGE ====================
function DatabasePage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🗄️ Migrations - SQL Server</h3>
        <CodeViewer code={laravelMigrations} filename="database/migrations/create_all_tables.php" language="php" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔗 Relacionamentos</h3>
        <CodeViewer code={`
dioceses
  └── paroquias (diocese_id FK)
        ├── comunidades (paroquia_id FK)
        ├── pastorais (paroquia_id FK, comunidade_id FK nullable)
        │     └── voluntarios (pastoral_id FK nullable)
        ├── voluntarios (paroquia_id FK, comunidade_id FK nullable)
        │     └── termos (voluntario_id FK)
        ├── eventos (paroquia_id FK, pastoral_id FK nullable)
        │     └── eventos_voluntarios (evento_id FK, voluntario_id FK)
        ├── termos (paroquia_id FK, pastoral_id FK nullable, evento_id FK nullable)
        │     ├── termo_assinaturas (termo_id FK)
        │     └── auditoria_logs (documento_id = termo.id)
        ├── termo_templates (paroquia_id FK nullable)
        └── users (paroquia_id FK nullable)
`} />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📊 Índices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { table: 'termos', indexes: ['paroquia_id', 'voluntario_id', 'status', 'codigo', '(data_fim, status)'] },
            { table: 'voluntarios', indexes: ['paroquia_id', 'pastoral_id', 'status', 'cpf (unique)'] },
            { table: 'eventos', indexes: ['paroquia_id', 'status'] },
            { table: 'auditoria_logs', indexes: ['documento_id', 'acao', 'data_hora'] },
            { table: 'termo_assinaturas', indexes: ['termo_id', 'status'] },
            { table: 'notificacoes', indexes: ['destinatario_id', 'lida'] },
          ].map(t => (
            <div key={t.table} className="bg-slate-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase">{t.table}</h4>
              <div className="mt-2 space-y-0.5">
                {t.indexes.map(idx => (
                  <p key={idx} className="text-xs text-slate-600 font-mono">📌 {idx}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== API PAGE ====================
function ApiPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🌐 Rotas da API REST</h3>
        <CodeViewer code={laravelRoutes} filename="routes/api.php" language="php" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📋 Endpoints Detalhados</h3>
        <div className="space-y-4">
          {[
            { group: 'Autenticação', endpoints: [
              { method: 'POST', path: '/api/v1/auth/login', desc: 'Login - retorna JWT token', auth: false },
              { method: 'POST', path: '/api/v1/auth/logout', desc: 'Logout - invalida token', auth: true },
              { method: 'POST', path: '/api/v1/auth/refresh', desc: 'Refresh JWT token', auth: true },
              { method: 'GET', path: '/api/v1/auth/me', desc: 'Dados do usuário autenticado', auth: true },
            ]},
            { group: 'Voluntários', endpoints: [
              { method: 'GET', path: '/api/v1/voluntarios', desc: 'Listar (com filtros)', auth: true },
              { method: 'POST', path: '/api/v1/voluntarios', desc: 'Criar voluntário', auth: true },
              { method: 'GET', path: '/api/v1/voluntarios/{id}', desc: 'Detalhar voluntário', auth: true },
              { method: 'PUT', path: '/api/v1/voluntarios/{id}', desc: 'Atualizar voluntário', auth: true },
              { method: 'DELETE', path: '/api/v1/voluntarios/{id}', desc: 'Remover (soft delete)', auth: true },
              { method: 'GET', path: '/api/v1/voluntarios/{id}/termos', desc: 'Termos do voluntário', auth: true },
            ]},
            { group: 'Pastorais', endpoints: [
              { method: 'GET', path: '/api/v1/pastorais', desc: 'Listar pastorais', auth: true },
              { method: 'POST', path: '/api/v1/pastorais', desc: 'Criar pastoral', auth: true },
              { method: 'GET', path: '/api/v1/pastorais/{id}', desc: 'Detalhar pastoral', auth: true },
              { method: 'PUT', path: '/api/v1/pastorais/{id}', desc: 'Atualizar pastoral', auth: true },
              { method: 'DELETE', path: '/api/v1/pastorais/{id}', desc: 'Remover pastoral', auth: true },
              { method: 'GET', path: '/api/v1/pastorais/{id}/voluntarios', desc: 'Voluntários da pastoral', auth: true },
            ]},
            { group: 'Eventos', endpoints: [
              { method: 'GET', path: '/api/v1/eventos', desc: 'Listar eventos', auth: true },
              { method: 'POST', path: '/api/v1/eventos', desc: 'Criar evento', auth: true },
              { method: 'GET', path: '/api/v1/eventos/{id}', desc: 'Detalhar evento', auth: true },
              { method: 'PUT', path: '/api/v1/eventos/{id}', desc: 'Atualizar evento', auth: true },
              { method: 'DELETE', path: '/api/v1/eventos/{id}', desc: 'Remover evento', auth: true },
              { method: 'POST', path: '/api/v1/eventos/{id}/voluntarios', desc: 'Vincular voluntário', auth: true },
            ]},
            { group: 'Termos', endpoints: [
              { method: 'GET', path: '/api/v1/termos', desc: 'Listar termos (filtros)', auth: true },
              { method: 'POST', path: '/api/v1/termos/anual', desc: 'Criar termo anual', auth: true },
              { method: 'POST', path: '/api/v1/termos/evento', desc: 'Criar termo de evento', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}', desc: 'Detalhar termo', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/gerar', desc: 'Gerar PDF', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/solicitar-assinatura', desc: 'Solicitar assinatura gov.br', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}/assinatura/status', desc: 'Status da assinatura', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/cancelar', desc: 'Cancelar termo', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/renovar', desc: 'Renovar termo', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}/pdf', desc: 'Download PDF', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}/auditoria', desc: 'Auditoria do termo', auth: true },
              { method: 'GET', path: '/api/v1/termos/assinatura/callback', desc: 'Callback gov.br OAuth', auth: false },
            ]},
            { group: 'Templates', endpoints: [
              { method: 'GET', path: '/api/v1/templates', desc: 'Listar templates', auth: true },
              { method: 'POST', path: '/api/v1/templates', desc: 'Criar template', auth: true },
              { method: 'GET', path: '/api/v1/templates/{id}', desc: 'Detalhar template', auth: true },
              { method: 'PUT', path: '/api/v1/templates/{id}', desc: 'Atualizar template', auth: true },
              { method: 'POST', path: '/api/v1/templates/{id}/ativar', desc: 'Ativar template', auth: true },
              { method: 'POST', path: '/api/v1/templates/{id}/desativar', desc: 'Desativar template', auth: true },
            ]},
            { group: 'Validação (Pública)', endpoints: [
              { method: 'GET', path: '/api/v1/validacao/{codigo}', desc: 'Validar termo por código', auth: false },
            ]},
            { group: 'Dashboard & Auditoria', endpoints: [
              { method: 'GET', path: '/api/v1/dashboard', desc: 'Estatísticas do dashboard', auth: true },
              { method: 'GET', path: '/api/v1/auditoria', desc: 'Logs de auditoria', auth: true },
            ]},
          ].map(group => (
            <div key={group.group}>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">{group.group}</h4>
              <div className="space-y-1">
                {group.endpoints.map((ep, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded text-xs">
                    <span className={`px-2 py-0.5 rounded font-bold text-white min-w-[50px] text-center ${
                      ep.method === 'GET' ? 'bg-green-500' : ep.method === 'POST' ? 'bg-blue-500' : ep.method === 'PUT' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>{ep.method}</span>
                    <span className="font-mono text-slate-700 flex-1">{ep.path}</span>
                    <span className="text-slate-400">{ep.desc}</span>
                    {ep.auth && <span className="badge bg-amber-100 text-amber-700">🔒 JWT</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== GOV.BR PAGE ====================
function GovBrPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6 border-blue-200 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🔐 Integração Assinatura Eletrônica gov.br</h3>
        <p className="text-sm text-blue-700">
          Baseado na documentação oficial: <a href="https://manual-integracao-assinatura-eletronica.servicos.gov.br/" target="_blank" className="underline">manual-integracao-assinatura-eletronica.servicos.gov.br</a>
        </p>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📋 Fluxo Oficial de Integração</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Credenciamento', desc: 'Gestor Público solicita credenciais via Serviço de Integração aos Produtos do Ecossistema da Conta Digital GOV.BR' },
            { step: 2, title: 'Autenticação OAuth 2.0', desc: 'Redirecionar usuário para: cas.iti.br/oauth2.0/authorize com scope=sign e conta Prata/Ouro' },
            { step: 3, title: 'Authorization Code', desc: 'gov.br retorna código de autorização via redirect_uri cadastrado' },
            { step: 4, title: 'Access Token', desc: 'POST cas.iti.br/oauth2.0/token trocando code por access_token' },
            { step: 5, title: 'Certificado Público', desc: 'GET assinatura-api.iti.br/externo/v2/certificadoPublico com Bearer token' },
            { step: 6, title: 'Assinatura PKCS#7', desc: 'POST assinatura-api.iti.br/externo/v2/assinarPKCS7 com hash SHA-256 do documento' },
            { step: 7, title: 'Incorporar no PDF', desc: 'Pacote PKCS#7 retornado é incorporado ao PDF como assinatura digital' },
            { step: 8, title: 'Validação', desc: 'Documento pode ser validado em validar.iti.gov.br (produção) ou validar.staging.iti.br (homologação)' },
          ].map(s => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">💻 GovBrSignatureService (Laravel)</h3>
        <CodeViewer code={laravelServices.govBrSignatureService} filename="app/Services/GovBrSignatureService.php" language="php" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔧 Configuração</h3>
        <CodeViewer code={laravelConfig.govbr} filename="config/govbr.php" language="php" />
      </div>

      <div className="card p-6 bg-yellow-50 border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Requisitos Importantes</h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• A API de Assinatura Eletrônica do gov.br é destinada a <strong>órgãos públicos</strong>.</li>
          <li>• Para uso por paróquias, é necessário credenciamento via <strong>Diocese/Cúria</strong> com domínio oficial.</li>
          <li>• O usuário precisa de conta gov.br nível <strong>Prata ou Ouro</strong>.</li>
          <li>• A aplicação deve estar hospedada em domínio oficial (gov.br, edu.br, etc.) para produção.</li>
          <li>• Em homologação, usar ambiente staging: sso.staging.acesso.gov.br</li>
          <li>• A arquitetura está preparada para integração quando credenciais forem obtidas.</li>
        </ul>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔄 Escopos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-700">sign</h4>
            <p className="text-xs text-slate-600 mt-1">Token de uso único. Permite assinar um único hash. Ideal para assinatura individual de documentos.</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-700">signature_session</h4>
            <p className="text-xs text-slate-600 mt-1">Token reutilizável. Permite múltiplas assinaturas em lote durante a validade do token.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SECURITY PAGE ====================
function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">🔒 Segurança</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Autenticação JWT (tymon/jwt-auth)</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Controle por perfil (RBAC) com Guards</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Isolamento por paróquia (multi-tenant)</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Middleware SetParoquiaContext</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Criptografia de dados sensíveis</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> URLs temporárias para documentos</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Hash SHA-256 para integridade</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Logs de auditoria imutáveis</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Validação de uploads</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Soft deletes para rastreabilidade</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> CORS configurado</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Rate limiting</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-slate-800 mb-4">📋 LGPD - Lei 13.709/2018</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Minimização de dados</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Finalidade definida e transparente</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Controle de acesso por perfil</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Política de retenção documental</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Histórico completo de operações</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Consentimento para uso de imagem</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Eliminação quando juridicamente aplicável</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Registro de tratamento (Art. 37)</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Dados sensíveis protegidos</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> CPF formatado e validado</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Auditoria de acesso a documentos</li>
            <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Cláusula LGPD nos templates</li>
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔐 Fluxo de Autenticação JWT</h3>
        <CodeViewer code={`
1. POST /api/v1/auth/login { email, password }
   → Valida credenciais
   → Gera JWT com claims: { sub, perfil, paroquia_id, nome }
   → Retorna: { token, token_type, expires_in, user }

2. Requests subsequentes:
   → Header: Authorization: Bearer {token}
   → JwtAuthenticate middleware valida token
   → SetParoquiaContext middleware define contexto

3. Refresh:
   → POST /api/v1/auth/refresh
   → Retorna novo token
   → TTL: 60 min, Refresh TTL: 14 dias

4. Logout:
   → POST /api/v1/auth/logout
   → Token é colocado na blacklist
`} />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🛡️ Middleware de Controle de Acesso</h3>
        <CodeViewer code={`<?php
// app/Http/Middleware/CheckPerfil.php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class CheckPerfil
{
    public function handle(Request $request, Closure $next, ...$perfis)
    {
        $user = Auth::user();

        if (!$user || !$user->hasAnyPerfil($perfis)) {
            abort(403, 'Acesso negado. Perfil não autorizado.');
        }

        return $next($request);
    }
}

// app/Http/Middleware/SetParoquiaContext.php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class SetParoquiaContext
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user->perfil === 'ADMIN_DIOCESE') {
            // Admin de diocese pode acessar qualquer paróquia
            $paroquiaId = $request->header('X-Paroquia-Id') ?? $user->paroquia_id;
        } else {
            // Demais perfis são limitados à sua paróquia
            $paroquiaId = $user->paroquia_id;
        }

        $request->attributes->set('paroquia_id', $paroquiaId);

        return $next($request);
    }
}`} filename="app/Http/Middleware/" language="php" />
      </div>
    </div>
  );
}

// ==================== INSTALL PAGE ====================
function InstallPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">⚙️ Instalação do Backend (Laravel)</h3>
        <CodeViewer code={`# 1. Clonar o repositório
git clone https://github.com/paroquia/voluntariado-paroquial-api.git
cd voluntariado-paroquial-api

# 2. Instalar dependências
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate

# 4. Configurar banco de dados (SQL Server)
# Editar .env com credenciais do SQL Server

# 5. Configurar JWT
php artisan jwt:secret

# 6. Executar migrations
php artisan migrate

# 7. Criar seeders (opcional)
php artisan db:seed

# 8. Iniciar servidor
php artisan serve

# 9. Iniciar queue worker (para jobs)
php artisan queue:work`} filename="terminal" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">⚙️ Instalação do Frontend (Angular)</h3>
        <CodeViewer code={`# 1. Instalar Angular CLI (se ainda não tiver)
npm install -g @angular/cli

# 2. Clonar o repositório
git clone https://github.com/paroquia/voluntariado-paroquial-frontend.git
cd voluntariado-paroquial-frontend

# 3. Instalar dependências
npm install

# 4. Configurar ambiente
# Editar src/environments/environment.ts com URL da API

# 5. Iniciar servidor de desenvolvimento
ng serve

# 6. Acessar em http://localhost:4200

# Build para produção
ng build --configuration production`} filename="terminal" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📦 Dependências do Backend</h3>
        <CodeViewer code={`// composer.json - dependências principais
{
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "tymon/jwt-auth": "^2.0",
        "barryvdh/laravel-dompdf": "^2.0",
        "league/flysystem-aws-s3-v3": "^3.0",
        "azure-oss/storage-blob": "^1.0",
        "guzzlehttp/guzzle": "^7.0"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/pint": "^1.0",
        "mockery/mockery": "^1.6",
        "phpunit/phpunit": "^11.0"
    }
}`} filename="composer.json" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📦 Dependências do Frontend</h3>
        <CodeViewer code={`// package.json - dependências principais
{
    "dependencies": {
        "@angular/animations": "^17.0.0",
        "@angular/common": "^17.0.0",
        "@angular/compiler": "^17.0.0",
        "@angular/core": "^17.0.0",
        "@angular/forms": "^17.0.0",
        "@angular/platform-browser": "^17.0.0",
        "@angular/platform-browser-dynamic": "^17.0.0",
        "@angular/router": "^17.0.0",
        "rxjs": "~7.8.0",
        "tslib": "^2.3.0",
        "zone.js": "~0.14.0"
    },
    "devDependencies": {
        "@angular-devkit/build-angular": "^17.0.0",
        "@angular/cli": "^17.0.0",
        "@angular/compiler-cli": "^17.0.0",
        "typescript": "~5.2.0",
        "tailwindcss": "^3.4.0"
    }
}`} filename="package.json" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🚀 Deploy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Backend</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• PHP 8.2+ com extensões necessárias</li>
              <li>• SQL Server 2019+</li>
              <li>• Nginx/Apache com PHP-FPM</li>
              <li>• Supervisor para queue workers</li>
              <li>• Cron para jobs agendados</li>
              <li>• SSL/TLS obrigatório</li>
            </ul>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Frontend</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Node.js 18+ para build</li>
              <li>• Nginx para servir arquivos estáticos</li>
              <li>• CDN para assets</li>
              <li>• Service Worker (PWA opcional)</li>
              <li>• SSL/TLS obrigatório</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-green-50 border-green-200">
        <h3 className="font-semibold text-green-800 mb-2">✅ Checklist de Produção</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>☐ Variáveis de ambiente configuradas</li>
          <li>☐ JWT_SECRET gerado e seguro</li>
          <li>☐ APP_DEBUG=false em produção</li>
          <li>☐ CORS configurado para domínio do frontend</li>
          <li>☐ SSL/TLS ativo em ambos os serviços</li>
          <li>☐ Credenciais gov.br obtidas e configuradas</li>
          <li>☐ Storage configurado (S3/Azure/Local)</li>
          <li>☐ Backup automático do banco de dados</li>
          <li>☐ Monitoramento de logs configurado</li>
          <li>☐ Rate limiting ativo</li>
          <li>☐ Política de retenção documental definida</li>
        </ul>
      </div>
    </div>
  );
}
