using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using RSSI_webAPI.Authorization;
using RSSI_webAPI.Data;
using RSSI_webAPI.Extensions;
using RSSI_webAPI.Repositories;
using RSSI_webAPI.Repositories.Contracts;


var builder = WebApplication.CreateBuilder(args);

// Add services

builder.Services.AddDbContext<ApplicationDbContext>(option => {
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultSQLConnection"));
});

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddHttpClient();

builder.Services.AddSwaggerGen(def => {
    def.AddSecurityDefinition("StaticApiKey",new OpenApiSecurityScheme { 
        Description = "The Api key to access the controllers",
        Type = SecuritySchemeType.ApiKey,
        Name = "x-api-key",
        In = ParameterLocation.Header,
        Scheme = "StaticApiKeyAuthorizationScheme",
    });

    var scheme = new OpenApiSecurityScheme
    {
        Reference = new OpenApiReference
        {
            Id = "StaticApiKey",
            Type = ReferenceType.SecurityScheme,
        },
        In = ParameterLocation.Header,
    };

    var requirement = new OpenApiSecurityRequirement
    {
        { scheme, new List<string>() }
    };

    def.AddSecurityRequirement(requirement);
});

builder.Services.AddScoped<ISatelliteDataRepository, SatelliteDataRepository>();
builder.Services.AddScoped<IEarthDataRepository,EarthDataRepository>();
builder.Services.AddAutoMapper(typeof(MappingConfiguration));
builder.Services.AddScoped<AuthFilter>();

// Check appsettings.json
string? client = builder.Configuration.GetSection("Urls").GetValue<string>("Client");
string? sclient = builder.Configuration.GetSection("Urls").GetValue<string>("Secureclient");


// Configure CORS policy
builder.Services.AddCors(p => p.AddPolicy("corspolicy", build => {
    build.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();



// HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("corspolicy");

// app.UseMiddleware<AuthMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
