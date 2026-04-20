using ystasearea.Domain.Entities;

namespace ystasearea.Application.Interfaces;

public interface IAuthService
{
    Task<string> GenerateJwtTokenAsync(User user);
    Task<User> FindOrCreateUserAsync(
        string provider,
        string providerUserId,
        string email,
        string displayName,
        string? avatarUrl);
}
