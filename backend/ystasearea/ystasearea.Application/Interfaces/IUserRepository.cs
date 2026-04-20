using ystasearea.Domain.Entities;

namespace ystasearea.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByProviderAsync(string provider, string providerUserId);
    Task<User?> GetByIdAsync(Guid id);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
}
