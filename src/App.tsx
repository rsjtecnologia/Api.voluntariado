import { useState } from 'react';

type Page = 'overview' | 'angular' | 'laravel' | 'database' | 'api' | 'govbr' | 'security' | 'install';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: { id: Page; label: string; icon: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: '🏠' },
    { id: 'angular', label: 'Frontend Angular', icon: '🅰️' },
    { id: 'laravel', label: 'Backend Laravel', icon: '🔺' },
    { id: 'database', label: 'Banco de Dados', icon: '🗄️' },
    { id: 'api', label: 'API REST', icon: '🌐' },
    { id: 'govbr', label: 'Integração gov.br', icon: '🔐' },
    { id: 'security', label: 'Segurança & LGPD', icon: '🛡️' },
    { id: 'install', label: 'Instalação', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
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
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-base font-semibold text-slate-800">
              {menuItems.find(m => m.id === currentPage)?.icon} {menuItems.find(m => m.id === currentPage)?.label}
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {currentPage === 'overview' && <OverviewPage />}
            {currentPage === 'angular' && <AngularPage />}
            {currentPage === 'laravel' && <LaravelPage />}
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

function CodeViewer({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {filename && (
        <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg">
          <span className="text-xs text-slate-400 font-mono">{filename}</span>
        </div>
      )}
      <button onClick={copy} className={`absolute top-2 right-2 px-2 py-1 text-xs rounded transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
      <pre className={`bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed font-mono ${filename ? 'rounded-t-none' : ''}`}>
        {code}
      </pre>
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-3xl">✝</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Gestão de Termos de Voluntariado Paroquial</h1>
        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
          Plataforma completa para cadastro de voluntários, geração de termos, assinatura eletrônica via gov.br e gestão documental.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">🅰️ Angular 17+</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">🔺 Laravel 11</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🔐 JWT Auth</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">🗄️ SQL Server</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">🎯 Objetivo</h3>
          <p className="text-sm text-slate-600">
            Permitir que a paróquia cadastre voluntários, vincule-os às pastorais e eventos, gere documentos PDF, 
            controle o ciclo de assinatura eletrônica via gov.br e mantenha auditoria completa.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-3">📋 Tipos de Termos</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>TVP</strong> - Termo de Voluntariado Pastoral (anual)</p>
            <p><strong>TVE</strong> - Termo de Voluntariado para Evento</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🏗️ Arquitetura do Sistema</h3>
        <CodeViewer code={`FRONTEND - Angular 17+ (Standalone Components)
├── Core Module
│   ├── Interceptors (JWT, Error Handling)
│   ├── Guards (Auth, Role-based)
│   └── Services (Auth, Notification)
├── Features (Lazy Loaded)
│   ├── Dashboard
│   ├── Voluntários
│   ├── Pastorais
│   ├── Eventos
│   ├── Termos
│   ├── Templates
│   ├── Auditoria
│   └── Validação
└── Shared (Components, Pipes, Validators)

BACKEND - Laravel 11 (API REST + JWT)
├── Controllers (RESTful)
├── Services (Business Logic)
│   ├── TermoService
│   ├── GovBrSignatureService
│   ├── PdfGeneratorService
│   └── AuditoriaService
├── Models (Eloquent ORM)
├── Middleware (JWT Auth, Paroquia Context)
└── Jobs (Queue for async tasks)

DATABASE - SQL Server
├── Dioceses → Paróquias → Comunidades
├── Pastorais → Voluntários → Termos
├── Eventos → Termos
└── Auditoria Logs`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔄 Ciclo de Vida do Termo</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO', 'ASSINADO'].map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-400">→</span>}
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">{s.replace(/_/g, ' ')}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">Status alternativos: RECUSADO | CANCELADO | EXPIRADO | ERRO_ASSINATURA</p>
      </div>
    </div>
  );
}

function AngularPage() {
  const [activeFile, setActiveFile] = useState('app.config.ts');
  
  const files: Record<string, string> = {
    'app.config.ts': `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ]
};`,

    'app.routes.ts': `import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadComponent: () => import('./features/auth/login.component') },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component') },
      { path: 'voluntarios', loadChildren: () => import('./features/voluntarios/voluntarios.routes') },
      { path: 'pastorais', loadChildren: () => import('./features/pastorais/pastorais.routes') },
      { path: 'eventos', loadChildren: () => import('./features/eventos/eventos.routes') },
      { path: 'termos', loadChildren: () => import('./features/termos/termos.routes') },
      { path: 'validar-termo/:codigo', loadComponent: () => import('./features/validacao/validacao.component') }
    ]
  }
];`,

    'auth.service.ts': `import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = \`\${environment.apiUrl}/auth\`;
  private currentUserSignal = signal<any>(null);
  currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const user = localStorage.getItem('user');
    if (user) this.currentUserSignal.set(JSON.parse(user));
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(\`\${this.apiUrl}/login\`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSignal.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}`,

    'termos.service.ts': `import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TermosService {
  private readonly apiUrl = \`\${environment.apiUrl}/termos\`;

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.tipo) params = params.set('tipo', filters.tipo);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(\`\${this.apiUrl}/\${id}\`);
  }

  gerarPdf(id: number): Observable<Blob> {
    return this.http.post(\`\${this.apiUrl}/\${id}/gerar\`, {}, { responseType: 'blob' });
  }

  solicitarAssinatura(id: number): Observable<{ redirect_url: string }> {
    return this.http.post<{ redirect_url: string }>(\`\${this.apiUrl}/\${id}/solicitar-assinatura\`, {});
  }

  getStatusAssinatura(id: number): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(\`\${this.apiUrl}/\${id}/assinatura/status\`);
  }

  renovar(id: number): Observable<any> {
    return this.http.post<any>(\`\${this.apiUrl}/\${id}/renovar\`, {});
  }
}`,

    'dashboard.component.ts': `import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stats = signal<any>(null);
  loading = signal(true);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}`,

    'validacao.component.ts': `import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-validacao',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-4">Validação de Termo</h1>
      
      @if (loading()) {
        <p>Verificando...</p>
      } @else if (termo()) {
        <div class="p-6 bg-white rounded-lg border">
          <h2 class="text-xl font-semibold">
            {{ termo()!.status === 'ASSINADO' ? '✓ Documento Válido' : '✗ Documento Inválido' }}
          </h2>
          <p class="mt-2">Código: {{ termo()!.codigo }}</p>
          <p>Status: {{ termo()!.status }}</p>
        </div>
      } @else {
        <p>Documento não encontrado</p>
      }
    </div>
  \`
})
export class ValidacaoComponent implements OnInit {
  codigo = signal('');
  termo = signal<any>(null);
  loading = signal(true);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.codigo.set(this.route.snapshot.paramMap.get('codigo') || '');
    if (this.codigo()) this.validar();
  }

  private validar(): void {
    this.http.get(\`\${environment.apiUrl}/validacao/\${this.codigo()}\`).subscribe({
      next: (termo) => {
        this.termo.set(termo);
        this.loading.set(false);
      },
      error: () => {
        this.termo.set(null);
        this.loading.set(false);
      }
    });
  }
}`,

    'environment.ts': `export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  govBrAuthUrl: 'https://sso.staging.acesso.gov.br',
  govBrClientId: 'SEU_CLIENT_ID',
  govBrRedirectUri: 'http://localhost:4200/auth/callback',
};`
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📁 Estrutura do Projeto Angular</h3>
        <CodeViewer code={`src/
├── app/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── core/
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       └── notification.service.ts
│   ├── features/
│   │   ├── auth/
│   │   │   └── login.component.ts
│   │   ├── dashboard/
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.service.ts
│   │   │   └── dashboard.model.ts
│   │   ├── voluntarios/
│   │   │   ├── voluntarios.routes.ts
│   │   │   ├── voluntarios-list/
│   │   │   └── voluntario-form/
│   │   ├── pastorais/
│   │   ├── eventos/
│   │   ├── termos/
│   │   │   ├── termos.routes.ts
│   │   │   ├── termos.service.ts
│   │   │   ├── termos-list/
│   │   │   ├── termo-detail/
│   │   │   └── termo-assinatura/
│   │   ├── templates/
│   │   ├── auditoria/
│   │   └── validacao/
│   │       └── validacao.component.ts
│   └── shared/
│       ├── pipes/
│       └── validators/
└── environments/
    ├── environment.ts
    └── environment.prod.ts`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">💻 Código-Fonte</h3>
        <div className="flex gap-4">
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {Object.keys(files).map(file => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    activeFile === file ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📄 {file}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <CodeViewer code={files[activeFile]} filename={activeFile} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LaravelPage() {
  const [activeFile, setActiveFile] = useState('routes/api.php');
  
  const files: Record<string, string> = {
    'routes/api.php': `<?php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\{AuthController, VoluntarioController, PastoralController, EventoController, TermoController, DashboardController, ValidacaoController};

Route::prefix('v1')->group(function () {
    // Público
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/validacao/{codigo}', [ValidacaoController::class, 'validar']);
    
    // Autenticado (JWT)
    Route::middleware('jwt.auth')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        Route::get('/dashboard', [DashboardController::class, 'stats']);
        
        Route::apiResource('/voluntarios', VoluntarioController::class);
        Route::apiResource('/pastorais', PastoralController::class);
        Route::apiResource('/eventos', EventoController::class);
        
        Route::get('/termos', [TermoController::class, 'index']);
        Route::post('/termos/anual', [TermoController::class, 'storeAnual']);
        Route::post('/termos/evento', [TermoController::class, 'storeEvento']);
        Route::get('/termos/{id}', [TermoController::class, 'show']);
        Route::post('/termos/{id}/gerar', [TermoController::class, 'gerarPdf']);
        Route::post('/termos/{id}/solicitar-assinatura', [TermoController::class, 'solicitarAssinatura']);
        Route::get('/termos/{id}/assinatura/status', [TermoController::class, 'statusAssinatura']);
        Route::post('/termos/{id}/cancelar', [TermoController::class, 'cancelar']);
        Route::post('/termos/{id}/renovar', [TermoController::class, 'renovar']);
        Route::get('/termos/{id}/pdf', [TermoController::class, 'downloadPdf']);
    });
});`,

    'Models/Termo.php': `<?php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Termo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'codigo', 'tipo', 'voluntario_id', 'pastoral_id', 'evento_id',
        'paroquia_id', 'data_inicio', 'data_fim', 'status', 'template_id',
        'versao', 'hash_documento', 'hash_documento_assinado',
        'data_geracao', 'data_assinatura', 'assinatura_govbr_id',
        'documento_url', 'documento_assinado_url'
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'data_geracao' => 'date',
        'data_assinatura' => 'datetime',
    ];

    public function voluntario() { return $this->belongsTo(Voluntario::class); }
    public function pastoral() { return $this->belongsTo(Pastoral::class); }
    public function evento() { return $this->belongsTo(Evento::class); }
    public function paroquia() { return $this->belongsTo(Paroquia::class); }
    public function template() { return $this->belongsTo(TermoTemplate::class, 'template_id'); }

    public static function gerarCodigo(string $tipo, int $paroquiaId): string
    {
        $prefixo = $tipo === 'ANUAL' ? 'TVP' : 'TVE';
        $ano = date('Y');
        $ultimo = self::where('paroquia_id', $paroquiaId)
            ->where('codigo', 'like', "{$prefixo}-{$ano}-%")
            ->orderBy('codigo', 'desc')
            ->first();
        
        $seq = $ultimo ? intval(substr($ultimo->codigo, -6)) + 1 : 1;
        return sprintf('%s-%s-%06d', $prefixo, $ano, $seq);
    }
}`,

    'Controllers/TermoController.php': `<?php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Termo;
use App\\Services\\{TermoService, GovBrSignatureService, AuditoriaService};
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class TermoController extends Controller
{
    public function __construct(
        private TermoService $termoService,
        private GovBrSignatureService $signatureService,
        private AuditoriaService $auditoriaService
    ) {}

    public function index(Request $request)
    {
        $query = Termo::with(['voluntario', 'pastoral', 'evento'])
            ->where('paroquia_id', $request->attributes->get('paroquia_id'));

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('tipo')) $query->where('tipo', $request->tipo);

        return response()->json(['data' => $query->paginate(15)]);
    }

    public function storeAnual(Request $request)
    {
        $validated = $request->validate([
            'voluntario_id' => 'required|exists:voluntarios,id',
            'pastoral_id' => 'required|exists:pastorais,id',
            'template_id' => 'required|exists:termo_templates,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
        ]);

        $termo = $this->termoService->criarTermoAnual($validated, $request->attributes->get('paroquia_id'));
        
        $this->auditoriaService->registrar('TERMO_CRIADO', Auth::user()->nome, $termo->id);

        return response()->json($termo, 201);
    }

    public function solicitarAssinatura(int $id)
    {
        $termo = Termo::findOrFail($id);
        
        if ($termo->status !== 'GERADO') {
            return response()->json(['message' => 'Status inválido'], 422);
        }

        $signatureRequest = $this->signatureService->criarSolicitacaoAssinatura($termo);

        $termo->update([
            'status' => 'AGUARDANDO_ASSINATURA',
            'data_solicitacao_assinatura' => now(),
            'assinatura_govbr_id' => $signatureRequest['signature_id'],
        ]);

        return response()->json(['redirect_url' => $signatureRequest['auth_url']]);
    }

    public function renovar(int $id)
    {
        $termo = Termo::findOrFail($id);
        $novoTermo = $this->termoService->renovarTermo($termo);
        
        return response()->json($novoTermo, 201);
    }
}`,

    'Services/GovBrSignatureService.php': `<?php
namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Str;

/**
 * Integração com API de Assinatura Eletrônica gov.br
 * Documentação: https://manual-integracao-assinatura-eletronica.servicos.gov.br/
 */
class GovBrSignatureService
{
    private string $authUrl;
    private string $apiUrl;
    private string $clientId;
    private string $redirectUri;

    public function __construct()
    {
        $this->authUrl = config('govbr.auth_url');
        $this->apiUrl = config('govbr.api_url');
        $this->clientId = config('govbr.client_id');
        $this->redirectUri = config('govbr.redirect_uri');
    }

    public function criarSolicitacaoAssinatura($termo): array
    {
        $state = Str::uuid()->toString();
        
        cache()->put("signature:{$state}", [
            'termo_id' => $termo->id,
            'hash' => $termo->hash_documento,
        ], now()->addMinutes(30));

        $authUrl = $this->authUrl . '/oauth2.0/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => 'sign',
            'state' => $state,
        ]);

        return [
            'auth_url' => $authUrl,
            'signature_id' => $state,
        ];
    }

    public function trocarCodePorToken(string $code): array
    {
        $response = Http::asForm()->post($this->authUrl . '/oauth2.0/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => config('govbr.client_secret'),
        ]);

        return $response->json();
    }

    public function obterAssinaturaPKCS7(string $accessToken, string $hash): string
    {
        $response = Http::withToken($accessToken)
            ->post($this->apiUrl . '/externo/v2/assinarPKCS7', [
                'digestAlgorithm' => 'SHA-256',
                'hash' => $hash,
            ]);

        return $response->json()['signedHash'];
    }
}`,

    'Services/TermoService.php': `<?php
namespace App\\Services;

use App\\Models\\Termo;
use Illuminate\\Support\\Facades\\DB;

class TermoService
{
    public function __construct(
        private PdfGeneratorService $pdfService,
        private HashService $hashService,
        private DocumentStorageService $storageService
    ) {}

    public function criarTermoAnual(array $data, int $paroquiaId): Termo
    {
        return DB::transaction(function () use ($data, $paroquiaId) {
            return Termo::create([
                'codigo' => Termo::gerarCodigo('ANUAL', $paroquiaId),
                'tipo' => 'ANUAL',
                'voluntario_id' => $data['voluntario_id'],
                'pastoral_id' => $data['pastoral_id'],
                'paroquia_id' => $paroquiaId,
                'data_inicio' => $data['data_inicio'],
                'data_fim' => $data['data_fim'],
                'status' => 'RASCUNHO',
                'template_id' => $data['template_id'],
                'versao' => 1,
            ]);
        });
    }

    public function gerarDocumento(Termo $termo): Termo
    {
        return DB::transaction(function () use ($termo) {
            $pdfContent = $this->pdfService->gerarPdf($termo);
            $hash = $this->hashService->calcularHash($pdfContent);
            $url = $this->storageService->upload($pdfContent, "termos/{$termo->codigo}.pdf");

            $termo->update([
                'status' => 'GERADO',
                'hash_documento' => $hash,
                'data_geracao' => now(),
                'documento_url' => $url,
            ]);

            return $termo->fresh();
        });
    }

    public function renovarTermo(Termo $termoAntigo): Termo
    {
        return DB::transaction(function () use ($termoAntigo) {
            $termoAntigo->update(['status' => 'EXPIRADO']);

            return $this->criarTermoAnual([
                'voluntario_id' => $termoAntigo->voluntario_id,
                'pastoral_id' => $termoAntigo->pastoral_id,
                'template_id' => $termoAntigo->template_id,
                'data_inicio' => now()->format('Y-m-d'),
                'data_fim' => now()->addYear()->format('Y-m-d'),
            ], $termoAntigo->paroquia_id);
        });
    }
}`,

    'migrations/create_tables.php': `<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dioceses', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('cidade');
            $table->string('estado', 2);
            $table->timestamps();
        });

        Schema::create('paroquias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diocese_id')->constrained();
            $table->string('nome');
            $table->string('endereco')->nullable();
            $table->string('padroeiro')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('voluntarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->constrained();
            $table->foreignId('pastoral_id')->nullable()->constrained();
            $table->string('nome_completo');
            $table->string('cpf', 11)->unique();
            $table->date('data_nascimento');
            $table->string('email');
            $table->string('telefone');
            $table->date('data_inicio');
            $table->enum('status', ['ATIVO', 'INATIVO', 'PENDENTE']);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('termos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->enum('tipo', ['ANUAL', 'EVENTO']);
            $table->foreignId('voluntario_id')->constrained();
            $table->foreignId('pastoral_id')->nullable()->constrained();
            $table->foreignId('evento_id')->nullable()->constrained();
            $table->foreignId('paroquia_id')->constrained();
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->enum('status', ['RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA', 'ASSINADO', 'RECUSADO', 'EXPIRADO']);
            $table->foreignId('template_id')->constrained('termo_templates');
            $table->integer('versao')->default(1);
            $table->string('hash_documento', 64)->nullable();
            $table->string('hash_documento_assinado', 64)->nullable();
            $table->date('data_geracao')->nullable();
            $table->timestamp('data_assinatura')->nullable();
            $table->string('assinatura_govbr_id')->nullable();
            $table->string('documento_url')->nullable();
            $table->string('documento_assinado_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
            $table->index('status');
        });

        Schema::create('auditoria_logs', function (Blueprint $table) {
            $table->id();
            $table->string('usuario');
            $table->timestamp('data_hora');
            $table->string('ip')->nullable();
            $table->string('acao');
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->string('status_anterior')->nullable();
            $table->string('status_novo')->nullable();
            $table->enum('resultado', ['SUCESSO', 'ERRO']);
            $table->text('mensagem')->nullable();
            $table->timestamps();
        });
    }
};`,

    'config/govbr.php': `<?php
return [
    'environment' => env('GOVBR_ENVIRONMENT', 'staging'),
    
    'auth_url' => env('GOVBR_ENVIRONMENT') === 'production'
        ? 'https://sso.acesso.gov.br'
        : 'https://sso.staging.acesso.gov.br',
    
    'api_url' => env('GOVBR_ENVIRONMENT') === 'production'
        ? 'https://assinatura-api.iti.br'
        : 'https://cas.staging.iti.br',
    
    'client_id' => env('GOVBR_CLIENT_ID'),
    'client_secret' => env('GOVBR_CLIENT_SECRET'),
    'redirect_uri' => env('GOVBR_REDIRECT_URI'),
    'scope' => env('GOVBR_SCOPE', 'sign'),
];`,

    '.env.example': `APP_NAME="Voluntariado Paroquial"
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000

DB_CONNECTION=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_DATABASE=voluntariado_paroquial
DB_USERNAME=sa
DB_PASSWORD=

JWT_SECRET=your-jwt-secret
JWT_TTL=60

GOVBR_ENVIRONMENT=staging
GOVBR_CLIENT_ID=your-client-id
GOVBR_CLIENT_SECRET=your-client-secret
GOVBR_REDIRECT_URI=http://localhost:8000/api/v1/termos/assinatura/callback`
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📁 Estrutura do Projeto Laravel</h3>
        <CodeViewer code={`app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php
│   │   ├── VoluntarioController.php
│   │   ├── PastoralController.php
│   │   ├── EventoController.php
│   │   ├── TermoController.php
│   │   ├── DashboardController.php
│   │   └── ValidacaoController.php
│   └── Middleware/
│       ├── JwtAuthenticate.php
│       └── SetParoquiaContext.php
├── Models/
│   ├── User.php (implements JWTSubject)
│   ├── Diocese.php
│   ├── Paroquia.php
│   ├── Voluntario.php
│   ├── Pastoral.php
│   ├── Evento.php
│   ├── Termo.php
│   └── AuditoriaLog.php
├── Services/
│   ├── TermoService.php
│   ├── GovBrSignatureService.php
│   ├── PdfGeneratorService.php
│   ├── HashService.php
│   ├── DocumentStorageService.php
│   └── AuditoriaService.php
└── Jobs/
    ├── GerarTermoPdfJob.php
    └── EnviarNotificacaoJob.php

config/
├── jwt.php
└── govbr.php

database/migrations/
└── create_tables.php

routes/
└── api.php`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">💻 Código-Fonte</h3>
        <div className="flex gap-4">
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {Object.keys(files).map(file => (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    activeFile === file ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  📄 {file}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <CodeViewer code={files[activeFile]} filename={activeFile} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabasePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🗄️ Modelo de Dados</h3>
        <CodeViewer code={`dioceses
  └── paroquias (diocese_id FK)
        ├── comunidades (paroquia_id FK)
        ├── pastorais (paroquia_id FK)
        │     └── voluntarios (pastoral_id FK)
        ├── voluntarios (paroquia_id FK)
        │     └── termos (voluntario_id FK)
        ├── eventos (paroquia_id FK)
        │     └── eventos_voluntarios
        ├── termos (paroquia_id FK)
        │     ├── termo_assinaturas (termo_id FK)
        │     └── auditoria_logs (documento_id)
        └── termo_templates (paroquia_id FK)`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📊 Tabelas Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'termos', fields: ['id', 'codigo (unique)', 'tipo', 'voluntario_id', 'pastoral_id', 'evento_id', 'paroquia_id', 'data_inicio', 'data_fim', 'status', 'template_id', 'versao', 'hash_documento', 'hash_documento_assinado', 'data_geracao', 'data_assinatura', 'assinatura_govbr_id', 'documento_url', 'documento_assinado_url'] },
            { name: 'voluntarios', fields: ['id', 'paroquia_id', 'pastoral_id', 'nome_completo', 'cpf (unique)', 'data_nascimento', 'email', 'telefone', 'data_inicio', 'status'] },
            { name: 'pastorais', fields: ['id', 'paroquia_id', 'nome', 'descricao', 'coordenador', 'email', 'status'] },
            { name: 'eventos', fields: ['id', 'paroquia_id', 'nome', 'descricao', 'data_inicial', 'data_final', 'local', 'coordenador', 'status'] },
            { name: 'auditoria_logs', fields: ['id', 'usuario', 'data_hora', 'ip', 'acao', 'documento_id', 'status_anterior', 'status_novo', 'resultado', 'mensagem'] },
          ].map(table => (
            <div key={table.name} className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase mb-2">{table.name}</h4>
              <div className="space-y-1">
                {table.fields.map(field => (
                  <p key={field} className="text-xs text-slate-600 font-mono">{field}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApiPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🌐 Endpoints da API REST</h3>
        <div className="space-y-4">
          {[
            { group: 'Autenticação', endpoints: [
              { method: 'POST', path: '/api/v1/auth/login', desc: 'Login - retorna JWT', auth: false },
              { method: 'POST', path: '/api/v1/auth/logout', desc: 'Logout', auth: true },
              { method: 'GET', path: '/api/v1/auth/me', desc: 'Dados do usuário', auth: true },
            ]},
            { group: 'Termos', endpoints: [
              { method: 'GET', path: '/api/v1/termos', desc: 'Listar termos', auth: true },
              { method: 'POST', path: '/api/v1/termos/anual', desc: 'Criar termo anual', auth: true },
              { method: 'POST', path: '/api/v1/termos/evento', desc: 'Criar termo evento', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}', desc: 'Detalhar termo', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/gerar', desc: 'Gerar PDF', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/solicitar-assinatura', desc: 'Solicitar assinatura gov.br', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}/assinatura/status', desc: 'Status assinatura', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/cancelar', desc: 'Cancelar termo', auth: true },
              { method: 'POST', path: '/api/v1/termos/{id}/renovar', desc: 'Renovar termo', auth: true },
              { method: 'GET', path: '/api/v1/termos/{id}/pdf', desc: 'Download PDF', auth: true },
            ]},
            { group: 'CRUDs', endpoints: [
              { method: 'GET', path: '/api/v1/voluntarios', desc: 'Listar voluntários', auth: true },
              { method: 'POST', path: '/api/v1/voluntarios', desc: 'Criar voluntário', auth: true },
              { method: 'GET', path: '/api/v1/voluntarios/{id}', desc: 'Detalhar voluntário', auth: true },
              { method: 'PUT', path: '/api/v1/voluntarios/{id}', desc: 'Atualizar voluntário', auth: true },
              { method: 'DELETE', path: '/api/v1/voluntarios/{id}', desc: 'Remover voluntário', auth: true },
              { method: 'GET', path: '/api/v1/pastorais', desc: 'Listar pastorais', auth: true },
              { method: 'POST', path: '/api/v1/pastorais', desc: 'Criar pastoral', auth: true },
              { method: 'GET', path: '/api/v1/eventos', desc: 'Listar eventos', auth: true },
              { method: 'POST', path: '/api/v1/eventos', desc: 'Criar evento', auth: true },
            ]},
            { group: 'Público', endpoints: [
              { method: 'GET', path: '/api/v1/validacao/{codigo}', desc: 'Validar termo', auth: false },
              { method: 'GET', path: '/api/v1/dashboard', desc: 'Estatísticas', auth: true },
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
                    {ep.auth && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px]">🔒 JWT</span>}
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

function GovBrPage() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">🔐 Integração Assinatura Eletrônica gov.br</h3>
        <p className="text-sm text-blue-700">
          Baseado na documentação oficial: <a href="https://manual-integracao-assinatura-eletronica.servicos.gov.br/" target="_blank" className="underline">manual-integracao-assinatura-eletronica.servicos.gov.br</a>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📋 Fluxo Oficial</h3>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Credenciamento', desc: 'Solicitar credenciais via Serviço de Integração gov.br' },
            { step: 2, title: 'OAuth 2.0', desc: 'Redirecionar para: cas.iti.br/oauth2.0/authorize (conta Prata/Ouro)' },
            { step: 3, title: 'Authorization Code', desc: 'gov.br retorna código via redirect_uri' },
            { step: 4, title: 'Access Token', desc: 'POST cas.iti.br/oauth2.0/token' },
            { step: 5, title: 'Assinatura PKCS#7', desc: 'POST assinatura-api.iti.br/externo/v2/assinarPKCS7 com hash SHA-256' },
            { step: 6, title: 'Validação', desc: 'Documento validável em validar.iti.gov.br' },
          ].map(s => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{s.step}</div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                <p className="text-xs text-slate-600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">💻 GovBrSignatureService</h3>
        <CodeViewer code={`<?php
class GovBrSignatureService
{
    public function criarSolicitacaoAssinatura($termo): array
    {
        $state = Str::uuid()->toString();
        
        cache()->put("signature:{$state}", [
            'termo_id' => $termo->id,
            'hash' => $termo->hash_documento,
        ], now()->addMinutes(30));

        $authUrl = config('govbr.auth_url') . '/oauth2.0/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => config('govbr.client_id'),
            'redirect_uri' => config('govbr.redirect_uri'),
            'scope' => 'sign',
            'state' => $state,
        ]);

        return ['auth_url' => $authUrl, 'signature_id' => $state];
    }

    public function trocarCodePorToken(string $code): array
    {
        $response = Http::asForm()->post(config('govbr.auth_url') . '/oauth2.0/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => config('govbr.redirect_uri'),
            'client_id' => config('govbr.client_id'),
            'client_secret' => config('govbr.client_secret'),
        ]);

        return $response->json();
    }

    public function obterAssinaturaPKCS7(string $accessToken, string $hash): string
    {
        $response = Http::withToken($accessToken)
            ->post(config('govbr.api_url') . '/externo/v2/assinarPKCS7', [
                'digestAlgorithm' => 'SHA-256',
                'hash' => $hash,
            ]);

        return $response->json()['signedHash'];
    }
}`} />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Requisitos Importantes</h3>
        <ul className="text-sm text-yellow-700 space-y-2">
          <li>• API destinada a <strong>órgãos públicos</strong></li>
          <li>• Necessário credenciamento via Diocese/Cúria com domínio oficial</li>
          <li>• Usuário precisa conta gov.br nível <strong>Prata ou Ouro</strong></li>
          <li>• Aplicação em domínio oficial (gov.br, edu.br, etc.) para produção</li>
        </ul>
      </div>
    </div>
  );
}

function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">🔒 Segurança</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>✓ Autenticação JWT (tymon/jwt-auth)</li>
            <li>✓ Controle por perfil (RBAC)</li>
            <li>✓ Isolamento por paróquia (multi-tenant)</li>
            <li>✓ Middleware SetParoquiaContext</li>
            <li>✓ Hash SHA-256 para integridade</li>
            <li>✓ Logs de auditoria imutáveis</li>
            <li>✓ URLs temporárias para documentos</li>
            <li>✓ Soft deletes para rastreabilidade</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-4">📋 LGPD</h3>
          <ul className="text-sm text-slate-700 space-y-2">
            <li>✓ Minimização de dados</li>
            <li>✓ Finalidade transparente</li>
            <li>✓ Controle de acesso por perfil</li>
            <li>✓ Política de retenção</li>
            <li>✓ Histórico completo</li>
            <li>✓ Consentimento para imagem</li>
            <li>✓ Eliminação quando aplicável</li>
            <li>✓ Cláusula LGPD nos templates</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">👥 Perfis de Usuário</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { perfil: 'ADMIN_DIOCESE', desc: 'Acesso total' },
            { perfil: 'ADMIN_PAROQUIA', desc: 'Administra paróquia' },
            { perfil: 'COORDENADOR_PASTORAL', desc: 'Gerencia pastoral' },
            { perfil: 'RESPONSAVEL_EVENTO', desc: 'Gerencia eventos' },
            { perfil: 'SECRETARIA', desc: 'Operações admin' },
            { perfil: 'VOLUNTARIO', desc: 'Acesso próprio' },
            { perfil: 'AUDITOR', desc: 'Consulta logs' },
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

function InstallPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">⚙️ Instalação Backend (Laravel)</h3>
        <CodeViewer code={`# 1. Clonar repositório
git clone https://github.com/paroquia/voluntariado-api.git
cd voluntariado-api

# 2. Instalar dependências
composer install

# 3. Configurar ambiente
cp .env.example .env
php artisan key:generate
php artisan jwt:secret

# 4. Configurar SQL Server no .env

# 5. Executar migrations
php artisan migrate

# 6. Iniciar servidor
php artisan serve

# 7. Queue worker (jobs assíncronos)
php artisan queue:work`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">⚙️ Instalação Frontend (Angular)</h3>
        <CodeViewer code={`# 1. Instalar Angular CLI
npm install -g @angular/cli

# 2. Clonar repositório
git clone https://github.com/paroquia/voluntariado-frontend.git
cd voluntariado-frontend

# 3. Instalar dependências
npm install

# 4. Configurar environment.ts com URL da API

# 5. Iniciar desenvolvimento
ng serve

# 6. Acessar http://localhost:4200

# Build produção
ng build --configuration production`} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">📦 Dependências</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Backend (composer.json)</h4>
            <CodeViewer code={`{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "tymon/jwt-auth": "^2.0",
    "barryvdh/laravel-dompdf": "^2.0",
    "guzzlehttp/guzzle": "^7.0"
  }
}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-2">Frontend (package.json)</h4>
            <CodeViewer code={`{
  "dependencies": {
    "@angular/core": "^17.0.0",
    "@angular/router": "^17.0.0",
    "@angular/forms": "^17.0.0",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "typescript": "~5.2.0"
  }
}`} />
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-semibold text-green-800 mb-2">✅ Checklist Produção</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>☐ Variáveis de ambiente configuradas</li>
          <li>☐ JWT_SECRET seguro</li>
          <li>☐ APP_DEBUG=false</li>
          <li>☐ CORS configurado</li>
          <li>☐ SSL/TLS ativo</li>
          <li>☐ Credenciais gov.br obtidas</li>
          <li>☐ Backup automático</li>
          <li>☐ Monitoramento de logs</li>
        </ul>
      </div>
    </div>
  );
}
