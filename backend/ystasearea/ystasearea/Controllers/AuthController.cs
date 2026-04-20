using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ystasearea.Application.DTOs;
using ystasearea.Application.Interfaces;

namespace ystasearea.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    // GET /api/auth/login/google
    [HttpGet("login/google")]
    public IActionResult LoginGoogle([FromQuery] string? returnUrl)
    {
        // After OAuth completes, middleware redirects here
        var redirectUrl = Url.Action(nameof(GoogleCallback), "Auth",
            null, Request.Scheme, Request.Host.ToString());
        var properties = new AuthenticationProperties
        {
            RedirectUri = redirectUrl,
            Items = { ["returnUrl"] = returnUrl }
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    // GET /api/auth/callback/google — post-OAuth handler (NOT the middleware callback)
    [HttpGet("callback/google")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded)
            return Unauthorized(new { error = "Google authentication failed" });

        var claims = result.Principal!.Claims.ToList();
        var providerUserId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
        var email       = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? "";
        var displayName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "";
        var avatarUrl   = claims.FirstOrDefault(c => c.Type == "picture")?.Value;

        var user  = await _authService.FindOrCreateUserAsync("Google", providerUserId, email, displayName, avatarUrl);
        var token = await _authService.GenerateJwtTokenAsync(user);

        var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:5173";
        return Redirect($"{frontendUrl}/auth/callback?token={Uri.EscapeDataString(token)}");
    }

    // GET /api/auth/login/github
    [HttpGet("login/github")]
    public IActionResult LoginGitHub([FromQuery] string? returnUrl)
    {
        var redirectUrl = Url.Action(nameof(GitHubCallback), "Auth");
        var properties = new AuthenticationProperties
        {
            RedirectUri = redirectUrl,
            Items = { ["returnUrl"] = returnUrl }
        };
        return Challenge(properties, "GitHub");
    }

    // GET /api/auth/callback/github
    [HttpGet("callback/github")]
    public async Task<IActionResult> GitHubCallback()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!result.Succeeded)
            return Unauthorized(new { error = "GitHub authentication failed" });

        var claims = result.Principal!.Claims.ToList();
        var providerUserId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
        var email       = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value ?? "";
        var displayName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "";
        var avatarUrl   = claims.FirstOrDefault(c => c.Type == "urn:github:avatar")?.Value;

        var user  = await _authService.FindOrCreateUserAsync("GitHub", providerUserId, email, displayName, avatarUrl);
        var token = await _authService.GenerateJwtTokenAsync(user);

        var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:5173";
        return Redirect($"{frontendUrl}/auth/callback?token={Uri.EscapeDataString(token)}");
    }

    // GET /api/auth/me  — protected
    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        return Ok(new UserDto
        {
            Id          = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            Email       = User.FindFirstValue(ClaimTypes.Email) ?? "",
            DisplayName = User.FindFirstValue("displayName") ?? "",
            AvatarUrl   = User.FindFirstValue("avatarUrl"),
            Provider    = User.FindFirstValue("provider") ?? "",
            Role        = User.FindFirstValue(ClaimTypes.Role) ?? "user",
        });
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        // JWT is stateless — logout is handled client-side by discarding the token
        return Ok(new { message = "Logged out successfully" });
    }
}
