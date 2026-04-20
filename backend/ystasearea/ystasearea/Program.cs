using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ystasearea.Application.Interfaces;
using ystasearea.Infrastructure.Data;
using ystasearea.Infrastructure.Repositories;
using ystasearea.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── CORS ──────────────────────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
    options.AddPolicy("FrontendPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()));

// ── Database — SQLite locally, swap to PostgreSQL for production ───────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Authentication ────────────────────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is required");

builder.Services
    .AddAuthentication(options =>
    {
        // JWT for API endpoint authentication ([Authorize] on controllers)
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
        // Cookie for OAuth sign-in flow (Google redirects back with a cookie ticket)
        options.DefaultSignInScheme       = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.HttpOnly = true;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer   = false,
            ValidateAudience = false,
            ClockSkew        = TimeSpan.Zero
        };
    })
    .AddGoogle(options =>
    {
        options.ClientId     = builder.Configuration["OAuth:Google:ClientId"]     ?? "";
        options.ClientSecret = builder.Configuration["OAuth:Google:ClientSecret"] ?? "";
        // Internal middleware path — Google redirects here, middleware handles code exchange
        options.CallbackPath = "/signin-google";
        options.SignInScheme  = CookieAuthenticationDefaults.AuthenticationScheme;
        // Allow correlation cookie on HTTP localhost during development
        options.CorrelationCookie.SameSite    = SameSiteMode.Lax;
        options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    });
    // GitHub OAuth disabled temporarily — uncomment when ready
    // .AddGitHub(options =>
    // {
    //     options.ClientId     = builder.Configuration["OAuth:GitHub:ClientId"]     ?? "";
    //     options.ClientSecret = builder.Configuration["OAuth:GitHub:ClientSecret"] ?? "";
    //     options.CallbackPath = "/api/auth/callback/github";
    //     options.SignInScheme  = CookieAuthenticationDefaults.AuthenticationScheme;
    //     options.Scope.Add("user:email");
    // });

builder.Services.AddAuthorization();

// ── Dependency Injection ──────────────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// ── Build ─────────────────────────────────────────────────────────────────────
var app = builder.Build();

// Auto-migrate on startup — SQLite will create the .db file automatically if missing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
}

app.UseCors("FrontendPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
