using Microsoft.EntityFrameworkCore;
using RSSI_webAPI.Models;

namespace RSSI_webAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options) { }

    public DbSet<SupervisedDataModel> ReconnectionRecords { get; set; }
}
