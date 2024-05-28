using RSSI_webAPI.Models;

namespace RSSI_webAPI.Repositories.Contracts;

public interface ISatelliteDataRepository
{
    Task<SatelliteDataModel?> GetAceRealtimeData();
    Task<SatelliteDataModel?> GetDscovrRealtimeData();
}
