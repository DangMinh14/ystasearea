using Microsoft.EntityFrameworkCore;
using ystasearea.Application.Interfaces;
using ystasearea.Domain.Entities;
using ystasearea.Infrastructure.Data;

namespace ystasearea.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByProviderAsync(string provider, string providerUserId)
        => await _context.Users.FirstOrDefaultAsync(
            u => u.Provider == provider && u.ProviderUserId == providerUserId);

    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }
}
