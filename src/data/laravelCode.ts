// Código-fonte Laravel - Backend API com JWT

export const laravelStructure = {
  root: `voluntariado-paroquial-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── VoluntarioController.php
│   │   │   │   ├── PastoralController.php
│   │   │   │   ├── EventoController.php
│   │   │   │   ├── TermoController.php
│   │   │   │   ├── TermoTemplateController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ValidacaoController.php
│   │   │   │   └── AuditoriaController.php
│   │   ├── Middleware/
│   │   │   ├── JwtAuthenticate.php
│   │   │   ├── CheckPerfil.php
│   │   │   └── SetParoquiaContext.php
│   │   ├── Requests/
│   │   │   ├── StoreVoluntarioRequest.php
│   │   │   ├── UpdateVoluntarioRequest.php
│   │   │   ├── StoreTermoRequest.php
│   │   │   └── ...
│   │   └── Resources/
│   │       ├── VoluntarioResource.php
│   │       ├── TermoResource.php
│   │       └── ...
│   ├── Models/
│   │   ├── User.php
│   │   ├── Diocese.php
│   │   ├── Paroquia.php
│   │   ├── Comunidade.php
│   │   ├── Pastoral.php
│   │   ├── Voluntario.php
│   │   ├── Evento.php
│   │   ├── Termo.php
│   │   ├── TermoTemplate.php
│   │   ├── TermoAssinatura.php
│   │   ├── AuditoriaLog.php
│   │   └── Notificacao.php
│   ├── Services/
│   │   ├── TermoService.php
│   │   ├── PdfGeneratorService.php
│   │   ├── GovBrSignatureService.php
│   │   ├── DocumentStorageService.php
│   │   ├── NotificationService.php
│   │   ├── AuditoriaService.php
│   │   └── HashService.php
│   ├── Interfaces/
│   │   ├── IGovBrSignatureService.php
│   │   ├── IDocumentStorageService.php
│   │   └── INotificationService.php
│   ├── Jobs/
│   │   ├── GerarTermoPdfJob.php
│   │   ├── EnviarNotificacaoJob.php
│   │   ├── VerificarVencimentoJob.php
│   │   └── ProcessarAssinaturaJob.php
│   ├── Events/
│   │   ├── TermoCriado.php
│   │   ├── TermoAssinado.php
│   │   └── TermoExpirado.php
│   ├── Listeners/
│   │   ├── RegistrarAuditoria.php
│   │   └── EnviarNotificacaoTermo.php
│   └── Providers/
│       └── AppServiceProvider.php
├── config/
│   ├── jwt.php
│   ├── govbr.php
│   └── storage.php
├── database/
│   └── migrations/
│       ├── 2027_01_01_000001_create_dioceses_table.php
│       ├── 2027_01_01_000002_create_paroquias_table.php
│       ├── 2027_01_01_000003_create_comunidades_table.php
│       ├── 2027_01_01_000004_create_pastorais_table.php
│       ├── 2027_01_01_000005_create_voluntarios_table.php
│       ├── 2027_01_01_000006_create_eventos_table.php
│       ├── 2027_01_01_000007_create_termos_table.php
│       ├── 2027_01_01_000008_create_termo_templates_table.php
│       ├── 2027_01_01_000009_create_termo_assinaturas_table.php
│       ├── 2027_01_01_000010_create_auditoria_logs_table.php
│       ├── 2027_01_01_000011_create_notificacoes_table.php
│       └── 2027_01_01_000012_create_users_table.php
├── routes/
│   └── api.php
├── .env.example
├── composer.json
└── artisan`,
};

export const laravelRoutes = `<?php
// routes/api.php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\VoluntarioController;
use App\\Http\\Controllers\\Api\\PastoralController;
use App\\Http\\Controllers\\Api\\EventoController;
use App\\Http\\Controllers\\Api\\TermoController;
use App\\Http\\Controllers\\Api\\TermoTemplateController;
use App\\Http\\Controllers\\Api\\DashboardController;
use App\\Http\\Controllers\\Api\\ValidacaoController;
use App\\Http\\Controllers\\Api\\AuditoriaController;

// Rotas públicas
Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Validação pública de termos
    Route::get('/validacao/{codigo}', [ValidacaoController::class, 'validar']);
});

// Rotas autenticadas (JWT)
Route::prefix('v1')->middleware(['jwt.auth', 'paroquia.context'])->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'stats']);

    // Voluntários
    Route::apiResource('/voluntarios', VoluntarioController::class);
    Route::get('/voluntarios/{id}/termos', [VoluntarioController::class, 'termos']);

    // Pastorais
    Route::apiResource('/pastorais', PastoralController::class);
    Route::get('/pastorais/{id}/voluntarios', [PastoralController::class, 'voluntarios']);

    // Eventos
    Route::apiResource('/eventos', EventoController::class);
    Route::post('/eventos/{id}/voluntarios', [EventoController::class, 'vincularVoluntario']);
    Route::delete('/eventos/{id}/voluntarios/{voluntarioId}', [EventoController::class, 'desvincularVoluntario']);

    // Termos
    Route::get('/termos', [TermoController::class, 'index']);
    Route::get('/termos/{id}', [TermoController::class, 'show']);
    Route::post('/termos/anual', [TermoController::class, 'storeAnual']);
    Route::post('/termos/evento', [TermoController::class, 'storeEvento']);
    Route::post('/termos/{id}/gerar', [TermoController::class, 'gerarPdf']);
    Route::post('/termos/{id}/solicitar-assinatura', [TermoController::class, 'solicitarAssinatura']);
    Route::get('/termos/{id}/assinatura/status', [TermoController::class, 'statusAssinatura']);
    Route::post('/termos/{id}/cancelar', [TermoController::class, 'cancelar']);
    Route::post('/termos/{id}/renovar', [TermoController::class, 'renovar']);
    Route::get('/termos/{id}/pdf', [TermoController::class, 'downloadPdf']);
    Route::get('/termos/{id}/auditoria', [TermoController::class, 'auditoria']);

    // Callback assinatura gov.br
    Route::get('/termos/assinatura/callback', [TermoController::class, 'callbackAssinatura']);

    // Templates
    Route::apiResource('/templates', TermoTemplateController::class);
    Route::post('/templates/{id}/ativar', [TermoTemplateController::class, 'ativar']);
    Route::post('/templates/{id}/desativar', [TermoTemplateController::class, 'desativar']);

    // Auditoria
    Route::get('/auditoria', [AuditoriaController::class, 'index']);
});`;

export const laravelModels = {
  termo: `<?php
// app/Models/Termo.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\Relations\\HasOne;

class Termo extends Model
{
    use SoftDeletes;

    protected $table = 'termos';

    protected $fillable = [
        'codigo',
        'tipo',
        'voluntario_id',
        'pastoral_id',
        'evento_id',
        'paroquia_id',
        'data_inicio',
        'data_fim',
        'status',
        'template_id',
        'versao',
        'hash_documento',
        'hash_documento_assinado',
        'data_geracao',
        'data_assinatura',
        'data_solicitacao_assinatura',
        'assinatura_govbr_id',
        'documento_url',
        'documento_assinado_url',
        'observacoes',
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'data_geracao' => 'date',
        'data_assinatura' => 'datetime',
        'data_solicitacao_assinatura' => 'datetime',
        'versao' => 'integer',
    ];

    // Relationships
    public function voluntario(): BelongsTo
    {
        return $this->belongsTo(Voluntario::class);
    }

    public function pastoral(): BelongsTo
    {
        return $this->belongsTo(Pastoral::class);
    }

    public function evento(): BelongsTo
    {
        return $this->belongsTo(Evento::class);
    }

    public function paroquia(): BelongsTo
    {
        return $this->belongsTo(Paroquia::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(TermoTemplate::class, 'template_id');
    }

    public function assinaturas(): HasMany
    {
        return $this->hasMany(TermoAssinatura::class);
    }

    public function assinaturaAtual(): HasOne
    {
        return $this->hasOne(TermoAssinatura::class)->latestOfMany();
    }

    public function auditoriaLogs(): HasMany
    {
        return $this->hasMany(AuditoriaLog::class, 'documento_id');
    }

    // Scopes
    public function scopeAtivos($query)
    {
        return $query->where('status', 'ASSINADO')
                     ->where('data_fim', '>=', now());
    }

    public function scopeProximosVencimento($query, $dias = 30)
    {
        return $query->where('status', 'ASSINADO')
                     ->where('data_fim', '>=', now())
                     ->where('data_fim', '<=', now()->addDays($dias));
    }

    public function scopeVencidos($query)
    {
        return $query->where('status', 'ASSINADO')
                     ->where('data_fim', '<', now());
    }

    public function scopeAguardandoAssinatura($query)
    {
        return $query->whereIn('status', ['AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO']);
    }

    // Helpers
    public function estaProximoVencimento(): bool
    {
        return $this->data_fim->diffInDays(now()) <= 30 && $this->data_fim->isFuture();
    }

    public function estaVencido(): bool
    {
        return $this->data_fim->isPast();
    }

    public function podeSerAssinado(): bool
    {
        return in_array($this->status, ['GERADO', 'RASCUNHO']);
    }

    public function podeSerCancelado(): bool
    {
        return in_array($this->status, ['RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA']);
    }

    public function podeSerRenovado(): bool
    {
        return $this->status === 'EXPIRADO' || $this->estaProximoVencimento();
    }

    public static function gerarCodigo(string $tipo, int $paroquiaId): string
    {
        $prefixo = $tipo === 'ANUAL' ? 'TVP' : 'TVE';
        $ano = date('Y');
        
        $ultimoTermo = self::where('paroquia_id', $paroquiaId)
            ->where('codigo', 'like', "{$prefixo}-{$ano}-%")
            ->orderBy('codigo', 'desc')
            ->first();

        $sequencial = $ultimoTermo 
            ? intval(substr($ultimoTermo->codigo, -6)) + 1 
            : 1;

        return sprintf('%s-%s-%06d', $prefixo, $ano, $sequencial);
    }
}`,

  voluntario: `<?php
// app/Models/Voluntario.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Voluntario extends Model
{
    use SoftDeletes;

    protected $table = 'voluntarios';

    protected $fillable = [
        'nome_completo',
        'cpf',
        'data_nascimento',
        'email',
        'telefone',
        'endereco',
        'paroquia_id',
        'comunidade_id',
        'pastoral_id',
        'funcao_id',
        'data_inicio',
        'status',
        'observacoes',
    ];

    protected $casts = [
        'data_nascimento' => 'date',
        'data_inicio' => 'date',
    ];

    protected $hidden = [
        // Dados sensíveis protegidos (LGPD)
    ];

    // Relationships
    public function paroquia(): BelongsTo
    {
        return $this->belongsTo(Paroquia::class);
    }

    public function comunidade(): BelongsTo
    {
        return $this->belongsTo(Comunidade::class);
    }

    public function pastoral(): BelongsTo
    {
        return $this->belongsTo(Pastoral::class);
    }

    public function termos(): HasMany
    {
        return $this->hasMany(Termo::class);
    }

    public function termoAtivo()
    {
        return $this->termos()->where('status', 'ASSINADO')
                               ->where('data_fim', '>=', now())
                               ->latest()
                               ->first();
    }

    public function eventosParticipando(): HasMany
    {
        return $this->hasMany(EventoVoluntario::class);
    }

    // Scopes
    public function scopeAtivos($query)
    {
        return $query->where('status', 'ATIVO');
    }

    public function scopePorPastoral($query, $pastoralId)
    {
        return $query->where('pastoral_id', $pastoralId);
    }

    // Accessors
    public function getIdadeAttribute(): int
    {
        return $this->data_nascimento->age;
    }

    public function getNomePrimeiroAttribute(): string
    {
        return explode(' ', $this->nome_completo)[0];
    }

    // Mutators
    public function setCpfAttribute($value): void
    {
        $this->attributes['cpf'] = preg_replace('/\\D/', '', $value);
    }

    public function getTelefoneFormatadoAttribute(): string
    {
        $tel = preg_replace('/\\D/', '', $this->telefone);
        if (strlen($tel) === 11) {
            return sprintf('(%s) %s-%s', substr($tel, 0, 2), substr($tel, 2, 5), substr($tel, 7));
        }
        return $this->telefone;
    }
}`,

  user: `<?php
// app/Models/User.php

namespace App\\Models;

use Illuminate\\Foundation\\Auth\\User as Authenticatable;
use Illuminate\\Notifications\\Notifiable;
use Tymon\\JWTAuth\\Contracts\\JWTSubject;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'nome',
        'email',
        'password',
        'perfil',
        'paroquia_id',
        'ativo',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'perfil' => $this->perfil,
            'paroquia_id' => $this->paroquia_id,
            'nome' => $this->nome,
        ];
    }

    // Relationships
    public function paroquia(): BelongsTo
    {
        return $this->belongsTo(Paroquia::class);
    }

    // Helpers
    public function isAdminDiocese(): bool
    {
        return $this->perfil === 'ADMIN_DIOCESE';
    }

    public function isAdminParoquia(): bool
    {
        return $this->perfil === 'ADMIN_PAROQUIA';
    }

    public function hasPerfil(string $perfil): bool
    {
        return $this->perfil === $perfil;
    }

    public function hasAnyPerfil(array $perfis): bool
    {
        return in_array($this->perfil, $perfis);
    }
}`,
};

export const laravelControllers = {
  termoController: `<?php
// app/Http/Controllers/Api/TermoController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Termo;
use App\\Services\\TermoService;
use App\\Services\\GovBrSignatureService;
use App\\Services\\AuditoriaService;
use App\\Http\\Resources\\TermoResource;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Log;
use Symfony\\Component\\HttpFoundation\\StreamedResponse;

class TermoController extends Controller
{
    public function __construct(
        private TermoService $termoService,
        private GovBrSignatureService $signatureService,
        private AuditoriaService $auditoriaService
    ) {}

    /**
     * Listar termos com filtros
     */
    public function index(Request $request): JsonResponse
    {
        $query = Termo::with(['voluntario', 'pastoral', 'evento', 'template'])
            ->where('paroquia_id', $request->attributes->get('paroquia_id'));

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('voluntario_id')) {
            $query->where('voluntario_id', $request->voluntario_id);
        }

        if ($request->filled('pastoral_id')) {
            $query->where('pastoral_id', $request->pastoral_id);
        }

        $termos = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => TermoResource::collection($termos),
            'total' => $termos->total(),
            'page' => $termos->currentPage(),
            'per_page' => $termos->perPage(),
        ]);
    }

    /**
     * Detalhar termo
     */
    public function show(int $id): TermoResource
    {
        $termo = Termo::with([
            'voluntario', 'pastoral', 'evento', 'template', 
            'assinaturas', 'paroquia'
        ])->findOrFail($id);

        $this->authorizeParoquia($termo);

        return new TermoResource($termo);
    }

    /**
     * Criar termo anual
     */
    public function storeAnual(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'voluntario_id' => 'required|exists:voluntarios,id',
            'pastoral_id' => 'required|exists:pastorais,id',
            'template_id' => 'required|exists:termo_templates,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ]);

        $paroquiaId = $request->attributes->get('paroquia_id');
        
        $termo = $this->termoService->criarTermoAnual(
            $validated,
            $paroquiaId,
            Auth::id()
        );

        $this->auditoriaService->registrar(
            'TERMO_CRIADO',
            Auth::user()->nome,
            $termo->id,
            null,
            'RASCUNHO',
            'SUCESSO'
        );

        return response()->json(new TermoResource($termo), 201);
    }

    /**
     * Criar termo de evento
     */
    public function storeEvento(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'voluntario_id' => 'required|exists:voluntarios,id',
            'evento_id' => 'required|exists:eventos,id',
            'template_id' => 'required|exists:termo_templates,id',
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after:data_inicio',
            'observacoes' => 'nullable|string',
        ]);

        $paroquiaId = $request->attributes->get('paroquia_id');
        
        $termo = $this->termoService->criarTermoEvento(
            $validated,
            $paroquiaId,
            Auth::id()
        );

        $this->auditoriaService->registrar(
            'TERMO_CRIADO',
            Auth::user()->nome,
            $termo->id,
            null,
            'RASCUNHO',
            'SUCESSO'
        );

        return response()->json(new TermoResource($termo), 201);
    }

    /**
     * Gerar PDF do termo
     */
    public function gerarPdf(int $id, Request $request): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        if (!$termo->podeSerAssinado() && $termo->status !== 'RASCUNHO') {
            return response()->json([
                'message' => 'Termo não pode ser gerado no status atual.'
            ], 422);
        }

        $termo = $this->termoService->gerarDocumento($termo, Auth::id());

        $this->auditoriaService->registrar(
            'TERMO_GERADO',
            Auth::user()->nome,
            $termo->id,
            'RASCUNHO',
            'GERADO',
            'SUCESSO'
        );

        return response()->json(new TermoResource($termo));
    }

    /**
     * Solicitar assinatura via gov.br
     */
    public function solicitarAssinatura(int $id, Request $request): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        if ($termo->status !== 'GERADO') {
            return response()->json([
                'message' => 'Termo precisa estar com status GERADO para solicitar assinatura.'
            ], 422);
        }

        try {
            // Cria solicitação de assinatura no gov.br
            $signatureRequest = $this->signatureService->criarSolicitacaoAssinatura(
                $termo,
                $termo->voluntario
            );

            $termo->update([
                'status' => 'AGUARDANDO_ASSINATURA',
                'data_solicitacao_assinatura' => now(),
                'assinatura_govbr_id' => $signatureRequest['signature_id'],
            ]);

            $this->auditoriaService->registrar(
                'ASSINATURA_SOLICITADA',
                Auth::user()->nome,
                $termo->id,
                'GERADO',
                'AGUARDANDO_ASSINATURA',
                'SUCESSO',
                $signatureRequest['signature_id']
            );

            return response()->json([
                'redirect_url' => $signatureRequest['auth_url'],
                'signature_id' => $signatureRequest['signature_id'],
                'termo' => new TermoResource($termo),
            ]);

        } catch (\\Exception $e) {
            Log::error('Erro ao solicitar assinatura gov.br', [
                'termo_id' => $id,
                'error' => $e->getMessage(),
            ]);

            $this->auditoriaService->registrar(
                'ASSINATURA_SOLICITADA',
                Auth::user()->nome,
                $termo->id,
                'GERADO',
                'ERRO_ASSINATURA',
                'ERRO',
                null,
                $e->getMessage()
            );

            return response()->json([
                'message' => 'Erro ao solicitar assinatura. Tente novamente.'
            ], 500);
        }
    }

    /**
     * Consultar status da assinatura
     */
    public function statusAssinatura(int $id): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        // Se está aguardando, verifica no gov.br
        if (in_array($termo->status, ['AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO'])) {
            $status = $this->signatureService->obterStatusAssinatura(
                $termo->assinatura_govbr_id
            );

            if ($status === 'ASSINADO') {
                // Obtém documento assinado
                $documentoAssinado = $this->signatureService->obterDocumentoAssinado(
                    $termo->assinatura_govbr_id
                );

                $this->termoService->finalizarAssinatura($termo, $documentoAssinado);
                
                $this->auditoriaService->registrar(
                    'TERMO_ASSINADO',
                    $termo->voluntario->nome_completo,
                    $termo->id,
                    'ASSINATURA_EM_ANDAMENTO',
                    'ASSINADO',
                    'SUCESSO',
                    $termo->assinatura_govbr_id
                );
            }

            return response()->json(['status' => $termo->fresh()->status]);
        }

        return response()->json(['status' => $termo->status]);
    }

    /**
     * Callback da assinatura gov.br
     */
    public function callbackAssinatura(Request $request): JsonResponse
    {
        $code = $request->get('code');
        $state = $request->get('state');

        try {
            // Troca code por access token
            $tokenData = $this->signatureService->trocarCodePorToken($code);
            
            // Obtém assinatura PKCS#7
            $signature = $this->signatureService->obterAssinaturaPKCS7(
                $tokenData['access_token'],
                $state
            );

            // Busca termo pelo state
            $termo = Termo::where('assinatura_govbr_id', $state)->firstOrFail();
            
            // Finaliza assinatura
            $this->termoService->finalizarAssinatura($termo, $signature);

            $this->auditoriaService->registrar(
                'TERMO_ASSINADO',
                $termo->voluntario->nome_completo,
                $termo->id,
                'ASSINATURA_EM_ANDAMENTO',
                'ASSINADO',
                'SUCESSO',
                $state
            );

            return response()->json(['message' => 'Assinatura processada com sucesso.']);

        } catch (\\Exception $e) {
            Log::error('Erro no callback de assinatura', [
                'error' => $e->getMessage(),
                'code' => $code,
                'state' => $state,
            ]);

            return response()->json(['message' => 'Erro ao processar assinatura.'], 500);
        }
    }

    /**
     * Cancelar termo
     */
    public function cancelar(int $id, Request $request): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        if (!$termo->podeSerCancelado()) {
            return response()->json([
                'message' => 'Termo não pode ser cancelado no status atual.'
            ], 422);
        }

        // Cancela assinatura pendente no gov.br
        if ($termo->assinatura_govbr_id) {
            $this->signatureService->cancelarSolicitacao($termo->assinatura_govbr_id);
        }

        $statusAnterior = $termo->status;
        $termo->update(['status' => 'CANCELADO']);

        $this->auditoriaService->registrar(
            'TERMO_CANCELADO',
            Auth::user()->nome,
            $termo->id,
            $statusAnterior,
            'CANCELADO',
            'SUCESSO'
        );

        return response()->json(new TermoResource($termo));
    }

    /**
     * Renovar termo
     */
    public function renovar(int $id, Request $request): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        if (!$termo->podeSerRenovado()) {
            return response()->json([
                'message' => 'Termo não pode ser renovado.'
            ], 422);
        }

        $novoTermo = $this->termoService->renovarTermo($termo, Auth::id());

        $this->auditoriaService->registrar(
            'TERMO_RENOVADO',
            Auth::user()->nome,
            $termo->id,
            $termo->status,
            'EXPIRADO',
            'SUCESSO'
        );

        $this->auditoriaService->registrar(
            'TERMO_CRIADO',
            Auth::user()->nome,
            $novoTermo->id,
            null,
            'RASCUNHO',
            'SUCESSO',
            null,
            "Renovação do termo {$termo->codigo}"
        );

        return response()->json(new TermoResource($novoTermo), 201);
    }

    /**
     * Download PDF
     */
    public function downloadPdf(int $id): StreamedResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        $url = $termo->documento_assinado_url ?? $termo->documento_url;
        
        if (!$url) {
            abort(404, 'Documento não encontrado.');
        }

        $this->auditoriaService->registrar(
            'DOCUMENTO_DOWNLOAD',
            Auth::user()->nome,
            $termo->id,
            null,
            null,
            'SUCESSO'
        );

        return response()->streamDownload(function () use ($url) {
            echo file_get_contents($url);
        }, "{$termo->codigo}.pdf", [
            'Content-Type' => 'application/pdf',
        ]);
    }

    /**
     * Auditoria do termo
     */
    public function auditoria(int $id): JsonResponse
    {
        $termo = Termo::findOrFail($id);
        $this->authorizeParoquia($termo);

        $logs = $termo->auditoriaLogs()->orderBy('created_at', 'desc')->get();

        return response()->json($logs);
    }

    /**
     * Verificar se o termo pertence à paróquia do usuário
     */
    private function authorizeParoquia(Termo $termo): void
    {
        $user = Auth::user();
        
        if ($user->perfil !== 'ADMIN_DIOCESE' && $termo->paroquia_id !== $user->paroquia_id) {
            abort(403, 'Acesso negado.');
        }
    }
}`,

  authController: `<?php
// app/Http/Controllers/Api/AuthController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Hash;
use App\\Models\\User;
use Tymon\\JWTAuth\\Facades\\JWTAuth;

class AuthController extends Controller
{
    /**
     * Login - Retorna JWT token
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 401);
        }

        $user = Auth::user();

        if (!$user->ativo) {
            return response()->json([
                'message' => 'Usuário desativado.'
            ], 403);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Logout
     */
    public function logout(): JsonResponse
    {
        Auth::logout();
        
        return response()->json([
            'message' => 'Logout realizado com sucesso.'
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh(): JsonResponse
    {
        $token = Auth::refresh();
        
        return $this->respondWithToken($token);
    }

    /**
     * Dados do usuário autenticado
     */
    public function me(): JsonResponse
    {
        $user = Auth::user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'nome' => $user->nome,
                'email' => $user->email,
                'perfil' => $user->perfil,
                'paroquia_id' => $user->paroquia_id,
            ]
        ]);
    }

    /**
     * Formatar resposta com token
     */
    private function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            'user' => [
                'id' => Auth::user()->id,
                'nome' => Auth::user()->nome,
                'email' => Auth::user()->email,
                'perfil' => Auth::user()->perfil,
                'paroquia_id' => Auth::user()->paroquia_id,
            ]
        ]);
    }
}`,

  dashboardController: `<?php
// app/Http/Controllers/Api/DashboardController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Voluntario;
use App\\Models\\Termo;
use App\\Models\\Evento;
use App\\Models\\Pastoral;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\DB;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $paroquiaId = $request->attributes->get('paroquia_id');

        // Totais
        $totalVoluntariosAtivos = Voluntario::where('paroquia_id', $paroquiaId)
            ->where('status', 'ATIVO')
            ->count();

        $termosAssinados = Termo::where('paroquia_id', $paroquiaId)
            ->where('status', 'ASSINADO')
            ->count();

        $termosAguardando = Termo::where('paroquia_id', $paroquiaId)
            ->whereIn('status', ['AGUARDANDO_ASSINATURA', 'ASSINATURA_EM_ANDAMENTO'])
            ->count();

        $termosProximosVencimento = Termo::where('paroquia_id', $paroquiaId)
            ->proximosVencimento(30)
            ->count();

        $termosVencidos = Termo::where('paroquia_id', $paroquiaId)
            ->vencidos()
            ->count();

        $termosRecusados = Termo::where('paroquia_id', $paroquiaId)
            ->where('status', 'RECUSADO')
            ->count();

        $eventosAtivos = Evento::where('paroquia_id', $paroquiaId)
            ->whereIn('status', ['PLANEJAMENTO', 'ATIVO'])
            ->count();

        $pastoraisAtivas = Pastoral::where('paroquia_id', $paroquiaId)
            ->where('status', 'ATIVA')
            ->count();

        // Termos por status
        $termosPorStatus = Termo::where('paroquia_id', $paroquiaId)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Voluntários por pastoral
        $voluntariosPorPastoral = Voluntario::where('paroquia_id', $paroquiaId)
            ->where('status', 'ATIVO')
            ->join('pastorais', 'voluntarios.pastoral_id', '=', 'pastorais.id')
            ->select('pastorais.nome', DB::raw('count(*) as total'))
            ->groupBy('pastorais.id', 'pastorais.nome')
            ->pluck('total', 'nome')
            ->toArray();

        // Alertas
        $alertas = $this->gerarAlertas($paroquiaId);

        return response()->json([
            'total_voluntarios_ativos' => $totalVoluntariosAtivos,
            'termos_assinados' => $termosAssinados,
            'termos_aguardando_assinatura' => $termosAguardando,
            'termos_proximos_vencimento' => $termosProximosVencimento,
            'termos_vencidos' => $termosVencidos,
            'termos_recusados' => $termosRecusados,
            'eventos_ativos' => $eventosAtivos,
            'pastorais_ativas' => $pastoraisAtivas,
            'termos_por_status' => $termosPorStatus,
            'voluntarios_por_pastoral' => $voluntariosPorPastoral,
            'alertas' => $alertas,
        ]);
    }

    private function gerarAlertas(int $paroquiaId): array
    {
        $alertas = [];

        // Termos próximos do vencimento
        $proxVenc = Termo::where('paroquia_id', $paroquiaId)
            ->proximosVencimento(30)
            ->count();
        
        if ($proxVenc > 0) {
            $alertas[] = [
                'tipo' => 'warning',
                'mensagem' => "{$proxVenc} termo(s) próximo(s) do vencimento (30 dias)."
            ];
        }

        // Termos recusados
        $recusados = Termo::where('paroquia_id', $paroquiaId)
            ->where('status', 'RECUSADO')
            ->count();
        
        if ($recusados > 0) {
            $alertas[] = [
                'tipo' => 'error',
                'mensagem' => "{$recusados} termo(s) com assinatura recusada."
            ];
        }

        // Termos aguardando assinatura há mais de 7 dias
        $pendentesAntigos = Termo::where('paroquia_id', $paroquiaId)
            ->where('status', 'AGUARDANDO_ASSINATURA')
            ->where('data_solicitacao_assinatura', '<', now()->subDays(7))
            ->count();
        
        if ($pendentesAntigos > 0) {
            $alertas[] = [
                'tipo' => 'warning',
                'mensagem' => "{$pendentesAntigos} termo(s) aguardando assinatura há mais de 7 dias."
            ];
        }

        return $alertas;
    }
}`,
};

export const laravelServices = {
  govBrSignatureService: `<?php
// app/Interfaces/IGovBrSignatureService.php
namespace App\\Interfaces;

interface IGovBrSignatureService
{
    public function criarSolicitacaoAssinatura($termo, $voluntario): array;
    public function obterStatusAssinatura(string $signatureId): string;
    public function cancelarSolicitacao(string $signatureId): void;
    public function obterDocumentoAssinado(string $signatureId): string;
    public function validarAssinatura(string $signatureId): bool;
    public function trocarCodePorToken(string $code): array;
    public function obterAssinaturaPKCS7(string $accessToken, string $state): string;
}

// app/Services/GovBrSignatureService.php
namespace App\\Services;

use App\\Interfaces\\IGovBrSignatureService;
use App\\Models\\Termo;
use App\\Models\\Voluntario;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;
use Illuminate\\Support\\Str;

/**
 * Serviço de integração com a API de Assinatura Eletrônica do gov.br
 * 
 * Documentação oficial: https://manual-integracao-assinatura-eletronica.servicos.gov.br/
 * 
 * Fluxo:
 * 1. Redirecionar usuário para OAuth gov.br (conta Prata/Ouro)
 * 2. Receber authorization code via callback
 * 3. Trocar code por access_token
 * 4. Obter certificado público do usuário
 * 5. Assinar hash SHA-256 em PKCS#7
 * 6. Incorporar assinatura no PDF
 * 
 * IMPORTANTE: Esta API é destinada a órgãos públicos.
 * Para uso por paróquias, é necessário credenciamento via Diocese/Cúria
 * com domínio oficial (gov.br, edu.br, etc.)
 */
class GovBrSignatureService implements IGovBrSignatureService
{
    private string $authUrl;
    private string $apiUrl;
    private string $clientId;
    private string $clientSecret;
    private string $redirectUri;
    private string $scope;

    public function __construct()
    {
        $this->authUrl = config('govbr.auth_url');
        $this->apiUrl = config('govbr.api_url');
        $this->clientId = config('govbr.client_id');
        $this->clientSecret = config('govbr.client_secret');
        $this->redirectUri = config('govbr.redirect_uri');
        $this->scope = config('govbr.scope', 'sign');
    }

    /**
     * Cria solicitação de assinatura e retorna URL de autenticação
     */
    public function criarSolicitacaoAssinatura($termo, $voluntario): array
    {
        $state = Str::uuid()->toString();

        // Armazena state para validação no callback
        cache()->put("signature_state:{$state}", [
            'termo_id' => $termo->id,
            'voluntario_id' => $voluntario->id,
            'hash_documento' => $termo->hash_documento,
        ], now()->addMinutes(30));

        // Monta URL de autorização OAuth
        $authUrl = $this->authUrl . '/oauth2.0/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => $this->scope,
            'state' => $state,
        ]);

        Log::info('Solicitação de assinatura gov.br criada', [
            'termo_id' => $termo->id,
            'state' => $state,
        ]);

        return [
            'auth_url' => $authUrl,
            'signature_id' => $state,
            'state' => $state,
        ];
    }

    /**
     * Troca authorization code por access token
     */
    public function trocarCodePorToken(string $code): array
    {
        $response = Http::asForm()->post($this->authUrl . '/oauth2.0/token', [
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $this->redirectUri,
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
        ]);

        if (!$response->successful()) {
            Log::error('Erro ao obter access token gov.br', [
                'response' => $response->body(),
            ]);
            throw new \\Exception('Erro ao autenticar no gov.br');
        }

        return $response->json();
    }

    /**
     * Obtém assinatura PKCS#7 usando access token
     */
    public function obterAssinaturaPKCS7(string $accessToken, string $state): string
    {
        $stateData = cache()->get("signature_state:{$state}");
        
        if (!$stateData) {
            throw new \\Exception('Solicitação de assinatura expirada.');
        }

        // Obtém certificado público do usuário
        $certResponse = Http::withToken($accessToken)
            ->get($this->apiUrl . '/externo/v2/certificadoPublico');

        if (!$certResponse->successful()) {
            throw new \\Exception('Erro ao obter certificado do usuário.');
        }

        $certificado = $certResponse->json()['certificado'];

        // Realiza assinatura do hash SHA-256 em PKCS#7
        $signResponse = Http::withToken($accessToken)
            ->post($this->apiUrl . '/externo/v2/assinarPKCS7', [
                'digestAlgorithm' => 'SHA-256',
                'hash' => $stateData['hash_documento'],
            ]);

        if (!$signResponse->successful()) {
            Log::error('Erro ao assinar PKCS#7', [
                'response' => $signResponse->body(),
            ]);
            throw new \\Exception('Erro ao realizar assinatura digital.');
        }

        $pkcs7Signature = $signResponse->json()['signedHash'];

        // Limpa cache
        cache()->forget("signature_state:{$state}");

        return $pkcs7Signature;
    }

    /**
     * Consulta status da assinatura
     */
    public function obterStatusAssinatura(string $signatureId): string
    {
        // Verifica se o state ainda existe no cache (aguardando)
        $stateData = cache()->get("signature_state:{$signatureId}");
        
        if ($stateData) {
            return 'AGUARDANDO_ASSINATURA';
        }

        // Se não existe mais no cache, verifica se foi processado
        $termo = Termo::where('assinatura_govbr_id', $signatureId)->first();
        
        if ($termo) {
            return $termo->status;
        }

        return 'ERRO';
    }

    /**
     * Cancela solicitação de assinatura
     */
    public function cancelarSolicitacao(string $signatureId): void
    {
        cache()->forget("signature_state:{$signatureId}");
        
        Log::info('Solicitação de assinatura cancelada', [
            'signature_id' => $signatureId,
        ]);
    }

    /**
     * Obtém documento assinado
     */
    public function obterDocumentoAssinado(string $signatureId): string
    {
        $termo = Termo::where('assinatura_govbr_id', $signatureId)->firstOrFail();
        
        // Retorna o caminho do documento assinado
        return $termo->documento_assinado_url;
    }

    /**
     * Valida assinatura via ITI
     */
    public function validarAssinatura(string $signatureId): bool
    {
        // Validação via serviço do ITI
        // https://validar.iti.gov.br
        $termo = Termo::where('assinatura_govbr_id', $signatureId)->first();
        
        if (!$termo || !$termo->hash_documento_assinado) {
            return false;
        }

        // Aqui seria feita a validação real via API do ITI
        // Por enquanto, verifica se o hash existe
        return !empty($termo->hash_documento_assinado);
    }
}`,

  termoService: `<?php
// app/Services/TermoService.php

namespace App\\Services;

use App\\Models\\Termo;
use App\\Models\\TermoAssinatura;
use App\\Services\\PdfGeneratorService;
use App\\Services\\HashService;
use App\\Services\\DocumentStorageService;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Log;
use Carbon\\Carbon;

class TermoService
{
    public function __construct(
        private PdfGeneratorService $pdfService,
        private HashService $hashService,
        private DocumentStorageService $storageService
    ) {}

    /**
     * Criar termo anual de voluntariado pastoral
     */
    public function criarTermoAnual(array $data, int $paroquiaId, int $userId): Termo
    {
        return DB::transaction(function () use ($data, $paroquiaId, $userId) {
            $codigo = Termo::gerarCodigo('ANUAL', $paroquiaId);

            $termo = Termo::create([
                'codigo' => $codigo,
                'tipo' => 'ANUAL',
                'voluntario_id' => $data['voluntario_id'],
                'pastoral_id' => $data['pastoral_id'],
                'paroquia_id' => $paroquiaId,
                'data_inicio' => $data['data_inicio'],
                'data_fim' => $data['data_fim'],
                'status' => 'RASCUNHO',
                'template_id' => $data['template_id'],
                'versao' => 1,
                'observacoes' => $data['observacoes'] ?? null,
            ]);

            // Cria registro de assinatura pendente
            TermoAssinatura::create([
                'termo_id' => $termo->id,
                'status' => 'PENDENTE',
                'data_solicitacao' => now(),
            ]);

            return $termo->load(['voluntario', 'pastoral', 'template']);
        });
    }

    /**
     * Criar termo de voluntariado para evento
     */
    public function criarTermoEvento(array $data, int $paroquiaId, int $userId): Termo
    {
        return DB::transaction(function () use ($data, $paroquiaId, $userId) {
            $codigo = Termo::gerarCodigo('EVENTO', $paroquiaId);

            $termo = Termo::create([
                'codigo' => $codigo,
                'tipo' => 'EVENTO',
                'voluntario_id' => $data['voluntario_id'],
                'evento_id' => $data['evento_id'],
                'paroquia_id' => $paroquiaId,
                'data_inicio' => $data['data_inicio'],
                'data_fim' => $data['data_fim'],
                'status' => 'RASCUNHO',
                'template_id' => $data['template_id'],
                'versao' => 1,
                'observacoes' => $data['observacoes'] ?? null,
            ]);

            TermoAssinatura::create([
                'termo_id' => $termo->id,
                'status' => 'PENDENTE',
                'data_solicitacao' => now(),
            ]);

            return $termo->load(['voluntario', 'evento', 'template']);
        });
    }

    /**
     * Gerar documento PDF
     */
    public function gerarDocumento(Termo $termo, int $userId): Termo
    {
        return DB::transaction(function () use ($termo, $userId) {
            // Carrega dados necessários
            $termo->load(['voluntario', 'pastoral', 'evento', 'template', 'paroquia']);

            // Gera PDF a partir do template
            $pdfContent = $this->pdfService->gerarPdf($termo);

            // Calcula hash SHA-256 do documento
            $hash = $this->hashService->calcularHash($pdfContent);

            // Armazena documento
            $documentoUrl = $this->storageService->upload(
                $pdfContent,
                "termos/{$termo->paroquia_id}/{$termo->codigo}_v{$termo->versao}.pdf",
                [
                    'termo_id' => $termo->id,
                    'codigo' => $termo->codigo,
                    'versao' => $termo->versao,
                    'tipo' => $termo->tipo,
                ]
            );

            // Atualiza termo
            $termo->update([
                'status' => 'GERADO',
                'hash_documento' => $hash,
                'data_geracao' => now(),
                'documento_url' => $documentoUrl,
            ]);

            return $termo->fresh();
        });
    }

    /**
     * Finalizar assinatura do termo
     */
    public function finalizarAssinatura(Termo $termo, string $pkcs7Signature): Termo
    {
        return DB::transaction(function () use ($termo, $pkcs7Signature) {
            // Obtém PDF original
            $pdfOriginal = file_get_contents($termo->documento_url);

            // Incorpora assinatura PKCS#7 no PDF
            $pdfAssinado = $this->pdfService->incorporarAssinatura(
                $pdfOriginal,
                $pkcs7Signature
            );

            // Calcula hash do documento assinado
            $hashAssinado = $this->hashService->calcularHash($pdfAssinado);

            // Armazena documento assinado
            $urlAssinado = $this->storageService->upload(
                $pdfAssinado,
                "termos/{$termo->paroquia_id}/{$termo->codigo}_v{$termo->versao}_assinado.pdf",
                [
                    'termo_id' => $termo->id,
                    'codigo' => $termo->codigo,
                    'versao' => $termo->versao,
                    'assinado' => 'true',
                ]
            );

            // Atualiza termo
            $termo->update([
                'status' => 'ASSINADO',
                'hash_documento_assinado' => $hashAssinado,
                'data_assinatura' => now(),
                'documento_assinado_url' => $urlAssinado,
            ]);

            // Atualiza registro de assinatura
            $termo->assinaturaAtual()->update([
                'status' => 'CONCLUIDA',
                'data_conclusao' => now(),
                'hash_assinado' => $hashAssinado,
            ]);

            return $termo->fresh();
        });
    }

    /**
     * Renovar termo
     */
    public function renovarTermo(Termo $termoAntigo, int $userId): Termo
    {
        return DB::transaction(function () use ($termoAntigo, $userId) {
            // Marca termo antigo como expirado
            $termoAntigo->update(['status' => 'EXPIRADO']);

            // Define novo período (1 ano a partir de hoje)
            $dataInicio = now()->format('Y-m-d');
            $dataFim = now()->addYear()->format('Y-m-d');

            // Cria novo termo baseado no anterior
            if ($termoAntigo->tipo === 'ANUAL') {
                return $this->criarTermoAnual([
                    'voluntario_id' => $termoAntigo->voluntario_id,
                    'pastoral_id' => $termoAntigo->pastoral_id,
                    'template_id' => $termoAntigo->template_id,
                    'data_inicio' => $dataInicio,
                    'data_fim' => $dataFim,
                ], $termoAntigo->paroquia_id, $userId);
            } else {
                return $this->criarTermoEvento([
                    'voluntario_id' => $termoAntigo->voluntario_id,
                    'evento_id' => $termoAntigo->evento_id,
                    'template_id' => $termoAntigo->template_id,
                    'data_inicio' => $dataInicio,
                    'data_fim' => $dataFim,
                ], $termoAntigo->paroquia_id, $userId);
            }
        });
    }
}`,

  pdfGeneratorService: `<?php
// app/Services/PdfGeneratorService.php

namespace App\\Services;

use App\\Models\\Termo;
use Barryvdh\\DomPDF\\Facade\\Pdf;
use Illuminate\\Support\\Str;

class PdfGeneratorService
{
    /**
     * Gera PDF do termo a partir do template
     */
    public function gerarPdf(Termo $termo): string
    {
        $template = $termo->template;
        $conteudo = $template->conteudo;

        // Substitui variáveis do template
        $variaveis = $this->obterVariaveis($termo);
        
        foreach ($variaveis as $chave => $valor) {
            $conteudo = str_replace("{{{$chave}}}", $valor, $conteudo);
        }

        // Gera PDF usando DomPDF
        $pdf = Pdf::loadView('termos.template', [
            'conteudo' => $conteudo,
            'termo' => $termo,
            'paroquia' => $termo->paroquia,
        ]);

        $pdf->setPaper('A4', 'portrait');
        
        // Adiciona cabeçalho e rodapé
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
        ]);

        return $pdf->output();
    }

    /**
     * Incorpora assinatura PKCS#7 no PDF
     */
    public function incorporarAssinatura(string $pdfContent, string $pkcs7Signature): string
    {
        // Utiliza biblioteca para incorporar assinatura digital no PDF
        // Opções: setasign, signdocument, ou implementação customizada
        
        // Por enquanto, retorna o PDF original com metadados de assinatura
        // Em produção, usar biblioteca adequada para assinatura PDF
        
        return $pdfContent;
    }

    /**
     * Obtém variáveis para substituição no template
     */
    private function obterVariaveis(Termo $termo): array
    {
        $termo->loadMissing(['voluntario', 'pastoral', 'evento', 'paroquia']);

        $voluntario = $termo->voluntario;
        $paroquia = $termo->paroquia;

        $variaveis = [
            'CODIGO' => $termo->codigo,
            'PAROQUIA' => $paroquia->nome,
            'NOME_VOLUNTARIO' => $voluntario->nome_completo,
            'CPF' => $this->formatarCpf($voluntario->cpf),
            'DATA_INICIO' => $termo->data_inicio->format('d/m/Y'),
            'DATA_FIM' => $termo->data_fim->format('d/m/Y'),
            'DATA_GERACAO' => now()->format('d/m/Y'),
            'LOCAL' => $paroquia->cidade ?? 'Cidade',
        ];

        if ($termo->tipo === 'ANUAL' && $termo->pastoral) {
            $variaveis['PASTORAL'] = $termo->pastoral->nome;
            $variaveis['COORDENADOR'] = $termo->pastoral->coordenador;
            $variaveis['COMUNIDADE'] = $termo->pastoral->comunidade?->nome ?? 'N/A';
            $variaveis['FUNCAO'] = $voluntario->funcao?->nome ?? 'Voluntário';
        }

        if ($termo->tipo === 'EVENTO' && $termo->evento) {
            $variaveis['EVENTO'] = $termo->evento->nome;
            $variaveis['DATA_EVENTO'] = $termo->evento->data_inicial->format('d/m/Y');
            $variaveis['LOCAL_EVENTO'] = $termo->evento->local;
            $variaveis['COORDENADOR'] = $termo->evento->coordenador;
            $variaveis['FUNCAO'] = $voluntario->funcao?->nome ?? 'Voluntário';
        }

        return $variaveis;
    }

    private function formatarCpf(string $cpf): string
    {
        $cpf = preg_replace('/\\D/', '', $cpf);
        return vsprintf('%s%s%s.%s%s%s.%s%s%s-%s%s', str_split($cpf));
    }
}`,

  auditoriaService: `<?php
// app/Services/AuditoriaService.php

namespace App\\Services;

use App\\Models\\AuditoriaLog;
use Illuminate\\Support\\Facades\\Request;

class AuditoriaService
{
    /**
     * Registra ação na trilha de auditoria
     */
    public function registrar(
        string $acao,
        string $usuario,
        ?int $documentoId = null,
        ?string $statusAnterior = null,
        ?string $statusNovo = null,
        string $resultado = 'SUCESSO',
        ?string $assinaturaId = null,
        ?string $mensagem = null,
        ?int $versao = null
    ): AuditoriaLog {
        return AuditoriaLog::create([
            'usuario' => $usuario,
            'data_hora' => now(),
            'ip' => Request::ip(),
            'acao' => $acao,
            'documento_id' => $documentoId,
            'versao' => $versao,
            'status_anterior' => $statusAnterior,
            'status_novo' => $statusNovo,
            'assinatura_id' => $assinaturaId,
            'resultado' => $resultado,
            'mensagem' => $mensagem,
        ]);
    }

    /**
     * Obtém histórico de auditoria de um documento
     */
    public function getHistorico(int $documentoId): \\Illuminate\\Support\\Collection
    {
        return AuditoriaLog::where('documento_id', $documentoId)
            ->orderBy('data_hora', 'desc')
            ->get();
    }
}`,

  hashService: `<?php
// app/Services/HashService.php

namespace App\\Services;

class HashService
{
    /**
     * Calcula hash SHA-256 do conteúdo
     */
    public function calcularHash(string $content): string
    {
        return hash('sha256', $content);
    }

    /**
     * Verifica integridade do documento
     */
    public function verificarIntegridade(string $content, string $hashEsperado): bool
    {
        return hash_equals($hashEsperado, $this->calcularHash($content));
    }
}`,

  documentStorageService: `<?php
// app/Interfaces/IDocumentStorageService.php
namespace App\\Interfaces;

interface IDocumentStorageService
{
    public function upload(string $content, string $path, array $metadata = []): string;
    public function download(string $path): string;
    public function delete(string $path): void;
    public function getSignedUrl(string $path, int $expiresInSeconds = 3600): string;
}

// app/Services/DocumentStorageService.php
namespace App\\Services;

use App\\Interfaces\\IDocumentStorageService;
use Illuminate\\Support\\Facades\\Storage;

class DocumentStorageService implements IDocumentStorageService
{
    private string $disk;

    public function __construct()
    {
        $this->disk = config('storage.disk', 'local');
    }

    public function upload(string $content, string $path, array $metadata = []): string
    {
        Storage::disk($this->disk)->put($path, $content);
        
        return Storage::disk($this->disk)->path($path);
    }

    public function download(string $path): string
    {
        return Storage::disk($this->disk)->get($path);
    }

    public function delete(string $path): void
    {
        Storage::disk($this->disk)->delete($path);
    }

    public function getSignedUrl(string $path, int $expiresInSeconds = 3600): string
    {
        return Storage::disk($this->disk)->temporaryUrl($path, now()->addSeconds($expiresInSeconds));
    }
}`,
};

export const laravelMigrations = `<?php
// database/migrations/2027_01_01_000001_create_dioceses_table.php
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
            $table->softDeletes();
        });

        Schema::create('paroquias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('diocese_id')->constrained('dioceses');
            $table->string('nome');
            $table->string('endereco')->nullable();
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('padroeiro')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('diocese_id');
        });

        Schema::create('comunidades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->constrained('paroquias');
            $table->string('nome');
            $table->string('endereco')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
        });

        Schema::create('pastorais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->constrained('paroquias');
            $table->foreignId('comunidade_id')->nullable()->constrained('comunidades');
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->string('coordenador');
            $table->string('email')->nullable();
            $table->enum('status', ['ATIVA', 'INATIVA'])->default('ATIVA');
            $table->date('data_criacao');
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
            $table->index('comunidade_id');
        });

        Schema::create('funcoes_voluntario', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->boolean('ativa')->default(true);
            $table->timestamps();
        });

        Schema::create('voluntarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->constrained('paroquias');
            $table->foreignId('comunidade_id')->nullable()->constrained('comunidades');
            $table->foreignId('pastoral_id')->nullable()->constrained('pastorais');
            $table->foreignId('funcao_id')->nullable()->constrained('funcoes_voluntario');
            $table->string('nome_completo');
            $table->string('cpf', 11)->unique();
            $table->date('data_nascimento');
            $table->string('email');
            $table->string('telefone');
            $table->text('endereco')->nullable();
            $table->date('data_inicio');
            $table->enum('status', ['ATIVO', 'INATIVO', 'PENDENTE'])->default('PENDENTE');
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
            $table->index('pastoral_id');
            $table->index('status');
            $table->index('cpf');
        });

        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->constrained('paroquias');
            $table->foreignId('comunidade_id')->nullable()->constrained('comunidades');
            $table->foreignId('pastoral_id')->nullable()->constrained('pastorais');
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->date('data_inicial');
            $table->date('data_final');
            $table->string('horario')->nullable();
            $table->string('local')->nullable();
            $table->string('coordenador');
            $table->enum('status', ['PLANEJAMENTO', 'ATIVO', 'CONCLUIDO', 'CANCELADO'])->default('PLANEJAMENTO');
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
            $table->index('status');
        });

        Schema::create('eventos_voluntarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos');
            $table->foreignId('voluntario_id')->constrained('voluntarios');
            $table->foreignId('funcao_id')->constrained('funcoes_voluntario');
            $table->text('atividades')->nullable();
            $table->timestamps();
            
            $table->unique(['evento_id', 'voluntario_id']);
        });

        Schema::create('termo_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paroquia_id')->nullable()->constrained('paroquias');
            $table->string('nome');
            $table->enum('tipo', ['ANUAL', 'EVENTO']);
            $table->longText('conteudo');
            $table->integer('versao')->default(1);
            $table->boolean('ativa')->default(true);
            $table->json('variaveis')->nullable();
            $table->timestamps();
            
            $table->index('paroquia_id');
            $table->index('tipo');
        });

        Schema::create('termos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->enum('tipo', ['ANUAL', 'EVENTO']);
            $table->foreignId('voluntario_id')->constrained('voluntarios');
            $table->foreignId('pastoral_id')->nullable()->constrained('pastorais');
            $table->foreignId('evento_id')->nullable()->constrained('eventos');
            $table->foreignId('paroquia_id')->constrained('paroquias');
            $table->date('data_inicio');
            $table->date('data_fim');
            $table->enum('status', [
                'RASCUNHO', 'GERADO', 'AGUARDANDO_ASSINATURA', 
                'ASSINATURA_EM_ANDAMENTO', 'ASSINADO', 'RECUSADO', 
                'CANCELADO', 'EXPIRADO', 'ERRO_ASSINATURA'
            ])->default('RASCUNHO');
            $table->foreignId('template_id')->constrained('termo_templates');
            $table->integer('versao')->default(1);
            $table->string('hash_documento', 64)->nullable();
            $table->string('hash_documento_assinado', 64)->nullable();
            $table->date('data_geracao')->nullable();
            $table->timestamp('data_assinatura')->nullable();
            $table->timestamp('data_solicitacao_assinatura')->nullable();
            $table->string('assinatura_govbr_id')->nullable();
            $table->string('documento_url')->nullable();
            $table->string('documento_assinado_url')->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('paroquia_id');
            $table->index('voluntario_id');
            $table->index('status');
            $table->index('codigo');
            $table->index(['data_fim', 'status']);
        });

        Schema::create('termo_assinaturas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('termo_id')->constrained('termos');
            $table->string('govbr_signature_id')->nullable();
            $table->enum('status', ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'RECUSADA', 'EXPIRADA', 'ERRO'])->default('PENDENTE');
            $table->timestamp('data_solicitacao');
            $table->timestamp('data_conclusao')->nullable();
            $table->text('certificado_usuario')->nullable();
            $table->string('hash_assinado', 64)->nullable();
            $table->longText('pkcs7_signature')->nullable();
            $table->timestamps();
            
            $table->index('termo_id');
            $table->index('status');
        });

        Schema::create('auditoria_logs', function (Blueprint $table) {
            $table->id();
            $table->string('usuario');
            $table->timestamp('data_hora');
            $table->string('ip')->nullable();
            $table->string('acao');
            $table->unsignedBigInteger('documento_id')->nullable();
            $table->integer('versao')->nullable();
            $table->string('status_anterior')->nullable();
            $table->string('status_novo')->nullable();
            $table->string('assinatura_id')->nullable();
            $table->enum('resultado', ['SUCESSO', 'ERRO']);
            $table->text('mensagem')->nullable();
            $table->timestamps();
            
            $table->index('documento_id');
            $table->index('acao');
            $table->index('data_hora');
        });

        Schema::create('notificacoes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('destinatario_id');
            $table->enum('tipo', ['EMAIL', 'INTERNA', 'WHATSAPP']);
            $table->string('assunto');
            $table->text('mensagem');
            $table->boolean('lida')->default(false);
            $table->timestamp('data_envio');
            $table->timestamp('data_leitura')->nullable();
            $table->timestamps();
            
            $table->index('destinatario_id');
            $table->index('lida');
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('perfil', [
                'ADMIN_DIOCESE', 'ADMIN_PAROQUIA', 'COORDENADOR_PASTORAL',
                'RESPONSAVEL_EVENTO', 'SECRETARIA', 'VOLUNTARIO', 'AUDITOR'
            ]);
            $table->foreignId('paroquia_id')->nullable()->constrained('paroquias');
            $table->boolean('ativo')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('notificacoes');
        Schema::dropIfExists('auditoria_logs');
        Schema::dropIfExists('termo_assinaturas');
        Schema::dropIfExists('termos');
        Schema::dropIfExists('termo_templates');
        Schema::dropIfExists('eventos_voluntarios');
        Schema::dropIfExists('eventos');
        Schema::dropIfExists('voluntarios');
        Schema::dropIfExists('funcoes_voluntario');
        Schema::dropIfExists('pastorais');
        Schema::dropIfExists('comunidades');
        Schema::dropIfExists('paroquias');
        Schema::dropIfExists('dioceses');
    }
};`;

export const laravelConfig = {
  jwt: `<?php
// config/jwt.php
return [
    'secret' => env('JWT_SECRET'),
    'ttl' => env('JWT_TTL', 60), // Tempo de vida do token em minutos
    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // Tempo para refresh
    'algo' => env('JWT_ALGO', 'HS256'),
    'required_claims' => ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'],
    'persistent_subject' => true,
    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),
    'show_black_list_exception' => env('JWT_SHOW_BLACKLIST_EXCEPTION', true),
];`,

  govbr: `<?php
// config/govbr.php
return [
    // Ambiente: 'staging' para homologação, 'production' para produção
    'environment' => env('GOVBR_ENVIRONMENT', 'staging'),
    
    // URLs de acordo com o ambiente
    'auth_url' => env('GOVBR_ENVIRONMENT', 'staging') === 'production'
        ? 'https://sso.acesso.gov.br'
        : 'https://sso.staging.acesso.gov.br',
    
    'api_url' => env('GOVBR_ENVIRONMENT', 'staging') === 'production'
        ? 'https://assinatura-api.iti.br'
        : 'https://cas.staging.iti.br',
    
    // Validação de documentos
    'validacao_url' => env('GOVBR_ENVIRONMENT', 'staging') === 'production'
        ? 'https://validar.iti.gov.br'
        : 'https://validar.staging.iti.br',
    
    // Credenciais da aplicação (obtidas via credenciamento)
    'client_id' => env('GOVBR_CLIENT_ID'),
    'client_secret' => env('GOVBR_CLIENT_SECRET'),
    
    // URL de retorno após autenticação
    'redirect_uri' => env('GOVBR_REDIRECT_URI'),
    
    // Escopo da assinatura
    // 'sign' = assinatura única (token usado uma vez)
    // 'signature_session' = múltiplas assinaturas (token reutilizável)
    'scope' => env('GOVBR_SCOPE', 'sign'),
    
    // Nível mínimo da conta gov.br
    // 'prata' ou 'ouro' para assinatura avançada
    'min_account_level' => env('GOVBR_MIN_LEVEL', 'prata'),
    
    // Timeout para solicitações de assinatura (minutos)
    'signature_timeout' => env('GOVBR_SIGNATURE_TIMEOUT', 30),
];`,

  env: `# .env.example

# Application
APP_NAME="Voluntariado Paroquial"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQL Server)
DB_CONNECTION=sqlsrv
DB_HOST=localhost
DB_PORT=1433
DB_DATABASE=voluntariado_paroquial
DB_USERNAME=sa
DB_PASSWORD=

# JWT
JWT_SECRET=your-jwt-secret-key-here
JWT_TTL=60
JWT_REFRESH_TTL=20160

# gov.br Signature API
GOVBR_ENVIRONMENT=staging
GOVBR_CLIENT_ID=your-client-id
GOVBR_CLIENT_SECRET=your-client-secret
GOVBR_REDIRECT_URI=http://localhost:8000/api/v1/termos/assinatura/callback
GOVBR_SCOPE=sign
GOVBR_MIN_LEVEL=prata
GOVBR_SIGNATURE_TIMEOUT=30

# Document Storage
STORAGE_DISK=local
# STORAGE_DISK=s3 (para AWS S3)
# STORAGE_DISK=azure (para Azure Blob)

# AWS S3 (quando aplicável)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Azure Blob (quando aplicável)
AZURE_STORAGE_ACCOUNT=
AZURE_STORAGE_KEY=
AZURE_CONTAINER=

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@paroquia.gov.br"
MAIL_FROM_NAME="Paróquia"

# Queue
QUEUE_CONNECTION=database

# Notification
NOTIFICATION_WHATSAPP_ENABLED=false
NOTIFICATION_WHATSAPP_TOKEN=`,
};
