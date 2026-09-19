// Código-fonte Angular - Frontend

export const angularStructure = {
  root: `voluntariado-paroquial-frontend/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── .editorconfig
├── .gitignore
├── README.md
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo-paroquia.png
│   │   │   └── govbr-logo.svg
│   │   └── i18n/
│   │       └── pt-BR.json
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       ├── app.component.scss
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/
│       ├── shared/
│       └── features/`,

  appConfig: `// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInterceptorsFromDi } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([])
    ),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
};`,

  appRoutes: `// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'voluntarios',
        canActivate: [roleGuard(['ADMIN_PAROQUIA', 'SECRETARIA', 'COORDENADOR_PASTORAL'])],
        loadChildren: () => import('./features/voluntarios/voluntarios.routes').then(m => m.VOLUNTARIOS_ROUTES)
      },
      {
        path: 'pastorais',
        canActivate: [roleGuard(['ADMIN_PAROQUIA', 'SECRETARIA'])],
        loadChildren: () => import('./features/pastorais/pastorais.routes').then(m => m.PASTORAIS_ROUTES)
      },
      {
        path: 'eventos',
        canActivate: [roleGuard(['ADMIN_PAROQUIA', 'RESPONSAVEL_EVENTO'])],
        loadChildren: () => import('./features/eventos/eventos.routes').then(m => m.EVENTOS_ROUTES)
      },
      {
        path: 'termos',
        loadChildren: () => import('./features/termos/termos.routes').then(m => m.TERMOS_ROUTES)
      },
      {
        path: 'templates',
        canActivate: [roleGuard(['ADMIN_PAROQUIA', 'ADMIN_DIOCESE'])],
        loadChildren: () => import('./features/templates/templates.routes').then(m => m.TEMPLATES_ROUTES)
      },
      {
        path: 'auditoria',
        canActivate: [roleGuard(['ADMIN_PAROQUIA', 'AUDITOR'])],
        loadChildren: () => import('./features/auditoria/auditoria.routes').then(m => m.AUDITORIA_ROUTES)
      },
      {
        path: 'validar-termo/:codigo',
        loadComponent: () => import('./features/validacao/validacao.component').then(m => m.ValidacaoComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];`,
};

export const angularCore = {
  authInterceptor: `// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: \`Bearer \${token}\`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}`,

  errorInterceptor: `// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private notification: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.notification.error('Sessão expirada. Faça login novamente.');
            this.router.navigate(['/auth/login']);
            break;
          case 403:
            this.notification.error('Você não tem permissão para esta ação.');
            break;
          case 404:
            this.notification.error('Recurso não encontrado.');
            break;
          case 422:
            const errors = error.error.errors;
            if (errors) {
              Object.values(errors).forEach((msgs: any) => {
                msgs.forEach((msg: string) => this.notification.error(msg));
              });
            }
            break;
          case 500:
            this.notification.error('Erro interno do servidor. Tente novamente.');
            break;
        }
        return throwError(() => error);
      })
    );
  }
}`,

  authGuard: `// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};`,

  roleGuard: `// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUser();

    if (user && allowedRoles.includes(user.perfil)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};`,

  authService: `// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, LoginResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = \`\${environment.apiUrl}/auth\`;
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(\`\${this.apiUrl}/login\`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.perfil === role : false;
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(\`\${this.apiUrl}/refresh\`, {}).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }
}`,

  models: `// src/app/core/models/termo.model.ts
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
  id: number;
  codigo: string;
  tipo: TipoTermo;
  voluntario_id: number;
  pastoral_id?: number;
  evento_id?: number;
  paroquia_id: number;
  data_inicio: string;
  data_fim: string;
  status: StatusTermo;
  template_id: number;
  versao: number;
  hash_documento?: string;
  hash_documento_assinado?: string;
  data_geracao: string;
  data_assinatura?: string;
  data_solicitacao_assinatura?: string;
  assinatura_govbr_id?: string;
  documento_url?: string;
  documento_assinado_url?: string;
  observacoes?: string;
  voluntario?: Voluntario;
  pastoral?: Pastoral;
  evento?: Evento;
  template?: TermoTemplate;
  assinaturas?: TermoAssinatura[];
}

export interface TermoCreate {
  tipo: TipoTermo;
  voluntario_id: number;
  pastoral_id?: number;
  evento_id?: number;
  data_inicio: string;
  data_fim: string;
  template_id: number;
  observacoes?: string;
}

export interface TermoAssinatura {
  id: number;
  termo_id: number;
  govbr_signature_id?: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'RECUSADA' | 'EXPIRADA' | 'ERRO';
  data_solicitacao: string;
  data_conclusao?: string;
  certificado_usuario?: string;
  hash_assinado?: string;
}

export interface TermoTemplate {
  id: number;
  nome: string;
  tipo: TipoTermo;
  conteudo: string;
  versao: number;
  ativa: boolean;
  data_criacao: string;
  data_atualizacao: string;
  variaveis: string[];
}

// src/app/core/models/voluntario.model.ts
export interface Voluntario {
  id: number;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  email: string;
  telefone: string;
  endereco: string;
  paroquia_id: number;
  comunidade_id?: number;
  pastoral_id?: number;
  funcao_id?: number;
  data_inicio: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  observacoes?: string;
  termos?: Termo[];
}

// src/app/core/models/pastoral.model.ts
export interface Pastoral {
  id: number;
  nome: string;
  descricao: string;
  paroquia_id: number;
  comunidade_id?: number;
  coordenador: string;
  email: string;
  status: 'ATIVA' | 'INATIVA';
  data_criacao: string;
  observacoes?: string;
  voluntarios?: Voluntario[];
}

// src/app/core/models/evento.model.ts
export interface Evento {
  id: number;
  nome: string;
  descricao: string;
  paroquia_id: number;
  comunidade_id?: number;
  pastoral_id?: number;
  data_inicial: string;
  data_final: string;
  horario: string;
  local: string;
  coordenador: string;
  status: 'PLANEJAMENTO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO';
  observacoes?: string;
  voluntarios?: Voluntario[];
}

// src/app/core/models/usuario.model.ts
export type PerfilUsuario = 
  | 'ADMIN_DIOCESE'
  | 'ADMIN_PAROQUIA'
  | 'COORDENADOR_PASTORAL'
  | 'RESPONSAVEL_EVENTO'
  | 'SECRETARIA'
  | 'VOLUNTARIO'
  | 'AUDITOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  paroquia_id?: number;
  ativo: boolean;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_in: number;
  user: Usuario;
}`,

  notificationService: `// src/app/core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  success(message: string, duration = 3000): void {
    this.notificationSubject.next({ type: 'success', message, duration });
  }

  error(message: string, duration = 5000): void {
    this.notificationSubject.next({ type: 'error', message, duration });
  }

  warning(message: string, duration = 4000): void {
    this.notificationSubject.next({ type: 'warning', message, duration });
  }

  info(message: string, duration = 3000): void {
    this.notificationSubject.next({ type: 'info', message, duration });
  }
}`,
};

export const angularFeatures = {
  dashboardComponent: `// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { DashboardStats } from './dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.loading = true;
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}

// src/app/features/dashboard/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = \`\${environment.apiUrl}/dashboard\`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl);
  }
}

// src/app/features/dashboard/dashboard.model.ts
export interface DashboardStats {
  total_voluntarios_ativos: number;
  termos_assinados: number;
  termos_aguardando_assinatura: number;
  termos_proximos_vencimento: number;
  termos_vencidos: number;
  termos_recusados: number;
  eventos_ativos: number;
  pastorais_ativas: number;
  termos_por_status: Record<string, number>;
  voluntarios_por_pastoral: Record<string, number>;
  alertas: Alerta[];
}

export interface Alerta {
  tipo: 'warning' | 'error' | 'info' | 'success';
  mensagem: string;
  termo_id?: number;
}`,

  termosComponent: `// src/app/features/termos/termos.routes.ts
import { Routes } from '@angular/router';

export const TERMOS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./termos-list/termos-list.component').then(m => m.TermosListComponent) },
  { path: 'novo', loadComponent: () => import('./termo-form/termo-form.component').then(m => m.TermoFormComponent) },
  { path: ':id', loadComponent: () => import('./termo-detail/termo-detail.component').then(m => m.TermoDetailComponent) },
  { path: ':id/assinatura', loadComponent: () => import('./termo-assinatura/termo-assinatura.component').then(m => m.TermoAssinaturaComponent) },
];

// src/app/features/termos/termos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Termo, TermoCreate } from '../../core/models/termo.model';

@Injectable({ providedIn: 'root' })
export class TermosService {
  private readonly apiUrl = \`\${environment.apiUrl}/termos\`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { status?: string; tipo?: string; page?: number }): Observable<{ data: Termo[]; total: number }> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.tipo) params = params.set('tipo', filters.tipo);
    if (filters?.page) params = params.set('page', filters.page.toString());
    return this.http.get<{ data: Termo[]; total: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Termo> {
    return this.http.get<Termo>(\`\${this.apiUrl}/\${id}\`);
  }

  createAnual(data: TermoCreate): Observable<Termo> {
    return this.http.post<Termo>(\`\${this.apiUrl}/anual\`, data);
  }

  createEvento(data: TermoCreate): Observable<Termo> {
    return this.http.post<Termo>(\`\${this.apiUrl}/evento\`, data);
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

  cancelar(id: number): Observable<Termo> {
    return this.http.post<Termo>(\`\${this.apiUrl}/\${id}/cancelar\`, {});
  }

  renovar(id: number): Observable<Termo> {
    return this.http.post<Termo>(\`\${this.apiUrl}/\${id}/renovar\`, {});
  }

  downloadPdf(id: number): Observable<Blob> {
    return this.http.get(\`\${this.apiUrl}/\${id}/pdf\`, { responseType: 'blob' });
  }

  getAuditoria(id: number): Observable<any[]> {
    return this.http.get<any[]>(\`\${this.apiUrl}/\${id}/auditoria\`);
  }
}

// src/app/features/termos/termo-assinatura/termo-assinatura.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TermosService } from '../termos.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-termo-assinatura',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="assinatura-container">
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Preparando assinatura...</p>
      </div>
      
      <div *ngIf="!loading && status === 'AGUARDANDO'" class="aguardando">
        <h2>Assinatura Eletrônica gov.br</h2>
        <p>Você será redirecionado para o portal gov.br para autenticação.</p>
        <p class="info">É necessário possuir conta gov.br nível Prata ou Ouro.</p>
        <button (click)="iniciarAssinatura()" class="btn-primary">
          <i class="fas fa-sign-in-alt"></i> Iniciar Assinatura via gov.br
        </button>
      </div>

      <div *ngIf="status === 'EM_ANDAMENTO'" class="em-andamento">
        <div class="spinner"></div>
        <h2>Assinatura em andamento...</h2>
        <p>Aguardando confirmação do gov.br</p>
      </div>

      <div *ngIf="status === 'ASSINADO'" class="sucesso">
        <i class="fas fa-check-circle"></i>
        <h2>Documento assinado com sucesso!</h2>
        <p>Sua assinatura eletrônica foi registrada.</p>
        <button (click)="verDocumento()" class="btn-primary">Ver Documento</button>
      </div>

      <div *ngIf="status === 'ERRO'" class="erro">
        <i class="fas fa-exclamation-circle"></i>
        <h2>Erro na assinatura</h2>
        <p>{{ errorMessage }}</p>
        <button (click)="tentarNovamente()" class="btn-secondary">Tentar Novamente</button>
      </div>
    </div>
  \`
})
export class TermoAssinaturaComponent implements OnInit {
  termoId!: number;
  loading = true;
  status = 'AGUARDANDO';
  errorMessage = '';
  pollingInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private termosService: TermosService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.termoId = Number(this.route.snapshot.paramMap.get('id'));
    this.checkStatus();
  }

  iniciarAssinatura(): void {
    this.termosService.solicitarAssinatura(this.termoId).subscribe({
      next: (response) => {
        // Redireciona para o OAuth do gov.br
        window.location.href = response.redirect_url;
      },
      error: (err) => {
        this.status = 'ERRO';
        this.errorMessage = err.error?.message || 'Erro ao iniciar assinatura';
      }
    });
  }

  checkStatus(): void {
    this.termosService.getStatusAssinatura(this.termoId).subscribe({
      next: (response) => {
        this.status = response.status;
        this.loading = false;
        
        if (response.status === 'EM_ANDAMENTO') {
          this.startPolling();
        } else if (response.status === 'ASSINADO') {
          this.notification.success('Documento assinado com sucesso!');
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private startPolling(): void {
    this.pollingInterval = setInterval(() => {
      this.checkStatus();
    }, 3000);
  }

  verDocumento(): void {
    this.router.navigate(['/termos', this.termoId]);
  }

  tentarNovamente(): void {
    this.status = 'AGUARDANDO';
    this.errorMessage = '';
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}`,

  voluntariosComponent: `// src/app/features/voluntarios/voluntarios.routes.ts
import { Routes } from '@angular/router';

export const VOLUNTARIOS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./voluntarios-list/voluntarios-list.component').then(m => m.VoluntariosListComponent) },
  { path: 'novo', loadComponent: () => import('./voluntario-form/voluntario-form.component').then(m => m.VoluntarioFormComponent) },
  { path: ':id', loadComponent: () => import('./voluntario-detail/voluntario-detail.component').then(m => m.VoluntarioDetailComponent) },
  { path: ':id/editar', loadComponent: () => import('./voluntario-form/voluntario-form.component').then(m => m.VoluntarioFormComponent) },
];

// src/app/features/voluntarios/voluntarios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Voluntario } from '../../core/models/voluntario.model';

@Injectable({ providedIn: 'root' })
export class VoluntariosService {
  private readonly apiUrl = \`\${environment.apiUrl}/voluntarios\`;

  constructor(private http: HttpClient) {}

  getAll(filters?: { search?: string; status?: string; pastoral_id?: number }): Observable<{ data: Voluntario[]; total: number }> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.pastoral_id) params = params.set('pastoral_id', filters.pastoral_id.toString());
    return this.http.get<{ data: Voluntario[]; total: number }>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Voluntario> {
    return this.http.get<Voluntario>(\`\${this.apiUrl}/\${id}\`);
  }

  create(data: Partial<Voluntario>): Observable<Voluntario> {
    return this.http.post<Voluntario>(this.apiUrl, data);
  }

  update(id: number, data: Partial<Voluntario>): Observable<Voluntario> {
    return this.http.put<Voluntario>(\`\${this.apiUrl}/\${id}\`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}

// src/app/features/voluntarios/voluntario-form/voluntario-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VoluntariosService } from '../voluntarios.service';
import { PastoraisService } from '../../pastorais/pastorais.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CpfValidator } from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-voluntario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './voluntario-form.component.html'
})
export class VoluntarioFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  voluntarioId?: number;
  pastorais: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private voluntariosService: VoluntariosService,
    private pastoraisService: PastoraisService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPastorais();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.voluntarioId = Number(id);
      this.loadVoluntario(this.voluntarioId);
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      nome_completo: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, CpfValidator.isValid]],
      data_nascimento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      endereco: [''],
      pastoral_id: [''],
      funcao_id: [''],
      data_inicio: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['PENDENTE'],
      observacoes: ['']
    });
  }

  private loadPastorais(): void {
    this.pastoraisService.getAll().subscribe(res => {
      this.pastorais = res.data;
    });
  }

  private loadVoluntario(id: number): void {
    this.voluntariosService.getById(id).subscribe(vol => {
      this.form.patchValue(vol);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;
    
    if (this.isEditing && this.voluntarioId) {
      this.voluntariosService.update(this.voluntarioId, data).subscribe(() => {
        this.notification.success('Voluntário atualizado com sucesso!');
        this.router.navigate(['/voluntarios']);
      });
    } else {
      this.voluntariosService.create(data).subscribe(() => {
        this.notification.success('Voluntário cadastrado com sucesso!');
        this.router.navigate(['/voluntarios']);
      });
    }
  }
}`,

  validacaoComponent: `// src/app/features/validacao/validacao.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-validacao',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="validacao-page">
      <div class="container">
        <div class="header">
          <h1>Validação de Termo de Voluntariado</h1>
          <p>Verifique a autenticidade deste documento</p>
        </div>

        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Verificando documento...</p>
        </div>

        <div *ngIf="!loading && termo" class="resultado" [class.valido]="termo.status === 'ASSINADO'" [class.invalido]="termo.status !== 'ASSINADO'">
          <div class="status-icon">
            <i *ngIf="termo.status === 'ASSINADO'" class="fas fa-check-circle"></i>
            <i *ngIf="termo.status !== 'ASSINADO'" class="fas fa-times-circle"></i>
          </div>
          
          <h2>{{ termo.status === 'ASSINADO' ? 'Documento Válido' : 'Documento Inválido' }}</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Código:</label>
              <span>{{ termo.codigo }}</span>
            </div>
            <div class="info-item">
              <label>Tipo:</label>
              <span>{{ termo.tipo === 'ANUAL' ? 'Voluntariado Pastoral' : 'Voluntariado Evento' }}</span>
            </div>
            <div class="info-item">
              <label>Data de Emissão:</label>
              <span>{{ termo.data_geracao | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <label>Situação:</label>
              <span>{{ termo.status }}</span>
            </div>
            <div class="info-item" *ngIf="termo.data_assinatura">
              <label>Data da Assinatura:</label>
              <span>{{ termo.data_assinatura | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="info-item" *ngIf="termo.hash_documento_assinado">
              <label>Hash SHA-256:</label>
              <span class="hash">{{ termo.hash_documento_assinado }}</span>
            </div>
          </div>

          <div class="govbr-info" *ngIf="termo.status === 'ASSINADO'">
            <p>✅ Documento assinado eletronicamente via gov.br</p>
            <p>Validação oficial: <a href="https://validar.iti.gov.br" target="_blank">validar.iti.gov.br</a></p>
          </div>
        </div>

        <div *ngIf="!loading && !termo" class="nao-encontrado">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Documento não encontrado</h2>
          <p>O código informado não foi encontrado na base de dados.</p>
        </div>
      </div>
    </div>
  \`,
  styles: [\`
    .validacao-page { min-height: 100vh; background: #f8fafc; padding: 2rem; }
    .container { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 2rem; }
    .resultado { background: white; border-radius: 1rem; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .resultado.valido { border-left: 4px solid #22c55e; }
    .resultado.invalido { border-left: 4px solid #ef4444; }
    .status-icon { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
    .valido .status-icon { color: #22c55e; }
    .invalido .status-icon { color: #ef4444; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0; }
    .info-item label { font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
    .info-item span { font-weight: 500; }
    .hash { font-family: monospace; font-size: 0.75rem; word-break: break-all; }
    .govbr-info { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem; }
  \`]
})
export class ValidacaoComponent implements OnInit {
  codigo!: string;
  termo: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.codigo = this.route.snapshot.paramMap.get('codigo') || '';
    if (this.codigo) {
      this.validar();
    }
  }

  private validar(): void {
    this.http.get(\`\${environment.apiUrl}/validacao/\${this.codigo}\`).subscribe({
      next: (termo) => {
        this.termo = termo;
        this.loading = false;
      },
      error: () => {
        this.termo = null;
        this.loading = false;
      }
    });
  }
}`,
};

export const angularShared = {
  cpfValidator: `// src/app/shared/validators/cpf.validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CpfValidator {
  static isValid(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\\D/g, '');
    
    if (!cpf || cpf.length !== 11) {
      return { cpfInvalid: true };
    }

    if (/^(\\d)\\1+$/.test(cpf)) {
      return { cpfInvalid: true };
    }

    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return { cpfInvalid: true };

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return { cpfInvalid: true };

    return null;
  }
}`,

  statusBadgePipe: `// src/app/shared/pipes/status-badge.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): { label: string; class: string; icon: string } {
    const map: Record<string, { label: string; class: string; icon: string }> = {
      'RASCUNHO': { label: 'Rascunho', class: 'bg-gray-100 text-gray-700', icon: '📝' },
      'GERADO': { label: 'Gerado', class: 'bg-blue-100 text-blue-700', icon: '📄' },
      'AGUARDANDO_ASSINATURA': { label: 'Aguardando', class: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
      'ASSINATURA_EM_ANDAMENTO': { label: 'Em Andamento', class: 'bg-blue-100 text-blue-700', icon: '🔵' },
      'ASSINADO': { label: 'Assinado', class: 'bg-green-100 text-green-700', icon: '✅' },
      'RECUSADO': { label: 'Recusado', class: 'bg-red-100 text-red-700', icon: '🔴' },
      'CANCELADO': { label: 'Cancelado', class: 'bg-gray-100 text-gray-700', icon: '⛔' },
      'EXPIRADO': { label: 'Expirado', class: 'bg-gray-800 text-white', icon: '⚫' },
      'ERRO_ASSINATURA': { label: 'Erro', class: 'bg-orange-100 text-orange-700', icon: '⚠️' },
    };
    return map[status] || { label: status, class: 'bg-gray-100 text-gray-700', icon: '📄' };
  }
}`,
};

export const angularEnvironment = `// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  govBrAuthUrl: 'https://sso.staging.acesso.gov.br',
  govBrClientId: 'SEU_CLIENT_ID',
  govBrRedirectUri: 'http://localhost:4200/auth/callback',
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.paroquia.gov.br/api/v1',
  govBrAuthUrl: 'https://sso.acesso.gov.br',
  govBrClientId: 'SEU_CLIENT_ID_PROD',
  govBrRedirectUri: 'https://paroquia.gov.br/auth/callback',
};`;
