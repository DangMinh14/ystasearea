using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ystasearea.Application.Interfaces;
using ystasearea.Domain.Entities;

namespace ystasearea.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public Task<string> GenerateJwtTokenAsync(User user)
    {
        var secret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret is not configured");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("displayName", user.DisplayName),
            new Claim("avatarUrl", user.AvatarUrl ?? ""),
            new Claim("provider", user.Provider),
            new Claim(ClaimTypes.Role, user.Role),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return Task.FromResult(new JwtSecurityTokenHandler().WriteToken(token));
    }

    public async Task<User> FindOrCreateUserAsync(
        string provider,
        string providerUserId,
        string email,
        string displayName,
        string? avatarUrl)
    {
        var existing = await _userRepository.GetByProviderAsync(provider, providerUserId);
        if (existing != null)
        {
            existing.LastLoginAt = DateTime.UtcNow;
            existing.AvatarUrl = avatarUrl;
            return await _userRepository.UpdateAsync(existing);
        }

        return await _userRepository.CreateAsync(new User
        {
            Provider = provider,
            ProviderUserId = providerUserId,
            Email = email,
            DisplayName = displayName,
            AvatarUrl = avatarUrl,
            LastLoginAt = DateTime.UtcNow,
        });
    }
}
