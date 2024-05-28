using AutoMapper;
using RSSI_webAPI.Models;
using RSSI_webAPI.Models.DtoModels;

namespace RSSI_webAPI.Extensions;

public class MappingConfiguration : Profile
{
    public MappingConfiguration()
    {
        CreateMap<SatelliteDataModel, SatelliteDataDtoModel>()
            .ReverseMap();
    }
}
